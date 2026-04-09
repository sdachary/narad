---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/DEPLOYMENT-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 186
size: 3846 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [cloudflare-workers, docs, documentation, markdown, project/narad]
---

# DEPLOYMENT-md-md-md.md

> Documentation using **cloudflare-workers** (186 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/DEPLOYMENT-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 186 |
| **Size** | 3846 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/DEPLOYMENT-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 148
size: 3064 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [cloudflare-workers, docs, documentation, markdown, project/narad]
---

# DEPLOYMENT-md-md.md

> Documentation using **cloudflare-workers** (148 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/DEPLOYMENT-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 148 |
| **Size** | 3064 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/DEPLOYMENT-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 110
size: 2279 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [cloudflare-workers, docs, documentation, markdown, project/narad]
---

# DEPLOYMENT-md.md

> Documentation using **cloudflare-workers** (110 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/DEPLOYMENT-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 110 |
| **Size** | 2279 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/DEPLOYMENT.md"
project: "vishwakarma"
role: docs
language: markdown
frameworks: [cloudflare-workers]
lines: 72
size: 1502 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [cloudflare-workers, docs, documentation, markdown, project/vishwakarma]
---

# DEPLOYMENT.md

> Documentation using **cloudflare-workers** (72 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/DEPLOYMENT.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 72 |
| **Size** | 1502 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Deployment Guide

## Prerequisites
- Cloudflare account with Pages project
- Wrangler CLI installed (npm install -g wrangler)
- All environment variables set

## Pre-Deployment Checklist
- [ ] All .env.example files filled out
- [ ] Secrets set up via Cloudflare dashboard
- [ ] Database migrations run
- [ ] Tests passing locally
- [ ] Build succeeds: npm run build
- [ ] No secrets in git (verify: git log --all --oneline -S "GROQ" -S "API_KEY")

## Deployment Steps

### 1. Set Up Secrets
See [SECRETS_SETUP.md](./SECRETS_SETUP.md)

### 2. Deploy Each Service

**AGI Service:**
```bash
cd services/agi
wrangler pages deploy
```

**SyncLedger:**
```bash
cd services/syncledger
npm run build
wrangler pages deploy dist
```

**Cloud Provisioning:**
```bash
cd services/vishwakarma
wrangler pages deploy pages
```

**Gold SaaS:**
```bash
cd services/saas
npm run build
wrangler pages deploy
```

### 3. Verify Deployments
```bash
curl https://vishwakarma-agi.pages.dev/health
curl https://syncledger.pages.dev/api/health
curl https://gold-saas.pages.dev/health
curl https://vishwakarma.pages.dev/health
```
All should return 200 OK with `{ status: "ok" }`.

### 4. Health Checks
- Open each service in browser
- Verify no console errors
- Test primary workflows

### 5. Monitor
- Watch error logs in Sentry
- Check Cloudflare Analytics
- Monitor uptime via UptimeRobot

## Rollback
1. Go to Cloudflare Dashboard → Pages
2. Select service
3. Go to Deployments
4. Click "Rollback" on previous version

```

```

```

```
