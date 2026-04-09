---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/config.ts"
project: "social-blueprint-ai"
role: config
language: typescript
frameworks: [typescript, vite]
lines: 9
size: 331 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, config, project/social-blueprint-ai, typescript, vite]
---

# config.ts

> Configuration file for the project using **typescript, vite** (9 lines).

**Key exports:** `apiUrl`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/config.ts` |
| **Role** | config |
| **Language** | typescript |
| **Frameworks** | typescript, vite |
| **Lines** | 9 |
| **Size** | 331 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```typescript
/// <reference types="vite/client" />

const apiBase: string = import.meta.env.VITE_API_URL ?? '';

export function apiUrl(path: string): string {
  const base = apiBase.endsWith('/') ? apiBase.slice(0, -1) : apiBase;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}/api/v1${normalizedPath}`;
}

```
