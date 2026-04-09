---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/CHECKPOINT-md.md"
project: "narad"
role: service
language: markdown
frameworks: [docker]
lines: 124
size: 3945 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docker, documentation, markdown, project/narad, service]
---

# CHECKPOINT-md.md

> Service / API client module using **docker** (124 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/CHECKPOINT-md.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 124 |
| **Size** | 3945 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/CHECKPOINT.md"
project: "vishwakarma"
role: service
language: markdown
frameworks: [docker]
lines: 86
size: 3221 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docker, documentation, markdown, project/vishwakarma, service]
---

# CHECKPOINT.md

> Service / API client module using **docker** (86 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/CHECKPOINT.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 86 |
| **Size** | 3221 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# vishwakarma-platform — Project Checkpoint

**Date:** April 4, 2026
**Status:** Unified Platform v2.5 — Enhanced AI & Backup Features.

---

## Architecture

| Service | Portal | Backend |
|---|---|---|
| **Cloud Provisioning** | `vishwakarma-ops.pages.dev` | `vishwakarma` (Unified _worker.js) |
| **Ai Bhaina AGI** | `vishwakarma-ops.pages.dev/agi` | Integrated Neural Core (OpenRouter + Qdrant) |
| **Gold SaaS** | `gold-saas.pages.dev` | `gold-worker` (Supabase Proxy) |

---

## 🛠️ Status & Recent Changes

### ✅ New Serverless Services
- **Cloudflare Zero Trust**: Free DNS-based ad blocking (no query limit)
- Alternative to NextDNS with more features

### ✅ AI Agent Memory
- **Persistent Context**: AI remembers user preferences across conversations
- **User Preferences**: Stores preferred services, timezone, notification settings
- **Topic Tracking**: Remembers what services user is interested in
- **Endpoints**: `/api/agi/preferences` and `/api/agi/memory`

### ✅ Backup Restore UI
- **One-click Restore**: New `/restore.html` page for backup management
- **List Backups**: View all available R2 backups
- **Restore**: Select and restore from any backup
- **R2 Integration**: Uses Cloudflare R2 API

### ✅ Conditional Service Provisioning
- **Only selected services install**: Client selects services, only those get provisioned
- **Server vs Serverless**: Clear distinction - VM only provisions for server services
- **Serverless alternatives**: NextDNS, Cloudflare Zero Trust, Bitwarden, UptimeRobot
- **`install_nextcloud` flag**: Nextcloud now conditional like other services

### ✅ Infrastructure Enhancements
- **Multi-region support**: Added `additional_regions` variable and module for OCI disaster recovery
- **Automated R2 backups**: New `backup-r2.sh` script for NextCloud backup/restore with retention
- **Auto-generated passwords**: All services (Nextcloud, Pi-hole, Vaultwarden, n8n) auto-generate passwords

### ✅ Terraform Improvements
- Fixed syntax issues in security rules (proper multi-line blocks)
- Added `random_password` resources for each service
- All passwords marked sensitive in outputs

### ✅ Brahma AI Scope
- Refined system prompt with clear scope boundaries
- Service catalog with pricing tiers (Oracle Free Tier)
- Memory-enabled for personalized assistance

---

## Available Services

### Server-Based (Requires Oracle VM)
| Service | Description |
|---|---|
| Nextcloud | Self-hosted file sync & collaboration |
| Pi-hole | Network-wide ad blocker |
| Vaultwarden | Self-hosted password manager (Bitwarden-compatible) |
| n8n | Workflow automation |
| Uptime Kuma | Service monitoring dashboard |

### Serverless (No VM Required)
| Service | Description |
|---|---|
| NextDNS | Ad blocking via DNS (no server) |
| Cloudflare Zero Trust | Free DNS ad blocking + security |
| Tailscale | Secure VPN for remote access |
| Bitwarden | Official hosted password manager |
| UptimeRobot | External monitoring service |

---

## Pending Roadmap

- ⬜ Razorpay integration for Gold SaaS.
- ⬜ Telegram Bot integration for remote AGI orchestration.
- ⬜ Agent Marketplace (pre-built AI agents).
- ⬜ Multi-Agent Orchestration (spawn multiple agents).

```

```
