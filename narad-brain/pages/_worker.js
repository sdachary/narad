import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// Cloudflare Workers AI - Free embedding model
// Uses @cf/baai/bge-base-en-v1.5 (free tier)
const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';
const EMBEDDING_DIM = 768;

// Semantic Memory Configuration
const SEMANTIC_MEMORY_CONFIG = {
  maxMemories: 1000,
  similarityThreshold: 0.7,
  topK: 5
};

// Workers AI Budget Controls (prevent billing surprises)
// Workers AI free tier: 3000 req/min for embeddings - using 10000/day for safety
const AI_BUDGET_CONFIG = {
  maxDailyEmbeddings: 10000,     // Max embeddings per day (well under 3000/min limit)
  cacheEmbeddingTTL: 3600,        // Cache embeddings for 1 hour
  fallbackOnLimit: true           // Use TF-IDF fallback if limit reached
};

// Auto-save configuration
const AUTO_SAVE_CONFIG = {
  enabled: true,
  keywords: ['important', 'remember', 'note', 'key', 'critical', 'learned', 'fix', 'bug', 'solution', 'architecture', 'design', 'decision'],
  saveOnFeedback: true,           // Save responses with positive feedback
  saveOnCode: true,              // Save responses containing code
  saveOnLongResponse: true,      // Save responses > 500 chars
  minLengthForAutoSave: 500
};

// In-memory cache for embeddings (resets on worker cold start)
const embeddingCache = new Map();
const embeddingBudget = { used: 0, resetAt: getTomorrowMidnight() };

function getTomorrowMidnight() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

function canUseWorkersAI() {
  const now = Date.now();
  if (now > embeddingBudget.resetAt) {
    embeddingBudget.used = 0;
    embeddingBudget.resetAt = getTomorrowMidnight();
  }
  return embeddingBudget.used < AI_BUDGET_CONFIG.maxDailyEmbeddings;
}

function useWorkersAI() {
  embeddingBudget.used++;
}

// Hash string for cache key
function hashString(str) {
  return simpleHash(str).toString(36);
}

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
  if (!request || !request.headers) {
    return { valid: true }; // Allow if no request/headers (dev mode)
  }
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
  general: 200000,
  coding: 250000,
  research: 150000,
  debugging: 200000,
  testing: 200000,
  deployment: 150000,
  coder: 250000,
  writer: 150000,
  analyst: 150000,
  architect: 200000
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

// Warehouse Agent Registry (lightweight index - always loaded)
// Full agent configs loaded on-demand from warehouse/agents/
const WAREHOUSE_INDEX = {
  dev: {
    name: 'Developer',
    icon: '⚡',
    keywords: ['git', 'commit', 'branch', 'test', 'build', 'run', 'npm', 'install', 'debug', 'code', 'function', 'implement'],
    daily_use: true
  },
  reviewer: {
    name: 'Code Reviewer',
    icon: '🔍',
    keywords: ['review', 'security', 'audit', 'quality', 'lint', 'vulnerability', 'bug', 'check'],
    daily_use: true
  },
  debugger: {
    name: 'Debugger',
    icon: '🔧',
    keywords: ['debug', 'error', 'crash', 'fix', 'issue', 'problem', 'broken', 'not working', 'fails'],
    daily_use: true
  },
  api: {
    name: 'API Developer',
    icon: '🔌',
    keywords: ['api', 'rest', 'graphql', 'endpoint', 'route', 'http', 'request', 'json', 'crud'],
    daily_use: false
  },
  database: {
    name: 'Database Expert',
    icon: '🗄️',
    keywords: ['sql', 'query', 'database', 'postgres', 'mysql', 'mongodb', 'migration', 'schema', 'table'],
    daily_use: false
  },
  infrastructure: {
    name: 'DevOps',
    icon: '🚀',
    keywords: ['docker', 'kubernetes', 'deploy', 'ci', 'cd', 'aws', 'gcp', 'azure', 'terraform', 'server'],
    daily_use: false
  },
  security: {
    name: 'Security',
    icon: '🔒',
    keywords: ['security', 'auth', 'oauth', 'jwt', 'https', 'ssl', 'penetration', 'owasp', 'vulnerability'],
    daily_use: false
  },
  writer: {
    name: 'Writer',
    icon: '✍️',
    keywords: ['documentation', 'readme', 'docs', 'write', 'email', 'blog', 'markdown', 'content'],
    daily_use: false
  }
};

// Legacy agents mapped to warehouse
const SUBAGENTS = {
  research: {
    name: 'Research Agent',
    icon: '🔬',
    keywords: ['search', 'find', 'latest', 'recent', 'current', 'news', 'information', 'look up', 'web', 'research'],
    systemPrompt: 'You are a research assistant. Search for accurate, well-sourced information and provide comprehensive answers. Format your responses with clear sections and cite sources when possible.'
  },
  coder: {
    name: 'Coder Agent', 
    icon: '💻',
    keywords: ['code', 'function', 'write code', 'implement', 'programming', 'script', 'algorithm', 'api', 'debug', 'fix bug'],
    systemPrompt: 'You are an expert programmer. Write clean, efficient, well-documented code. Include comments explaining complex logic. Provide working examples.'
  },
  writer: {
    name: 'Writer Agent',
    icon: '✍️',
    keywords: ['write', 'draft', 'email', 'copy', 'content', 'edit', 'proofread', 'blog', 'article', 'documentation'],
    systemPrompt: 'You are a professional writer. Create clear, engaging, well-structured content. Adapt tone to the audience and purpose.'
  },
  analyst: {
    name: 'Analyst Agent',
    icon: '📊',
    keywords: ['analyze', 'data', 'insights', 'pattern', 'trend', 'report', 'metrics', 'statistics', 'numbers', 'analysis'],
    systemPrompt: 'You are a data analyst. Provide deep insights, identify patterns, and deliver logical analysis. Use concrete examples and evidence.'
  },
  architect: {
    name: 'Architect Agent',
    icon: '🏗️',
    keywords: ['design', 'architecture', 'system', 'scalability', 'infrastructure', 'technology', 'stack', 'framework', 'system design'],
    systemPrompt: 'You are a software architect. Design robust, scalable systems. Consider trade-offs, best practices, and long-term maintainability.'
  }
};

// Warehouse agent configs (loaded on-demand)
const WAREHOUSE_AGENTS = {
  dev: {
    systemPrompt: `You are an expert software developer. You help with daily development tasks including:

- Git workflows (commit, branch, merge, rebase, stash)
- Package management (npm, yarn, pnpm, pip, cargo)
- Build and run commands
- Testing (unit, integration, e2e)
- Code formatting and linting
- Project scaffolding
- Dependency management

Best practices:
- Write clean, maintainable code
- Follow project's coding conventions
- Add comments for complex logic
- Write tests alongside code
- Use meaningful variable names`
  },
  reviewer: {
    systemPrompt: `You are an expert code reviewer. You analyze code for:

**Quality:**
- Code structure and organization
- Design patterns and SOLID principles
- Error handling
- Performance considerations
- Code duplication

**Security:**
- Input validation
- SQL injection, XSS, CSRF
- Authentication/authorization issues
- Secrets in code
- Dependency vulnerabilities

**Best Practices:**
- DRY (Don't Repeat Yourself)
- Single Responsibility
- Proper naming conventions
- Documentation completeness
- Test coverage

Provide actionable feedback with specific line references and suggested fixes.`
  },
  debugger: {
    systemPrompt: `You are an expert debugging specialist. You help troubleshoot and fix issues:

**Debugging Approach:**
1. Reproduce the issue
2. Gather information (logs, error messages, stack traces)
3. Identify root cause
4. Implement fix
5. Verify solution

**Common Issues:**
- Runtime errors and exceptions
- Logic errors
- Memory leaks
- Race conditions
- API failures
- Database connection issues

**Tools & Techniques:**
- Read logs carefully
- Add debug statements
- Use breakpoints
- Check environment variables
- Verify API responses
- Test edge cases

Provide clear explanations of what's going wrong and how to fix it.`
  },
  api: {
    systemPrompt: `You are an expert API developer. You help design and implement APIs:

**REST API Design:**
- Resource naming (nouns, plural)
- HTTP methods (GET, POST, PUT, PATCH, DELETE)
- Status codes (200, 201, 400, 401, 403, 404, 500)
- Query parameters and pagination
- Error response format

**Best Practices:**
- Versioning strategies
- Authentication (JWT, OAuth2)
- Rate limiting
- CORS configuration
- Request validation
- API documentation (OpenAPI/Swagger)`
  },
  database: {
    systemPrompt: `You are a database expert. You help with:

**SQL Databases (PostgreSQL, MySQL):**
- Schema design and normalization
- Index optimization
- Query optimization with EXPLAIN
- Transactions and isolation levels
- Stored procedures and triggers
- Migrations

**NoSQL (MongoDB, Redis):**
- Document design
- Query patterns
- Indexing strategies
- Data modeling

**Best Practices:**
- Use parameterized queries
- Avoid N+1 queries
- Proper indexing
- Connection pooling
- Backup strategies

**Performance:**
- Query analysis
- Index creation
- Partitioning
- Caching strategies`
  },
  infrastructure: {
    systemPrompt: `You are a DevOps engineer. You help with:

**Containers:**
- Dockerfiles best practices
- Docker Compose for local dev
- Multi-stage builds
- Image optimization

**Kubernetes:**
- Pods, Services, Deployments
- ConfigMaps and Secrets
- Ingress configuration
- Helm charts
- Resource limits

**CI/CD:**
- GitHub Actions
- GitLab CI
- Build optimization
- Deployment strategies

**Cloud (AWS/GCP/Azure):**
- Compute services
- Networking basics
- Storage options
- Serverless (Lambda, Cloud Functions)`
  },
  security: {
    systemPrompt: `You are a security expert. You help identify and fix security issues:

**OWASP Top 10:**
- Injection (SQL, NoSQL, OS)
- Broken authentication
- Sensitive data exposure
- XSS (Cross-Site Scripting)
- Broken access control
- Security misconfiguration
- Using components with vulnerabilities

**Authentication:**
- JWT implementation
- OAuth2 / OpenID Connect
- Session management
- Password hashing (bcrypt, argon2)
- MFA implementation

**Data Protection:**
- Encryption at rest
- TLS/HTTPS
- Secrets management
- Environment variables`
  },
  writer: {
    systemPrompt: `You are a technical writer. You create clear, helpful documentation:

**Documentation Types:**
- README files
- API documentation
- User guides
- Architecture decision records
- Changelogs

**Best Practices:**
- Start with why, then how
- Use code examples
- Include prerequisites
- Explain trade-offs
- Keep it concise
- Use consistent formatting

**Markdown:**
- Headers hierarchy
- Code blocks with syntax
- Tables for structured data
- Links and references`
  }
};

// Merge all agents for detection
const ALL_AGENTS = { ...SUBAGENTS, ...WAREHOUSE_INDEX };

// Detect agent type from message
function detectAgentType(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for explicit agent prefix (supports warehouse + legacy)
  const allAgentIds = [...Object.keys(WAREHOUSE_INDEX), ...Object.keys(SUBAGENTS)].join('|');
  const prefixMatch = lowerMessage.match(new RegExp(`^\/(${allAgentIds})\\s+`));
  if (prefixMatch) {
    return prefixMatch[1];
  }
  
  // Score each agent type based on keyword matches
  let bestAgent = 'general';
  let bestScore = 0;
  
  for (const [agentType, config] of Object.entries(ALL_AGENTS)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (lowerMessage.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAgent = agentType;
    }
  }
  
  // Only use subagent if we have strong keyword matches
  return bestScore >= 2 ? bestAgent : 'general';
}

// Get system prompt for agent type (from warehouse or legacy)
function getSystemPrompt(agentType) {
  // Check warehouse first
  if (WAREHOUSE_AGENTS[agentType]) {
    return WAREHOUSE_AGENTS[agentType].systemPrompt;
  }
  // Check legacy agents
  if (SUBAGENTS[agentType]) {
    return SUBAGENTS[agentType].systemPrompt;
  }
  return null; // Use default prompt from the request
}

// Get agent info for UI
function getAgentInfo(agentType) {
  if (WAREHOUSE_INDEX[agentType]) {
    return WAREHOUSE_INDEX[agentType];
  }
  if (SUBAGENTS[agentType]) {
    return { name: SUBAGENTS[agentType].name, icon: SUBAGENTS[agentType].icon, daily_use: false };
  }
  return null;
}

// Parse multi-agent syntax
// Supported formats:
// - /dev+reviewer: task (parallel execution)
// - /chain:dev->reviewer: task (sequential chaining)
// - "Use dev and reviewer for this" (auto-detect)
function parseMultiAgentRequest(message) {
  const lowerMessage = message.toLowerCase();
  
  // Get all valid agent IDs
  const allAgentIds = Object.keys(ALL_AGENTS).join('|');
  
  // Check for explicit parallel syntax: /dev+reviewer+api:
  const parallelMatch = lowerMessage.match(new RegExp(`^\/([a-z]+(?:\\+[a-z]+)+):?\\s*(.*)`));
  if (parallelMatch) {
    const agents = parallelMatch[1].split('+').filter(a => ALL_AGENTS[a]);
    const task = parallelMatch[2] || message;
    if (agents.length > 1) {
      return { mode: 'parallel', agents, task, originalMessage: message };
    }
  }
  
  // Check for chain syntax: /chain:dev->reviewer->writer:
  const chainMatch = lowerMessage.match(/^\/chain:([a-z]+(?:->[a-z]+)+):?\s*(.*)/);
  if (chainMatch) {
    const agents = chainMatch[1].split('->').filter(a => ALL_AGENTS[a]);
    const task = chainMatch[2] || message;
    if (agents.length > 1) {
      return { mode: 'chain', agents, task, originalMessage: message };
    }
  }
  
  // Check for "use X and Y" pattern (auto-detect multi-agent intent)
  const conjunctionMatch = message.match(/(?:use|with|and|combine)\s+([a-z]+(?:\s+and\s+[a-z]+)+)/i);
  if (conjunctionMatch) {
    const mentionedAgents = conjunctionMatch[1]
      .toLowerCase()
      .split(/\s+and\s+/)
      .filter(a => ALL_AGENTS[a.trim()]);
    if (mentionedAgents.length > 1) {
      return { mode: 'parallel', agents: mentionedAgents, task: message, originalMessage: message };
    }
  }
  
  return null; // Single agent request
}

// Execute multiple agents in parallel
async function executeParallelAgents(env, agents, task, context) {
  const results = await Promise.all(
    agents.map(async (agentType) => {
      try {
        const systemPrompt = getSystemPrompt(agentType);
        const response = await callAIProvider(env, task, systemPrompt, context, agentType);
        return {
          agent: agentType,
          success: true,
          response
        };
      } catch (error) {
        return {
          agent: agentType,
          success: false,
          error: error.message
        };
      }
    })
  );
  
  // Synthesize results
  let synthesizedResponse = '';
  const successfulResults = results.filter(r => r.success);
  
  if (successfulResults.length === 0) {
    throw new Error('All agents failed');
  }
  
  if (successfulResults.length === 1) {
    synthesizedResponse = successfulResults[0].response.reply;
  } else {
    synthesizedResponse = `## Multi-Agent Analysis (${successfulResults.length} agents)\n\n`;
    for (const result of successfulResults) {
      const agentConfig = SUBAGENTS[result.agent];
      synthesizedResponse += `### ${agentConfig.name}\n${result.response.reply}\n\n---\n\n`;
    }
    synthesizedResponse = synthesizedResponse.trim();
  }
  
  return {
    reply: synthesizedResponse,
    metadata: {
      mode: 'parallel',
      agents: results.map(r => ({ type: r.agent, success: r.success })),
      totalTokens: successfulResults.reduce((sum, r) => sum + (r.response.metadata?.tokens || 0), 0)
    }
  };
}

// Execute agents in sequence (chain)
async function executeChainAgents(env, agents, task, context) {
  let accumulatedContext = task;
  const chainLog = [];
  
  for (let i = 0; i < agents.length; i++) {
    const agentType = agents[i];
    const agentConfig = SUBAGENTS[agentType];
    const isLast = i === agents.length - 1;
    
    // Build context for this agent
    let agentTask = accumulatedContext;
    if (i > 0) {
      const previousResult = chainLog[i - 1].response.reply;
      agentTask = `Previous agent (${SUBAGENTS[agents[i - 1]].name}) output:\n${previousResult}\n\nYour task: ${task}\n\nBuild upon the previous work and continue the task.`;
    }
    
    try {
      const systemPrompt = getSystemPrompt(agentType);
      const response = await callAIProvider(env, agentType, agentTask, context);
      
      chainLog.push({
        agent: agentType,
        name: agentConfig.name,
        response: response.reply,
        tokens: response.metadata?.tokens || 0
      });
      
      // Update accumulated context for next agent
      accumulatedContext = response.reply;
      
    } catch (error) {
      chainLog.push({
        agent: agentType,
        name: agentConfig.name,
        error: error.message
      });
      
      if (isLast) {
        throw error;
      }
    }
  }
  
  // Build final response showing chain
  let synthesizedResponse = '';
  if (chainLog.length === 1) {
    synthesizedResponse = chainLog[0].response;
  } else {
    synthesizedResponse = `## Chain Execution (${chainLog.length} agents)\n\n`;
    for (const step of chainLog) {
      const status = step.error ? '❌' : '✅';
      synthesizedResponse += `### ${status} ${step.name}\n`;
      if (step.error) {
        synthesizedResponse += `Error: ${step.error}\n\n`;
      } else {
        synthesizedResponse += `${step.response}\n\n---\n\n`;
      }
    }
    synthesizedResponse = synthesizedResponse.trim();
  }
  
  return {
    reply: synthesizedResponse,
    metadata: {
      mode: 'chain',
      agents: chainLog.map(s => ({ type: s.agent, name: s.name, tokens: s.tokens, error: s.error })),
      totalTokens: chainLog.reduce((sum, s) => sum + s.tokens, 0)
    }
  };
}

// Simplified AI call wrapper for multi-agent
async function callAIProvider(env, agentType, task, context, forcedAgentType) {
  const availableProviders = getAvailableProviders(env);
  if (availableProviders.length === 0) {
    throw new Error('No AI provider configured');
  }
  
  const selection = selectProviderAndModel(forcedAgentType || agentType, task, availableProviders);
  const providerConfig = getProviderConfig(env, selection.provider);
  
  const systemPrompt = getSystemPrompt(agentType) || 'You are a helpful AI assistant.';
  
  // Build messages
  const messages = [];
  if (context && context.length > 0) {
    messages.push(...context.slice(-10)); // Last 10 messages for context
  }
  messages.push({ role: 'user', content: task });
  
  const body = {
    messages,
    model: selection.model,
    ...(providerConfig.defaultModel !== selection.model && { system: systemPrompt }),
    stream: false,
    max_tokens: 2000
  };
  
  const response = await fetch(`${providerConfig.baseURL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(providerConfig.apiKey && { 'Authorization': `Bearer ${providerConfig.apiKey}` })
    },
    body: JSON.stringify(body)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI request failed: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content || '';
  const tokens = data.usage?.total_tokens || 0;
  
  // Track usage
  if (tokens > 0) {
    await addUsage(env, agentType, tokens);
  }
  
  return {
    reply,
    metadata: { tokens, agentType, model: selection.model }
  };
}

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
  if (env && env.NARAD_DATA && typeof env.NARAD_DATA.get === 'function') {
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

// ============================================
// SEMANTIC MEMORY SYSTEM (FREE - Workers AI)
// ============================================

// Generate embedding using Cloudflare Workers AI (free tier)
async function generateEmbedding(env, text) {
  const cacheKey = hashString(text);
  
  // Check cache first
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey);
  }
  
  // Check budget
  if (!AI_BUDGET_CONFIG.fallbackOnLimit && !canUseWorkersAI()) {
    console.warn('Workers AI daily limit reached, using TF-IDF fallback');
    const fallback = generateTFIDFFallback(text);
    embeddingCache.set(cacheKey, fallback);
    return fallback;
  }
  
  try {
    // Check if AI binding is available
    if (!env.AI) {
      console.warn('Workers AI not configured, using TF-IDF fallback');
      const fallback = generateTFIDFFallback(text);
      embeddingCache.set(cacheKey, fallback);
      return fallback;
    }
    
    // Use Workers AI
    const ai = new CloudflareAI({ runtime: env });
    const result = await ai.run(EMBEDDING_MODEL, { text });
    const embedding = result.data[0]; // Returns 768-dim embedding array
    
    // Track usage
    useWorkersAI();
    
    // Cache the result
    embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  } catch (error) {
    console.error('Embedding generation failed:', error);
    // Fallback to TF-IDF based similarity
    const fallback = generateTFIDFFallback(text);
    embeddingCache.set(cacheKey, fallback);
    return fallback;
  }
}

// Fallback TF-IDF style embedding (no external API needed)
function generateTFIDFFallback(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const vocab = [...new Set(words)];
  const vector = new Array(128).fill(0); // Smaller dimension for fallback
  
  vocab.forEach((word, i) => {
    const hash = simpleHash(word);
    const idx = hash % 128;
    vector[idx] += 1;
  });
  
  // Normalize
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return norm > 0 ? vector.map(v => v / norm) : vector;
}

// Cosine similarity between two vectors
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// Store memory with embedding in KV
async function storeSemanticMemory(env, key, content, metadata = {}) {
  const embedding = await generateEmbedding(env, content);
  const memoryData = {
    key,
    content,
    embedding,
    metadata,
    createdAt: new Date().toISOString()
  };
  
  // Store the memory
  await getStore(env).put(`sem:${key}`, JSON.stringify(memoryData));
  
  // Add to index
  const indexKey = 'sem:index';
  const indexData = await getStore(env).get(indexKey);
  const index = indexData ? JSON.parse(indexData) : [];
  
  // Limit memory count
  if (index.length >= SEMANTIC_MEMORY_CONFIG.maxMemories) {
    index.shift(); // Remove oldest
  }
  
  index.push(key);
  await getStore(env).put(indexKey, JSON.stringify(index));
  
  return memoryData;
}

// Search semantic memory using vector similarity
async function searchSemanticMemory(env, query, topK = 5, threshold = 0.7) {
  const queryEmbedding = await generateEmbedding(env, query);
  
  // Get all memory keys from index
  const indexKey = 'sem:index';
  const indexData = await getStore(env).get(indexKey);
  const keys = indexData ? JSON.parse(indexData) : [];
  
  const results = [];
  
  for (const key of keys) {
    const memoryData = await getStore(env).get(`sem:${key}`);
    if (!memoryData) continue;
    
    try {
      const memory = JSON.parse(memoryData);
      const similarity = cosineSimilarity(queryEmbedding, memory.embedding);
      
      if (similarity >= threshold) {
        results.push({
          key: memory.key,
          content: memory.content,
          similarity,
          metadata: memory.metadata,
          createdAt: memory.createdAt
        });
      }
    } catch (e) {
      continue;
    }
  }
  
  // Sort by similarity and return top K
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

// Store chat message in semantic memory
async function storeChatSemanticMemory(env, sessionId, role, text, metadata = {}) {
  const key = `chat:${sessionId}:${Date.now()}`;
  const content = `[${role}] ${text}`;
  return storeSemanticMemory(env, key, content, { sessionId, role, ...metadata });
}

// Clear semantic memory index
async function clearSemanticMemory(env) {
  const indexKey = 'sem:index';
  const indexData = await getStore(env).get(indexKey);
  const keys = indexData ? JSON.parse(indexData) : [];
  
  for (const key of keys) {
    await getStore(env).delete(`sem:${key}`);
  }
  await getStore(env).delete(indexKey);
  
  return { cleared: keys.length };
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

// Get warehouse agents (lightweight index for UI)
app.get('/api/warehouse', async (c) => {
  const agents = {};
  for (const [id, config] of Object.entries(WAREHOUSE_INDEX)) {
    agents[id] = {
      name: config.name,
      icon: config.icon,
      description: `${config.name} - Daily use: ${config.daily_use ? 'Yes' : 'No'}`,
      daily_use: config.daily_use
    };
  }
  return c.json({
    version: '1.0.0',
    agents,
    daily_use: Object.entries(WAREHOUSE_INDEX)
      .filter(([_, a]) => a.daily_use)
      .map(([id, a]) => ({ id, name: a.name, icon: a.icon }))
  });
});

// Get specific agent config (lazy load)
app.get('/api/warehouse/:agentId', async (c) => {
  const agentId = c.req.param('agentId');
  
  if (WAREHOUSE_AGENTS[agentId]) {
    return c.json({
      id: agentId,
      ...WAREHOUSE_INDEX[agentId],
      systemPrompt: WAREHOUSE_AGENTS[agentId].systemPrompt
    });
  }
  
  if (SUBAGENTS[agentId]) {
    return c.json({
      id: agentId,
      name: SUBAGENTS[agentId].name,
      icon: SUBAGENTS[agentId].icon,
      systemPrompt: SUBAGENTS[agentId].systemPrompt
    });
  }
  
  return c.json({ error: 'Agent not found' }, 404);
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

    // Determine agent type (auto-detect if not specified)
    let agentType = agent_type && DAILY_LIMITS.hasOwnProperty(agent_type) ? agent_type : 'general';
    
    // Auto-detect agent type from message if not explicitly specified
    if (agentType === 'general' && message) {
      const detectedType = detectAgentType(message);
      if (detectedType !== 'general') {
        agentType = detectedType;
      }
    }

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

    // Build system prompt with optional hint and agent-specific guidance
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
    
    // Add agent-specific guidance
    const agentPrompt = getSystemPrompt(agentType);
    if (agentPrompt) {
      systemPromptParts.push('');
      systemPromptParts.push('AGENT GUIDANCE:');
      systemPromptParts.push(agentPrompt);
    }
    
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

// ============================================
// SEMANTIC MEMORY API ENDPOINTS
// ============================================

// Store a memory (for /idea command integration)
app.post('/api/memory/store', async (c) => {
  try {
    // CSRF validation
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const { key, content, metadata } = await c.req.json();
    
    if (!key || !content) {
      return c.json({ error: 'key and content are required' }, 400);
    }
    
    const memory = await storeSemanticMemory(c.env, key, content, metadata || {});
    
    return c.json({ 
      success: true, 
      memory: {
        key: memory.key,
        createdAt: memory.createdAt
      }
    });
  } catch (error) {
    return c.json({ error: 'Failed to store memory' }, 500);
  }
});

// Semantic search (for /recall command)
app.post('/api/memory/search', async (c) => {
  try {
    // CSRF validation
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const { query, topK, threshold } = await c.req.json();
    
    if (!query) {
      return c.json({ error: 'query is required' }, 400);
    }
    
    const results = await searchSemanticMemory(
      c.env, 
      query, 
      topK || SEMANTIC_MEMORY_CONFIG.topK,
      threshold || SEMANTIC_MEMORY_CONFIG.similarityThreshold
    );
    
    return c.json({ 
      results,
      meta: {
        query,
        count: results.length,
        usingWorkersAI: canUseWorkersAI()
      }
    });
  } catch (error) {
    return c.json({ error: 'Failed to search memory' }, 500);
  }
});

// Speech-to-Text using Whisper (free tier)
app.post('/api/speech-to-text', async (c) => {
  try {
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const formData = await c.req.formData();
    const audio = formData.get('audio');
    
    if (!audio) {
      return c.json({ error: 'No audio provided' }, 400);
    }
    
    if (!c.env.AI) {
      return c.json({ error: 'Workers AI not configured' }, 500);
    }
    
    const audioBuffer = await audio.arrayBuffer();
    
    // Use Whisper for speech recognition
    const results = await c.env.AI.run('@cf/openai/whisper', {
      audio: [...new Uint8Array(audioBuffer)]
    });
    
    return c.json({
      success: true,
      text: results.text || results.description || results,
      model: 'whisper'
    });
  } catch (error) {
    console.error('Speech-to-text error:', error);
    return c.json({ error: 'Failed to transcribe audio' }, 500);
  }
});

// Text-to-Speech using MeloTTS (free tier)
app.post('/api/text-to-speech', async (c) => {
  try {
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const { text, voice } = await c.req.json();
    
    if (!text) {
      return c.json({ error: 'No text provided' }, 400);
    }
    
    if (!c.env.AI) {
      return c.json({ error: 'Workers AI not configured' }, 500);
    }
    
    // Use MeloTTS for text-to-speech
    const results = await c.env.AI.run('@cf/myshell-ai/melotts', {
      text: text.substring(0, 500), // Limit to 500 chars
      voice: voice || 'male-qnq' // Options: male-qnq, female-qjs
    });
    
    // MeloTTS returns audio as base64 or array
    let audioData = results.audio;
    if (Array.isArray(audioData)) {
      audioData = Uint8Array.from(audioData);
    }
    
    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/wav',
        'Content-Disposition': 'inline; filename="speech.wav"'
      }
    });
  } catch (error) {
    console.error('Text-to-speech error:', error);
    return c.json({ error: 'Failed to synthesize speech' }, 500);
  }
});

// Get memory budget status
app.get('/api/memory/status', async (c) => {
  const indexKey = 'sem:index';
  const indexData = await getStore(c.env).get(indexKey);
  const memoryCount = indexData ? JSON.parse(indexData).length : 0;
  
  return c.json({
    budget: {
      used: embeddingBudget.used,
      limit: AI_BUDGET_CONFIG.maxDailyEmbeddings,
      remaining: Math.max(0, AI_BUDGET_CONFIG.maxDailyEmbeddings - embeddingBudget.used),
      resetAt: new Date(embeddingBudget.resetAt).toISOString()
    },
    memory: {
      count: memoryCount,
      maxMemories: SEMANTIC_MEMORY_CONFIG.maxMemories
    },
    cache: {
      entries: embeddingCache.size
    }
  });
});

// Clear all semantic memory (admin)
app.delete('/api/memory/clear', async (c) => {
  try {
    // CSRF validation
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const result = await clearSemanticMemory(c.env);
    embeddingCache.clear();
    
    return c.json({ 
      success: true,
      cleared: result.cleared
    });
  } catch (error) {
    return c.json({ error: 'Failed to clear memory' }, 500);
  }
});

// Store idea from /idea command
app.post('/api/idea', async (c) => {
  try {
    const { text, tags } = await c.req.json();
    
    if (!text) {
      return c.json({ error: 'text is required' }, 400);
    }
    
    const key = `idea:${Date.now()}`;
    const metadata = { type: 'idea', tags: tags || [] };
    
    const memory = await storeSemanticMemory(c.env, key, text, metadata);
    
    return c.json({ 
      success: true,
      id: key,
      createdAt: memory.createdAt
    });
  } catch (error) {
    return c.json({ error: 'Failed to store idea' }, 500);
  }
});

// Image analysis using Workers AI (free tier)
app.post('/api/analyze-image', async (c) => {
  try {
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const formData = await c.req.formData();
    const image = formData.get('image');
    
    if (!image) {
      return c.json({ error: 'No image provided' }, 400);
    }
    
    const imageBuffer = await image.arrayBuffer();
    
    // Check if AI binding is available
    if (!c.env.AI) {
      return c.json({ error: 'Workers AI not configured' }, 500);
    }
    
    // Use multimodal model for image understanding
    // @cf/unum/uform-gen2-qwen-7b supports image-to-text
    const results = await c.env.AI.run('@cf/unum/uform-gen2-qwen-7b', {
      image: [...new Uint8Array(imageBuffer)],
      prompt: 'Describe this image in detail. Include any text, objects, people, or important visual elements.'
    });
    
    return c.json({
      success: true,
      description: results.description || results.response || results,
      model: 'uform-gen2-qwen-7b'
    });
  } catch (error) {
    console.error('Image analysis error:', error);
    return c.json({ error: 'Failed to analyze image' }, 500);
  }
});

// Multi-agent coordination endpoint
app.post('/api/multi-agent', async (c) => {
  try {
    const { message, context } = await c.req.json();
    
    if (!message) {
      return c.json({ error: 'Message is required' }, 400);
    }
    
    // Parse multi-agent request
    const multiAgentRequest = parseMultiAgentRequest(message);
    
    if (!multiAgentRequest) {
      return c.json({ error: 'No multi-agent pattern detected. Use /agent1+agent2: or /chain:agent1->agent2: syntax' }, 400);
    }
    
    // Check budget for all agents
    for (const agentType of multiAgentRequest.agents) {
      if (!(await isWithinLimit(c.env, agentType, 500))) {
        return c.json({
          error: `Agent '${agentType}' has exceeded its daily token limit`,
          agent: agentType
        }, 429);
      }
    }
    
    // Execute based on mode
    let result;
    if (multiAgentRequest.mode === 'parallel') {
      result = await executeParallelAgents(c.env, multiAgentRequest.agents, multiAgentRequest.task, context);
    } else if (multiAgentRequest.mode === 'chain') {
      result = await executeChainAgents(c.env, multiAgentRequest.agents, multiAgentRequest.task, context);
    }
    
    return c.json({
      success: true,
      ...result,
      mode: multiAgentRequest.mode,
      agents: multiAgentRequest.agents
    });
    
  } catch (error) {
    console.error('Multi-agent error:', error);
    return c.json({ error: error.message || 'Multi-agent execution failed' }, 500);
  }
});

// Detect multi-agent pattern in chat message
app.post('/api/detect-multi-agent', async (c) => {
  try {
    const { message } = await c.req.json();
    
    if (!message) {
      return c.json({ isMultiAgent: false });
    }
    
    const parsed = parseMultiAgentRequest(message);
    
    return c.json({
      isMultiAgent: parsed !== null,
      mode: parsed?.mode || null,
      agents: parsed?.agents || [],
      task: parsed?.task || message
    });
    
  } catch (error) {
    return c.json({ isMultiAgent: false });
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