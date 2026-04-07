---
source: "/home/deepak/Work/unnati/src/lib/supabase.ts"
project: "unnati"
role: utility
language: typescript
frameworks: []
lines: 9
size: 380 bytes
last_modified: "2026-04-07 01:48"
scanned: "2026-04-07 01:48"
tags: [code, project/unnati, typescript, utility]
---

# supabase.ts

> Utility / helper module (9 lines).

**Key exports:** `supabase`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/supabase.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | — |
| **Lines** | 9 |
| **Size** | 380 bytes |
| **Modified** | 2026-04-07 01:48 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

// Only create the client if we have a valid URL to prevent build crashes
export const supabase = (supabaseUrl && supabaseUrl.startsWith('http')) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

```
