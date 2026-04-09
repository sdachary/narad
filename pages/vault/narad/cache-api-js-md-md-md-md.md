---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/cache-api-js-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 155
size: 3382 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service]
---

# cache-api-js-md-md-md.md

> Service / API client module (155 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/cache-api-js-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 155 |
| **Size** | 3382 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/cache-api-js-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 117
size: 2653 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, service]
---

# cache-api-js-md-md.md

> Service / API client module (117 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/cache-api-js-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 117 |
| **Size** | 2653 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/cache-api-js-md.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 79
size: 1936 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, service]
---

# cache-api-js-md.md

> Service / API client module (79 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/cache-api-js-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 79 |
| **Size** | 1936 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/cache-api-js.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 41
size: 1226 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, service]
---

# cache-api-js.md

> Service / API client module (41 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/cache-api-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 41 |
| **Size** | 1226 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/unnati/.vercel/output/static/_worker.js/__next-on-pages-dist__/cache/cache-api.js"
project: "unnati"
role: service
language: javascript
frameworks: []
lines: 1
size: 441 bytes
last_modified: "2026-04-07 17:53"
scanned: "2026-04-07 17:53"
tags: [code, javascript, project/unnati, service]
---

# cache-api.js

> Service / API client module (1 lines).

**Key exports:** `o`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/.vercel/output/static/_worker.js/__next-on-pages-dist__/cache/cache-api.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 1 |
| **Size** | 441 bytes |
| **Modified** | 2026-04-07 17:53 |

## 🔗 Related Files

—

## 📄 Content

```javascript
import{CacheAdaptor as r}from"./adaptor.js";export default class o extends r{cacheName="suspense-cache";constructor(e={}){super(e)}async retrieve(e){const c=await(await caches.open(this.cacheName)).match(this.buildCacheKey(e));return c?c.text():null}async update(e,a,c){const s=await caches.open(this.cacheName),t=c??"31536000",n=new Response(a,{headers:new Headers({"cache-control":`max-age=${t}`})});await s.put(this.buildCacheKey(e),n)}}

```

```

```

```

```
