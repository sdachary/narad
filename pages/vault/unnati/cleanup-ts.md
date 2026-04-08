---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/automation/cleanup.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 78
size: 2164 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, project/unnati, typescript, utility]
---

# cleanup.ts

> Utility / helper module using **typescript** (78 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/automation/cleanup.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 78 |
| **Size** | 2164 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { SupabaseClient } from '@supabase/supabase-js';

const OLD_FILE_THRESHOLD_DAYS = 90;
const OLD_FILE_THRESHOLD_MS = OLD_FILE_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

export async function cleanupOldFiles(
  supabase: SupabaseClient
): Promise<{ deleted: number; freedMb: number }> {
  if (!supabase) {
    return { deleted: 0, freedMb: 0 };
  }

  const cutoffDate = new Date(Date.now() - OLD_FILE_THRESHOLD_MS).toISOString();

  const { data: oldFiles, error: listError } = await supabase
    .storage
    .from('resumes')
    .list('', {
      limit: 1000,
    });

  if (listError || !oldFiles) {
    console.error('Failed to list storage files:', listError?.message);
    return { deleted: 0, freedMb: 0 };
  }

  const toDelete = oldFiles.filter((file) => {
    const createdAt = file.created_at;
    return createdAt && new Date(createdAt).getTime() < Date.now() - OLD_FILE_THRESHOLD_MS;
  });

  if (toDelete.length === 0) {
    return { deleted: 0, freedMb: 0 };
  }

  const fileNames = toDelete.map((f) => f.name);
  const totalSize = toDelete.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);

  const { error: deleteError } = await supabase.storage
    .from('resumes')
    .remove(fileNames);

  if (deleteError) {
    console.error('Failed to delete old files:', deleteError.message);
    return { deleted: 0, freedMb: 0 };
  }

  return {
    deleted: toDelete.length,
    freedMb: Math.round((totalSize / (1024 * 1024)) * 100) / 100,
  };
}

export async function getStorageUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<{ totalMb: number; fileCount: number }> {
  if (!supabase || !userId) {
    return { totalMb: 0, fileCount: 0 };
  }

  const { data: files, error } = await supabase.storage
    .from('resumes')
    .list(userId, {
      limit: 1000,
    });

  if (error || !files) {
    console.error('Failed to list user files:', error?.message);
    return { totalMb: 0, fileCount: 0 };
  }

  const fileCount = files.length;
  const totalBytes = files.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
  const totalMb = Math.round((totalBytes / (1024 * 1024)) * 100) / 100;

  return { totalMb, fileCount };
}

```
