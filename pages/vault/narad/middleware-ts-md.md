---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/middleware-ts.md"
project: "narad"
role: middleware
language: markdown
frameworks: []
lines: 52
size: 993 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
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
| **Modified** | 2026-04-10 16:04 |

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
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
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
| **Modified** | 2026-04-09 16:48 |

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
