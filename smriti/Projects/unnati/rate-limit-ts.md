---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/security/rate-limit.ts"
project: "unnati"
role: config
language: typescript
frameworks: [typescript]
lines: 45
size: 1127 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, project/unnati, typescript]
---

# rate-limit.ts

> Configuration file for the project using **typescript** (45 lines).

**Key exports:** `RATE_LIMITS`, `rateLimit`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/security/rate-limit.ts` |
| **Role** | config |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 45 |
| **Size** | 1127 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```typescript
interface RateLimitConfig {
  max: number;
  window: number;
}

const inMemoryStore = new Map<string, { count: number; resetAt: number }>();

export const RATE_LIMITS: Record<string, RateLimitConfig> = {
  api: { max: 100, window: 60 },
  upload: { max: 10, window: 3600 },
};

function cleanupStore(): void {
  const now = Date.now();
  for (const [key, value] of inMemoryStore.entries()) {
    if (value.resetAt < now) {
      inMemoryStore.delete(key);
    }
  }
}

setInterval(cleanupStore, 60000);

export function rateLimit(ip: string, action: string): { allowed: boolean; remaining: number } {
  const key = `${ip}:${action}`;
  const config = RATE_LIMITS[action] ?? RATE_LIMITS.api;
  const now = Date.now();

  const entry = inMemoryStore.get(key);

  if (!entry || entry.resetAt < now) {
    inMemoryStore.set(key, {
      count: 1,
      resetAt: now + config.window * 1000,
    });
    return { allowed: true, remaining: config.max - 1 };
  }

  if (entry.count >= config.max) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: config.max - entry.count };
}
```
