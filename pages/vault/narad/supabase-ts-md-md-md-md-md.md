---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/supabase-ts-md-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 204
size: 3968 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [documentation, markdown, project/narad, utility]
---

# supabase-ts-md-md-md-md.md

> Utility / helper module (204 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/supabase-ts-md-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 204 |
| **Size** | 3968 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/supabase-ts-md-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 166
size: 3237 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, utility]
---

# supabase-ts-md-md-md.md

> Utility / helper module (166 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/supabase-ts-md-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 166 |
| **Size** | 3237 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/supabase-ts-md-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 128
size: 2515 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [documentation, markdown, project/narad, utility]
---

# supabase-ts-md-md.md

> Utility / helper module (128 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/supabase-ts-md-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 128 |
| **Size** | 2515 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/supabase-ts-md.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 90
size: 1805 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [documentation, markdown, project/narad, utility]
---

# supabase-ts-md.md

> Utility / helper module (90 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/supabase-ts-md.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 90 |
| **Size** | 1805 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/supabase-ts.md"
project: "narad"
role: utility
language: markdown
frameworks: []
lines: 52
size: 1102 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [documentation, markdown, project/narad, utility]
---

# supabase-ts.md

> Utility / helper module (52 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/supabase-ts.md` |
| **Role** | utility |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 52 |
| **Size** | 1102 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/supabase.ts"
project: "unnati"
role: utility
language: typescript
frameworks: []
lines: 13
size: 385 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, project/unnati, typescript, utility]
---

# supabase.ts

> Utility / helper module (13 lines).

**Key exports:** `getSupabase`, `supabase`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/supabase.ts` |
| **Role** | utility |
| **Language** | typescript |
| **Frameworks** | — |
| **Lines** | 13 |
| **Size** | 385 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";

export function getSupabase() {
  if (!supabaseUrl || !supabaseKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseKey);
}

export const supabase = typeof window !== 'undefined' ? null : getSupabase();
```

```

```

```

```

```
