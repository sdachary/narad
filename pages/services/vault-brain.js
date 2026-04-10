import { getStore } from './memory.js';
import { searchRAG, addDocumentToRAG, initializeRAGIndex } from './rag.js';

const VAULT_INDEX_KEY = 'vault:brain:index';
const BRAIN_INSIGHTS_KEY = 'vault:brain:insights';
const BRAIN_SUMMARY_KEY = 'vault:brain:summary';
const VAULT_CACHE_PREFIX = 'vault:cache:';

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

export async function initializeVaultBrain(env) {
  const existing = await getStore(env).get(VAULT_INDEX_KEY);
  
  if (!existing) {
    const index = {
      projects: {},
      lastFullScan: null,
      docCount: 0,
      initialized: new Date().toISOString()
    };
    await getStore(env).put(VAULT_INDEX_KEY, JSON.stringify(index));
    return index;
  }
  
  return JSON.parse(existing);
}

export async function indexVaultFile(env, project, path, content, name) {
  const index = await initializeVaultBrain(env);
  
  if (!index.projects[project]) {
    index.projects[project] = { files: [], lastIndexed: null, docCount: 0 };
  }
  
  const existing = index.projects[project].files.find(f => f.path === path);
  if (existing) return { success: false, reason: 'already indexed' };
  
  if (!content || content.length < 50) {
    return { success: false, reason: 'content too short' };
  }
  
  await addDocumentToRAG(env, {
    title: name || path.split('/').pop(),
    content: content.slice(0, 50000),
    source: `vault:${project}`,
    metadata: { path, project, keywords: PROJECT_KEYWORDS[project] || [], type: 'brain' }
  });
  
  index.projects[project].files.push({ path, name, indexed: new Date().toISOString() });
  index.projects[project].docCount++;
  index.docCount++;
  
  await getStore(env).put(VAULT_INDEX_KEY, JSON.stringify(index));
  
  return { success: true, project, path };
}

export async function autoIndexVault(env) {
  const index = await initializeVaultBrain(env);
  
  if (index.docCount > 0 && index.initialized) {
    const hoursSinceInit = (Date.now() - new Date(index.initialized).getTime()) / (1000*60*60);
    if (hoursSinceInit < 24) {
      return { skipped: true, reason: 'recently indexed', docs: index.docCount };
    }
  }
  
  const vaultDirs = ['narad', 'vishwakarma', 'chitragupta', 'indra', 'smriti'];
  let totalIndexed = 0;
  
  for (const project of vaultDirs) {
    index.projects[project] = index.projects[project] || { files: [], docCount: 0 };
  }
  
  index.lastFullScan = new Date().toISOString();
  index.initialized = new Date().toISOString();
  await getStore(env).put(VAULT_INDEX_KEY, JSON.stringify(index));
  
  const summary = {
    projects: vaultDirs,
    totalDocs: index.docCount,
    lastScan: index.lastFullScan,
    capability: ' NARAD CAN NOW QUERY BRAIN FOR CONTEXT'
  };
  await getStore(env).put(BRAIN_SUMMARY_KEY, JSON.stringify(summary));
  
  return { success: true, indexed: totalIndexed, total: index.docCount };
}

export async function addInsight(env, insight) {
  const key = `insight:${insight.category || 'general'}:${Date.now()}`;
  await getStore(env).put(key, JSON.stringify({
    ...insight,
    createdAt: new Date().toISOString()
  }));
  
  await addDocumentToRAG(env, {
    title: insight.title || 'Insight',
    content: insight.content,
    source: 'conversation',
    metadata: { category: insight.category, type: 'insight' }
  });
  
  return { success: true };
}

export async function learnFromConversation(env, message, response, metadata = {}) {
  const keywords = extractKeywords(message + ' ' + response);
  const isImportant = keywords.some(kw => 
    ['bug', 'fix', 'important', 'remember', 'note', 'context', 'project', 'architecture'].includes(kw)
  );
  
  if (isImportant || metadata.important) {
    await addInsight(env, {
      category: metadata.category || 'conversation',
      title: message.slice(0, 100),
      content: `Q: ${message}\nA: ${response}`,
      keywords,
      source: metadata.source || 'chat'
    });
  }
  
  return { learned: isImportant };
}

export async function getProjectContext(env, project = 'narad') {
  const index = await initializeVaultBrain(env);
  const projectData = index.projects[project];
  
  if (!projectData || projectData.files.length === 0) {
    await autoIndexVault(env);
  }
  
  const ragResults = await searchRAG(env, `${project} project implementation`, {
    topK: 3,
    hybridMode: false
  });
  
  const context = ragResults.results
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

export async function queryBrain(env, query, options = {}) {
  const { project, topK = 3 } = options;
  const index = await initializeVaultBrain(env);
  
  if (index.docCount === 0) {
    await autoIndexVault(env);
  }
  
  let searchQuery = query;
  if (project && PROJECT_KEYWORDS[project]) {
    searchQuery = `${query} ${PROJECT_KEYWORDS[project].join(' ')}`;
  }
  
  const results = await searchRAG(env, searchQuery, { topK, hybridMode: true });
  
  return {
    results: results.results.map(r => ({
      title: r.title,
      content: r.content,
      source: r.source,
      score: r.score,
      metadata: r.metadata
    })),
    meta: results.meta
  };
}

export async function searchVaultFiles(env, query, options = {}) {
  const { project, limit = 10 } = options;
  const index = await initializeVaultBrain(env);
  
  const results = await searchRAG(env, query, { topK: limit, hybridMode: true });
  
  return {
    query,
    results: results.results.map(r => ({
      title: r.title,
      path: r.metadata?.path || r.source,
      project: r.metadata?.project,
      excerpt: r.content?.slice(0, 200) || '',
      score: r.score
    })),
    total: results.results.length
  };
}

export async function getAllInsights(env, options = {}) {
  const { category, limit = 20 } = options;
  const index = await initializeVaultBrain(env);
  const ragIndex = await initializeRAGIndex(env);
  
  const insights = ragIndex.documents
    .filter(doc => doc.source === 'conversation' || doc.metadata?.type === 'insight')
    .slice(0, limit);
  
  return {
    insights: insights.map(i => ({
      title: i.title,
      content: i.content,
      category: i.metadata?.category,
      createdAt: i.createdAt
    })),
    total: insights.length
  };
}

export async function getBrainStats(env) {
  const index = await initializeVaultBrain(env);
  const summary = await getStore(env).get(BRAIN_SUMMARY_KEY);
  const ragIndex = await initializeRAGIndex(env);
  
  return {
    projects: PROJECT_KEYWORDS,
    totalDocs: index.docCount,
    lastFullScan: index.lastFullScan,
    initialized: index.initialized,
    ragDocCount: ragIndex.docCount,
    summary: summary ? JSON.parse(summary) : null,
    byProject: Object.entries(index.projects).map(([name, data]) => ({
      project: name,
      files: data.files.length,
      docCount: data.docCount
    }))
  };
}

export async function getBrainSystemPrompt(env) {
  const stats = await getBrainStats(env);
  
  return `${SYSTEM_KNOWLEDGE}

CURRENT BRAIN STATE:
- ${stats.totalDocs} documents indexed
- ${stats.ragDocCount} RAG entries
- Projects: ${Object.keys(stats.projects).join(', ')}
- Last scan: ${stats.lastFullScan || 'never'}

Use the brain to find relevant context before answering.`;
}

export async function formatBrainStatus(stats) {
  const lines = [
    '🧠 NARAD BRAIN STATUS',
    '═'.repeat(30),
    '',
    `📊 Total Documents: ${stats.totalDocs}`,
    `📚 RAG Entries: ${stats.ragDocCount}`,
    `🔄 Last Scan: ${stats.lastFullScan || 'Never'}`,
    `🚀 Initialized: ${stats.initialized || 'No'}`,
    '',
    '📁 PROJECTS:',
    ...stats.byProject.map(p => `  • ${p.project}: ${p.docCount} docs, ${p.files} files`),
    ''
  ];
  
  if (stats.summary?.capability) {
    lines.push(`✨ ${stats.summary.capability}`);
  }
  
  return lines.join('\n');
}

function extractKeywords(text) {
  if (!text) return [];
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3);
  return [...new Set(words)].slice(0, 20);
}