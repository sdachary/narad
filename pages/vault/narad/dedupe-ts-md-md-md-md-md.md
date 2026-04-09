---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/dedupe-ts-md-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 339
size: 7162 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# dedupe-ts-md-md-md-md.md

> Utility / helper module using **typescript** (339 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/dedupe-ts-md-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 339 |
| **Size** | 7162 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/dedupe-ts-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 301
size: 6387 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# dedupe-ts-md-md-md.md

> Utility / helper module using **typescript** (301 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/dedupe-ts-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 301 |
| **Size** | 6387 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/dedupe-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 263
size: 5621 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# dedupe-ts-md-md.md

> Utility / helper module using **typescript** (263 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/dedupe-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 263 |
| **Size** | 5621 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/dedupe-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 225
size: 4864 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# dedupe-ts-md.md

> Utility / helper module using **typescript** (225 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/dedupe-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 225 |
| **Size** | 4864 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/dedupe-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 187
size: 4114 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# dedupe-ts.md

> Utility / helper module using **typescript** (187 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/dedupe-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 187 |
| **Size** | 4114 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/jobs/dedupe.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 147
size: 3349 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# dedupe.ts

> Utility / helper module using **typescript** (147 lines).

**Key exports:** `generateJobHash`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/jobs/dedupe.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 147 |
| **Size** | 3349 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[types-ts]]

## 📄 Content

```typescript
import { SupabaseClient } from '@supabase/supabase-js';
import { ApplicationRow, ApplicationStatus } from '../types';

export interface JobInput {
  url?: string;
  title: string;
  company: string;
}

export interface UnifiedJob {
  id: string;
  source: string;
  source_id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  posted_at: string;
  salary_range?: string;
  remote?: boolean;
}

function generateStringHash(str: string): string {
  const normalized = str.toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

export function generateJobHash(job: JobInput): string {
  const urlPart = job.url ? job.url : '';
  const str = `${urlPart}|${job.title}|${job.company}`;
  return generateStringHash(str);
}

export async function checkDuplicate(
  supabase: SupabaseClient,
  jobHash: string
): Promise<{ exists: boolean; existingId?: string }> {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('id')
      .eq('job_hash', jobHash)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error checking duplicate:', error);
      return { exists: false };
    }

    if (data) {
      return { exists: true, existingId: data.id };
    }

    return { exists: false };
  } catch (error) {
    console.error('Database error in checkDuplicate:', error);
    return { exists: false };
  }
}

export async function saveJob(
  supabase: SupabaseClient,
  job: UnifiedJob,
  userId: string
): Promise<string> {
  try {
    const jobHash = generateJobHash({
      url: job.url,
      title: job.title,
      company: job.company,
    });

    const applicationData: Omit<ApplicationRow, 'id' | 'updated_at'> = {
      user_id: userId,
      company_name: job.company,
      job_title: job.title,
      job_url: job.url,
      status: ApplicationStatus.FOUND,
      match_score: null,
      cover_letter: null,
      notes: null,
      location: job.location,
      salary_range: job.salary_range || null,
      job_hash: jobHash,
      source: job.source,
      applied_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('applications')
      .insert(applicationData)
      .select('id')
      .single();

    if (error) {
      console.error('Error saving job:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Database error in saveJob:', error);
    throw error;
  }
}

export async function processJobBatch(
  supabase: SupabaseClient,
  jobs: UnifiedJob[],
  userId: string
): Promise<{ saved: number; skipped: number }> {
  let saved = 0;
  let skipped = 0;

  for (const job of jobs) {
    const jobHash = generateJobHash({
      url: job.url,
      title: job.title,
      company: job.company,
    });

    const duplicate = await checkDuplicate(supabase, jobHash);

    if (duplicate.exists) {
      skipped++;
      continue;
    }

    try {
      await saveJob(supabase, job, userId);
      saved++;
    } catch (error) {
      console.error('Error processing job:', job.title, error);
      skipped++;
    }
  }

  return { saved, skipped };
}

```

```

```

```

```

```
