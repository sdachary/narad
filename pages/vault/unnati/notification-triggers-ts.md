---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/automation/notification-triggers.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 87
size: 1826 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# notification-triggers.ts

> Utility / helper module using **typescript** (87 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/automation/notification-triggers.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 87 |
| **Size** | 1826 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[supabase-ts]], [[types-ts]]

## 📄 Content

```typescript
import type { SupabaseClient } from '@supabase/supabase-js';
import { ActivityType } from '../types';
import { getSupabase } from '../supabase';

async function createActivity(
  supabase: SupabaseClient | null,
  userId: string,
  type: ActivityType,
  message: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  if (!supabase || !userId) {
    return;
  }

  const { error } = await supabase.from('activities').insert({
    user_id: userId,
    type,
    message,
    metadata,
    read: false,
  });

  if (error) {
    console.error('Failed to create activity:', error.message);
  }
}

export async function notifyNewJobsFound(
  userId: string,
  count: number
): Promise<void> {
  const supabase = getSupabase();
  const message = count === 1
    ? '1 new job matching your profile was found'
    : `${count} new jobs matching your profile were found`;

  await createActivity(
    supabase,
    userId,
    ActivityType.JOB_FOUND,
    message,
    { job_count: count }
  );
}

export async function notifyMatchReady(
  userId: string,
  jobId: string
): Promise<void> {
  const supabase = getSupabase();
  
  await createActivity(
    supabase,
    userId,
    ActivityType.MATCH_READY,
    'AI match analysis is ready for a job',
    { job_id: jobId }
  );
}

export async function notifyNeedsReview(userId: string): Promise<void> {
  const supabase = getSupabase();
  
  await createActivity(
    supabase,
    userId,
    ActivityType.NEEDS_REVIEW,
    'You have jobs waiting for your review',
    {}
  );
}

export async function notifyApplicationSubmitted(
  userId: string,
  jobId: string
): Promise<void> {
  const supabase = getSupabase();
  
  await createActivity(
    supabase,
    userId,
    ActivityType.APPLIED,
    'Your job application has been submitted',
    { job_id: jobId }
  );
}

```
