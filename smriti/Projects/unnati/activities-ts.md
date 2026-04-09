---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/activities.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 82
size: 2032 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, project/unnati, typescript, utility]
---

# activities.ts

> Utility / helper module using **typescript** (82 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/activities.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 82 |
| **Size** | 2032 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

[[supabase-ts]]

## 📄 Content

```typescript
import { supabase } from "./supabase";

export type ActivityType = 'job_found' | 'match_ready' | 'needs_review' | 'applied' | 'interview' | 'offer' | 'rejected';

const VALID_ACTIVITY_TYPES: ActivityType[] = ['job_found', 'match_ready', 'needs_review', 'applied', 'interview', 'offer', 'rejected'];

export interface CreateActivityParams {
  user_id: string;
  type: ActivityType;
  message: string;
  metadata?: Record<string, any>;
}

export async function createActivity(params: CreateActivityParams) {
  if (!supabase) {
    throw new Error("Supabase not initialized");
  }

  const { user_id, type, message, metadata } = params;

  if (!VALID_ACTIVITY_TYPES.includes(type)) {
    throw new Error(`Invalid activity type. Valid types: ${VALID_ACTIVITY_TYPES.join(', ')}`);
  }

  const { data, error } = await supabase
    .from('activities')
    .insert({
      user_id,
      type,
      message,
      metadata: metadata || null,
      read: false
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markActivityAsRead(activityId: string, userId: string) {
  if (!supabase) {
    throw new Error("Supabase not initialized");
  }

  const { error } = await supabase
    .from('activities')
    .update({ read: true })
    .eq('id', activityId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function markAllActivitiesAsRead(userId: string) {
  if (!supabase) {
    throw new Error("Supabase not initialized");
  }

  const { error } = await supabase
    .from('activities')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
}

export async function getUnreadActivityCount(userId: string): Promise<number> {
  if (!supabase) {
    throw new Error("Supabase not initialized");
  }

  const { count, error } = await supabase
    .from('activities')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false);

  if (error) throw error;
  return count || 0;
}

```
