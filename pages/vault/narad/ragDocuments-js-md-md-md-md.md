---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ragDocuments-js-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 378
size: 9021 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad]
---

# ragDocuments-js-md-md-md.md

> Documentation (378 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ragDocuments-js-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 378 |
| **Size** | 9021 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ragDocuments-js-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 340
size: 8306 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad]
---

# ragDocuments-js-md-md.md

> Documentation (340 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ragDocuments-js-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 340 |
| **Size** | 8306 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ragDocuments-js-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 302
size: 7600 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# ragDocuments-js-md.md

> Documentation (302 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ragDocuments-js-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 302 |
| **Size** | 7600 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ragDocuments-js.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 264
size: 6903 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# ragDocuments-js.md

> Documentation (264 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ragDocuments-js.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 264 |
| **Size** | 6903 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/ragDocuments.js"
project: "narad"
role: page
language: javascript
frameworks: []
lines: 226
size: 6227 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, javascript, page, project/narad]
---

# ragDocuments.js

> Web page (226 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/ragDocuments.js` |
| **Role** | page |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 226 |
| **Size** | 6227 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const docStore = new Map();

function getDocsStore(env) {
  if (env && env.NARAD_DATA && typeof env.NARAD_DATA.get === 'function') {
    return env.NARAD_DATA;
  }
  return {
    async get(key) { return docStore.get(key) || null; },
    async put(key, value) { docStore.set(key, value); },
    async delete(key) { docStore.delete(key); },
    async list(prefix) {
      const prefixStr = prefix ? prefix.name : '';
      const keys = Array.from(docStore.keys())
        .filter(k => k.startsWith(prefixStr))
        .map(k => ({ name: k }));
      return { keys };
    }
  };
}

function generateDocId() {
  return `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function extractKeywords(text) {
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 2 && !['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'now', 'old', 'see', 'than', 'that', 'this', 'with'].includes(w));
  
  const wordCounts = {};
  words.forEach(word => {
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  });
  
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word]) => word);
}

function createDocument(sessionId, doc) {
  const id = generateDocId();
  const now = new Date().toISOString();
  const keywords = extractKeywords(doc.content || '');
  
  return {
    id,
    title: doc.title || 'Untitled',
    content: doc.content || '',
    type: doc.type || 'text',
    tags: doc.tags || [],
    keywords,
    addedAt: now,
    sessionId
  };
}

export async function addDocument(env, sessionId, doc) {
  const store = getDocsStore(env);
  const document = createDocument(sessionId, doc);
  
  const indexKey = `rag:index:${sessionId}`;
  const indexData = await store.get(indexKey);
  const index = indexData ? JSON.parse(indexData) : [];
  
  index.push(document.id);
  await store.put(indexKey, JSON.stringify(index));
  
  await store.put(`rag:doc:${sessionId}:${document.id}`, JSON.stringify(document));
  
  return { success: true, document };
}

export async function getDocument(env, sessionId, docId) {
  const store = getDocsStore(env);
  const docData = await store.get(`rag:doc:${sessionId}:${docId}`);
  
  if (!docData) {
    return null;
  }
  
  return JSON.parse(docData);
}

export async function listDocuments(env, sessionId) {
  const store = getDocsStore(env);
  const indexKey = `rag:index:${sessionId}`;
  const indexData = await store.get(indexKey);
  
  if (!indexData) {
    return [];
  }
  
  const index = JSON.parse(indexData);
  const documents = [];
  
  for (const docId of index) {
    const docData = await store.get(`rag:doc:${sessionId}:${docId}`);
    if (docData) {
      documents.push(JSON.parse(docData));
    }
  }
  
  return documents.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
}

export async function deleteDocument(env, sessionId, docId) {
  const store = getDocsStore(env);
  const docData = await store.get(`rag:doc:${sessionId}:${docId}`);
  
  if (!docData) {
    return { success: false, error: 'Document not found' };
  }
  
  await store.delete(`rag:doc:${sessionId}:${docId}`);
  
  const indexKey = `rag:index:${sessionId}`;
  const indexData = await store.get(indexKey);
  if (indexData) {
    const index = JSON.parse(indexData).filter(id => id !== docId);
    await store.put(indexKey, JSON.stringify(index));
  }
  
  return { success: true };
}

export async function searchDocuments(env, sessionId, query, limit = 5) {
  const documents = await listDocuments(env, sessionId);
  
  if (!query || query.trim() === '') {
    return documents.slice(0, limit);
  }
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  const scored = documents.map(doc => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    
    queryWords.forEach(word => {
      if (titleLower.includes(word)) {
        score += 10;
      }
      if (contentLower.includes(word)) {
        score += 3;
      }
      if (doc.keywords && doc.keywords.includes(word)) {
        score += 5;
      }
      if (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(word))) {
        score += 5;
      }
    });
    
    return { doc, score };
  });
  
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.doc);
}

function createChunks(content, chunkSize = 500, overlap = 50) {
  const chunks = [];
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = '';
  
  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (currentChunk.length + trimmed.length > chunkSize && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      const lastWords = currentChunk.split(' ').slice(-Math.floor(overlap / 5));
      currentChunk = lastWords.join(' ') + ' ' + trimmed;
    } else {
      currentChunk += (currentChunk ? '. ' : '') + trimmed;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks.length > 0 ? chunks : [content.substring(0, chunkSize)];
}

export async function getContextForQuery(env, sessionId, query, maxChunks = 3) {
  const documents = await searchDocuments(env, sessionId, query, 3);
  
  if (documents.length === 0) {
    return [];
  }
  
  const chunks = [];
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  for (const doc of documents) {
    const docChunks = createChunks(doc.content, 500, 50);
    
    for (const chunk of docChunks) {
      let relevanceScore = 0;
      const chunkLower = chunk.toLowerCase();
      
      queryWords.forEach(word => {
        if (chunkLower.includes(word)) {
          relevanceScore += 1;
        }
      });
      
      chunks.push({
        docId: doc.id,
        title: doc.title,
        content: chunk,
        relevanceScore,
        type: doc.type
      });
    }
  }
  
  return chunks
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxChunks);
}

```

```

```

```

```
