const SMRITI_NODES = [
  { id: 'narad', label: 'narad', type: 'project', path: 'narad' },
  { id: 'vishwakarma', label: 'vishwakarma', type: 'project', path: 'vishwakarma' },
  { id: 'chitragupta', label: 'chitragupta', type: 'project', path: 'chitragupta' },
  { id: 'karma', label: 'karma', type: 'project', path: 'karma' },
  { id: 'kanak', label: 'kanak', type: 'project', path: 'kanak' },
  { id: 'unnati', label: 'unnati', type: 'project', path: 'unnati' },
  { id: 'indra', label: 'indra', type: 'project', path: 'indra' },
  { id: 'social-blueprint-ai', label: 'social-blueprint-ai', type: 'project', path: 'social-blueprint-ai' },
  { id: 'Knowledge-Map', label: 'Knowledge-Map', type: 'file', path: 'Knowledge/Knowledge-Map.md' },
  { id: 'Home', label: 'Home', type: 'file', path: 'Home.md' },
  { id: 'SUMMARY', label: 'SUMMARY', type: 'file', path: 'SUMMARY.md' }
];

const SMRITI_EDGES = [
  { source: 'Knowledge-Map', target: 'narad', type: 'wikilink' },
  { source: 'Knowledge-Map', target: 'vishwakarma', type: 'wikilink' },
  { source: 'Knowledge-Map', target: 'chitragupta', type: 'wikilink' },
  { source: 'Knowledge-Map', target: 'unnati', type: 'wikilink' },
  { source: 'Knowledge-Map', target: 'kanak', type: 'wikilink' },
  { source: 'narad', target: 'chitragupta', type: 'wikilink' },
  { source: 'narad', target: 'vishwakarma', type: 'wikilink' },
  { source: 'narad', target: 'unnati', type: 'wikilink' },
  { source: 'unnati', target: 'karma', type: 'wikilink' },
  { source: 'vishwakarma', target: 'indra', type: 'wikilink' },
  { source: 'chitragupta', target: 'narad', type: 'wikilink' }
];

export async function getKnowledgeGraph() {
  return {
    nodes: SMRITI_NODES,
    edges: SMRITI_EDGES
  };
}

export async function searchSmriti(query) {
  const { nodes } = await getKnowledgeGraph();
  const queryLower = query.toLowerCase();
  return nodes.filter(n => n.label.toLowerCase().includes(queryLower));
}

export async function getFileContent(filePath) {
  return { error: 'Not implemented in worker - use Obsidian' };
}