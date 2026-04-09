---
source: "/home/runner/work/narad/narad/sync_temp/unnati/tsconfig.json"
project: "unnati"
role: config
language: json
frameworks: []
lines: 42
size: 717 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, config, json, project/unnati]
---

# tsconfig.json

> Configuration file for the project (42 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/tsconfig.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 42 |
| **Size** | 717 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": [
      "dom",
      "dom.iterable",
      "esnext"
    ],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": [
    "node_modules"
  ]
}

```
