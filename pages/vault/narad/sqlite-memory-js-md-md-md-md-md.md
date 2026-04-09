---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sqlite-memory-js-md-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 423
size: 11108 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [config, documentation, markdown, project/narad]
---

# sqlite-memory-js-md-md-md-md.md

> Configuration file for the project (423 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sqlite-memory-js-md-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 423 |
| **Size** | 11108 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sqlite-memory-js-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 385
size: 10352 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad]
---

# sqlite-memory-js-md-md-md.md

> Configuration file for the project (385 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sqlite-memory-js-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 385 |
| **Size** | 10352 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sqlite-memory-js-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 347
size: 9607 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [config, documentation, markdown, project/narad]
---

# sqlite-memory-js-md-md.md

> Configuration file for the project (347 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sqlite-memory-js-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 347 |
| **Size** | 9607 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sqlite-memory-js-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 309
size: 8871 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, markdown, project/narad]
---

# sqlite-memory-js-md.md

> Configuration file for the project (309 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sqlite-memory-js-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 309 |
| **Size** | 8871 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sqlite-memory-js.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 271
size: 8144 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, documentation, markdown, project/narad]
---

# sqlite-memory-js.md

> Configuration file for the project (271 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sqlite-memory-js.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 271 |
| **Size** | 8144 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/sqlite-memory.js"
project: "narad"
role: config
language: javascript
frameworks: []
lines: 233
size: 7423 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, javascript, project/narad]
---

# sqlite-memory.js

> Configuration file for the project (233 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/sqlite-memory.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 233 |
| **Size** | 7423 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[memory-js]]

## 📄 Content

```javascript
import { getStore } from './memory.js';

const MEMORY_CONFIG = {
  dbName: 'narad_memory',
  maxEntries: 10000,
  cleanupInterval: 3600000,
  batchSize: 100
};

export async function initializeMemoryDB(env) {
  const dbKey = 'memory:db:index';
  const existing = await getStore(env).get(dbKey);
  
  if (!existing) {
    const db = {
      tables: {
        conversations: { rows: 0, columns: ['id', 'user_id', 'title', 'created_at', 'updated_at'] },
        messages: { rows: 0, columns: ['id', 'conversation_id', 'role', 'content', 'metadata', 'created_at'] },
        memories: { rows: 0, columns: ['id', 'key', 'content', 'type', 'importance', 'created_at', 'accessed_at'] },
        verifications: { rows: 0, columns: ['id', 'query', 'result', 'confidence', 'verified_at', 'accuracy'] },
        embeddings: { rows: 0, columns: ['id', 'content_id', 'content', 'embedding', 'model', 'created_at'] },
        agents: { rows: 0, columns: ['id', 'name', 'system_prompt', 'config', 'created_at'] },
        workflows: { rows: 0, columns: ['id', 'name', 'steps', 'status', 'created_at', 'updated_at'] }
      },
      version: '2.0.0',
      createdAt: new Date().toISOString()
    };
    await getStore(env).put(dbKey, JSON.stringify(db));
    return db;
  }
  
  return JSON.parse(existing);
}

export async function executeSQL(env, sql, params = []) {
  const db = await initializeMemoryDB(env);
  
  const tableMatch = sql.match(/SELECT\s+(\w+)\s+FROM\s+(\w+)/i);
  if (tableMatch) {
    const tableName = tableMatch[2].toLowerCase();
    return queryTable(env, tableName, sql, params);
  }
  
  const insertMatch = sql.match(/INSERT\s+INTO\s+(\w+)/i);
  if (insertMatch) {
    const tableName = insertMatch[1].toLowerCase();
    return insertIntoTable(env, tableName, sql, params);
  }
  
  const updateMatch = sql.match(/UPDATE\s+(\w+)/i);
  if (updateMatch) {
    return { notice: 'Update operations use KV directly' };
  }
  
  return { error: 'Unsupported SQL operation' };
}

async function queryTable(env, tableName, sql, params) {
  const dataKey = `memory:data:${tableName}`;
  const data = await getStore(env).get(dataKey);
  let rows = data ? JSON.parse(data) : [];
  
  const whereMatch = sql.match(/WHERE\s+(.+?)(?:ORDER|LIMIT|$)/i);
  if (whereMatch) {
    const conditions = whereMatch[1];
    rows = rows.filter(row => {
      for (const [key, value] of Object.entries(row)) {
        if (conditions.includes(key)) {
          if (conditions.includes('LIKE')) {
            const pattern = value.toLowerCase();
            if (!pattern.includes(value.toLowerCase().replace(/%/g, ''))) return false;
          } else if (conditions.includes('=')) {
            if (row[key] != value) return false;
          }
        }
      }
      return true;
    });
  }
  
  const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    rows = rows.slice(0, parseInt(limitMatch[1]));
  }
  
  return { type: tableName, rows, count: rows.length };
}

async function insertIntoTable(env, tableName, sql, params) {
  const dataKey = `memory:data:${tableName}`;
  const data = await getStore(env).get(dataKey);
  let rows = data ? JSON.parse(data) : [];
  
  const columnsMatch = sql.match(/\(([^)]+)\)\s+VALUES/i);
  if (!columnsMatch) {
    return { error: 'Invalid insert syntax' };
  }
  
  const columns = columnsMatch[1].split(',').map(c => c.trim());
  const newRow = {};
  
  columns.forEach((col, i) => {
    newRow[col] = params[i] !== undefined ? params[i] : null;
  });
  
  newRow.id = newRow.id || `${tableName}:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  newRow.created_at = newRow.created_at || new Date().toISOString();
  
  rows.push(newRow);
  await getStore(env).put(dataKey, JSON.stringify(rows));
  
  return { type: 'insert', id: newRow.id, rows: rows.length };
}

export async function saveConversation(env, userId, title) {
  const tableName = 'conversations';
  const dataKey = `memory:data:${tableName}`;
  const data = await getStore(env).get(dataKey);
  const rows = data ? JSON.parse(data) : [];
  
  const conversation = {
    id: `conv:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    title: title || 'Untitled',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  rows.push(conversation);
  await getStore(env).put(dataKey, JSON.stringify(rows));
  
  return conversation;
}

export async function saveMessage(env, conversationId, role, content, metadata = {}) {
  const tableName = 'messages';
  const dataKey = `memory:data:${tableName}`;
  const data = await getStore(env).get(dataKey);
  const rows = data ? JSON.parse(data) : [];
  
  const message = {
    id: `msg:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    conversation_id: conversationId,
    role,
    content,
    metadata,
    created_at: new Date().toISOString()
  };
  
  rows.push(message);
  await getStore(env).put(dataKey, JSON.stringify(rows));
  
  return message;
}

export async function searchMessages(env, conversationId, query) {
  const tableName = 'messages';
  const dataKey = `memory:data:${tableName}`;
  const data = await getStore(env).get(dataKey);
  const rows = data ? JSON.parse(data) : [];
  
  const conversationIdFilter = conversationId ? (row.conversation_id === conversationId) : true;
  const queryLower = query.toLowerCase();
  
  const results = rows.filter(row => 
    conversationIdFilter && 
    (row.content.toLowerCase().includes(queryLower))
  );
  
  return results;
}

export async function saveMemory(env, key, content, type = 'general', importance = 5) {
  const tableName = 'memories';
  const dataKey = `memory:data:${tableName}`;
  const data = await getStore(env).get(dataKey);
  const rows = data ? JSON.parse(data) : [];
  
  const memory = {
    id: `mem:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`,
    key,
    content,
    type,
    importance,
    created_at: new Date().toISOString(),
    accessed_at: new Date().toISOString()
  };
  
  rows.push(memory);
  await getStore(env).put(dataKey, JSON.stringify(rows));
  
  return memory;
}

export async function searchMemories(env, query, type = null, limit = 10) {
  const tableName = 'memories';
  const dataKey = `memory:data:${tableName}`;
  const data = await getStore(env).get(dataKey);
  const rows = data ? JSON.parse(data) : [];
  
  const queryLower = query.toLowerCase();
  
  const results = rows
    .filter(row => {
      const typeMatch = type ? row.type === type : true;
      const contentMatch = row.content.toLowerCase().includes(queryLower) || 
                          row.key.toLowerCase().includes(queryLower);
      return typeMatch && contentMatch;
    })
    .sort((a, b) => b.importance - a.importance || 
                   new Date(b.accessed_at) - new Date(a.accessed_at))
    .slice(0, limit);
  
  for (const result of results) {
    result.accessed_at = new Date().toISOString();
  }
  await getStore(env).put(dataKey, JSON.stringify(rows));
  
  return results;
}

export async function getMemoryStats(env) {
  const tables = ['conversations', 'messages', 'memories', 'verifications', 'embeddings', 'agents', 'workflows'];
  const stats = {};
  
  for (const table of tables) {
    const dataKey = `memory:data:${table}`;
    const data = await getStore(env).get(dataKey);
    stats[table] = data ? JSON.parse(data).length : 0;
  }
  
  return stats;
}

```

```

```

```

```

```
