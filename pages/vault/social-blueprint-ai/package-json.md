---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/worker/package.json"
project: "social-blueprint-ai"
role: config
language: json
frameworks: [cloudflare-workers]
lines: 23
size: 555 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [cloudflare-workers, code, config, json, project/social-blueprint-ai]
---

# package.json

> Configuration file for the project using **cloudflare-workers** (23 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/worker/package.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | cloudflare-workers |
| **Lines** | 23 |
| **Size** | 555 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "name": "social-blueprint-worker",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "db:migrate": "wrangler d1 execute social-blueprint-db --file=./schema.sql"
  },
  "dependencies": {
    "@hono/swagger-ui": "^0.6.1",
    "bcryptjs": "^3.0.3",
    "hono": "^4.6.3",
    "jose": "^6.2.2",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20241022.0",
    "@types/bcryptjs": "^3.0.0",
    "typescript": "~5.8.2",
    "wrangler": "^3.80.0"
  }
}

```
