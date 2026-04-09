---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/middleware-ts-md-md-md.md"
project: "narad"
role: middleware
language: markdown
frameworks: []
lines: 166
size: 3150 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, middleware, project/narad]
---

# middleware-ts-md-md-md.md

> Middleware layer (166 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/middleware-ts-md-md-md.md` |
| **Role** | middleware |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 166 |
| **Size** | 3150 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/middleware-ts-md-md.md"
project: "narad"
role: middleware
language: markdown
frameworks: []
lines: 128
size: 2420 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, middleware, project/narad]
---

# middleware-ts-md-md.md

> Middleware layer (128 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/middleware-ts-md-md.md` |
| **Role** | middleware |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 128 |
| **Size** | 2420 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/middleware-ts-md.md"
project: "narad"
role: middleware
language: markdown
frameworks: []
lines: 90
size: 1702 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, middleware, project/narad]
---

# middleware-ts-md.md

> Middleware layer (90 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/middleware-ts-md.md` |
| **Role** | middleware |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 90 |
| **Size** | 1702 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/middleware-ts.md"
project: "narad"
role: middleware
language: markdown
frameworks: []
lines: 52
size: 993 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, middleware, project/narad]
---

# middleware-ts.md

> Middleware layer (52 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/middleware-ts.md` |
| **Role** | middleware |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 52 |
| **Size** | 993 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/middleware.ts"
project: "unnati"
role: middleware
language: typescript
frameworks: []
lines: 13
size: 293 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, middleware, project/unnati, typescript]
---

# middleware.ts

> Middleware layer (13 lines).

**Key exports:** `config`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/middleware.ts` |
| **Role** | middleware |
| **Language** | typescript |
| **Frameworks** | — |
| **Lines** | 13 |
| **Size** | 293 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
```

```

```

```

```
