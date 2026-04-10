---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/config-js.md"
project: "narad"
role: auth
language: markdown
frameworks: []
lines: 64
size: 1774 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [auth, documentation, markdown, project/narad]
---

# config-js.md

> Authentication / authorization module (64 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/config-js.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 64 |
| **Size** | 1774 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/config.js"
project: "kanak"
role: auth
language: javascript
frameworks: []
lines: 26
size: 1108 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [auth, code, javascript, project/kanak]
---

# config.js

> Authentication / authorization module (26 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/config.js` |
| **Role** | auth |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 26 |
| **Size** | 1108 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * Gold SaaS Configuration
 * Supabase client points DIRECTLY at Supabase for all auth + data.
 * The gold-worker is only called explicitly for specific data routes
 * that need the service role key — NOT for auth.
 *
 * Root cause of login loop:
 *   getSession() was going through gold-worker which injected schema
 *   headers on /auth/v1/* breaking Supabase session handling.
 */

const SUPABASE_URL  = 'https://lpyatghqeqnbcnedregw.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweWF0Z2hxZXFuYmNuZWRyZWd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MDg0NDksImV4cCI6MjA4NTQ4NDQ0OX0.Hcf4p7V7h-KiwKDCoeOHJigghuvY0m-Xaqm4gkIyuwU';
const SCHEMA        = 'app_data';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

window.DB = {
    from: (table) => _supabase.schema(SCHEMA).from(table),
    auth:  _supabase.auth,
    rpc:  (fn, params) => _supabase.schema(SCHEMA).rpc(fn, params),
    _config: { url: SUPABASE_URL }
};

window.DASHBOARD_URL = 'https://gold-saas.pages.dev';
console.log('✅ Gold SaaS → Supabase direct');

```

```
