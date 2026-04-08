---
source: "/home/deepak/Work/job-hunt-app/tsconfig.json"
project: "job-hunt-app"
role: config
language: json
frameworks: []
lines: 34
size: 670 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [code, config, json, project/job-hunt-app]
---

# tsconfig.json

> Configuration file for the project (34 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `job-hunt-app/tsconfig.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 34 |
| **Size** | 670 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
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
  "exclude": ["node_modules"]
}

```
