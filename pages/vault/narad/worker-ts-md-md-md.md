---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/worker-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 269
size: 6247 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# worker-ts-md-md.md

> Utility / helper module using **typescript** (269 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/worker-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 269 |
| **Size** | 6247 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/worker-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 231
size: 5490 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# worker-ts-md.md

> Utility / helper module using **typescript** (231 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/worker-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 231 |
| **Size** | 5490 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/worker-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 193
size: 4740 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# worker-ts.md

> Utility / helper module using **typescript** (193 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/worker-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 193 |
| **Size** | 4740 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/jobs/worker.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 156
size: 3927 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# worker.ts

> Utility / helper module using **typescript** (156 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/jobs/worker.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 156 |
| **Size** | 3927 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[activities-ts]], [[index-ts]], [[matcher-ts]], [[processor-ts]], [[supabase-ts]], [[types-ts]]

## 📄 Content

```typescript
import { getSupabase } from '../supabase';
import { createActivity } from '../activities';
import { searchJobs } from './index';
import { processAndMatchJobs } from './processor';
import { UserProfile } from '../matcher';
import { ActivityType } from '../types';

interface UserPreferences {
  preferred_roles: string[];
  preferred_location: string;
  company_types: string[];
  sectors: string[];
  experience_level: string;
  skills: string[];
}

async function fetchUserProfile(supabase: ReturnType<typeof getSupabase>, userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase!
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return {
    skills: data.skills || [],
    preferredRoles: data.preferred_roles || [],
    preferredLocation: data.preferred_location || '',
    companyTypes: data.company_types || [],
    experienceLevel: data.experience_level || 'mid',
    sectors: data.sectors || [],
  };
}

function buildSearchQueries(prefs: UserPreferences): string[] {
  const queries: string[] = [];
  
  if (prefs.preferred_roles && prefs.preferred_roles.length > 0) {
    for (const role of prefs.preferred_roles.slice(0, 3)) {
      queries.push(role);
    }
  }

  if (prefs.skills && prefs.skills.length > 0) {
    const skillCombo = prefs.skills.slice(0, 2).join(' ');
    queries.push(skillCombo);
  }

  if (queries.length === 0) {
    queries.push('software engineer');
  }

  return queries;
}

function toUserPreferences(profile: UserProfile): UserPreferences {
  return {
    preferred_roles: profile.preferredRoles,
    preferred_location: profile.preferredLocation,
    company_types: profile.companyTypes,
    sectors: profile.sectors,
    experience_level: profile.experienceLevel,
    skills: profile.skills,
  };
}

async function searchMultipleSources(
  queries: string[],
  location: string
): Promise<any[]> {
  const allJobs: any[] = [];
  
  for (const query of queries) {
    try {
      const jobs = await searchJobs({
        keywords: query,
        location,
        sources: ['all'],
        remote_only: true,
      });
      allJobs.push(...jobs);
    } catch (error) {
      console.error(`Search error for query "${query}":`, error);
    }
  }

  return allJobs;
}

async function notifyUser(
  userId: string,
  found: number,
  saved: number
): Promise<void> {
  const message = saved > 0
    ? `Found ${found} jobs, saved ${saved} new opportunities matching your profile.`
    : `Found ${found} jobs but none matched your profile yet.`;

  await createActivity({
    user_id: userId,
    type: 'job_found' as ActivityType,
    message,
    metadata: { found, saved },
  });
}

export async function runJobSearch(userId: string): Promise<{
  found: number;
  saved: number;
  skipped: number;
  errors: string[];
}> {
  const errors: string[] = [];
  const supabase = getSupabase();

  if (!supabase) {
    errors.push('Supabase not initialized');
    return { found: 0, saved: 0, skipped: 0, errors };
  }

  const userProfile = await fetchUserProfile(supabase, userId);
  if (!userProfile) {
    errors.push('Could not fetch user profile');
    return { found: 0, saved: 0, skipped: 0, errors };
  }

  const userPrefs = toUserPreferences(userProfile);
  const queries = buildSearchQueries(userPrefs);
  const jobs = await searchMultipleSources(queries, userProfile.preferredLocation);

  if (jobs.length === 0) {
    await notifyUser(userId, 0, 0);
    return { found: 0, saved: 0, skipped: 0, errors };
  }

  const { jobs: matchedJobs, saved, skipped } = await processAndMatchJobs(jobs, {
    userId,
    userProfile,
    matchThreshold: 60,
    saveAll: false,
    supabase,
  });

  await notifyUser(userId, jobs.length, saved);

  return {
    found: jobs.length,
    saved,
    skipped,
    errors,
  };
}
```

```

```

```
