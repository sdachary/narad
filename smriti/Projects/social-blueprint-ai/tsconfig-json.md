---
source: "/home/deepak/Work/social-blueprint-ai/worker/tsconfig.json"
project: "social-blueprint-ai"
role: config
language: json
frameworks: []
lines: 15
size: 321 bytes
last_modified: "2026-03-22 17:30"
scanned: "2026-04-06 21:37"
tags: [code, config, json, project/social-blueprint-ai]
---

# tsconfig.json

> Configuration file for the project (15 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/worker/tsconfig.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 15 |
| **Size** | 321 bytes |
| **Modified** | 2026-03-22 17:30 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}

```
