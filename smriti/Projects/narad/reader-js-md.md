---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reader-js.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 188
size: 5793 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# reader-js.md

> Documentation (188 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reader-js.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 188 |
| **Size** | 5793 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/reader.js"
project: "narad"
role: page
language: javascript
frameworks: []
lines: 150
size: 5153 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, javascript, page, project/narad]
---

# reader.js

> Web page (150 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/reader.js` |
| **Role** | page |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 150 |
| **Size** | 5153 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * Smriti | Knowledge Reader Engine
 */

let allNodes = []; // For search indexing

async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const path = urlParams.get('path');
    
    if (path) {
        loadNode(path);
    } else {
        document.getElementById('node-title').textContent = "SELECT A MEMORY";
        document.getElementById('node-path').textContent = "Use the search bar above or return to the Neural Map.";
    }

    // Load graph data for search indexing
    try {
        const response = await fetch('smriti_graph.json');
        const data = await response.json();
        allNodes = data.nodes;
        setupSearch();
    } catch (e) {
        console.warn("Search index failed to load.");
    }
}

async function loadNode(path) {
    try {
        // Vault paths are stored as pages/vault/Project/Note.md
        // We fetch from /vault/ which is mapped in the sync workflow
        const response = await fetch(`vault/${path}`);
        if (!response.ok) throw new Error("Memory not found");
        
        const markdown = await response.text();
        renderContent(markdown, path);
        updateMetadata(path);
        
    } catch (error) {
        console.error("Reader Error:", error);
        document.getElementById('node-title').textContent = "ERROR RECALLING MEMORY";
        document.getElementById('content').innerHTML = `
            <div style="color: #ff5f56; padding: 20px; border: 1px solid #ff5f56;">
                The neural link to <b>${path}</b> has been severed or the memory has moved.
            </div>
        `;
    }
}

function renderContent(markdown, path) {
    const contentEl = document.getElementById('content');
    
    // 1. Extract Summary for Indra
    extractIndraSummary(markdown);
    
    // 2. Parse Wikilinks [[Project/Note]] or [[Note]]
    let processedMd = markdown.replace(/\[\[(.*?)\]\]/g, (match, link) => {
        return `<span class="wikilink" onclick="navigateToNode('${link}')">${link}</span>`;
    });
    
    // 3. Render Markdown
    contentEl.innerHTML = marked.parse(processedMd);
    
    // Scroll to top
    document.querySelector('.reader-main').scrollTop = 0;
}

function updateMetadata(path) {
    const title = path.split('/').pop().replace('.md', '');
    document.getElementById('node-title').textContent = title;
    document.getElementById('node-path').textContent = `NARAD://SMRITI/VAULT/${path.toUpperCase()}`;
    window.history.pushState({}, '', `?path=${path}`);
}

function extractIndraSummary(markdown) {
    const indraSection = document.getElementById('indra-section');
    const indraText = document.getElementById('indra-text');
    
    // Try to find a summary section
    // Pattern 1: > [!SUMMARY] or # Summary
    const summaryMatch = markdown.match(/(?:# Summary|> \[!SUMMARY\])\s*([\s\S]*?)(?:\n\n|\n#)/i);
    
    if (summaryMatch) {
        indraText.innerHTML = marked.parse(summaryMatch[1].trim());
        indraSection.style.display = 'block';
    } else {
        // Fallback: First 3 non-empty lines
        const lines = markdown.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 3);
        if (lines.length) {
            indraText.textContent = lines.join(' ');
            indraSection.style.display = 'block';
        } else {
            indraSection.style.display = 'none';
        }
    }
}

function navigateToNode(link) {
    // If the link is just a name, find the full path in our index
    const node = allNodes.find(n => n.name.toLowerCase() === link.toLowerCase() || n.path.endsWith(link + '.md'));
    if (node) {
        loadNode(node.path);
    } else {
        alert("Node '" + link + "' not found in current neural index.");
    }
}

// SEARCH ENGINE
function setupSearch() {
    const searchBar = document.getElementById('search-bar');
    const results = document.getElementById('search-results');
    
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (!query) {
            results.style.display = 'none';
            return;
        }
        
        const filtered = allNodes
            .filter(n => n.name.toLowerCase().includes(query) || n.path.toLowerCase().includes(query))
            .slice(0, 8);
            
        if (filtered.length) {
            results.innerHTML = filtered.map(n => `
                <div class="search-item" onclick="selectResult('${n.path}')">
                    <b>${n.name}</b><br/>
                    <small style="opacity:0.5">${n.path}</small>
                </div>
            `).join('');
            results.style.display = 'block';
        } else {
            results.style.display = 'none';
        }
    });

    // Close results when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-area')) results.style.display = 'none';
    });
}

function selectResult(path) {
    document.getElementById('search-bar').value = '';
    document.getElementById('search-results').style.display = 'none';
    loadNode(path);
}

document.addEventListener('DOMContentLoaded', init);

```

```
