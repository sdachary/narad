---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/middleware.ts"
project: "unnati"
role: middleware
language: typescript
frameworks: []
lines: 13
size: 293 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
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
| **Modified** | 2026-04-09 16:07 |

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
