import { AI_BUDGET_CONFIG, SEMANTIC_MEMORY_CONFIG, EMBEDDING_MODEL } from '../config/index.js';

const embeddingCache = new Map();
const embeddingBudget = { used: 0, resetAt: getTomorrowMidnight() };

export function getTomorrowMidnight() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.getTime();
}

export function canUseWorkersAI() {
  const now = Date.now();
  if (now > embeddingBudget.resetAt) {
    embeddingBudget.used = 0;
    embeddingBudget.resetAt = getTomorrowMidnight();
  }
  return embeddingBudget.used < AI_BUDGET_CONFIG.maxDailyEmbeddings;
}

export function useWorkersAI() {
  embeddingBudget.used++;
}

export function getEmbeddingBudget() {
  return embeddingBudget;
}

function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) + char;
    hash = hash & 0xFFFFFFFF;
  }
  return Math.abs(hash);
}

function hashString(str) {
  return simpleHash(str).toString(36);
}

export async function generateEmbedding(env, text) {
  const cacheKey = hashString(text);
  
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey);
  }
  
  if (!AI_BUDGET_CONFIG.fallbackOnLimit && !canUseWorkersAI()) {
    const fallback = generateTFIDFFallback(text);
    embeddingCache.set(cacheKey, fallback);
    return fallback;
  }
  
  try {
    if (!env.AI) {
      const fallback = generateTFIDFFallback(text);
      embeddingCache.set(cacheKey, fallback);
      return fallback;
    }
    
    const ai = new CloudflareAI({ runtime: env });
    const result = await ai.run(EMBEDDING_MODEL, { text });
    const embedding = result.data[0];
    
    useWorkersAI();
    embeddingCache.set(cacheKey, embedding);
    
    return embedding;
  } catch (error) {
    const fallback = generateTFIDFFallback(text);
    embeddingCache.set(cacheKey, fallback);
    return fallback;
  }
}

function generateTFIDFFallback(text) {
  const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const vocab = [...new Set(words)];
  const vector = new Array(128).fill(0);
  
  vocab.forEach((word, i) => {
    const hash = simpleHash(word);
    const idx = hash % 128;
    vector[idx] += 1;
  });
  
  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  return norm > 0 ? vector.map(v => v / norm) : vector;
}

export function cosineSimilarity(vecA, vecB) {
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

export async function storeSemanticMemory(env, key, content, metadata = {}) {
  const embedding = await generateEmbedding(env, content);
  const memoryData = {
    key,
    content,
    embedding,
    metadata,
    createdAt: new Date().toISOString()
  };
  
  await getStore(env).put(`sem:${key}`, JSON.stringify(memoryData));
  
  const indexKey = 'sem:index';
  const indexData = await getStore(env).get(indexKey);
  const index = indexData ? JSON.parse(indexData) : [];
  
  if (index.length >= SEMANTIC_MEMORY_CONFIG.maxMemories) {
    index.shift();
  }
  
  index.push(key);
  await getStore(env).put(indexKey, JSON.stringify(index));
  
  return memoryData;
}

export async function searchSemanticMemory(env, query, topK = 5, threshold = 0.7) {
  const queryEmbedding = await generateEmbedding(env, query);
  
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
  
  return results
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}

export async function clearSemanticMemory(env) {
  const indexKey = 'sem:index';
  const indexData = await getStore(env).get(indexKey);
  const keys = indexData ? JSON.parse(indexData) : [];
  
  for (const key of keys) {
    await getStore(env).delete(`sem:${key}`);
  }
  await getStore(env).delete(indexKey);
  
  return { cleared: keys.length };
}

const memoryStore = new Map();

export function getStore(env) {
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

function getToday() {
  return new Date().toISOString().split('T')[0];
}

export async function getUsage(env, agentType) {
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
  
  const newUsage = { tokensUsed: 0, lastReset: today };
  await store.put(usageKey, JSON.stringify(newUsage));
  return newUsage;
}

export async function addUsage(env, agentType, tokens) {
  const usage = await getUsage(env, agentType);
  usage.tokensUsed += tokens;
  await getStore(env).put(`usage:${agentType}`, JSON.stringify(usage));
}

export async function getRemaining(env, agentType) {
  const usage = await getUsage(env, agentType);
  return Math.max(0, DAILY_LIMITS[agentType] - usage.tokensUsed);
}

export async function isWithinLimit(env, agentType, estimatedTokens = 0) {
  const usage = await getUsage(env, agentType);
  return usage.tokensUsed + estimatedTokens <= DAILY_LIMITS[agentType];
}

export async function getChatHistory(env, sessionId) {
  const key = `chat:${sessionId}`;
  const historyData = await getStore(env).get(key);
  if (historyData) {
    return JSON.parse(historyData);
  }
  return [];
}

export async function saveChatHistory(env, sessionId, messages) {
  const key = `chat:${sessionId}`;
  await getStore(env).put(key, JSON.stringify(messages));
}

export async function getLastAssistantMessage(env, sessionId) {
  const history = await getChatHistory(env, sessionId);
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'assistant') {
      return history[i];
    }
  }
  return null;
}
