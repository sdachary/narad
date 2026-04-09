---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/index-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 112
size: 2912 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# index-ts.md

> Utility / helper module using **typescript** (112 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/index-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 112 |
| **Size** | 2912 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/analytics/index.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 75
size: 2179 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/unnati, typescript, utility]
---

# index.ts

> Utility / helper module using **typescript** (75 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/analytics/index.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 75 |
| **Size** | 2179 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { ApplicationStatus } from '../types';

export interface DashboardStats {
  totalApplications: number;
  jobsFoundToday: number;
  pendingReview: number;
  interviewsScheduled: number;
  offersReceived: number;
  activeDays: number;
}

export async function getDashboardStats(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const [appsResult, todayJobsResult, pendingResult, interviewResult, offerResult, profileResult] =
    await Promise.all([
      supabase
        .from('applications')
        .select('id, status', { count: 'exact', head: true })
        .eq('user_id', userId),

      supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', ApplicationStatus.FOUND)
        .gte('applied_at', todayStr),

      supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', ApplicationStatus.FOUND),

      supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', ApplicationStatus.INTERVIEW),

      supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', ApplicationStatus.OFFER),

      supabase
        .from('user_profiles')
        .select('created_at')
        .eq('id', userId)
        .single(),
    ]);

  let activeDays = 0;
  if (profileResult.data?.created_at) {
    const created = new Date(profileResult.data.created_at);
    const now = new Date();
    activeDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  }

  return {
    totalApplications: appsResult.count ?? 0,
    jobsFoundToday: todayJobsResult.count ?? 0,
    pendingReview: pendingResult.count ?? 0,
    interviewsScheduled: interviewResult.count ?? 0,
    offersReceived: offerResult.count ?? 0,
    activeDays,
  };
}
```

```
