import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

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

// Get usage for agent type from KV, initializing if needed
async function getUsage(env, agentType) {
  const today = getToday();
  const usageKey = `usage:${agentType}`;
  const usageData = await env.NARAD_DATA.get(usageKey);
  
  if (usageData) {
    const parsed = JSON.parse(usageData);
    if (parsed.lastReset === today) {
      return parsed;
    }
  }
  
  // Initialize or reset if new day
  const newUsage = { tokensUsed: 0, lastReset: today };
  await env.NARAD_DATA.put(usageKey, JSON.stringify(newUsage));
  return newUsage;
}

// Add tokens used for agent type
async function addUsage(env, agentType, tokens) {
  const usage = await getUsage(env, agentType);
  usage.tokensUsed += tokens;
  await env.NARAD_DATA.put(`usage:${agentType}`, JSON.stringify(usage));
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
  const historyData = await env.NARAD_DATA.get(key);
  if (historyData) {
    return JSON.parse(historyData);
  }
  return []; // empty array if no history
}

// Save chat history for a session_id
async function saveChatHistory(env, sessionId, messages) {
  const key = `chat:${sessionId}`;
  await env.NARAD_DATA.put(key, JSON.stringify(messages));
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
  const data = await env.NARAD_DATA.get(key);
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
  await env.NARAD_DATA.put(key, JSON.stringify(patternData));
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
    await env.NARAD_DATA.put(`usage:${agentType}`, JSON.stringify({ tokensUsed: 0, lastReset: today }));
  }
}

// Clear chat history for a session_id (optional)
async function clearChatHistory(env, sessionId) {
  await env.NARAD_DATA.delete(`chat:${sessionId}`);
}

app.use('*', cors());

// Health check
app.get('/api/health', (c) => {
  const availableProviders = getAvailableProviders(c.env);
  return c.json({ 
    status: 'ok', 
    service: 'narad-brain',
    providers: availableProviders,
    timestamp: new Date().toISOString()
  });
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
    const { session_id, score } = await c.req.json(); // score: -1, 0, or 1
    if (typeof session_id !== 'string' || session_id.trim() === '') {
      return c.json({ error: 'Valid session_id is required' }, 400);
    }
    if (typeof score !== 'number' || ![ -1, 0, 1 ].includes(score)) {
      return c.json({ error: 'Score must be -1, 0, or 1' }, 400);
    }
    
    // Get the last assistant message for this session to associate feedback
    const lastAssistant = await getLastAssistantMessage(c.env, session_id);
    if (!lastAssistant) {
      return c.json({ error: 'No assistant message found for this session' }, 404);
    }
    
    // Store feedback linked to this specific message (optional: could store separately)
    const feedbackKey = `feedback:${session_id}:${lastAssistant.textHash || Date.now() + '-' + Math.random().toString(36).substr(2, 9)}`;
    await c.env.NARAD_DATA.put(feedbackKey, JSON.stringify({
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
    const { message, history, context, session_id, agent_type, force_provider } = await c.req.json();

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json({ error: 'Message is required and must be a non-empty string' }, 400);
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
    return c.json({ error: 'Internal Worker Error', message: err.message }, 500);
  }
});

// Optional: Get chat history for a session_id
app.get('/api/chat/history/:session_id', async (c) => {
  try {
    const { session_id } = c.req.param();
    const history = await getChatHistory(c.env, session_id);
    return c.json({ history });
  } catch (error) {
    return c.json({ error: 'Failed to fetch chat history' }, 500);
  }
});

// Optional: Clear chat history for a session_id
app.delete('/api/chat/history/:session_id', async (c) => {
  try {
    const { session_id } = c.req.param();
    await clearChatHistory(c.env, session_id);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to clear chat history' }, 500);
  }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve API routes via Hono
    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env, ctx);
    }
    
    // Serve static assets via Cloudflare Pages asset server
    return env.ASSETS.fetch(request);
  }
};