---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/prisma.ts"
project: "unnati"
role: utility
language: typescript
frameworks: []
lines: 11
size: 293 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
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
| **Modified** | 2026-04-09 16:07 |

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
