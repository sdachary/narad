---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/handler-ts-md.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 124
size: 2939 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, service, typescript]
---

# handler-ts-md.md

> Service / API client module using **typescript** (124 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/handler-ts-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 124 |
| **Size** | 2939 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/handler-ts.md"
project: "narad"
role: service
language: markdown
frameworks: [typescript]
lines: 86
size: 2185 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, service, typescript]
---

# handler-ts.md

> Service / API client module using **typescript** (86 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/handler-ts.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 86 |
| **Size** | 2185 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/errors/handler.ts"
project: "unnati"
role: service
language: typescript
frameworks: [typescript]
lines: 47
size: 1410 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/unnati, service, typescript]
---

# handler.ts

> Service / API client module using **typescript** (47 lines).

**Key exports:** `handleAPIError`, `logError`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/errors/handler.ts` |
| **Role** | service |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 47 |
| **Size** | 1410 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```typescript
export interface ErrorResponse {
  status: number;
  message: string;
  code?: string;
}

export function handleAPIError(error: unknown): ErrorResponse {
  if (error instanceof Error) {
    const message = error.message;

    if (message.includes('fetch') || message.includes('network')) {
      return { status: 503, message: 'Service temporarily unavailable' };
    }

    if (message.includes('timeout')) {
      return { status: 504, message: 'Request timed out' };
    }

    if (message.includes('unauthorized') || message.includes('auth')) {
      return { status: 401, message: 'Unauthorized' };
    }

    if (message.includes('forbidden') || message.includes('permission')) {
      return { status: 403, message: 'Forbidden' };
    }

    if (message.includes('not found')) {
      return { status: 404, message: 'Resource not found' };
    }

    return { status: 500, message: 'Internal server error' };
  }

  return { status: 500, message: 'Unknown error occurred' };
}

export function logError(error: unknown, context?: string): void {
  const timestamp = new Date().toISOString();
  const errorMessage = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  if (context) {
    console.error(`[${timestamp}] [${context}] ${errorMessage}`, stack);
  } else {
    console.error(`[${timestamp}] ${errorMessage}`, stack);
  }
}
```

```

```
