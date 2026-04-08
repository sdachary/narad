---
source: "/home/deepak/Work/n8n/README.md"
project: "n8n"
role: docs
language: markdown
frameworks: [docker]
lines: 23
size: 873 bytes
last_modified: "2026-03-20 11:06"
scanned: "2026-04-07 10:16"
tags: [docker, docs, documentation, markdown, project/n8n]
---

# README.md

> Documentation using **docker** (23 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `n8n/README.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 23 |
| **Size** | 873 bytes |
| **Modified** | 2026-03-20 11:06 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# n8n — Automated Workflow Server

Hosted on Render.com (free tier). Uses Supabase as Postgres DB.
Source-controlled to GitHub for workflow backup/restore.

## Deployment
Render reads `render.yaml` automatically on repo connect.

## Keep-alive
`.github/workflows/n8n-keep-alive.yml` pings every 7 minutes to prevent Render's free tier from sleeping the container.

## DB
Uses the same Supabase project as Gold SaaS (`n8n` schema).
Connection via `DB_POSTGRESDB_*` env vars in `render.yaml`.

## Source Control
n8n's built-in source control syncs workflows to this repo.
Pull on startup is enabled — workflows auto-restore on redeploy.

## Required Secrets (Render.com)
- `N8N_ENCRYPTION_KEY` — change before first deploy
- `DB_POSTGRESDB_PASSWORD` — from Supabase Dashboard
- `N8N_SOURCECONTROL_HTTPS_TOKEN` — GitHub PAT (fine-grained, this repo, Contents write)

```
