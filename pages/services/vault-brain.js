import { getStore } from './memory.js';

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

import { getEmbedding } from './rag.js';

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

export async function getProjectContext(env, project = 'narad') {
  const { queryBrain, initializeVaultBrain } = await import('./supabase-brain.js');
  const index = await initializeVaultBrain(env);
  const projectData = index.projects[project];

  if (!projectData || projectData.files.length === 0) {
    await autoIndexVault(env);
  }

  const results = await queryBrain(env, `${project} project implementation`, { topK: 3 });

  const context = results.results
    .slice(0, 3)
    .map(r => r.content)
    .join('\n\n');

  return {
    context,
    project,
    filesFound: projectData?.files.length || 0,
    keywords: PROJECT_KEYWORDS[project] || []
  };
}

export async function getBrainSystemPrompt(env) {
  const { getBrainStats } = await import('./supabase-brain.js');
  const stats = await getBrainStats(env);

  return `${SYSTEM_KNOWLEDGE}

CURRENT BRAIN STATE:
- ${stats.totalDocs} documents indexed
- ${stats.totalInsights || 0} insights stored
- Projects: ${Object.keys(PROJECT_KEYWORDS).join(', ')}
- Last scan: ${stats.lastFullScan || 'never'}
- Source: ${stats.source || 'supabase'}

Use the brain to find relevant context before answering.`;
}

export async function autoIndexVault(env) {
  const { autoIndexVault: supabaseAutoIndex } = await import('./supabase-brain.js');
  return supabaseAutoIndex(env);
}

function extractKeywords(text) {
  if (!text) return [];
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);
  return [...new Set(words)].slice(0, 20);
}