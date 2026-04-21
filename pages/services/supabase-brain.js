import { getStore } from './memory.js';

const SUPABASE_URL = 'https://facurlopyzmmrjnllsnd.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const VAULT_INDEX_KEY = 'vault:brain:index';

const BRAIN_SCHEMA = 'brain';

async function getClient(env) {
  const headers = {
    'Content-Type': 'application/json',
    'apikey': SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_KEY || '',
    'Authorization': `Bearer ${SUPABASE_SERVICE_KEY || env.SUPABASE_SERVICE_KEY || ''}`,
    'Accept-Profile': BRAIN_SCHEMA
  };
  return { url: SUPABASE_URL, headers, env };
}

function getTableUrl(url, table) {
  return `${url}/rest/v1/${table}`;
}

export async function initializeVaultBrain(env) {
  const existing = await getStore(env).get(VAULT_INDEX_KEY);
  
  if (!existing) {
    const index = {
      projects: {},
      lastFullScan: null,
      docCount: 0,
      initialized: new Date().toISOString(),
      source: 'supabase'
    };
    await getStore(env).put(VAULT_INDEX_KEY, JSON.stringify(index));
    return index;
  }
  
  return JSON.parse(existing);
}

export async function indexVaultFile(env, project, path, content, name) {
  const index = await initializeVaultBrain(env);
  const client = await getClient(env);
  
  if (!index.projects[project]) {
    index.projects[project] = { files: [], lastIndexed: null, docCount: 0 };
  }
  
  const existing = index.projects[project].files.find(f => f.path === path);
  if (existing) return { success: false, reason: 'already indexed' };
  
  if (!content || content.length < 50) {
    return { success: false, reason: 'content too short' };
  }
  
  const keywords = extractKeywords(content);
  
  try {
    const doc = {
      project,
      title: name || path.split('/').pop(),
      content: content.slice(0, 100000),
      source: `vault:${project}`,
      keywords,
      metadata: { path, project, type: 'brain' }
    };
    
    const response = await fetch(`${client.url}/rest/v1/brain_documents`, {
      method: 'POST',
      headers: { ...client.headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify(doc)
    });
    
    if (!response.ok) {
      throw new Error(`Supabase insert failed: ${response.status}`);
    }
    
    index.projects[project].files.push({ path, name, indexed: new Date().toISOString() });
    index.projects[project].docCount++;
    index.docCount++;
    
    await getStore(env).put(VAULT_INDEX_KEY, JSON.stringify(index));
    
    return { success: true, project, path };
  } catch (e) {
    return { success: false, reason: e.message };
  }
}

export async function autoIndexVault(env) {
  const index = await initializeVaultBrain(env);
  
  if (index.docCount > 0 && index.initialized) {
    const hoursSinceInit = (Date.now() - new Date(index.initialized).getTime()) / (1000*60*60);
    if (hoursSinceInit < 24) {
      return { skipped: true, reason: 'recently indexed', docs: index.docCount };
    }
  }
  
  const vaultDirs = ['narad', 'vishwakarma', 'chitragupta', 'indra', 'smriti', 'nisha', 'unnati'];
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
    capability: 'NARAD CAN NOW QUERY BRAIN FOR CONTEXT',
    source: 'supabase'
  };
  await getStore(env).put('vault:brain:summary', JSON.stringify(summary));
  
  return { success: true, indexed: totalIndexed, total: index.docCount, source: 'supabase' };
}

export async function addInsight(env, insight) {
  const client = await getClient(env);
  const keywords = extractKeywords(insight.content);
  
  const doc = {
    title: insight.title || 'Insight',
    content: insight.content,
    category: insight.category || 'general',
    keywords,
    metadata: { type: 'insight', ...insight.metadata }
  };
  
  try {
    const response = await fetch(`${client.url}/rest/v1/brain_insights`, {
      method: 'POST',
      headers: { ...client.headers, 'Prefer': 'return=minimal' },
      body: JSON.stringify(doc)
    });
    
    if (!response.ok) {
      throw new Error(`Supabase insert failed: ${response.status}`);
    }
    
    return { success: true };
  } catch (e) {
    return { success: false, reason: e.message };
  }
}

export async function learnFromConversation(env, message, response, metadata = {}) {
  const keywords = extractKeywords(message + ' ' + response);
  const isImportant = keywords.some(kw => 
    ['bug', 'fix', 'important', 'remember', 'note', 'context', 'project', 'architecture'].includes(kw)
  );
  
  if (isImportant || metadata.important) {
    await addInsight(env, {
      title: message.slice(0, 100),
      content: `Q: ${message}\nA: ${response}`,
      category: metadata.category || 'conversation',
      keywords,
      metadata
    });
  }
  
  return { learned: isImportant };
}

export async function queryBrain(env, query, options = {}) {
  const { project, topK = 3 } = options;
  const client = await getClient(env);
  const index = await initializeVaultBrain(env);
  
  if (index.docCount === 0) {
    await autoIndexVault(env);
  }
  
  let searchQuery = query;
  if (project) {
    const PROJECT_KEYWORDS = {
      narad: ['chat', 'ai', 'assistant', 'telegram', 'bot', 'cloudflare', 'gateway'],
      vishwakarma: ['cloudflare', 'workers', 'deployment'],
      chitragupta: ['tracking', 'analytics', 'metrics'],
      indra: ['keep-alive', 'monitoring'],
      nisha: ['skills', 'orchestration'],
      brain: ['knowledge', 'graph', 'memory']
    };
    searchQuery = `${query} ${PROJECT_KEYWORDS[project]?.join(' ') || ''}`;
  }
  
  try {
    const vectorQuery = await getEmbedding(env, searchQuery);
    
    const requestBody = {
      project: project || null,
      contents: vectorQuery
    };
    
    const rpcResponse = await fetch(`${client.url}/rest/v1/rpc/brain.match_documents`, {
      method: 'POST',
      headers: { ...client.headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    
    if (!rpcResponse.ok) {
      return await fallbackKeywordSearch(env, query, { topK });
    }
    
    const results = await rpcResponse.json();
    
    return {
      results: results.map(r => ({
        id: r.id,
        title: r.title,
        content: r.content,
        source: r.source,
        metadata: r.metadata
      })),
      meta: { mode: 'supabase_vector', total: results.length }
    };
  } catch (e) {
    return await fallbackKeywordSearch(env, query, { topK });
  }
}

async function fallbackKeywordSearch(env, query, options = {}) {
  const client = await getClient(env);
  const { topK = 3 } = options;
  
  try {
    const response = await fetch(
      `${client.url}/rest/v1/brain_documents?title=ilike.*${encodeURIComponent('%' + query + '%')}*&content=ilike.*${encodeURIComponent('%' + query + '%')}*&limit=${topK}`,
      { headers: client.headers }
    );
    
    const results = await response.json();
    
    return {
      results: Array.isArray(results) ? results.map(r => ({
        id: r.id,
        title: r.title,
        content: r.content,
        source: r.source,
        metadata: r.metadata
      })) : [],
      meta: { mode: 'keyword_fallback', total: 0 }
    };
  } catch (e) {
    return { results: [], meta: { mode: 'error', error: e.message } };
  }
}

async function getEmbedding(env, text) {
  if (env.AI) {
    try {
      const result = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text });
      return result.data || result;
    } catch (e) {
      return null;
    }
  }
  return null;
}

export async function searchVaultFiles(env, query, options = {}) {
  const { project, limit = 10 } = options;
  const client = await getClient(env);
  
  let url = `${client.url}/rest/v1/brain_documents?or=(title.ilike.*${encodeURIComponent('%' + query + '%')}*,content.ilike.*${encodeURIComponent('%' + query + '%')}*)&limit=${limit}`;
  
  if (project) {
    url += `&project=eq.${project}`;
  }
  
  try {
    const response = await fetch(url, { headers: client.headers });
    const results = await response.json();
    
    return {
      query,
      results: Array.isArray(results) ? results.map(r => ({
        id: r.id,
        title: r.title,
        path: r.source,
        project: r.project,
        excerpt: r.content?.slice(0, 200) || ''
      })) : [],
      total: Array.isArray(results) ? results.length : 0
    };
  } catch (e) {
    return { query, results: [], total: 0, error: e.message };
  }
}

export async function getAllInsights(env, options = {}) {
  const { category, limit = 20 } = options;
  const client = await getClient(env);
  
  let url = `${client.url}/rest/v1/brain_insights?limit=${limit}`;
  if (category) {
    url += `&category=eq.${category}`;
  }
  
  try {
    const response = await fetch(url, { headers: client.headers });
    const insights = await response.json();
    
    return {
      insights: Array.isArray(insights) ? insights.map(i => ({
        id: i.id,
        title: i.title,
        content: i.content,
        category: i.category,
        createdAt: i.created_at
      })) : [],
      total: Array.isArray(insights) ? insights.length : 0
    };
  } catch (e) {
    return { insights: [], total: 0, error: e.message };
  }
}

export async function getBrainStats(env) {
  const index = await initializeVaultBrain(env);
  const client = await getClient(env);
  
  try {
    const docCountResponse = await fetch(
      `${client.url}/rest/v1/brain_documents?select=id`,
      { headers: client.headers }
    );
    const insightsCountResponse = await fetch(
      `${client.url}/rest/v1/brain_insights?select=id`,
      { headers: client.headers }
    );
    
    const docCount = (await docCountResponse.json()).length;
    const insightsCount = (await insightsCountResponse.json()).length;
    
    return {
      source: 'supabase',
      totalDocs: docCount,
      totalInsights: insightsCount,
      lastFullScan: index.lastFullScan,
      initialized: index.initialized,
      byProject: Object.entries(index.projects).map(([name, data]) => ({
        project: name,
        files: data.files.length,
        docCount: data.docCount
      }))
    };
  } catch (e) {
    return {
      source: 'supabase',
      totalDocs: index.docCount,
      totalInsights: 0,
      lastFullScan: index.lastFullScan,
      error: e.message
    };
  }
}

export async function formatBrainStatus(stats) {
  const lines = [
    '🧠 NARAD BRAIN STATUS',
    '═'.repeat(30),
    '',
    `📊 Source: ${stats.source || 'supabase'}`,
    `📚 Total Documents: ${stats.totalDocs}`,
    `💡 Insights: ${stats.totalInsights}`,
    `🔄 Last Scan: ${stats.lastFullScan || 'Never'}`,
    `🚀 Initialized: ${stats.initialized || 'No'}`,
    ''
  ];
  
  if (stats.byProject?.length > 0) {
    lines.push('📁 PROJECTS:');
    lines.push(...stats.byProject.map(p => `  • ${p.project}: ${p.docCount} docs`));
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

export async function getProjectContext(env, project = 'narad') {
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

const PROJECT_KEYWORDS = {
  narad: ['chat', 'ai', 'assistant', 'telegram', 'bot', 'cloudflare', 'gateway'],
  vishwakarma: ['cloudflare', 'workers', 'deployment'],
  chitragupta: ['tracking', 'analytics', 'metrics'],
  indra: ['keep-alive', 'monitoring'],
  brain: ['knowledge', 'graph', 'memory', 'rag']
};

const SYSTEM_KNOWLEDGE = `You are Narad - an AI assistant with a knowledge brain.
Your brain (brain) contains context from your projects and learns from conversations.
Projects: Narad (chat UI), Vishwakarma (deployment), Chitragupta (metrics), Indra (monitoring), Brain (knowledge)

CAPABILITIES:
- Query brain for relevant project context before responding
- Learn and store new insights from conversations
- Self-improve by updating knowledge base

BEHAVIOR:
- Always check brain for relevant context before answering
- Store important findings, plans, and insights
- Link new knowledge to existing concepts`;

export async function getBrainSystemPrompt(env) {
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