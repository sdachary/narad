---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/utils-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 46
size: 905 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, utility]
---

# utils-ts.md

> Utility / helper module (46 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/utils-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 46 |
| **Size** | 905 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/lib/utils.ts"
project: "social-blueprint-ai"
role: utility
language: typescript
frameworks: []
lines: 6
size: 169 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
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
| **Modified** | 2026-04-09 14:45 |

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

```
