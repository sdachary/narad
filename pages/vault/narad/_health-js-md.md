---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/_health-js.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 76
size: 1613 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [documentation, markdown, project/narad, service]
---

# _health-js.md

> Service / API client module (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/_health-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 76 |
| **Size** | 1613 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/public/_health.js"
project: "chitragupta"
role: service
language: javascript
frameworks: []
lines: 38
size: 921 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, javascript, project/chitragupta, service]
---

# _health.js

> Service / API client module (38 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/public/_health.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 38 |
| **Size** | 921 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```javascript
import { createClient } from '@supabase/supabase-js';

export async function onRequest(context) {
  try {
    const supabase = createClient(
      context.env.SUPABASE_URL,
      context.env.SUPABASE_ANON_KEY
    );
    
    // Test Supabase connection
    const { data, error } = await supabase
      .from('users')
      .select('count()', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return new Response(JSON.stringify({
      status: 'ok',
      service: 'syncledger',
      timestamp: new Date().toISOString(),
      checks: {
        database: 'ok'
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      service: 'syncledger',
      error: error.message
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

```

```
