---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/sessionSync.js"
project: "narad"
role: service
language: javascript
frameworks: [docker]
lines: 49
size: 1621 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
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
| **Modified** | 2026-04-09 16:48 |

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
