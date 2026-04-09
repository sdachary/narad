---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/timeline-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 114
size: 2466 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# timeline-ts.md

> Utility / helper module using **typescript** (114 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/timeline-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 114 |
| **Size** | 2466 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/automation/timeline.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 76
size: 1731 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# timeline.ts

> Utility / helper module using **typescript** (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/automation/timeline.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 76 |
| **Size** | 1731 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { SupabaseClient } from '@supabase/supabase-js';

export interface TimelineEvent {
  id: string;
  application_id: string;
  type: 'status_change' | 'note_added' | 'cover_letter_generated';
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export async function getTimeline(
  supabase: SupabaseClient,
  applicationId: string
): Promise<TimelineEvent[]> {
  if (!supabase || !applicationId) {
    return [];
  }

  const { data, error } = await supabase
    .from('application_timeline')
    .select('*')
    .eq('application_id', applicationId)
    .order('created_at', { ascending: true });

  if (error || !data) {
    console.error('Failed to fetch timeline:', error?.message);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    application_id: row.application_id,
    type: row.type,
    old_value: row.old_value,
    new_value: row.new_value,
    created_at: row.created_at,
  }));
}

export async function addTimelineEvent(
  supabase: SupabaseClient,
  applicationId: string,
  type: TimelineEvent['type'],
  oldValue?: string,
  newValue?: string
): Promise<TimelineEvent | null> {
  if (!supabase || !applicationId) {
    return null;
  }

  const { data, error } = await supabase
    .from('application_timeline')
    .insert({
      application_id: applicationId,
      type,
      old_value: oldValue,
      new_value: newValue,
    })
    .select()
    .single();

  if (error || !data) {
    console.error('Failed to add timeline event:', error?.message);
    return null;
  }

  return {
    id: data.id,
    application_id: data.application_id,
    type: data.type,
    old_value: data.old_value,
    new_value: data.new_value,
    created_at: data.created_at,
  };
}

```

```
