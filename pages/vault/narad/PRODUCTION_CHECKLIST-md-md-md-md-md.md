---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/PRODUCTION_CHECKLIST-md-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 187
size: 4441 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [cloudflare-workers, docs, documentation, markdown, project/narad]
---

# PRODUCTION_CHECKLIST-md-md-md-md.md

> Documentation using **cloudflare-workers** (187 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/PRODUCTION_CHECKLIST-md-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 187 |
| **Size** | 4441 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/PRODUCTION_CHECKLIST-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 149
size: 3620 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [cloudflare-workers, docs, documentation, markdown, project/narad]
---

# PRODUCTION_CHECKLIST-md-md-md.md

> Documentation using **cloudflare-workers** (149 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/PRODUCTION_CHECKLIST-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 149 |
| **Size** | 3620 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/PRODUCTION_CHECKLIST-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 111
size: 2808 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [cloudflare-workers, docs, documentation, markdown, project/narad]
---

# PRODUCTION_CHECKLIST-md-md.md

> Documentation using **cloudflare-workers** (111 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/PRODUCTION_CHECKLIST-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 111 |
| **Size** | 2808 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/PRODUCTION_CHECKLIST-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 73
size: 1996 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [cloudflare-workers, docs, documentation, markdown, project/narad]
---

# PRODUCTION_CHECKLIST-md.md

> Documentation using **cloudflare-workers** (73 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/PRODUCTION_CHECKLIST-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 73 |
| **Size** | 1996 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/PRODUCTION_CHECKLIST.md"
project: "vishwakarma"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 35
size: 1189 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [cloudflare-workers, docs, documentation, markdown, project/vishwakarma]
---

# PRODUCTION_CHECKLIST.md

> Documentation using **cloudflare-workers** (35 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/PRODUCTION_CHECKLIST.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 35 |
| **Size** | 1189 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Production Readiness Checklist

## Security
- [ ] All API keys removed from `wrangler.toml`
- [ ] `ALLOWED_ORIGIN` set for all services
- [ ] CORS headers verified in browser
- [ ] Security headers (CSP, HSTS) verified (SecurityHeaders.com)
- [ ] Cloudflare Access (Zero Trust) enabled for `vishwakarma` admin
- [ ] KV namespaces restricted to production IDs

## Secret Management
- [ ] All secrets from `.env.example` added to Cloudflare Dashboard
- [ ] No secrets committed to git history
- [ ] Telegram Bot Token verified working

## Error Handling & UX
- [ ] 404/500 pages uploaded to root project
- [ ] `robots.txt` present and limiting crawl
- [ ] `/health` endpoints return JSON 200 for all 4 services
- [ ] Request tracing visible in logs

## Monitoring
- [ ] Sentry DSNs configured
- [ ] Logpush enabled (optional)
- [ ] UptimeRobot monitors active

## Infrastructure
- [ ] Supabase projects switched to "Production" mode
- [ ] OCI Compartment limits checked
- [ ] Cloudflare Pages custom domains configured

## Documentation
- [ ] [SECRETS_SETUP.md](./SECRETS_SETUP.md) reviewed
- [ ] [DEPLOYMENT.md](./DEPLOYMENT.md) verified
- [ ] [RUNBOOK.md](./RUNBOOK.md) shared with team

```

```

```

```

```
