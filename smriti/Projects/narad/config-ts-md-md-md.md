---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/config-ts-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [typescript, vite]
lines: 125
size: 2727 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad, typescript, vite]
---

# config-ts-md-md.md

> Configuration file for the project using **typescript, vite** (125 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/config-ts-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | typescript, vite |
| **Lines** | 125 |
| **Size** | 2727 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/config-ts-md.md"
project: "narad"
role: config
language: markdown
frameworks: [typescript, vite]
lines: 87
size: 1941 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [config, documentation, markdown, project/narad, typescript, vite]
---

# config-ts-md.md

> Configuration file for the project using **typescript, vite** (87 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/config-ts-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | typescript, vite |
| **Lines** | 87 |
| **Size** | 1941 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/config-ts.md"
project: "narad"
role: config
language: markdown
frameworks: [typescript, vite]
lines: 49
size: 1136 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, markdown, project/narad, typescript, vite]
---

# config-ts.md

> Configuration file for the project using **typescript, vite** (49 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/config-ts.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | typescript, vite |
| **Lines** | 49 |
| **Size** | 1136 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
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

```

```

```
