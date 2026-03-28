import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Security configuration
const CSRF_TRUSTED_ORIGINS = [
  'https://narad-7hc.pages.dev',
  'https://narad.io',
  'http://localhost:8788',
  'http://localhost:3000'
];

// Rate limiting storage (in-memory for single worker, use KV for distributed)
const rateLimitStore = new Map();

// Rate limit configuration
const RATE_LIMIT = {
  maxRequests: 60,
  windowMs: 60000, // 1 minute
  burstLimit: 10
};

// Input validation schemas (Zod-like validation)
const ValidationSchemas = {
  message: {
    validate: (value) => {
      if (!value || typeof value !== 'string') {
        return { valid: false, error: 'Message is required and must be a string' };
      }
      if (value.trim().length === 0) {
        return { valid: false, error: 'Message cannot be empty' };
      }
      if (value.length > 5000) {
        return { valid: false, error: 'Message exceeds 5000 characters' };
      }
      // Check for suspicious patterns
      if (/<script|javascript:|onerror=|onclick=/i.test(value)) {
        return { valid: false, error: 'Invalid content detected' };
      }
      return { valid: true, value: value.trim() };
    }
  },
  sessionId: {
    pattern: /^[a-zA-Z0-9_-]{1,100}$/,
    validate: (value) => {
      if (!value || typeof value !== 'string') {
        return { valid: false, error: 'Valid session_id is required' };
      }
      if (!ValidationSchemas.sessionId.pattern.test(value)) {
        return { valid: false, error: 'Invalid session_id format' };
      }
      return { valid: true };
    }
  },
  history: {
    maxItems: 100,
    maxMessageLength: 10000,
    validate: (value) => {
      if (!Array.isArray(value)) {
        return { valid: false, error: 'History must be an array' };
      }
      if (value.length > ValidationSchemas.history.maxItems) {
        return { valid: false, error: `History exceeds ${ValidationSchemas.history.maxItems} items` };
      }
      for (const msg of value) {
        if (!msg.role || typeof msg.text !== 'string') {
          return { valid: false, error: 'Invalid history message format' };
        }
        if (msg.text.length > ValidationSchemas.history.maxMessageLength) {
          return { valid: false, error: 'History message too long' };
        }
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
          return { valid: false, error: 'Invalid message role in history' };
        }
      }
      return { valid: true };
    }
  },
  score: {
    validate: (value) => {
      if (typeof value !== 'number' || ![-1, 0, 1].includes(value)) {
        return { valid: false, error: 'Score must be -1, 0, or 1' };
      }
      return { valid: true };
    }
  }
};

// Rate limiting functions
function checkRateLimit(identifier) {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  let record = rateLimitStore.get(key);
  if (!record || now - record.windowStart > RATE_LIMIT.windowMs) {
    record = { windowStart: now, count: 0, burstCount: 0 };
  }
  
  // Check burst limit
  if (record.burstCount >= RATE_LIMIT.burstLimit) {
    const retryAfter = Math.ceil((record.windowStart + RATE_LIMIT.windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  if (record.count >= RATE_LIMIT.maxRequests) {
    const retryAfter = Math.ceil((record.windowStart + RATE_LIMIT.windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  record.count++;
  record.burstCount++;
  rateLimitStore.set(key, record);
  
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
}

// CSRF validation
function validateCSRF(request) {
  const origin = request.headers.get('Origin') || request.headers.get('Referer');
  const token = request.headers.get('X-CSRF-Token');
  
  // For now, we'll validate origin and optionally token
  // In production, you'd validate the token against a stored one
  if (origin) {
    const isTrustedOrigin = CSRF_TRUSTED_ORIGINS.some(trusted => 
      origin.startsWith(trusted) || origin === trusted
    );
    if (!isTrustedOrigin) {
      return { valid: false, error: 'Untrusted origin' };
    }
  }
  
  return { valid: true };
}

// Security headers middleware
function addSecurityHeaders(c, next) {
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return next();
}

// Error tracking (stored in KV for analysis)
const ErrorTracker = {
  async trackError(env, error, context = {}) {
    const errorKey = `error:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const errorData = {
      message: error.message || String(error),
      stack: error.stack || '',
      timestamp: new Date().toISOString(),
      context: {
        path: context.path || '',
        method: context.method || '',
        userAgent: context.userAgent || '',
        ip: context.ip || ''
      }
    };
    
    try {
      await getStore(env).put(errorKey, JSON.stringify(errorData), { expirationTtl: 86400 });
    } catch (e) {
      console.error('Failed to store error:', e);
    }
    
    // Also log to console (goes to Cloudflare logs)
    console.error('[ERROR]', JSON.stringify(errorData));
  },
  
  async getRecentErrors(env, limit = 10) {
    const errors = [];
    const list = await getStore(env).list({ prefix: 'error:', limit: 50 });
    
    for (const key of list.keys.reverse()) {
      if (errors.length >= limit) break;
      const data = await getStore(env).get(key.name);
      if (data) {
        errors.push(JSON.parse(data));
      }
    }
    
    return errors;
  }
};

// KV binding name: NARAD_DATA
// We'll store:
// - chat history: key `chat:${session_id}` -> JSON string of messages array
// - usage stats: key `usage:${agentType}` -> JSON string of { tokensUsed: number, lastReset: string (YYYY-MM-DD) }
// - pattern stats: key `pattern:${queryHash}` -> JSON string of { count, totalScore, avgScore, lastUpdated }
// - feedback: key `feedback:${session_id}:${random}` -> { session_id, messageText, score, timestamp }
// We'll also store a global reset token? No, we'll compute today each time.

const DAILY_LIMITS = {
  coding: 200000,
  research: 200000,
  debugging: 200000,
  testing: 200000,
  deployment: 200000,
  general: 200000
};

// AI Providers configuration
const AI_PROVIDERS = {
  groq: {
    name: 'Groq',
    apiKey: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: {
      fast: 'llama-3.1-8b-instant',
      balanced: 'llama-3.3-70b-versatile',
      strong: 'mixtral-8x7b-32768'
    },
    defaultModel: 'llama-3.3-70b-versatile'
  },
  openai: {
    name: 'OpenAI',
    apiKey: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: {
      fast: 'gpt-4o-mini',
      balanced: 'gpt-4o',
      strong: 'gpt-4-turbo'
    },
    defaultModel: 'gpt-4o-mini'
  },
  anthropic: {
    name: 'Anthropic',
    apiKey: 'ANTHROPIC_API_KEY',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: {
      fast: 'claude-3-haiku-20240307',
      balanced: 'claude-3-sonnet-20240229',
      strong: 'claude-3-opus-20240229'
    },
    defaultModel: 'claude-3-haiku-20240307'
  },
  openrouter: {
    name: 'OpenRouter',
    apiKey: 'OPENROUTER_API_KEY',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    models: {
      fast: 'google/gemma-2-9b-it:free',
      balanced: 'meta-llama/llama-3.1-70b-instruct',
      strong: 'deepseek/deepseek-chat'
    },
    defaultModel: 'google/gemma-2-9b-it:free',
    requiresModelInBody: true
  },
  gemini: {
    name: 'Gemini',
    apiKey: 'GEMINI_API_KEY',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: {
      fast: 'gemini-1.5-flash',
      balanced: 'gemini-1.5-pro',
      strong: 'gemini-1.5-pro'
    },
    defaultModel: 'gemini-1.5-flash',
    isGemini: true
  },
  mistral: {
    name: 'Mistral',
    apiKey: 'MISTRAL_API_KEY',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    models: {
      fast: 'mistral-small-latest',
      balanced: 'mistral-medium-latest',
      strong: 'mistral-large-latest'
    },
    defaultModel: 'mistral-small-latest'
  }
};

// Provider order for fallback (tries in order until one works)
const PROVIDER_FALLBACK_ORDER = ['groq', 'openrouter', 'mistral', 'gemini', 'openai', 'anthropic'];

// Analyze query and select best provider/model based on task type
function selectProviderAndModel(agentType, message, availableProviders) {
  const lowerMessage = message.toLowerCase();
  
  // Filter available providers
  const available = availableProviders || PROVIDER_FALLBACK_ORDER;
  
  // Coding tasks - prefer fast providers
  if (agentType === 'coding' || lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('implement')) {
    const provider = available.find(p => ['groq', 'mistral', 'openrouter'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.balanced };
  }
  
  // Debugging - need detailed analysis
  if (agentType === 'debugging' || lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('fix')) {
    const provider = available.find(p => ['openai', 'anthropic', 'gemini'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.balanced };
  }
  
  // Research - prefer reasoning models
  if (agentType === 'research' || lowerMessage.includes('research') || lowerMessage.includes('explain') || lowerMessage.includes('analysis')) {
    const provider = available.find(p => ['anthropic', 'gemini', 'openai'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.balanced };
  }
  
  // Testing - strong models
  if (agentType === 'testing' || lowerMessage.includes('test') || lowerMessage.includes('spec')) {
    const provider = available.find(p => ['anthropic', 'openai', 'mistral'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.strong };
  }
  
  // Deployment - fast responses
  if (agentType === 'deployment' || lowerMessage.includes('deploy') || lowerMessage.includes('docker') || lowerMessage.includes('kubernetes')) {
    const provider = available.find(p => ['groq', 'mistral', 'openrouter', 'gemini'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.fast };
  }
  
  // Default: use first available provider
  if (available.length > 0) {
    const provider = available[0];
    return { provider, model: AI_PROVIDERS[provider].defaultModel };
  }
  
  // Fallback to Groq
  return { provider: 'groq', model: AI_PROVIDERS.groq.defaultModel };
}

// Get available providers based on configured API keys
function getAvailableProviders(env) {
  return PROVIDER_FALLBACK_ORDER.filter(p => {
    const provider = AI_PROVIDERS[p];
    return env[provider.apiKey];
  });
}

// Get provider config
function getProviderConfig(env, providerName) {
  const provider = AI_PROVIDERS[providerName];
  if (!provider) return null;
  
  const apiKey = env[provider.apiKey];
  if (!apiKey) return null;
  
  return { ...provider, apiKey };
}

// Helper to get today's date string
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Simple string hash (djb2) returning a non-negative integer
function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) + char; // hash * 33 + char
    hash = hash & 0xFFFFFFFF; // convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Clean text for hashing: lowercase, remove punctuation, collapse whitespace
function cleanQueryHash(text) {
  if (!text) return '';
  // Lowercase
  let cleaned = text.toLowerCase();
  // Remove punctuation and special chars, keep alphanumeric and whitespace
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, '');
  // Collapse multiple whitespace
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

// In-memory fallback store when KV is not available
const memoryStore = new Map();

function getStore(env) {
  if (env.NARAD_DATA) {
    return env.NARAD_DATA;
  }
  return {
    async get(key) { return memoryStore.get(key) || null; },
    async put(key, value) { memoryStore.set(key, value); },
    async delete(key) { memoryStore.delete(key); },
    async list() { return { keys: Array.from(memoryStore.keys()).map(k => ({ name: k })) }; }
  };
}

// Get usage for agent type from KV, initializing if needed
async function getUsage(env, agentType) {
  const store = getStore(env);
  const today = getToday();
  const usageKey = `usage:${agentType}`;
  const usageData = await store.get(usageKey);
  
  if (usageData) {
    const parsed = JSON.parse(usageData);
    if (parsed.lastReset === today) {
      return parsed;
    }
  }
  
  // Initialize or reset if new day
  const newUsage = { tokensUsed: 0, lastReset: today };
  await store.put(usageKey, JSON.stringify(newUsage));
  return newUsage;
}

// Add tokens used for agent type
async function addUsage(env, agentType, tokens) {
  const usage = await getUsage(env, agentType);
  usage.tokensUsed += tokens;
  await getStore(env).put(`usage:${agentType}`, JSON.stringify(usage));
}

// Get remaining tokens for agent type
async function getRemaining(env, agentType) {
  const usage = await getUsage(env, agentType);
  return Math.max(0, DAILY_LIMITS[agentType] - usage.tokensUsed);
}

// Check if agent type is within limits (with estimated tokens)
async function isWithinLimit(env, agentType, estimatedTokens = 0) {
  const usage = await getUsage(env, agentType);
  return usage.tokensUsed + estimatedTokens <= DAILY_LIMITS[agentType];
}

// Get chat history for a session_id
async function getChatHistory(env, sessionId) {
  const key = `chat:${sessionId}`;
  const historyData = await getStore(env).get(key);
  if (historyData) {
    return JSON.parse(historyData);
  }
  return []; // empty array if no history
}

// Save chat history for a session_id
async function saveChatHistory(env, sessionId, messages) {
  const key = `chat:${sessionId}`;
  await getStore(env).put(key, JSON.stringify(messages));
}

// Get the last assistant message for a session
async function getLastAssistantMessage(env, sessionId) {
  const history = await getChatHistory(env, sessionId);
  // Find the last assistant message
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'assistant') {
      return history[i];
    }
  }
  return null;
}

// Get pattern stats for a query hash
async function getPattern(env, queryHash) {
  if (!queryHash) return null;
  const key = `pattern:${queryHash}`;
  const data = await getStore(env).get(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Update pattern stats with a new score (-1,0,1)
async function updatePattern(env, queryHash, score) {
  if (!queryHash) return;
  const key = `pattern:${queryHash}`;
  const existing = await getPattern(env, queryHash);
  let count = (existing && existing.count) || 0;
  let totalScore = (existing && existing.totalScore) || 0;
  count += 1;
  totalScore += score;
  const avgScore = totalScore / count;
  const patternData = {
    count,
    totalScore,
    avgScore,
    lastUpdated: new Date().toISOString()
  };
  await getStore(env).put(key, JSON.stringify(patternData));
  return patternData;
}

// Generate a hint string based on pattern performance (optional)
function getPatternHint(patternData) {
  if (!patternData) return '';
  const { avgScore, count } = patternData;
  if (count >= 3) {
    if (avgScore >= 0.8) {
      return 'Note: Similar queries have received highly positive feedback.';
    } else if (avgScore <= -0.5) {
      return 'Caution: Similar queries have received negative feedback; consider clarifying or adjusting approach.';
    }
  }
  return '';
}

// Clear all usage stats (optional admin endpoint)
async function resetUsage(env) {
  const today = getToday();
  for (const agentType of Object.keys(DAILY_LIMITS)) {
    await getStore(env).put(`usage:${agentType}`, JSON.stringify({ tokensUsed: 0, lastReset: today }));
  }
}

// Clear chat history for a session_id (optional)
async function clearChatHistory(env, sessionId) {
  await getStore(env).delete(`chat:${sessionId}`);
}

app.use('*', cors());
app.use('*', addSecurityHeaders);

// Request metrics middleware
app.use('*', async (c, next) => {
  const start = Date.now();
  
  // Process request
  await next();
  
  // Track metrics
  const duration = Date.now() - start;
  metricsStore.requests.total++;
  
  if (c.res.status >= 200 && c.res.status < 400) {
    metricsStore.requests.success++;
  } else if (c.res.status >= 400) {
    metricsStore.requests.errors++;
  }
  
  // Keep only last 1000 response times
  metricsStore.responseTimes.push(duration);
  if (metricsStore.responseTimes.length > 1000) {
    metricsStore.responseTimes.shift();
  }
  
  // Add timing header
  c.res.headers.set('X-Response-Time', `${duration}ms`);
});

// Metrics storage (in-memory for single worker)
const metricsStore = {
  requests: { total: 0, success: 0, errors: 0 },
  responseTimes: [],
  startTime: Date.now()
};

// Enhanced Health Check with detailed status
app.get('/api/health', async (c) => {
  const checks = {
    kv: { status: 'unknown', latency: 0 },
    providers: { status: 'unknown', count: 0 },
    rateLimit: { status: 'unknown', available: 0 }
  };
  
  let overallStatus = 'ok';
  
  // Check KV store
  const kvStart = Date.now();
  try {
    await getStore(c.env).get('health-check');
    checks.kv = { status: 'ok', latency: Date.now() - kvStart };
  } catch (error) {
    checks.kv = { status: 'error', error: error.message };
    overallStatus = 'degraded';
  }
  
  // Check providers
  const availableProviders = getAvailableProviders(c.env);
  checks.providers = { 
    status: availableProviders.length > 0 ? 'ok' : 'error',
    count: availableProviders.length,
    configured: Object.keys(AI_PROVIDERS).filter(p => c.env[AI_PROVIDERS[p].apiKey])
  };
  if (availableProviders.length === 0) {
    overallStatus = 'degraded';
  }
  
  // Check rate limiting
  const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
  const rateLimitResult = checkRateLimit(clientIP);
  checks.rateLimit = {
    status: rateLimitResult.allowed ? 'ok' : 'limited',
    remaining: rateLimitResult.remaining || 0
  };
  
  // Calculate uptime
  const uptimeSeconds = Math.floor((Date.now() - metricsStore.startTime) / 1000);
  const uptime = uptimeSeconds < 60 ? `${uptimeSeconds}s` 
    : uptimeSeconds < 3600 ? `${Math.floor(uptimeSeconds/60)}m` 
    : `${Math.floor(uptimeSeconds/3600)}h ${Math.floor((uptimeSeconds%3600)/60)}m`;
  
  return c.json({
    status: overallStatus,
    service: 'narad-brain',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime,
    checks,
    metrics: {
      requests: metricsStore.requests.total,
      successRate: metricsStore.requests.total > 0 
        ? ((metricsStore.requests.success / metricsStore.requests.total) * 100).toFixed(1) + '%'
        : 'N/A'
    }
  });
});

// Detailed metrics endpoint
app.get('/api/metrics', (c) => {
  const avgResponseTime = metricsStore.responseTimes.length > 0
    ? (metricsStore.responseTimes.reduce((a, b) => a + b, 0) / metricsStore.responseTimes.length).toFixed(0) + 'ms'
    : 'N/A';
  
  const p95ResponseTime = metricsStore.responseTimes.length > 0
    ? [...metricsStore.responseTimes].sort((a, b) => a - b)[Math.floor(metricsStore.responseTimes.length * 0.95)] + 'ms'
    : 'N/A';
  
  return c.json({
    requests: metricsStore.requests,
    responseTime: {
      average: avgResponseTime,
      p95: p95ResponseTime,
      samples: metricsStore.responseTimes.length
    },
    uptime: Math.floor((Date.now() - metricsStore.startTime) / 1000)
  });
});

// Get recent errors
app.get('/api/errors', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const errors = await ErrorTracker.getRecentErrors(c.env, Math.min(limit, 50));
    return c.json({ errors });
  } catch (error) {
    return c.json({ error: 'Failed to fetch errors' }, 500);
  }
});

// CSRF token endpoint
app.get('/api/csrf-token', (c) => {
  // Generate a simple CSRF token
  const token = crypto.randomUUID();
  return c.json({ token });
});

// Get usage stats for all agent types
app.get('/api/usage', async (c) => {
  try {
    const result = {};
    for (const [agentType, limit] of Object.entries(DAILY_LIMITS)) {
      const usage = await getUsage(c.env, agentType);
      result[agentType] = {
        tokensUsed: usage.tokensUsed,
        limit: limit,
        remaining: usage.limit - usage.tokensUsed,
        percentUsed: limit > 0 ? (usage.tokensUsed / limit) * 100 : 0
      };
    }
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch usage stats' }, 500);
  }
});

// Reset usage stats (optional, for testing/admin)
app.post('/api/reset-usage', async (c) => {
  // CSRF validation for admin endpoints
  const csrfResult = validateCSRF(c.req);
  if (!csrfResult.valid) {
    return c.json({ error: 'CSRF validation failed' }, 403);
  }
  
  try {
    await resetUsage(c.env);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to reset usage' }, 500);
  }
});

// Feedback endpoint: receive user feedback on the last assistant message
app.post('/api/feedback', async (c) => {
  try {
    // CSRF validation
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const { session_id, score } = await c.req.json(); // score: -1, 0, or 1
    
    // Input validation
    const sessionValidation = ValidationSchemas.sessionId.validate(session_id);
    if (!sessionValidation.valid) {
      return c.json({ error: sessionValidation.error }, 400);
    }
    
    const scoreValidation = ValidationSchemas.score.validate(score);
    if (!scoreValidation.valid) {
      return c.json({ error: scoreValidation.error }, 400);
    }
    
    // Get the last assistant message for this session to associate feedback
    const lastAssistant = await getLastAssistantMessage(c.env, session_id);
    if (!lastAssistant) {
      return c.json({ error: 'No assistant message found for this session' }, 404);
    }
    
    // Store feedback linked to this specific message (optional: could store separately)
    const feedbackKey = `feedback:${session_id}:${lastAssistant.textHash || Date.now() + '-' + Math.random().toString(36).substr(2, 9)}`;
    await getStore(c.env).put(feedbackKey, JSON.stringify({
      session_id,
      messageText: lastAssistant.text,
      score,
      timestamp: new Date().toISOString()
    }));
    
    // Update pattern stats if we have a queryHash stored with the message
    if (lastAssistant.queryHash) {
      await updatePattern(c.env, lastAssistant.queryHash, score);
    }
    
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to process feedback' }, 500);
  }
});

// Core AGI Chat Endpoint
app.post('/api/chat', async (c) => {
  try {
    // Rate limiting
    const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      c.res.headers.set('Retry-After', rateLimitResult.retryAfter.toString());
      return c.json({ 
        error: 'Too many requests. Please try again later.',
        retryAfter: rateLimitResult.retryAfter
      }, 429);
    }
    
    c.res.headers.set('X-RateLimit-Limit', RATE_LIMIT.maxRequests.toString());
    c.res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    
    // CSRF validation
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const body = await c.req.json();
    const { message, history, context, session_id, agent_type, force_provider } = body;

    // Input validation using schemas
    const messageValidation = ValidationSchemas.message.validate(message);
    if (!messageValidation.valid) {
      return c.json({ error: messageValidation.error }, 400);
    }

    const sessionValidation = ValidationSchemas.sessionId.validate(session_id);
    if (!sessionValidation.valid) {
      return c.json({ error: sessionValidation.error }, 400);
    }

    if (history) {
      const historyValidation = ValidationSchemas.history.validate(history);
      if (!historyValidation.valid) {
        return c.json({ error: historyValidation.error }, 400);
      }
    }

    // Determine agent type (default to general)
    const agentType = agent_type && DAILY_LIMITS.hasOwnProperty(agent_type) ? agent_type : 'general';

    // Check if we have enough quota for this request (estimate 1000 tokens for safety)
    if (!(await isWithinLimit(c.env, agentType, 1000))) {
      return c.json({ 
        error: `Agent '${agentType}' has exceeded its daily token limit. Please try again later or use a different agent.`,
        usage: await getUsage(c.env, agentType)
      }, 429); // Too Many Requests
    }

    // Get available providers
    const availableProviders = getAvailableProviders(c.env);
    
    if (availableProviders.length === 0) {
      return c.json({ error: 'No AI provider configured. Please set at least one API key (GROQ_API_KEY, OPENROUTER_API_KEY, MISTRAL_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY)' }, 500);
    }

    // Select provider and model (automatic routing or forced)
    let providerConfig;
    let selectedProvider;
    if (force_provider && AI_PROVIDERS[force_provider]) {
      providerConfig = getProviderConfig(c.env, force_provider);
      if (!providerConfig) {
        return c.json({ error: `Provider '${force_provider}' not configured` }, 400);
      }
      selectedProvider = force_provider;
    } else {
      const selection = selectProviderAndModel(agentType, message, availableProviders);
      selectedProvider = selection.provider;
      providerConfig = getProviderConfig(c.env, selection.provider);
      if (!providerConfig) {
        // Fallback to first available
        selectedProvider = availableProviders[0];
        providerConfig = getProviderConfig(c.env, selectedProvider);
      }
    }

    // Compute query hash for pattern-based feedback
    const cleaned = cleanQueryHash(message);
    const queryHash = simpleHash(cleaned).toString();

    // Retrieve pattern stats for hinting
    const patternData = await getPattern(c.env, queryHash);
    const patternHint = getPatternHint(patternData);

    // Build system prompt with optional hint
    const systemPromptParts = [
      'You are Narad, the omniscient messenger of the Nisha Platform.',
      '',
      'MISSION:',
      'Connect the right information to the right moment. Be wise, calm, and objective.',
      '',
      'CONTEXT:',
      context || 'No specific platform context provided.',
      '',
      'AGENT TYPE:',
      agentType === 'general' ? 'General purpose' : `Specialized in ${agentType} tasks`
    ];
    if (patternHint) {
      systemPromptParts.push('');
      systemPromptParts.push('FEEDBACK HINT:');
      systemPromptParts.push(patternHint);
    }
    const systemPrompt = systemPromptParts.join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(msg => ({ role: msg.role, content: msg.text || msg.content })),
      { role: 'user', content: message }
    ];

    const model = providerConfig.defaultModel;
    const isAnthropic = providerConfig.name === 'Anthropic';
    const isGemini = providerConfig.name === 'Gemini';
    const isOpenRouter = providerConfig.name === 'OpenRouter';

    // Try each available provider in order until one works
    let lastErr = null;
    for (let i = 0; i < availableProviders.length; i++) {
      const currentProvider = availableProviders[i];
      const currentConfig = getProviderConfig(c.env, currentProvider);
      if (!currentConfig) continue;
      
      const currentModel = currentConfig.defaultModel;
      const isCurrentAnthropic = currentConfig.name === 'Anthropic';
      const isCurrentGemini = currentConfig.name === 'Gemini';
      
      try {
        let res;
        if (isCurrentAnthropic) {
          res = await fetch(currentConfig.endpoint, {
            method: 'POST',
            headers: {
              'x-api-key': currentConfig.apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              model: currentModel,
              messages,
              max_tokens: 2048
            })
          });
        } else if (isCurrentGemini) {
          // Gemini API format
          const geminiEndpoint = `${currentConfig.endpoint}/${currentModel}:generateContent?key=${currentConfig.apiKey}`;
          res = await fetch(geminiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: messages.map(m => ({ role: m.role === 'system' ? 'user' : m.role, parts: [{ text: m.content }] })),
              generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
            })
          });
        } else {
          // OpenAI/Groq/Mistral/OpenRouter format
          const body = {
            model: currentModel,
            messages,
            temperature: 0.7,
            max_tokens: 2048
          };
          
          const headers = {
            'Authorization': `Bearer ${currentConfig.apiKey}`,
            'Content-Type': 'application/json'
          };
          
          // OpenRouter requires extra headers
          if (isOpenRouter || currentConfig.name === 'OpenRouter') {
            headers['HTTP-Referer'] = 'https://narad-7hc.pages.dev';
            headers['X-Title'] = 'Narad AI';
          }
          
          res = await fetch(currentConfig.endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
          });
        }

        if (res.status === 429 || res.status >= 500) {
          lastErr = `${currentConfig.name} API rate limited (${res.status}). Trying next provider...`;
          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        if (!res.ok) {
          const err = await res.text();
          lastErr = `${currentConfig.name} API error: ${res.status} - ${err.slice(0, 100)}`;
          continue;
        }

        const data = await res.json();
        
        let reply;
        let usage;
        
        if (isCurrentGemini) {
          reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          usage = { total_tokens: data.usageMetadata?.totalTokenCount || 0 };
        } else if (isCurrentAnthropic) {
          reply = data.content?.[0]?.text;
          usage = data.usage;
        } else {
          reply = data.choices?.[0]?.message?.content;
          usage = data.usage;
        }

        if (!reply) {
          lastErr = `${currentConfig.name} returned empty response.`;
          continue;
        }

        // Update selected provider and model for response
        providerConfig = currentConfig;
        selectedProvider = currentProvider;

        // Track token usage
        const totalTokens = usage?.total_tokens || 0;
        await addUsage(c.env, agentType, totalTokens);

        // Save chat history (store queryHash with both user and assistant msgs)
        const chatHistory = await getChatHistory(c.env, session_id);
        const newHistory = [
          ...chatHistory,
          { role: 'user', text: message, agentType: agentType, queryHash: queryHash },
          { role: 'assistant', text: reply, agentType: agentType, queryHash: queryHash }
        ];
        await saveChatHistory(c.env, session_id, newHistory);

        return c.json({ 
          reply, 
          session_id,
          metadata: {
            provider: selectedProvider,
            model: providerConfig.defaultModel,
            tokens: totalTokens,
            agentType: agentType,
            remainingTokens: await getRemaining(c.env, agentType)
          }
        });
      } catch (fetchErr) {
        lastErr = fetchErr.message;
      }
    }

    // All providers failed
    return c.json({ 
      error: 'All AI providers failed', 
      details: lastErr 
    }, 502);
  } catch (err) {
    // Track error
    await ErrorTracker.trackError(c.env, err, {
      path: '/api/chat',
      method: 'POST',
      userAgent: c.req.header('User-Agent'),
      ip: c.req.header('CF-Connecting-IP')
    });
    return c.json({ error: 'Internal Worker Error', message: err.message }, 500);
  }
});

// Optional: Get chat history for a session_id
app.get('/api/chat/history/:session_id', async (c) => {
  try {
    const { session_id } = c.req.param();
    
    // Validate session ID
    const validation = ValidationSchemas.sessionId.validate(session_id);
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400);
    }
    
    const history = await getChatHistory(c.env, session_id);
    return c.json({ history });
  } catch (error) {
    return c.json({ error: 'Failed to fetch chat history' }, 500);
  }
});

// Optional: Clear chat history for a session_id
app.delete('/api/chat/history/:session_id', async (c) => {
  try {
    // CSRF validation
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const { session_id } = c.req.param();
    
    // Validate session ID
    const validation = ValidationSchemas.sessionId.validate(session_id);
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400);
    }
    
    await clearChatHistory(c.env, session_id);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to clear chat history' }, 500);
  }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Add security headers to all responses
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
    
    // Serve API routes via Hono
    if (url.pathname.startsWith('/api/')) {
      const response = await app.fetch(request, env, ctx);
      
      // Add security headers to API responses
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }
    
    // Serve static assets via Cloudflare Pages asset server
    const staticResponse = await env.ASSETS.fetch(request);
    
    // Add security headers to static responses
    const newResponse = new Response(staticResponse.body, staticResponse);
    Object.entries(securityHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  }
};