# Narad 🔮

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is the private R&D intelligence brain and ops assistant for the [Nisha Platform](https://github.com/sdachary/nisha). It runs as a persistent process on your OCI VM, accessible via Telegram (mobile) and a web UI (laptop), powered entirely by free AI models.

---

## What Narad Does

| Capability | How |
|---|---|
| Capture R&D ideas instantly | Telegram message → stored in Qdrant |
| Research any topic | Web search + AI summary sent to Telegram |
| Draft architecture / code | Ask on Telegram or web UI |
| Track experiments across Nisha services | Tagged memory per service |
| Monitor VM health | Scheduled checks → Telegram alerts |
| Share memory with Bhaina | Same Qdrant collection — knowledge flows both ways |

---

## Architecture

```
You (Telegram / Mobile)
        ↓
    Narad (NullClaw binary)
    running on OCI VM
        ├── Groq API (Llama 3.3 70B) — primary model, free
        ├── OpenRouter (Gemini Flash / DeepSeek) — fallback, free
        ├── Qdrant Cloud — shared memory with Bhaina AGI
        ├── MCP: filesystem, GitHub, web search
        └── Web UI on port 7860 (Tailscale-protected)
                ↓
You (Browser / Laptop via Tailscale)
```

---

## Repo Structure

```
narad/
├── config/
│   ├── config.toml          ← your actual config (gitignored)
│   └── config.example.toml  ← template (committed, no secrets)
├── knowledge/
│   ├── nisha-platform.md    ← core platform context for Narad
│   ├── rnd-context.md       ← your R&D domain + active experiments
│   └── services/
│       ├── cloudprovision.md
│       ├── gold-saas.md
│       ├── syncledger.md
│       └── agi.md
├── scripts/
│   ├── install.sh           ← one-command setup on OCI VM
│   ├── sync-knowledge.sh    ← pull latest context from nisha repo
│   └── update.sh            ← update NullClaw binary
├── systemd/
│   └── narad.service        ← copy to /etc/systemd/system/
├── mcp/
│   └── nisha-worker/        ← MCP bridge to cloudprovision worker
├── .env.example             ← all required env vars
├── .gitignore
└── README.md
```

---

## Quick Start

```bash
# 1. Clone on your OCI VM
git clone https://github.com/sdachary/narad.git ~/narad
cd ~/narad

# 2. Copy env template and fill in your keys
cp .env.example .env
nano .env

# 3. Run installer
chmod +x scripts/install.sh
./scripts/install.sh

# 4. Start Narad
sudo systemctl enable narad
sudo systemctl start narad

# 5. Check it's running
sudo systemctl status narad
```

---

## Telegram Commands

| Command | What it does |
|---|---|
| `/idea <text>` | Capture an R&D idea, store in Qdrant |
| `/recall <query>` | Search past ideas by topic |
| `/research <topic>` | Web search + AI summary |
| `/draft <request>` | Generate code / architecture draft |
| `/status` | VM health: CPU, RAM, disk, containers |
| `/nisha` | Current Nisha platform status |
| `/digest` | Summary of recent ideas + connections |

---

## Shared Memory with Bhaina

Narad and Bhaina (the Nisha AGI worker) share the same Qdrant instance but use **separate collections**:

| Collection | Owner | Purpose |
|---|---|---|
| `agi_memory` | Bhaina | Customer conversations, provisioning context |
| `narad_rnd` | Narad | Your R&D ideas, experiments, research |
| `narad_shared` | Both | Cross-pollinated knowledge (Narad writes, Bhaina reads) |

This means when you research ATXP on Telegram, Bhaina can recall that context when a customer asks about payment options.

---

## Related Repos

- [sdachary/nisha](https://github.com/sdachary/nisha) — Main platform monorepo
- Bhaina AGI: `services/agi/` in nisha repo
- CloudProvision: `services/cloudprovision/` in nisha repo

---

*Proprietary — Nisha Platform*
