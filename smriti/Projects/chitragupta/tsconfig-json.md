---
source: "/home/deepak/Work/chitragupta/tsconfig.json"
project: "chitragupta"
role: config
language: json
frameworks: [vite]
lines: 21
size: 564 bytes
last_modified: "2026-04-07 13:44"
scanned: "2026-04-07 13:44"
tags: [code, config, json, project/chitragupta, vite]
---

# tsconfig.json

> Configuration file for the project using **vite** (21 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/tsconfig.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | vite |
| **Lines** | 21 |
| **Size** | 564 bytes |
| **Modified** | 2026-04-07 13:44 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipDefaultLibCheck": true,
    "types": ["vite/client", "node"]
  },
  "include": ["src", "vite.config.ts"]
}

```
