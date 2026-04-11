export {
  initializeVaultBrain,
  indexVaultFile,
  autoIndexVault,
  addInsight,
  learnFromConversation,
  queryBrain,
  searchVaultFiles,
  getAllInsights,
  getBrainStats,
  formatBrainStatus
} from './supabase-brain.js';

export { getProjectContext, getBrainSystemPrompt } from './supabase-brain.js';

const PROJECT_KEYWORDS = {
  narad: ['chat', 'ai', 'assistant', 'telegram', 'bot', 'cloudflare', 'gateway'],
  vishwakarma: ['cloudflare', 'workers', 'deployment'],
  chitragupta: ['tracking', 'analytics', 'metrics'],
  indra: ['keep-alive', 'monitoring'],
  smriti: ['knowledge', 'graph', 'memory', 'rag']
};

const SYSTEM_KNOWLEDGE = `You are Narad - an AI assistant with a knowledge brain.
Your brain (smriti) contains context from your projects and learns from conversations.
Projects: Narad (chat UI), Vishwakarma (deployment), Chitragupta (metrics), Indra (monitoring), Smriti (knowledge)

CAPABILITIES:
- Query brain for relevant project context before responding
- Learn and store new insights from conversations
- Self-improve by updating knowledge base

BEHAVIOR:
- Always check brain for relevant context before answering
- Store important findings, plans, and insights
- Link new knowledge to existing concepts`;

export function getProjectKeywords() {
  return PROJECT_KEYWORDS;
}

export function getSystemKnowledge() {
  return SYSTEM_KNOWLEDGE;
}