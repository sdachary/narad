---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/rag.js"
project: "narad"
role: config
language: javascript
frameworks: []
lines: 230
size: 6546 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, config, javascript, project/narad]
---

# rag.js

> Configuration file for the project (230 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/rag.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 230 |
| **Size** | 6546 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[memory-js]]

## 📄 Content

```javascript
import { getStore } from './memory.js';

const RAG_CONFIG = {
  vectorTopK: 5,
  keywordTopK: 10,
  hybridWeightVector: 0.6,
  hybridWeightKeyword: 0.4,
  minScore: 0.3
};

export async function initializeRAGIndex(env) {
  const indexKey = 'rag:index';
  const existing = await getStore(env).get(indexKey);
  
  if (!existing) {
    const initialIndex = {
      documents: [],
      lastUpdated: new Date().toISOString(),
      docCount: 0
    };
    await getStore(env).put(indexKey, JSON.stringify(initialIndex));
    return initialIndex;
  }
  
  return JSON.parse(existing);
}

export async function addDocumentToRAG(env, doc) {
  const indexKey = 'rag:index';
  const index = await initializeRAGIndex(env);
  
  const document = {
    id: `doc:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    title: doc.title,
    content: doc.content,
    source: doc.source || 'user',
    metadata: doc.metadata || {},
    keywords: extractKeywords(doc.content),
    createdAt: new Date().toISOString(),
    vectorId: null
  };
  
  if (env.AI) {
    try {
      const embedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: doc.content
      });
      document.embedding = embedding;
      document.vectorId = document.id;
    } catch (e) {
      console.warn('[RAG] Vector embedding failed, using keywords only:', e.message);
    }
  }
  
  index.documents.push(document);
  index.docCount = index.documents.length;
  index.lastUpdated = new Date().toISOString();
  
  await getStore(env).put(indexKey, JSON.stringify(index));
  
  return document;
}

export async function searchRAG(env, query, options = {}) {
  const topK = options.topK || RAG_CONFIG.vectorTopK;
  const hybridMode = options.hybridMode !== false;
  
  const index = await initializeRAGIndex(env);
  if (index.documents.length === 0) {
    return { results: [], mode: 'empty' };
  }
  
  const results = [];
  
  if (env.AI && hybridMode) {
    try {
      const queryEmbedding = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
        text: query
      });
      
      const vectorResults = index.documents
        .filter(doc => doc.embedding)
        .map(doc => {
          const score = cosineSimilarity(queryEmbedding, doc.embedding);
          return { ...doc, vectorScore: score, score };
        })
        .filter(doc => doc.score >= RAG_CONFIG.minScore)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
      
      results.push(...vectorResults.map(r => ({
        ...r,
        type: 'vector'
      })));
    } catch (e) {
      console.warn('[RAG] Vector search failed:', e.message);
    }
  }
  
  const queryKeywords = extractKeywords(query);
  const keywordResults = index.documents
    .map(doc => {
      const matches = queryKeywords.filter(kw => 
        doc.keywords.some(dk => dk.toLowerCase().includes(kw.toLowerCase())) ||
        doc.content.toLowerCase().includes(kw.toLowerCase())
      ).length;
      const score = matches / Math.max(queryKeywords.length, 1);
      return { ...doc, keywordScore: score, score: score * RAG_CONFIG.hybridWeightKeyword };
    })
    .filter(doc => doc.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, options.keywordTopK || RAG_CONFIG.keywordTopK);
  
  results.push(...keywordResults.map(r => ({
    ...r,
    type: 'keyword'
  })));
  
  const mergedResults = mergeResults(results, topK);
  
  return {
    results: mergedResults,
    meta: {
      query,
      mode: hybridMode && env.AI ? 'hybrid' : 'keyword',
      totalDocs: index.docCount,
      vectorResults: results.filter(r => r.type === 'vector').length,
      keywordResults: results.filter(r => r.type === 'keyword').length
    }
  };
}

function mergeResults(results, topK) {
  const seen = new Map();
  const merged = [];
  
  for (const result of results) {
    if (!seen.has(result.id)) {
      seen.set(result.id, result);
      merged.push(result);
    } else {
      const existing = seen.get(result.id);
      existing.score = Math.max(existing.score, result.score);
      existing.vectorScore = result.vectorScore || existing.vectorScore;
      existing.keywordScore = result.keywordScore || existing.keywordScore;
    }
  }
  
  return merged
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function cosineSimilarity(a, b) {
  if (!a || !b || !a.data || !b.data) return 0;
  
  const aData = a.data || a;
  const bData = b.data || b;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < Math.min(aData.length, bData.length); i++) {
    dotProduct += aData[i] * bData[i];
    normA += aData[i] * aData[i];
    normB += bData[i] * bData[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function extractKeywords(text) {
  if (!text) return [];
  
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'i', 'you', 'he', 'she', 'it', 'we', 'they', 'what', 'which', 'who',
    'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
    'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now', 'here'
  ]);
  
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
  
  const wordCount = new Map();
  for (const word of words) {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  }
  
  return Array.from(wordCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([word]) => word);
}

export async function deleteDocumentFromRAG(env, docId) {
  const indexKey = 'rag:index';
  const index = await initializeRAGIndex(env);
  
  index.documents = index.documents.filter(doc => doc.id !== docId);
  index.docCount = index.documents.length;
  index.lastUpdated = new Date().toISOString();
  
  await getStore(env).put(indexKey, JSON.stringify(index));
  
  return { success: true, deleted: docId };
}

export async function getRAGStats(env) {
  const index = await initializeRAGIndex(env);
  
  return {
    documentCount: index.docCount,
    lastUpdated: index.lastUpdated,
    modes: {
      vector: !!env.AI,
      keyword: true,
      hybrid: !!env.AI
    }
  };
}

```
