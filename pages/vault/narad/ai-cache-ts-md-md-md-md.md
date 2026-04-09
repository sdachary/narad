---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ai-cache-ts-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 244
size: 5284 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# ai-cache-ts-md-md-md.md

> Utility / helper module using **typescript** (244 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ai-cache-ts-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 244 |
| **Size** | 5284 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ai-cache-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 206
size: 4512 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# ai-cache-ts-md-md.md

> Utility / helper module using **typescript** (206 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ai-cache-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 206 |
| **Size** | 4512 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ai-cache-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 168
size: 3749 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# ai-cache-ts-md.md

> Utility / helper module using **typescript** (168 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ai-cache-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 168 |
| **Size** | 3749 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/ai-cache-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 130
size: 2993 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# ai-cache-ts.md

> Utility / helper module using **typescript** (130 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/ai-cache-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 130 |
| **Size** | 2993 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai-cache.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 91
size: 2231 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# ai-cache.ts

> Utility / helper module using **typescript** (91 lines).

**Key exports:** `generateCacheKey`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai-cache.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 91 |
| **Size** | 2231 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[supabase-ts]]

## 📄 Content

```typescript
import { getSupabase } from "./supabase";

function hashInputs(...inputs: string[]): string {
  const str = inputs.join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function generateCacheKey(type: string, ...inputs: string[]): string {
  const contentHash = hashInputs(...inputs);
  return `${type}:${contentHash}`;
}

export async function getCache(userId: string, cacheKey: string): Promise<Json | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("AiCache")
    .select("content, expires_at")
    .eq("user_id", userId)
    .eq("cache_key", cacheKey)
    .single();

  if (error || !data) return null;
  if (data.expires_at && new Date(data.expires_at) < new Date(now)) {
    return null;
  }

  return data.content as Json;
}

export async function setCache(
  userId: string,
  cacheKey: string,
  content: any,
  expiresInHours: number = 24
): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;
  if (!content || content.error) return;

  const expiresAt = expiresInHours 
    ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
    : null;

  await supabase
    .from("AiCache")
    .upsert({
      user_id: userId,
      cache_key: cacheKey,
      content,
      created_at: new Date().toISOString(),
      expires_at: expiresAt
    }, {
      onConflict: "user_id,cache_key"
    });
}

export async function clearUserCache(userId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) return;

  await supabase
    .from("AiCache")
    .delete()
    .eq("user_id", userId);
}

export async function cleanExpiredCache(): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;

  const now = new Date().toISOString();
  const { count } = await supabase
    .from("AiCache")
    .delete()
    .lt("expires_at", now)
    .neq("expires_at", null);

  return count || 0;
}

type Json = { [key: string]: any } | any[] | string | number | boolean | null;
```

```

```

```

```
