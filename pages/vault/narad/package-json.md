---
source: "/home/runner/work/narad/narad/sync_temp/narad/package.json"
project: "narad"
role: config
language: json
frameworks: [cloudflare-workers]
lines: 20
size: 445 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [cloudflare-workers, code, config, json, project/narad]
---

# package.json

> Configuration file for the project using **cloudflare-workers** (20 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/package.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | cloudflare-workers |
| **Lines** | 20 |
| **Size** | 445 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "name": "narad",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "wrangler pages dev pages",
    "deploy": "wrangler pages deploy pages",
    "build": "echo 'Build complete (bundling handled by Cloudflare)'"
  },
  "devDependencies": {
    "wrangler": "^4.80.0"
  },
  "dependencies": {
    "dompurify": "^3.3.3",
    "highlight.js": "^11.11.1",
    "hono": "^4.6.0",
    "marked": "^17.0.5",
    "xlsx": "^0.18.5"
  }
}

```
