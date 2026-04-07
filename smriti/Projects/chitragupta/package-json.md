---
source: "/home/deepak/Work/chitragupta/package.json"
project: "chitragupta"
role: config
language: json
frameworks: [cloudflare-workers, vite]
lines: 27
size: 766 bytes
last_modified: "2026-04-07 13:44"
scanned: "2026-04-07 13:44"
tags: [cloudflare-workers, code, config, json, project/chitragupta, vite]
---

# package.json

> Configuration file for the project using **cloudflare-workers, vite** (27 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/package.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | cloudflare-workers, vite |
| **Lines** | 27 |
| **Size** | 766 bytes |
| **Modified** | 2026-04-07 13:44 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "name": "chitragupta",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "wrangler pages dev dist",
    "deploy": "wrangler pages deploy dist",
    "prebuild": "npm install",
    "build:worker": "esbuild public/_worker.js --bundle --outfile=dist/_worker.js --platform=browser --format=esm --external:cloudflare:*",
    "build": "vite build && npm run build:worker"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@tsndr/cloudflare-worker-jwt": "^2.5.3",
    "chart.js": "^4.4.1",
    "hono": "^4.0.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "@types/node": "^25.5.0",
    "esbuild": "^0.28.0",
    "typescript": "^5.2.0",
    "vite": "^4.4.9",
    "vite-plugin-pwa": "^0.19.2",
    "wrangler": "^3.0.0"
  }
}

```
