import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { ALLOWED_ORIGINS } from './config/index.js';
import { setupHealthRoutes } from './routes/health.js';
import { setupChatRoutes } from './routes/chat.js';
import { setupErrorRoutes } from './routes/errors.js';
import { csrfManager } from './services/security.js';
import { getStore, getUsage, getRemaining, isWithinLimit, getChatHistory, saveChatHistory, clearSemanticMemory, getEmbeddingBudget } from './services/memory.js';
import { storeSemanticMemory, searchSemanticMemory } from './services/memory.js';
import { WAREHOUSE_INDEX, SUBAGENTS } from './config/agents.js';

const app = new Hono();

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
setupChatRoutes(app);
setupErrorRoutes(app);

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

export default {
  async fetch(request, env, ctx) {
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
