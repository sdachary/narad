---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai-cache.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 91
size: 2231 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
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
| **Modified** | 2026-04-09 16:07 |

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
