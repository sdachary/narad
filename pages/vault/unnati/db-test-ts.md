---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/db-test.ts"
project: "unnati"
role: utility
language: typescript
frameworks: [typescript]
lines: 129
size: 3150 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/unnati, typescript, utility]
---

# db-test.ts

> Utility / helper module using **typescript** (129 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/db-test.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 129 |
| **Size** | 3150 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[supabase-ts]]

## 📄 Content

```typescript
import { getSupabase } from "./supabase";

export interface DbStatus {
  connected: boolean;
  storage: {
    accessible: boolean;
    buckets: string[];
  };
  tables: {
    user_profiles: boolean;
    applications: boolean;
    ai_cache: boolean;
    activities: boolean;
  };
  errors: string[];
  timing: {
    connection: number;
    storage: number;
    tables: number;
    total: number;
  };
}

const REQUIRED_TABLES = [
  "user_profiles",
  "applications",
  "ai_cache",
  "activities"
];

async function time<T>(fn: () => Promise<T>): Promise<{ result: T; ms: number }> {
  const start = performance.now();
  const result = await fn();
  const ms = performance.now() - start;
  return { result, ms };
}

export async function testDatabaseConnection(): Promise<DbStatus> {
  const start = performance.now();
  const supabase = getSupabase();
  
  const status: DbStatus = {
    connected: false,
    storage: {
      accessible: false,
      buckets: []
    },
    tables: {
      user_profiles: false,
      applications: false,
      ai_cache: false,
      activities: false
    },
    errors: [],
    timing: {
      connection: 0,
      storage: 0,
      tables: 0,
      total: 0
    }
  };

  if (!supabase) {
    status.errors.push("Supabase client not initialized - check SUPABASE_URL env var");
    status.timing.total = performance.now() - start;
    return status;
  }
  
  const connTest = await time(async () => {
    try {
      const { data, error } = await supabase.from("user_profiles").select("id").limit(1);
      if (error) throw error;
      return true;
    } catch (e: any) {
      return e.message || "Connection test failed";
    }
  });
  status.timing.connection = connTest.ms;

  if (connTest.result === true) {
    status.connected = true;
  } else {
    status.errors.push(`Connection: ${connTest.result}`);
  }

  const storageTest = await time(async () => {
    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      return data?.map((b: { name: string }) => b.name) || [];
    } catch (e: any) {
      throw e.message || "Storage test failed";
    }
  });
  status.timing.storage = storageTest.ms;

  try {
    status.storage.buckets = storageTest.result;
    status.storage.accessible = true;
  } catch (e: any) {
    status.storage.accessible = false;
    status.errors.push(`Storage: ${e}`);
  }

  const tablesTest = await time(async () => {
    const results: Record<string, boolean> = {};
    for (const table of REQUIRED_TABLES) {
      try {
        const { error } = await supabase.from(table).select("id").limit(1);
        results[table] = !error;
        if (error) {
          status.errors.push(`Table ${table}: ${error.message}`);
        }
      } catch (e: any) {
        results[table] = false;
        status.errors.push(`Table ${table}: ${e.message}`);
      }
    }
    return results;
  });
  status.timing.tables = tablesTest.ms;

  for (const table of REQUIRED_TABLES) {
    status.tables[table as keyof typeof status.tables] = tablesTest.result[table];
  }

  status.timing.total = performance.now() - start;
  return status;
}

```
