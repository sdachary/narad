# Narad v2 🔮

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is the private R&D intelligence brain and Telegram bot interface for the [Nisha Platform](https://github.com/sdachary/nisha). Runs as a persistent Node.js process on your OCI VM. Built on Clean Architecture.

---

## Architecture

```
You (Telegram)
     ↓
TelegramBot (long-polling)
     ↓
MessageRouter (security + parse)
     ↓
HandleUserMessage (use case)
     ↓
AgiWorkerClient ──HTTP──→ nisha-agi.pages.dev/api/chat
     ↓                           ↓ Groq Llama 3.3 70B
TelegramSender ←── AgentResponse ←──
     ↓
You (Telegram reply)

Memory: SqliteMemoryStore (~/.narad/memory.db)
Knowledge: FileKnowledgeLoader (~/narad/knowledge/)
Scheduler: CronScheduler (morning digest, health check, weekly R&D)
```

### Layer Structure

```
src/
├── domain/           ← Entities + Interfaces. Zero dependencies.
│   ├── entities/     ← Message, AgentResponse, ConversationContext
│   ├── interfaces/   ← IMessageSender, IAgiWorkerClient, IMemoryStore,
│   │                    IKnowledgeLoader, ILogger
│   └── services/     ← MessageParser (command extraction)
│
├── application/      ← Use cases. Depends only on domain interfaces.
│   └── use_cases/    ← HandleUserMessage, HandleCronJob
│
├── infrastructure/   ← Concrete implementations of domain interfaces.
│   ├── agi_worker/   ← AgiWorkerClient (HTTP to nisha-agi.pages.dev)
│   ├── memory/       ← SqliteMemoryStore, FileKnowledgeLoader
│   ├── telegram/     ← TelegramSender
│   ├── scheduler/    ← CronScheduler (node-cron)
│   └── ConsoleLogger.js
│
├── interface/        ← Entry points. Wires transport → router → use cases.
│   ├── bot/          ← TelegramBot (long-polling)
│   └── router/       ← MessageRouter (parse + security gate)
│
├── config.js         ← Reads env vars. Fails fast on missing keys.
└── main.js           ← DI container. Wires everything together.
```

---

## Quick Start

```bash
# 1. Clone on your OCI VM
git clone https://github.com/sdachary/narad.git ~/narad
cd ~/narad

# 2. Set up env
cp .env.example .env
nano .env   # fill in GROQ_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

# 3. Install everything
chmod +x scripts/install.sh
./scripts/install.sh

# 4. Verify
sudo systemctl status narad
# Send /status to your Telegram bot
```

---

## Telegram Commands

| Command | What it does |
|---|---|
| `/start` | Welcome message + clears conversation context |
| `/help` | Full command reference |
| `/ask <query>` | Direct question to the AI brain |
| `/status` | VM health: CPU, RAM, disk, uptime, running services |
| `/idea <text>` | Capture and store an R&D idea |
| `/recall <query>` | Search stored memory by topic |
| `/research <topic>` | Web search + AI summary |
| `/draft <request>` | Generate docs, plans, or code |
| `/nisha` | Status of all Nisha platform services |
| `/digest` | Summary of recent R&D ideas |
| `/experiment <n>` | Look up experiment status |

---

## Scheduled Jobs

| Job | Schedule | Behavior |
|---|---|---|
| Morning Digest | 8:00 AM IST daily | VM health + ideas since yesterday + today's priority |
| VM Health Check | Every 30 minutes | Silent — only alerts if disk >85%, RAM <150MB, or service down |
| Weekly R&D Summary | 9:00 AM IST Monday | Experiments, backlog, top 3 priorities |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key (console.groq.com) |
| `TELEGRAM_BOT_TOKEN` | ✅ | Bot token from @BotFather |
| `TELEGRAM_CHAT_ID` | ✅ | Your numeric Telegram user ID (from @userinfobot) |
| `OPENROUTER_API_KEY` | Optional | Fallback models (Gemini, DeepSeek) |
| `AGI_WORKER_URL` | Optional | Default: `https://nisha-agi.pages.dev` |
| `LOG_LEVEL` | Optional | `debug\|info\|warn\|error` (default: `info`) |

---

## Operations

```bash
# View live logs
sudo journalctl -u narad -f

# Restart
sudo systemctl restart narad

# Update to latest code + NullClaw binary
./scripts/update.sh

# Sync knowledge base from nisha repo
./scripts/sync-knowledge.sh

# Check service status
sudo systemctl status narad
```

---

## Related

- [sdachary/nisha](https://github.com/sdachary/nisha) — Main platform monorepo
- AGI worker: `services/agi/` in nisha repo
- CloudProvision: `services/cloudprovision/` in nisha repo

---

*Proprietary — Nisha Platform*
