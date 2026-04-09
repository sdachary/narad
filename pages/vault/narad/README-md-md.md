---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/README-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [cloudflare-workers]
lines: 122
size: 4105 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, cloudflare-workers, documentation, markdown, project/narad]
---

# README-md.md

> Authentication / authorization module using **cloudflare-workers** (122 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/README-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 122 |
| **Size** | 4105 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/README.md"
project: "vishwakarma"
role: auth
language: markdown
frameworks: [cloudflare-workers]
lines: 84
size: 3316 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, cloudflare-workers, documentation, markdown, project/vishwakarma]
---

# README.md

> Authentication / authorization module using **cloudflare-workers** (84 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/README.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 84 |
| **Size** | 3316 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# vishwakarma-platform

A unified platform for business automation, private cloud management, and AGI orchestration.

## Core Services

| Service | Component | Deployment | Description |
|---------|-----------|------------|-------------|
| **Gold SaaS** | `services/saas` | Pages + Worker | Business management: inventory, orders, billing. |
| **Cloud Provisioning** | `services/vishwakarma` | Pages + Worker | OCI Infrastructure Management & Control Plane. |
| **AGI Nexus** | `services/agi` | **Edge Worker** | Dedicated "Ai Bhaina" Nexus Space with Neural Moods & RAG. |
| **Sync Ledger** | `services/syncledger` | Edge Worker | Optimized financial ledger with native Edge hashing. |
| **Narad** | `narad` (repo) | **OCI VM** | R&D Intelligence Brain & Telegram Bot Interface. |

---

## Repository Structure

```
vishwakarma-platform/
│
├── services/
│   ├── agi/                       ← [NEW] STANDALONE AGI
│   │   └── pages/_worker.js       ← Unified Nexus UI + API
│   │
│   ├── syncledger/                ← [OPTIMIZED] LEDGER
│   │   └── pages/_worker.js       ← Unified Ledger + Native Auth
│   │
│   ├── saas/                      ← CLIENT-FACING (Gold SaaS)
│   │   ├── pages/                 ← Dashboard, Inventory, Orders
│   │   └── worker/                ← CORS proxy
│   │
│   ├── vishwakarma/            ← OPERATOR-ONLY (Cloud Ops)
│   │   ├── pages/                 ← OCI Management Dashboard
│   │   └── terraform/             ← OCI Infrastructure
│   ...
```

---

## Service Highlights

### 1. AGI Nexus Space (`services/agi`)
- **Neural Moods**: Switchable particle environments (Nexus, Vortex, Pulse, Nebula).
- **Persistent Memory**: Qdrant-backed Vector DB for idea recall and RAG.
- **Telegram Bot**: Webhook integration for persistence beyond the browser.
- **Checkpoints**: Session state stored in Cloudflare KV (`AGENT_MEMORY`) for resiliency.

### 2. Sync Ledger (`services/syncledger`)
- **Edge-Native Hashing**: Uses Web Crypto **PBKDF2** for sub-millisecond logins, resolving the 1102 CPU limit issues.
- **Unified Structure**: Front-to-back logic inside a single `_worker.js`.
- **Legacy Migration**: Automated detection of heavy bcrypt hashes with graceful migration prompts.

### 3. Cloud Provisioning (`services/vishwakarma`)
- **Infrastructure**: Automated OCI VM provisioning via Terraform (NextCloud, Pi-hole).
- **Control Plane**: Dedicated dashboard for lifecycle management.

---

## Technical Reference: Checkpoints
Checkpoints ensure that long-running AGI tasks or sessions are never lost.
- **Storage**: Cloudflare KV (`AGENT_MEMORY`).
- **Keys**: `agi:session:{sessionId}`.
- **Payload**: Includes last message, thinking state, and timestamp.

---

## GitHub Secrets & Env Vars

| Secret / Var | Service | Purpose |
|--------------|---------|---------|
| `AGENT_MEMORY` | AGI | KV Binding for session persistence |
| `SUPABASE_URL` | SyncLedger | Ledger Database |
| `TELEGRAM_BOT_TOKEN` | AGI | Bot interaction |
| `OPENROUTER_API_KEY` | AGI | Fallback Inference |

## Local Development
Both AGI and SyncLedger can be run with:
```bash
cd services/[service]/pages && wrangler dev
```

## License
Proprietary — Vishwakarma Platform

```

```
