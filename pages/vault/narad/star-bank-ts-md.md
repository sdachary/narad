---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/star-bank-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: [typescript]
lines: 171
size: 3774 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, project/narad, typescript, utility]
---

# star-bank-ts.md

> Utility / helper module using **typescript** (171 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/star-bank-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 171 |
| **Size** | 3774 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/interview/star-bank.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 133
size: 3035 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, project/unnati, typescript, utility]
---

# star-bank.ts

> Utility / helper module using **typescript** (133 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/interview/star-bank.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 133 |
| **Size** | 3035 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { SupabaseClient } from '@supabase/supabase-js';

export interface STARStory {
  id: string;
  userId: string;
  category: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export async function getSTARStories(
  supabase: SupabaseClient,
  userId: string
): Promise<STARStory[]> {
  const { data, error } = await supabase
    .from('star_stories')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[STARBank] Error fetching stories:', error);
    throw new Error(error.message);
  }

  return (data || []).map((row) => ({
    id: row.id,
    userId: row.user_id,
    category: row.category,
    situation: row.situation,
    task: row.task,
    action: row.action,
    result: row.result,
    tags: row.tags || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function addSTARStory(
  supabase: SupabaseClient,
  story: Omit<STARStory, 'id' | 'createdAt' | 'updatedAt'>
): Promise<STARStory> {
  const { data, error } = await supabase
    .from('star_stories')
    .insert({
      user_id: story.userId,
      category: story.category,
      situation: story.situation,
      task: story.task,
      action: story.action,
      result: story.result,
      tags: story.tags,
    })
    .select()
    .single();

  if (error) {
    console.error('[STARBank] Error adding story:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    userId: data.user_id,
    category: data.category,
    situation: data.situation,
    task: data.task,
    action: data.action,
    result: data.result,
    tags: data.tags || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function updateSTARStory(
  supabase: SupabaseClient,
  id: string,
  story: Partial<Omit<STARStory, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
): Promise<STARStory> {
  const { data, error } = await supabase
    .from('star_stories')
    .update({
      category: story.category,
      situation: story.situation,
      task: story.task,
      action: story.action,
      result: story.result,
      tags: story.tags,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('[STARBank] Error updating story:', error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    userId: data.user_id,
    category: data.category,
    situation: data.situation,
    task: data.task,
    action: data.action,
    result: data.result,
    tags: data.tags || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function deleteSTARStory(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('star_stories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[STARBank] Error deleting story:', error);
    throw new Error(error.message);
  }
}

```

```
