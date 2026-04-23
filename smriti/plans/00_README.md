# Znext — Platform Implementation Plans

> Plans and guides for Karma, Vishwakarma, and Chitragupta platforms.

---

## 🚀 Active Work (Priority Order)

| # | Plan | Status |
|---|------|--------|
| 02 | [VM Migration](./02_vm-migration-plan.md) | ⏳ Pending |
| 13 | [Karma + Vishwakarma Integration](./13_karma_vishwakarma_integration_plan.md) | 📋 Planning |

---

## ✅ Completed (Archived to `done/`)

- **Narad Agentic OS** — Command Center, Knowledge Graph, mcptq (moved to narad repo)
- 14 — Karma Implementation
- 15 — Independent Platforms Architecture
- 16 — Sync Setup Implementation

---

## 📋 Supabase

**Single project**: `facurlopyzmmrjnllsnd.supabase.co` (all services)

---

## Quick Commands

```bash
# Run Karma backend
cd karma && pip install -r requirements.txt && python -m uvicorn backend.main:app --reload

# Sync schema to Supabase
# File: Znext/supabase_schema.sql
```

---

## Narad Command Center

Access: https://narad-7hc.pages.dev/command-center

Features:
- Service tiles with status
- Knowledge Graph (🗺️ button)
- Notification system
- Floating chat widget

MCP Task Queue: https://mcptq.sdachary-582.workers.dev

Second Brain: Use Obsidian with `/home/deepak/Work/narad/smriti/`

---

## Quick Links

- [AGENTS.md](../AGENTS.md)
- [OBSIDIAN_SETUP.md](./OBSIDIAN_SETUP.md)
- [vm-setup.sh](./vm-setup.sh)