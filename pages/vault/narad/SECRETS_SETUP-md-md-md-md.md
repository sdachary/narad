---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/SECRETS_SETUP-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 131
size: 3289 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [cloudflare-workers, documentation, markdown, project/narad, service]
---

# SECRETS_SETUP-md-md-md.md

> Service / API client module using **cloudflare-workers** (131 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/SECRETS_SETUP-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 131 |
| **Size** | 3289 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/SECRETS_SETUP-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 93
size: 2478 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [cloudflare-workers, documentation, markdown, project/narad, service]
---

# SECRETS_SETUP-md-md.md

> Service / API client module using **cloudflare-workers** (93 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/SECRETS_SETUP-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 93 |
| **Size** | 2478 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/SECRETS_SETUP-md.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 55
size: 1664 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [cloudflare-workers, documentation, markdown, project/narad, service]
---

# SECRETS_SETUP-md.md

> Service / API client module using **cloudflare-workers** (55 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/SECRETS_SETUP-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 55 |
| **Size** | 1664 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/SECRETS_SETUP.md"
project: "vishwakarma"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 17
size: 857 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [cloudflare-workers, documentation, markdown, project/vishwakarma, service]
---

# SECRETS_SETUP.md

> Service / API client module using **cloudflare-workers** (17 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/SECRETS_SETUP.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 17 |
| **Size** | 857 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Cloudflare Pages Secrets Setup

Run these commands to set up secrets for each service:

## AGI Service
wrangler pages secret put GROQ_API_KEY --project-name vishwakarma-agi
wrangler pages secret put OPENROUTER_API_KEY --project-name vishwakarma-agi
wrangler pages secret put QDRANT_URL --project-name vishwakarma-agi
wrangler pages secret put QDRANT_API_KEY --project-name vishwakarma-agi
wrangler pages secret put TELEGRAM_BOT_TOKEN --project-name vishwakarma-agi

## SyncLedger Service
wrangler pages secret put SUPABASE_URL --project-name syncledger-api
wrangler pages secret put SUPABASE_ANON_KEY --project-name syncledger-api
wrangler pages secret put SUPABASE_SERVICE_ROLE_KEY --project-name syncledger-api
wrangler pages secret put JWT_SECRET --project-name syncledger-api
wrangler pages secret put JWT_REFRESH_SECRET --project-name syncledger-api

```

```

```

```
