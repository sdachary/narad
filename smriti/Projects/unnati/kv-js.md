---
source: "/home/deepak/Work/unnati/.vercel/output/static/_worker.js/__next-on-pages-dist__/cache/kv.js"
project: "unnati"
role: worker
language: javascript
frameworks: []
lines: 1
size: 354 bytes
last_modified: "2026-04-07 17:53"
scanned: "2026-04-07 17:53"
tags: [code, javascript, project/unnati, worker]
---

# kv.js

> Cloudflare Worker / background worker (1 lines).

**Key exports:** `i`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/.vercel/output/static/_worker.js/__next-on-pages-dist__/cache/kv.js` |
| **Role** | worker |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 1 |
| **Size** | 354 bytes |
| **Modified** | 2026-04-07 17:53 |

## 🔗 Related Files

—

## 📄 Content

```javascript
import{CacheAdaptor as s}from"./adaptor.js";export default class i extends s{constructor(e={}){super(e)}async retrieve(e){return await process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE?.get(this.buildCacheKey(e))??null}async update(e,r,t){const n=t?{expirationTtl:t}:{};await process.env.__NEXT_ON_PAGES__KV_SUSPENSE_CACHE?.put(this.buildCacheKey(e),r,n)}}

```
