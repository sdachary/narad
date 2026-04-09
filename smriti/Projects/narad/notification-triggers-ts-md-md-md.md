---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/notification-triggers-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 201
size: 4223 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# notification-triggers-ts-md-md.md

> Utility / helper module using **typescript** (201 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/notification-triggers-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 201 |
| **Size** | 4223 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/notification-triggers-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 163
size: 3421 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# notification-triggers-ts-md.md

> Utility / helper module using **typescript** (163 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/notification-triggers-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 163 |
| **Size** | 3421 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/notification-triggers-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 125
size: 2626 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# notification-triggers-ts.md

> Utility / helper module using **typescript** (125 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/notification-triggers-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 125 |
| **Size** | 2626 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/automation/notification-triggers.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 87
size: 1826 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
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
| **Modified** | 2026-04-09 14:38 |

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

```

```

```
