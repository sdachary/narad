import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';

const SMRITI_PATH = './smriti';

let graphCache = null;
let lastIndexed = 0;
const CACHE_TTL = 60000;

export async function getKnowledgeGraph(forceRefresh = false) {
  const now = Date.now();
  
  if (!forceRefresh && graphCache && (now - lastIndexed) < CACHE_TTL) {
    return graphCache;
  }

  try {
    const { nodes, edges } = await buildGraph();
    graphCache = { nodes, edges };
    lastIndexed = now;
    return graphCache;
  } catch (e) {
    console.error('Failed to build knowledge graph:', e);
    return { nodes: [], edges: [] };
  }
}

async function buildGraph() {
  const nodes = new Map();
  const edges = [];
  
  async function scanDir(dir, parentDir = null) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relPath = relative(SMRITI_PATH, fullPath);
        
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '__pycache__') {
          const nodeId = entry.name;
          nodes.set(nodeId, {
            id: nodeId,
            label: nodeId,
            type: 'category',
            path: relPath
          });
          await scanDir(fullPath, nodeId);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const content = await readFile(fullPath, 'utf-8').catch(() => '');
          const fileName = entry.name.replace('.md', '');
          
          // Parse frontmatter
          let frontmatter = {};
          const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
          if (fmMatch) {
            try {
              fmMatch[1].split('\n').forEach(line => {
                const [key, ...valueParts] = line.split(':');
                if (key && valueParts.length) {
                  frontmatter[key.trim()] = valueParts.join(':').trim();
                }
              });
            } catch (e) {}
          }
          
          nodes.set(fileName, {
            id: fileName,
            label: fileName,
            type: frontmatter.project ? 'project' : 'file',
            path: relPath,
            project: frontmatter.project
          });
          
          // Extract wikilinks [[...]]
          const wikilinks = content.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g) || [];
          for (const link of wikilinks) {
            const target = link.replace(/\[\[|\]\]/g, '').split('|')[0].trim();
            edges.push({
              source: fileName,
              target: target,
              type: 'wikilink'
            });
            
            if (!nodes.has(target)) {
              nodes.set(target, {
                id: target,
                label: target,
                type: 'reference'
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('Error scanning:', dir, e.message);
    }
  }

  await scanDir(SMRITI_PATH);

  return {
    nodes: Array.from(nodes.values()),
    edges
  };
}

export async function searchSmriti(query) {
  const { nodes, edges } = await getKnowledgeGraph();
  const queryLower = query.toLowerCase();
  const results = nodes.filter(n => n.label.toLowerCase().includes(queryLower));
  return results;
}

export async function getFileContent(filePath) {
  try {
    const content = await readFile(join(SMRITI_PATH, filePath), 'utf-8');
    return { content };
  } catch (e) {
    return { error: e.message };
  }
}