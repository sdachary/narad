---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/prisma-ts-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 165
size: 3102 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, utility]
---

# prisma-ts-md-md-md.md

> Utility / helper module (165 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/prisma-ts-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 165 |
| **Size** | 3102 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/prisma-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 127
size: 2386 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, utility]
---

# prisma-ts-md-md.md

> Utility / helper module (127 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/prisma-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 127 |
| **Size** | 2386 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/prisma-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 89
size: 1682 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, utility]
---

# prisma-ts-md.md

> Utility / helper module (89 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/prisma-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 89 |
| **Size** | 1682 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/prisma-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 51
size: 987 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, utility]
---

# prisma-ts.md

> Utility / helper module (51 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/prisma-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 51 |
| **Size** | 987 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/prisma.ts"
project: "unnati"
role: utility
language: typescript
frameworks: []
lines: 11
size: 293 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# prisma.ts

> Utility / helper module (11 lines).

**Key exports:** `prisma`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/prisma.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | — |
| **Lines** | 11 |
| **Size** | 293 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { PrismaClient } from "@prisma/client/edge";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

```

```

```

```

```
