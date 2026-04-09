---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/MONITORING_SETUP-md-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 152
size: 3451 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [cloudflare-workers, documentation, markdown, project/narad, service]
---

# MONITORING_SETUP-md-md-md.md

> Service / API client module using **cloudflare-workers** (152 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/MONITORING_SETUP-md-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 152 |
| **Size** | 3451 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/MONITORING_SETUP-md-md.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 114
size: 2628 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [cloudflare-workers, documentation, markdown, project/narad, service]
---

# MONITORING_SETUP-md-md.md

> Service / API client module using **cloudflare-workers** (114 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/MONITORING_SETUP-md-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 114 |
| **Size** | 2628 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/MONITORING_SETUP-md.md"
project: "narad"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 76
size: 1805 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [cloudflare-workers, documentation, markdown, project/narad, service]
---

# MONITORING_SETUP-md.md

> Service / API client module using **cloudflare-workers** (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/MONITORING_SETUP-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 76 |
| **Size** | 1805 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/MONITORING_SETUP.md"
project: "vishwakarma"
role: service
language: markdown
frameworks: [cloudflare-workers]
lines: 38
size: 989 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [cloudflare-workers, documentation, markdown, project/vishwakarma, service]
---

# MONITORING_SETUP.md

> Service / API client module using **cloudflare-workers** (38 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/MONITORING_SETUP.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 38 |
| **Size** | 989 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Monitoring & Error Tracking Setup

## Option 1: Sentry (Recommended)
1. Create account at sentry.io
2. Create project for each service
3. Set DSN as Cloudflare secret:
   ```bash
   wrangler pages secret put SENTRY_DSN --project-name vishwakarma-agi
   ```

4. Add to each service:
   ```bash
   npm install @sentry/cloudflare-workers
   ```
   
5. In _worker.js:
   ```javascript
   import * as Sentry from "@sentry/cloudflare-workers";
   Sentry.init({
     dsn: env.SENTRY_DSN,
     environment: env.ENVIRONMENT,
     tracesSampleRate: 1.0,
   });
   ```

## Option 2: Cloudflare Logpush
1. Enable Logpush to your destination (Datadog, Cloudflare Analytics)
2. Push: HTTP access logs, Workers errors
3. Set up alerts for error rates > 1%

## Uptime Monitoring
Setup UptimeRobot to monitor:
- https://vishwakarma-agi.pages.dev/health
- https://syncledger.pages.dev/health
- https://gold-saas.pages.dev/health
- https://vishwakarma.pages.dev/health

Alert on down or response time > 5s

```

```

```

```
