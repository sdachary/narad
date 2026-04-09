---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ELIZA_FEATURES-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 145
size: 3584 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, docs, documentation, markdown, project/narad]
---

# ELIZA_FEATURES-md.md

> Documentation using **docker** (145 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ELIZA_FEATURES-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 145 |
| **Size** | 3584 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/docs/ELIZA_FEATURES.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 108
size: 2882 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, docs, documentation, markdown, project/narad]
---

# ELIZA_FEATURES.md

> Documentation using **docker** (108 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/docs/ELIZA_FEATURES.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 108 |
| **Size** | 2882 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Narad - Eliza Features Enhancement

## Overview
Narad now includes Eliza-style features: Character System, Enhanced Memory, RAG Documents, and Chat Connectors.

## New Features

### 1. Character System
Select different AI personas that affect how responses are generated.

**Characters Available:**
| Character | Traits | Best For |
|-----------|--------|----------|
| Default | balanced | General use |
| Professional | formal, business | Business queries |
| Casual | friendly, relaxed | Casual conversation |
| Technical | precise, detailed | Code & technical |
| Mentor | educational, patient | Learning |
| Concise | brief, direct | Quick answers |

**Usage:**
- Select character from dropdown in header
- Character persists in localStorage
- API includes `character` field in requests

### 2. Enhanced Memory
Extended memory capabilities with relationship tracking.

**Functions:**
- `saveMemory(env, sessionId, key, value, important)` - Save with importance flag
- `getMemories(env, sessionId, filter)` - Get all, important, or recent
- `updateRelationship(env, sessionId, updates)` - Track user preferences
- `getRelationship(env, sessionId)` - Get relationship data
- `summarizeContext(memories, maxTokens)` - Summarize for context

### 3. RAG Documents
Upload and query documents for knowledge retrieval.

**Functions:**
- `addDocument(sessionId, doc)` - Add document
- `searchDocuments(sessionId, query, limit)` - Search
- `listDocuments(sessionId)` - List all
- `getDocument(sessionId, docId)` - Get specific
- `deleteDocument(sessionId, docId)` - Remove
- `getContextForQuery(sessionId, query)` - Get relevant context

### 4. Chat Connectors
Connect to Discord and Telegram bots.

**Setup:**
See `config/CONNECTORS_SETUP.md` for detailed setup instructions.

**Configuration:**
- Discord: Bot token, server mappings
- Telegram: Bot token, allowed users

## API Endpoints

### Character Selection
```json
POST /api/chat
{
  "message": "hello",
  "character": "professional",
  "session_id": "user123"
}
```

### Memory Operations
```json
POST /api/memory/save
{
  "key": "user_preference",
  "value": "likes code reviews",
  "important": true
}

GET /api/memory?filter=important
```

### RAG Documents
```json
POST /api/rag/add
{
  "title": "Project Docs",
  "content": "...",
  "type": "markdown",
  "tags": ["docs", "project"]
}

POST /api/rag/search
{
  "query": "how to deploy"
}
```

## Environment Variables
No new environment variables required. All features use existing Cloudflare KV storage.

## Files Added/Modified
- `config/characters.js` - Character definitions
- `services/memory.js` - Enhanced memory functions
- `services/ragDocuments.js` - RAG document service
- `config/connectors.js` - Connector configs
- `config/CONNECTORS_SETUP.md` - Setup guide
- `index.html` - Character selector UI
- `app.js` - Frontend integration
- `style.css` - UI styling
```

```
