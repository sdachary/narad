---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/errors-js-md-md-md.md"
project: "narad"
role: route
language: markdown
frameworks: []
lines: 209
size: 4513 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, route]
---

# errors-js-md-md-md.md

> Route handler / API endpoint (209 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/errors-js-md-md-md.md` |
| **Role** | route |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 209 |
| **Size** | 4513 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/errors-js-md-md.md"
project: "narad"
role: route
language: markdown
frameworks: []
lines: 171
size: 3798 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, route]
---

# errors-js-md-md.md

> Route handler / API endpoint (171 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/errors-js-md-md.md` |
| **Role** | route |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 171 |
| **Size** | 3798 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/errors-js-md.md"
project: "narad"
role: route
language: markdown
frameworks: []
lines: 133
size: 3092 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, route]
---

# errors-js-md.md

> Route handler / API endpoint (133 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/errors-js-md.md` |
| **Role** | route |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 133 |
| **Size** | 3092 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/errors-js.md"
project: "narad"
role: route
language: markdown
frameworks: []
lines: 95
size: 2398 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, route]
---

# errors-js.md

> Route handler / API endpoint (95 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/errors-js.md` |
| **Role** | route |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 95 |
| **Size** | 2398 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/routes/errors.js"
project: "narad"
role: route
language: javascript
frameworks: []
lines: 55
size: 1671 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, javascript, project/narad, route]
---

# errors.js

> Route handler / API endpoint (55 lines).

**Key exports:** `ErrorTracker`, `setupErrorRoutes`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/routes/errors.js` |
| **Role** | route |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 55 |
| **Size** | 1671 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```javascript
export const ErrorTracker = {
  async trackError(env, error, context = {}) {
    const errorKey = `error:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
    const errorData = {
      message: error.message || String(error),
      stack: error.stack || '',
      timestamp: new Date().toISOString(),
      context: {
        path: context.path || '',
        method: context.method || '',
        userAgent: context.userAgent || '',
        ip: context.ip || ''
      }
    };
    
    try {
      const { getStore } = await import('../services/memory.js');
      const store = getStore(env);
      await store.put(errorKey, JSON.stringify(errorData), { expirationTtl: 86400 });
    } catch (e) {
      console.error('Failed to store error:', e);
    }
    
    console.error('[ERROR]', JSON.stringify(errorData));
  },
  
  async getRecentErrors(env, limit = 10) {
    const errors = [];
    const { getStore } = await import('../services/memory.js');
    const store = getStore(env);
    const list = await store.list({ prefix: 'error:', limit: 50 });
    
    for (const key of list.keys.reverse()) {
      if (errors.length >= limit) break;
      const data = await store.get(key.name);
      if (data) {
        errors.push(JSON.parse(data));
      }
    }
    
    return errors;
  }
};

export function setupErrorRoutes(app) {
  app.get('/api/errors', async (c) => {
    try {
      const limit = parseInt(c.req.query('limit') || '10');
      const errors = await ErrorTracker.getRecentErrors(c.env, Math.min(limit, 50));
      return c.json({ errors });
    } catch (error) {
      return c.json({ error: 'Failed to fetch errors' }, 500);
    }
  });
}

```

```

```

```

```
