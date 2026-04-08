---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/lib/utils.ts"
project: "social-blueprint-ai"
role: utility
language: typescript
frameworks: []
lines: 6
size: 169 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/social-blueprint-ai, typescript, utility]
---

# utils.ts

> Utility / helper module (6 lines).

**Key exports:** `cn`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/lib/utils.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | — |
| **Lines** | 6 |
| **Size** | 169 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```
