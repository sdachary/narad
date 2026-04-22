import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ALLOWED_ORIGINS } from './config/index.js';
import { setupHealthRoutes } from './routes/health.js';
import { setupChatRoutes } from './routes/chat.js';
import { setupBrainRoutes } from './routes/brain.js';
import { setupErrorRoutes } from './routes/errors.js';
import { csrfManager } from './services/security.js';
import { getStore, getUsage, getRemaining, isWithinLimit, getChatHistory, saveChatHistory, clearSemanticMemory, getEmbeddingBudget, generateEmbedding, storeSemanticMemory, searchSemanticMemory } from './services/memory.js';
import { initializeRAGIndex, addDocumentToRAG, searchRAG, deleteDocumentFromRAG, getRAGStats } from './services/rag.js';
import { webSearch, scrapeUrl, multiProviderSearch } from './services/search.js';
import { mcpConnect, mcpQuery, mcpDisconnect, listAvailableConnectors } from './services/mcp.js';
import { initializeMemoryDB, saveMemory, searchMemories, getMemoryStats } from './services/sqlite-memory.js';
import { saveVerification, getVerificationStats, verifyTruth } from './services/verification.js';
import { CHARACTERS, getCharacter, listCharacters, getCharacterByTrait, getCharacterSystemPrompt } from './config/characters.js';
import { getRelationship, updateRelationship, summarizeContext } from './services/memory.js';
import { addDocument, searchDocuments, listDocuments, getContextForQuery } from './services/ragDocuments.js';
import { syncSessions, getSessions, saveSessionHistory, getSessionHistory, deleteSessionCloud } from './services/sessionSync.js';
import { triggerGitHubDispatch, analyzeGitHubRepo } from './services/github.js';
import { runLast30DaysResearch } from './services/research.js';
import { pollAllServices, checkServiceDown, SERVICES } from './services/observer.js';
import { generateDailySummary, generateWeeklyRd, checkAlerts } from './services/reporter.js';
import { setupDashboardRoutes } from './routes/dashboard.js';
import { fetchSkill } from './services/skills.js';
import { handleHermesWebhook } from './services/hermes-gateway.js';

const app = new Hono();

// Metrics collection
const metrics = {
  chatRequestsTotal: 0,
  providerLatency: [],
  tokenUsageTotal: 0,
  activeSessions: new Set(),
  startTime: Date.now()
};

const CORS_CONFIG = {
  origin: (origin) => {
    if (!origin) return '*';
    if (ALLOWED_ORIGINS.includes(origin)) return origin;
    if (typeof process !== 'undefined' && process.env?.ENVIRONMENT !== 'production' && origin.includes('localhost')) return origin;
    console.warn('[CORS] Rejected origin:', origin);
    return false;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-CSRF-Token', 'X-Requested-With', 'Authorization'],
  exposeHeaders: ['Content-Length', 'X-Total-Count', 'Retry-After'],
  maxAge: 86400
};

app.use('*', cors(CORS_CONFIG));

app.use('*', async (c, next) => {
  c.res.headers.set('X-Content-Type-Options', 'nosniff');
  c.res.headers.set('X-Frame-Options', 'DENY');
  c.res.headers.set('X-XSS-Protection', '1; mode=block');
  c.res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.res.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  c.res.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  c.res.headers.set('Server', 'Narad/2.0');
  await next();
});

app.use('*', async (c, next) => {
  const start = Date.now();
  await next();
  const duration = Date.now() - start;
  c.res.headers.set('X-Response-Time', `${duration}ms`);
});

setupHealthRoutes(app);
setupDashboardRoutes(app);

// Observer routes for service monitoring
app.get('/api/observer/services', async (c) => {
  const results = await pollAllServices(c.env);
  const down = await checkServiceDown(c.env);
  return c.json({
    services: results,
    summary: {
      total: results.length,
      healthy: results.filter(s => s.status === 'healthy').length,
      unhealthy: results.filter(s => s.status === 'unhealthy').length,
      error: results.filter(s => s.status === 'error').length
    },
    alerts: down.map(s => ({
      service: s.service,
      name: s.name,
      status: s.status,
      timestamp: s.lastCheck
    }))
  });
});

app.get('/api/observer/services/:service', async (c) => {
  const serviceKey = c.req.param('service');
  const results = await pollAllServices(c.env);
  const service = results.find(s => s.service === serviceKey);
  
  if (!service) {
    return c.json({ error: 'Service not found' }, 404);
  }
  
  return c.json(service);
});

// Reporter routes for proactive reporting
app.get('/api/reporter/daily-summary', async (c) => {
  const summary = await generateDailySummary(c.env);
  return c.json(summary);
});

app.get('/api/reporter/weekly-rd', async (c) => {
  const rd = await generateWeeklyRd(c.env);
  return c.json(rd);
});

app.get('/api/reporter/alerts', async (c) => {
  const alerts = await checkAlerts(c.env);
  return c.json({ alerts, count: alerts.length });
});

app.get('/api/reporter/status', async (c) => {
  const services = await pollAllServices(c.env);
  const alerts = await checkAlerts(c.env);
  const summary = await generateDailySummary(c.env);
  const rd = await generateWeeklyRd(c.env);
  
  return c.json({
    services: services.length,
    healthy: services.filter(s => s.status === 'healthy').length,
    alerts: alerts.length,
    lastSummary: summary,
    weeklyRd: rd
  });
});

setupChatRoutes(app, metrics);
setupBrainRoutes(app);
setupErrorRoutes(app);

app.all('/api/hermes-webhook', async (c) => {
  return handleHermesWebhook(c.req.raw, c.env);
});

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
    version: '2.0.0',
    agents,
    daily_use: Object.entries(WAREHOUSE_INDEX)
      .filter(([_, a]) => a.daily_use)
      .map(([id, a]) => ({ id, name: a.name, icon: a.icon }))
  });
});

app.get('/api/warehouse/:agentId', async (c) => {
  const agentId = c.req.param('agentId');
  
  const WAREHOUSE_AGENTS = (await import('./config/agents.js')).WAREHOUSE_AGENTS;
  
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

app.post('/api/feedback', async (c) => {
  const { validateCSRF, ValidationSchemas } = await import('./services/security.js');
  
  const csrfResult = validateCSRF(c.req);
  if (!csrfResult.valid) {
    return c.json({ error: 'CSRF validation failed' }, 403);
  }
  
  const { session_id, score } = await c.req.json();
  
  const sessionValidation = ValidationSchemas.sessionId.validate(session_id);
  if (!sessionValidation.valid) {
    return c.json({ error: sessionValidation.error }, 400);
  }
  
  const scoreValidation = ValidationSchemas.score.validate(score);
  if (!scoreValidation.valid) {
    return c.json({ error: scoreValidation.error }, 400);
  }
  
  const lastAssistant = await getLastAssistantMessage(c.env, session_id);
  if (!lastAssistant) {
    return c.json({ error: 'No assistant message found for this session' }, 404);
  }
  
  const feedbackKey = `feedback:${session_id}:${Date.now()}`;
  await getStore(c.env).put(feedbackKey, JSON.stringify({
    session_id,
    messageText: lastAssistant.text,
    score,
    timestamp: new Date().toISOString()
  }));
  
  return c.json({ success: true });
});

async function getLastAssistantMessage(env, sessionId) {
  const history = await getChatHistory(env, sessionId);
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'assistant') {
      return history[i];
    }
  }
  return null;
}

app.post('/api/memory/store', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  
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
});

app.post('/api/memory/search', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  
  const csrfResult = validateCSRF(c.req);
  if (!csrfResult.valid) {
    return c.json({ error: 'CSRF validation failed' }, 403);
  }
  
  const { query, topK, threshold } = await c.req.json();
  
  if (!query) {
    return c.json({ error: 'query is required' }, 400);
  }
  
  const { SEMANTIC_MEMORY_CONFIG, canUseWorkersAI } = await import('./config/index.js');
  
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
});

app.get('/api/memory/status', async (c) => {
  const indexKey = 'sem:index';
  const indexData = await getStore(c.env).get(indexKey);
  const memoryCount = indexData ? JSON.parse(indexData).length : 0;
  const budget = getEmbeddingBudget();
  const { AI_BUDGET_CONFIG } = await import('./config/index.js');
  
  return c.json({
    budget: {
      used: budget.used,
      limit: AI_BUDGET_CONFIG.maxDailyEmbeddings,
      remaining: Math.max(0, AI_BUDGET_CONFIG.maxDailyEmbeddings - budget.used),
      resetAt: new Date(budget.resetAt).toISOString()
    },
    memory: {
      count: memoryCount,
      maxMemories: 1000
    }
  });
});

app.delete('/api/memory/clear', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  
  const csrfResult = validateCSRF(c.req);
  if (!csrfResult.valid) {
    return c.json({ error: 'CSRF validation failed' }, 403);
  }
  
  const result = await clearSemanticMemory(c.env);
  
  return c.json({ 
    success: true,
    cleared: result.cleared
  });
});

app.post('/api/idea', async (c) => {
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
});

app.post('/api/speech-to-text', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  
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
  
  const results = await c.env.AI.run('@cf/openai/whisper', {
    audio: [...new Uint8Array(audioBuffer)]
  });
  
  return c.json({
    success: true,
    text: results.text || results.description || results,
    model: 'whisper'
  });
});

app.post('/api/text-to-speech', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  
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
  
  const results = await c.env.AI.run('@cf/myshell-ai/melotts', {
    text: text.substring(0, 500),
    voice: voice || 'male-qnq'
  });
  
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
});

app.post('/api/analyze-image', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  
  const csrfResult = validateCSRF(c.req);
  if (!csrfResult.valid) {
    return c.json({ error: 'CSRF validation failed' }, 403);
  }
  
  const formData = await c.req.formData();
  const image = formData.get('image');
  
  if (!image) {
    return c.json({ error: 'No image provided' }, 400);
  }
  
  if (!c.env.AI) {
    return c.json({ error: 'Workers AI not configured' }, 500);
  }
  
  const imageBuffer = await image.arrayBuffer();
  
  const results = await c.env.AI.run('@cf/unum/uform-gen2-qwen-7b', {
    image: [...new Uint8Array(imageBuffer)],
    prompt: 'Describe this image in detail.'
  });
  
  return c.json({
    success: true,
    description: results.description || results.response || results,
    model: 'uform-gen2-qwen-7b'
  });
});

app.post('/api/multi-agent', async (c) => {
  const { message, context } = await c.req.json();
  
  if (!message) {
    return c.json({ error: 'Message is required' }, 400);
  }
  
  return c.json({ 
    error: 'Multi-agent API moved to /api/chat with auto-detection',
    hint: 'Use /agent1+agent2: or /chain:agent1->agent2: syntax in /api/chat'
  }, 400);
});

app.post('/api/detect-multi-agent', async (c) => {
  const { message } = await c.req.json();
  
  if (!message) {
    return c.json({ isMultiAgent: false });
  }
  
  const lowerMessage = message.toLowerCase();
  const allAgentIds = Object.keys({ ...SUBAGENTS, ...WAREHOUSE_INDEX }).join('|');
  
  const parallelMatch = lowerMessage.match(new RegExp(`^\/([a-z]+(?:\+[a-z]+)+):?\s*(.*)`));
  if (parallelMatch) {
    const agents = parallelMatch[1].split('+');
    return c.json({
      isMultiAgent: agents.length > 1,
      mode: 'parallel',
      agents,
      task: parallelMatch[2] || message
    });
  }
  
  const chainMatch = lowerMessage.match(/^\/chain:([a-z]+(?:->[a-z]+)+):?\s*(.*)/);
  if (chainMatch) {
    const agents = chainMatch[1].split('->');
    return c.json({
      isMultiAgent: agents.length > 1,
      mode: 'chain',
      agents,
      task: chainMatch[2] || message
    });
  }
  
  return c.json({ isMultiAgent: false });
});

app.post('/api/reset-usage', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  
  const csrfResult = validateCSRF(c.req);
  if (!csrfResult.valid) {
    return c.json({ error: 'CSRF validation failed' }, 403);
  }
  
  return c.json({ success: true });
});

app.post('/api/rag/add', async (c) => {
  const { validateCSRF } = await import('./services/security.js');
  const csrfResult = validateCSRF(c.req);
  if (!csrfResult.valid) {
    return c.json({ error: 'CSRF validation failed' }, 403);
  }
  
  const { title, content, source, metadata } = await c.req.json();
  
  if (!title || !content) {
    return c.json({ error: 'title and content are required' }, 400);
  }
  
  const doc = await addDocumentToRAG(c.env, { title, content, source, metadata });
  
  return c.json({ success: true, document: doc });
});

app.post('/api/rag/search', async (c) => {
  const { query, topK, hybridMode } = await c.req.json();
  
  if (!query) {
    return c.json({ error: 'query is required' }, 400);
  }
  
  const results = await searchRAG(c.env, query, { topK, hybridMode });
  
  return c.json(results);
});

app.get('/api/rag/stats', async (c) => {
  const stats = await getRAGStats(c.env);
  return c.json(stats);
});

app.delete('/api/rag/doc/:docId', async (c) => {
  const { docId } = c.req.param();
  const result = await deleteDocumentFromRAG(c.env, docId);
  return c.json(result);
});

app.post('/api/search', async (c) => {
  const { query, provider, limit } = await c.req.json();
  
  if (!query) {
    return c.json({ error: 'query is required' }, 400);
  }
  
  const apiKey = c.env.SERPER_API_KEY || c.env.FIRECRAWL_API_KEY;
  const results = await webSearch(query, { provider, limit, apiKey });
  
  return c.json(results);
});

app.post('/api/search/scrape', async (c) => {
  const { url } = await c.req.json();
  
  if (!url) {
    return c.json({ error: 'url is required' }, 400);
  }
  
  const result = await scrapeUrl(url, { apiKey: c.env.FIRECRAWL_API_KEY });
  return c.json(result);
});

app.post('/api/search/multi', async (c) => {
  const { query, providers, limit } = await c.req.json();
  
  if (!query) {
    return c.json({ error: 'query is required' }, 400);
  }
  
  const apiKeys = {
    serper: c.env.SERPER_API_KEY,
    firecrawl: c.env.FIRECRAWL_API_KEY
  };
  
  const results = await multiProviderSearch(query, { providers, limit, apiKeys });
  return c.json(results);
});

app.post('/api/mcp/connect', async (c) => {
  const { connectorType, config } = await c.req.json();
  
  if (!connectorType) {
    return c.json({ error: 'connectorType is required' }, 400);
  }
  
  const result = await mcpConnect(c.env, connectorType, config || {});
  return c.json(result);
});

app.post('/api/mcp/query', async (c) => {
  const { connectorId, query } = await c.req.json();
  
  if (!connectorId || !query) {
    return c.json({ error: 'connectorId and query are required' }, 400);
  }
  
  const result = await mcpQuery(c.env, connectorId, query);
  return c.json(result);
});

app.post('/api/mcp/disconnect', async (c) => {
  const { connectorId } = await c.req.json();
  
  if (!connectorId) {
    return c.json({ error: 'connectorId is required' }, 400);
  }
  
  const result = await mcpDisconnect(connectorId);
  return c.json(result);
});

app.get('/api/mcp/connectors', async (c) => {
  const result = listAvailableConnectors();
  return c.json({ connectors: result });
});

app.post('/api/verification/verify', async (c) => {
  const { query, result, threshold } = await c.req.json();
  
  if (!query || !result) {
    return c.json({ error: 'query and result are required' }, 400);
  }
  
  const verification = await verifyTruth(c.env, query, result, { threshold });
  return c.json(verification);
});

app.get('/api/verification/history', async (c) => {
  const limit = parseInt(c.req.query('limit') || '50');
  const history = await getVerificationStats(c.env);
  return c.json(history);
});

app.get('/api/verification/stats', async (c) => {
  const stats = await getVerificationStats(c.env);
  return c.json(stats);
});

app.post('/api/memory/sql', async (c) => {
  const { sql, params } = await c.req.json();
  
  if (!sql) {
    return c.json({ error: 'sql is required' }, 400);
  }
  
  const db = await initializeMemoryDB(c.env);
  const result = await executeSQL(c.env, sql, params || []);
  return c.json(result);
});

  app.post('/api/memory/save', async (c) => {
    const { key, content, type, importance } = await c.req.json();
   
    if (!key || !content) {
      return c.json({ error: 'key and content are required' }, 400);
    }
   
    const memory = await saveMemory(c.env, key, content, type, importance);
    return c.json({ success: true, memory });
  });

  // Metrics endpoint
  app.get('/api/metrics', async (c) => {
    const uptime = Date.now() - metrics.startTime;
    const avgLatency = metrics.providerLatency.length > 0 
      ? (metrics.providerLatency.reduce((a, b) => a + b, 0) / metrics.providerLatency.length) 
      : 0;
    
    // Create histogram buckets for latency (in seconds)
    const latencyBuckets = [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10];
    const latencyCounts = latencyBuckets.map(le => 
      metrics.providerLatency.filter(d => d <= le).length
    );
    
    const metricsText = `# HELP narad_chat_requests_total Total number of chat requests
# TYPE narad_chat_requests_total counter
narad_chat_requests_total ${metrics.chatRequestsTotal}

# HELP narad_provider_latency_seconds Latency of AI provider responses in seconds
# TYPE narad_provider_latency_seconds histogram
narad_provider_latency_seconds_count ${metrics.providerLatency.length}
narad_provider_latency_seconds_sum ${(metrics.providerLatency.reduce((a, b) => a + b, 0) / 1000).toFixed(3)}
${latencyBuckets.map((le, i) => `narad_provider_latency_seconds_bucket{le="${le}"} ${latencyCounts[i]}`).join('\n')}
narad_provider_latency_seconds_bucket{le="+Inf"} ${metrics.providerLatency.length}

# HELP narad_token_usage_total Total number of tokens used
# TYPE narad_token_usage_total counter
narad_token_usage_total ${metrics.tokenUsageTotal}

# HELP narad_active_sessions Number of active chat sessions
# TYPE narad_active_sessions gauge
narad_active_sessions ${metrics.activeSessions.size}

# HELP narad_uptime_seconds Worker uptime in seconds
# TYPE narad_uptime_seconds counter
narad_uptime_seconds ${Math.floor(uptime / 1000)}

# EOF
`;
   
    return new Response(metricsText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; version=0.0.4',
      }
    });
  });

app.post('/api/memory/search', async (c) => {
  const { query, type, limit } = await c.req.json();
  
  if (!query) {
    return c.json({ error: 'query is required' }, 400);
  }
  
  const results = await searchMemories(c.env, query, type, limit);
  return c.json({ results });
});

// ============================================
// CLOUD SESSION & GITHUB ROUTES
// ============================================

app.get('/api/sessions/:mode', async (c) => {
    const { mode } = c.req.param();
    const sessions = await getSessions(c.env, mode);
    return c.json({ sessions });
});

app.post('/api/sessions/sync', async (c) => {
    const { validateCSRF } = await import('./services/security.js');
    if (!validateCSRF(c.req).valid) return c.json({ error: 'CSRF failed' }, 403);
    
    const { mode, sessions } = await c.req.json();
    await syncSessions(c.env, mode, sessions);
    return c.json({ success: true });
});

app.get('/api/sessions/history/:sessionId', async (c) => {
    const { sessionId } = c.req.param();
    const history = await getSessionHistory(c.env, sessionId);
    return c.json({ history });
});

app.post('/api/sessions/history/:sessionId', async (c) => {
    const { validateCSRF } = await import('./services/security.js');
    if (!validateCSRF(c.req).valid) return c.json({ error: 'CSRF failed' }, 403);
    
    const { sessionId } = c.req.param();
    const { history } = await c.req.json();
    await saveSessionHistory(c.env, sessionId, history);
    return c.json({ success: true });
});

app.post('/api/github/dispatch', async (c) => {
    const { validateCSRF } = await import('./services/security.js');
    if (!validateCSRF(c.req).valid) return c.json({ error: 'CSRF failed' }, 403);
    
    try {
        const payload = await c.req.json();
        const result = await triggerGitHubDispatch(c.env, payload);
        return c.json(result);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

app.post('/api/github/analyze', async (c) => {
    const { repoUrl } = await c.req.json();
    try {
        const result = await analyzeGitHubRepo(c.env, repoUrl);
        return c.json(result);
    } catch (e) {
        return c.json({ error: e.message }, 400);
    }
});

app.post('/api/research/last30days', async (c) => {
    const { topic } = await c.req.json();
    if (!topic) return c.json({ error: 'Topic required' }, 400);
    
    try {
        const result = await runLast30DaysResearch(c.env, topic);
        return c.json(result);
    } catch (e) {
        return c.json({ error: e.message }, 500);
    }
});

app.get('/api/skills/:name', async (c) => {
    const { name } = c.req.param();
    try {
        const skill = await fetchSkill(c.env, name);
        return c.json(skill);
    } catch (e) {
        return c.json({ error: e.message }, 404);
    }
});

app.get('/api/memory/stats', async (c) => {
  const stats = await getMemoryStats(c.env);
  return c.json(stats);
});

export default {
  async fetch(request, env, ctx) {
    // Cron handler for scheduled observer polls
    if (request.method === 'GET' && request.url.includes('/api/cron/observer')) {
      const results = await pollAllServices(env);
      const down = await checkServiceDown(env);
      
      if (down.length > 0) {
        console.log('[Observer] Services down:', down.map(s => s.service).join(', '));
      }
      
      return new Response(JSON.stringify({
        timestamp: new Date().toISOString(),
        totalServices: results.length,
        downCount: down.length,
        downServices: down
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    env._services = { csrfManager };
    
    const url = new URL(request.url);
    
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
    
    if (url.pathname.startsWith('/api/')) {
      const response = await app.fetch(request, env, ctx);
      
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    }
    
    const staticResponse = await env.ASSETS.fetch(request);
    
    const newResponse = new Response(staticResponse.body, staticResponse);
    Object.entries(securityHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });
    
    return newResponse;
  }
};
