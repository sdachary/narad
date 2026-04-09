---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sessionSync-js-md-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker]
lines: 239
size: 5408 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, documentation, markdown, project/narad, service]
---

# sessionSync-js-md-md-md-md.md

> Service / API client module using **docker** (239 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sessionSync-js-md-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 239 |
| **Size** | 5408 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sessionSync-js-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker]
lines: 201
size: 4630 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, documentation, markdown, project/narad, service]
---

# sessionSync-js-md-md-md.md

> Service / API client module using **docker** (201 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sessionSync-js-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 201 |
| **Size** | 4630 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sessionSync-js-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker]
lines: 163
size: 3861 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, documentation, markdown, project/narad, service]
---

# sessionSync-js-md-md.md

> Service / API client module using **docker** (163 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sessionSync-js-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 163 |
| **Size** | 3861 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sessionSync-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker]
lines: 125
size: 3101 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, documentation, markdown, project/narad, service]
---

# sessionSync-js-md.md

> Service / API client module using **docker** (125 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sessionSync-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 125 |
| **Size** | 3101 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/sessionSync-js.md"
project: "narad"
role: service
language: markdown
frameworks: [docker]
lines: 87
size: 2353 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docker, documentation, markdown, project/narad, service]
---

# sessionSync-js.md

> Service / API client module using **docker** (87 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/sessionSync-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 87 |
| **Size** | 2353 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/sessionSync.js"
project: "narad"
role: service
language: javascript
frameworks: [docker]
lines: 49
size: 1621 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, docker, javascript, project/narad, service]
---

# sessionSync.js

> Service / API client module using **docker** (49 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/sessionSync.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | docker |
| **Lines** | 49 |
| **Size** | 1621 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * Session Sync Service - Handles cloud-based persistence for Narad sessions.
 * Uses Cloudflare KV (NARAD_DATA) for storage.
 */

const SESSION_LIST_PREFIX = 'sessions:list:';
const CHAT_HISTORY_PREFIX = 'sessions:history:';

export async function syncSessions(env, mode, sessions) {
    if (!env.NARAD_DATA) {
        console.error('[SessionSync] NARAD_DATA KV not found');
        return false;
    }
    
    // Store the list of session IDs for this mode
    await env.NARAD_DATA.put(`${SESSION_LIST_PREFIX}${mode}`, JSON.stringify(sessions));
    return true;
}

export async function getSessions(env, mode) {
    if (!env.NARAD_DATA) return [];
    const data = await env.NARAD_DATA.get(`${SESSION_LIST_PREFIX}${mode}`);
    return data ? JSON.parse(data) : [];
}

export async function saveSessionHistory(env, sessionId, history) {
    if (!env.NARAD_DATA) return false;
    await env.NARAD_DATA.put(`${CHAT_HISTORY_PREFIX}${sessionId}`, JSON.stringify(history));
    return true;
}

export async function getSessionHistory(env, sessionId) {
    if (!env.NARAD_DATA) return [];
    const data = await env.NARAD_DATA.get(`${CHAT_HISTORY_PREFIX}${sessionId}`);
    return data ? JSON.parse(data) : [];
}

export async function deleteSessionCloud(env, mode, sessionId) {
    if (!env.NARAD_DATA) return false;
    
    // Remove from list
    const sessions = await getSessions(env, mode);
    const updated = sessions.filter(id => id !== sessionId);
    await syncSessions(env, mode, updated);
    
    // Delete history
    await env.NARAD_DATA.delete(`${CHAT_HISTORY_PREFIX}${sessionId}`);
    return true;
}

```

```

```

```

```

```
