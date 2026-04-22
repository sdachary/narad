import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import { createServer } from 'http';

const SMRITI_PATH = join(process.cwd(), 'smriti');
const PORT = 3001;

let indexCache = null;
let lastIndexed = 0;
const CACHE_TTL = 60000;

async function buildIndex() {
  const now = Date.now();
  
  if (indexCache && (now - lastIndexed) < CACHE_TTL) {
    return indexCache;
  }

  const nodes = new Map();
  const edges = [];
  const tagsIndex = new Map();
  const contentIndex = new Map();

  async function scanDir(dir) {
    try {
      const entries = await readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        const relPath = relative(SMRITI_PATH, fullPath);

        if (entry.isDirectory() && !entry.name.startsWith('.') && !entry.name.includes('node_modules')) {
          const nodeId = entry.name;
          nodes.set(nodeId, {
            id: nodeId,
            label: nodeId,
            type: 'category',
            path: relPath
          });
          await scanDir(fullPath);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const fileName = entry.name.replace('.md', '');
          const content = await readFile(fullPath, 'utf-8').catch(() => '');

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
            project: frontmatter.project,
            tags: frontmatter.tags
          });

          if (frontmatter.tags) {
            frontmatter.tags.replace(/[\[\]]/g, '').split(',').forEach(t => {
              const tag = t.trim().toLowerCase();
              if (tag && !tagsIndex.has(tag)) tagsIndex.set(tag, []);
              if (tag) tagsIndex.get(tag).push(fileName);
            });
          }

          const wikilinks = content.match(/\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g) || [];
          for (const link of wikilinks) {
            const target = link.replace(/\[\[|\]\]/g, '').split('|')[0].trim();
            edges.push({ source: fileName, target, type: 'wikilink' });

            if (!nodes.has(target)) {
              nodes.set(target, { id: target, label: target, type: 'reference' });
            }
          }

          const plainContent = content.replace(/---[\s\S]*?---\n?/g, '').replace(/[#*`\[\]]/g, '');
          contentIndex.set(fileName, plainContent.toLowerCase());
        }
      }
    } catch (e) {
      console.error('Error scanning:', dir, e.message);
    }
  }

  await scanDir(SMRITI_PATH);

  indexCache = {
    nodes: Array.from(nodes.values()),
    edges,
    tagsIndex: Object.fromEntries(tagsIndex),
    contentIndex,
    indexed: new Date().toISOString()
  };
  lastIndexed = now;

  return indexCache;
}

const server = createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    return;
  }

  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const { tool, params } = JSON.parse(Buffer.concat(buffers).toString());
    
    let result;

    switch (tool) {
      case 'memory_store': {
        const { key, value, tags } = params;
        if (!global.memoryStore) global.memoryStore = new Map();
        global.memoryStore.set(key, { value, tags: tags || [], stored: new Date().toISOString() });
        result = { success: true, key };
        break;
      }

      case 'memory_recall': {
        const query = (params.query || '').toLowerCase();
        const index = await buildIndex();
        const results = [];
        
        index.nodes.forEach(node => {
          if (node.label.toLowerCase().includes(query)) {
            results.push({ type: 'node', ...node, score: 2 });
          }
        });

        Object.entries(index.contentIndex).forEach(([file, content]) => {
          if (content.includes(query) && !results.find(r => r.id === file)) {
            const node = index.nodes.find(n => n.id === file);
            if (node) results.push({ type: 'node', ...node, score: 1 });
          }
        });

        if (global.memoryStore) {
          global.memoryStore.forEach((data, key) => {
            if (key.toLowerCase().includes(query) || data.value.toLowerCase().includes(query)) {
              results.push({ type: 'memory', id: key, label: key, value: data.value, score: 1 });
            }
          });
        }

        result = { results: results.slice(0, 20), count: results.length };
        break;
      }

      case 'memory_search': {
        const tags = params.tags || [];
        const index = await buildIndex();
        const results = [];
        
        for (const tag of tags) {
          const tagLower = tag.toLowerCase();
          const matchingNodes = index.tagsIndex[tagLower] || [];
          matchingNodes.forEach(nodeId => {
            const node = index.nodes.find(n => n.id === nodeId);
            if (node && !results.find(r => r.id === node.id)) {
              results.push({ type: 'node', ...node, matched_tag: tag });
            }
          });
        }

        result = { results, count: results.length };
        break;
      }

      case 'kb_lookup': {
        const question = (params.question || '').toLowerCase();
        const index = await buildIndex();
        
        const keywords = question.split(/\s+/).filter(w => w.length > 2);
        const scores = new Map();

        index.nodes.forEach(node => {
          let score = 0;
          keywords.forEach(kw => {
            if (node.label.toLowerCase().includes(kw)) score += 3;
          });
          if (score > 0) scores.set(node.id, score);
        });

        Object.entries(index.contentIndex).forEach(([file, content]) => {
          let score = 0;
          keywords.forEach(kw => {
            const matches = (content.match(new RegExp(kw, 'gi')) || []).length;
            score += matches;
          });
          const current = scores.get(file) || 0;
          scores.set(file, current + score);
        });

        const ranked = Array.from(scores.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([id, score]) => {
            const node = index.nodes.find(n => n.id === id);
            return { ...node, score };
          });

        result = { results: ranked, question };
        break;
      }

      case 'graph_get': {
        const index = await buildIndex();
        result = { nodes: index.nodes, edges: index.edges, indexed: index.indexed };
        break;
      }

      case 'graph_stats': {
        const index = await buildIndex();
        result = {
          total_nodes: index.nodes.length,
          total_edges: index.edges.length,
          tags: Object.keys(index.tagsIndex).length,
          categories: index.nodes.filter(n => n.type === 'category').length,
          projects: index.nodes.filter(n => n.type === 'project').length,
          indexed: index.indexed
        };
        break;
      }

      default:
        result = { error: `Unknown tool: ${tool}` };
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));

  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: e.message }));
  }
});

server.listen(PORT, () => {
  console.log(`🧠 Second Brain MCP running at http://localhost:${PORT}`);
  console.log(`📚 Reading from: ${SMRITI_PATH}`);
  console.log(`\nTools available:`);
  console.log(`  - memory_store(key, value, tags?)`);
  console.log(`  - memory_recall(query)`);
  console.log(`  - memory_search(tags[])`);
  console.log(`  - kb_lookup(question)`);
  console.log(`  - graph_get()`);
  console.log(`  - graph_stats()`);
});