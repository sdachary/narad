import { getStore } from './memory.js';
import { searchRAG, addDocumentToRAG } from './rag.js';

const VAULT_INDEX_KEY = 'vault:brain:index';
const VAULT_CACHE_TTL = 24 * 60 * 60 * 1000;

const PROJECT_KEYWORDS = {
  narad: ['chat', 'ai', 'assistant', 'telegram', 'bot', 'cloudflare', 'gateway'],
  vishwakarma: ['cloudflare', 'workers', 'deployment'],
  chitragupta: ['tracking', 'analytics', 'metrics'],
  indra: ['keep-alive', 'monitoring'],
  smriti: ['knowledge', 'graph', 'memory', 'rag']
};

export async function initializeVaultBrain(env) {
  const existing = await getStore(env).get(VAULT_INDEX_KEY);
  
  if (!existing) {
    const index = {
      projects: {},
      lastFullScan: null,
      docCount: 0
    };
    await getStore(env).put(VAULT_INDEX_KEY, JSON.stringify(index));
    return index;
  }
  
  return JSON.parse(existing);
}

export async function indexVaultFiles(env, projectFiles) {
  const index = await initializeVaultBrain(env);
  let added = 0;
  
  for (const file of projectFiles) {
    const project = file.project || 'general';
    
    if (!index.projects[project]) {
      index.projects[project] = {
        files: [],
        lastIndexed: null,
        docCount: 0
      };
    }
    
    const existing = index.projects[project].files.find(f => f.path === file.path);
    if (existing) continue;
    
    try {
      await addDocumentToRAG(env, {
        title: file.name || file.path.split('/').pop(),
        content: file.content || file.excerpt || '',
        source: `vault:${project}`,
        metadata: {
          path: file.path,
          project,
          keywords: PROJECT_KEYWORDS[project] || [],
          type: 'brain'
        }
      });
      
      index.projects[project].files.push({
        path: file.path,
        name: file.name,
        indexed: new Date().toISOString()
      });
      index.projects[project].docCount++;
      index.docCount++;
      added++;
    } catch (e) {
      console.warn(`[VaultBrain] Failed to index ${file.path}:`, e.message);
    }
  }
  
  index.lastFullScan = new Date().toISOString();
  await getStore(env).put(VAULT_INDEX_KEY, JSON.stringify(index));
  
  return { added, total: index.docCount };
}

export async function getProjectContext(env, project = 'narad') {
  const index = await initializeVaultBrain(env);
  const projectData = index.projects[project];
  
  if (!projectData || !projectData.files.length) {
    return { context: '', project, filesFound: 0 };
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
    filesFound: projectData.files.length,
    keywords: PROJECT_KEYWORDS[project] || []
  };
}

export async function queryBrain(env, query, options = {}) {
  const { project, topK = 3 } = options;
  const index = await initializeVaultBrain(env);
  
  let searchQuery = query;
  if (project && PROJECT_KEYWORDS[project]) {
    searchQuery = `${query} ${PROJECT_KEYWORDS[project].join(' ')}`;
  }
  
  const results = await searchRAG(env, searchQuery, {
    topK,
    hybridMode: true
  });
  
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

export async function getBrainStats(env) {
  const index = await initializeVaultBrain(env);
  
  return {
    projects: Object.keys(index.projects),
    totalDocs: index.docCount,
    lastFullScan: index.lastFullScan,
    byProject: Object.entries(index.projects).map(([name, data]) => ({
      project: name,
      files: data.files.length,
      docCount: data.docCount
    }))
  };
}