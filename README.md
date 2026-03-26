# Narad v2 🔮

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is the private R&D intelligence brain and Telegram bot interface for the [Nisha Platform](https://github.com/sdachary/nisha). Runs as a persistent Node.js process on your OCI VM. Built on Clean Architecture.

---

## Architecture

```
                          ┌─────────────────────┐
                          │    You (Telegram)   │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │  TelegramBot (long- │
                          │    polling)         │
                          └──────────┬──────────┘
                                     │
                          ┌──────────▼──────────┐
                          │   MessageRouter     │
                          │ (security + parse)  │
                          └──────────┬──────────┘
                                     │
                  ┌──────────────────▼───────────────────┐
                  │        Command Dispatcher              │
                  ├───────────────┬──────────────────────┤
                  │               │                      │
          ┌───────▼───────┐  ┌────▼─────┐        ┌───────▼──────┐
          │ HandleUserMessage │  │ HandleCronJob │  │ HandleMASRequest │
          └───────────────┘  └─────────┘        └───────┬──────┘
                                                        │
                                          ┌─────────────▼─────────────┐
                                          │   Multi-Agent System Core │
                                          │                           │
                                          │  ┌─────────────────────┐  │
                                          │  │    TaskManager      │  │
                                          │  └──────────┬─────────┘  │
                                          │             │          │
                                          │  ┌──────────▼─────────┐  │
                                          │  │  SubtaskManager   │  │
                                          │  └──────────┬─────────┘  │
                                          │             │          │
                                          │  ┌──────────▼─────────┐  │
                                          │  │   AgentManager    │  │
                                          │  └──────────┬─────────┘  │
                                          │             │          │
                                          │  ┌──────────▼─────────┐  │
                                          │  │ GitWorkflowMgr    │  │
                                          │  └──────────────────┘  │
                                          └─────────────┬─────────┘
                                                        │
                                          ┌─────────────▼─────────────┐
                                          │   Free AI Providers Pool  │
                                          │ (Groq, OpenRouter, etc.)  │
                                          └───────────────────────────┘

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
│   ├── agi_worker/   ← AgiWorkerClient (HTTP to narad.pages.dev)
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
| `/build <description>` | **NEW**: Activate Multi-Agent System to build apps/websites/solutions |
| `[file upload]` | Upload .md to refresh knowledge base |

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
| `AGI_WORKER_URL` | Optional | Default: `https://narad.pages.dev` |
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

# Sync knowledge base from nisha repo (git pull)
./scripts/sync-knowledge.sh

# Knowledge Upload (Telegram)
Attach any .md file and send to the bot.
README.md -> nisha-platform.md
Other .md -> services/<filename>.md
```

## Deployment Options

### OCI VM (Recommended Deployment)
Narad was originally designed to run on Oracle Cloud Infrastructure (OCI) Always Free VM using long-polling for Telegram updates. This is the recommended and fully tested deployment method.

#### Steps:
1. Follow the Quick Start section above
2. The bot will connect to Telegram via long-polling (no webhook setup needed)

### Cloudflare Workers Deployment (Requires Modification)
**Note**: The current implementation uses long-polling and is designed for persistent VMs. Deploying to Cloudflare Workers requires modifying the Telegram interface to handle webhooks instead of long-polling.

#### What Would Need to Change:
1. Replace `TelegramBot` (long-polling) with a webhook handler in `src/interface/bot/`
2. Update `MessageRouter` to accept HTTP requests instead of Telegram updates
3. Ensure the AGI worker endpoints are accessible from Cloudflare

#### If You Wish to Proceed with Cloudflare:
1. **Prerequisites**:
   - Cloudflare account
   - wrangler CLI installed (`npm install -g wrangler`)
   - GitHub repository for your code
   - Modified Telegram interface for webhook handling

2. **Steps**:
   - Fork or clone this repository
   - Modify the Telegram interface to handle webhook requests (see Telegram Bot API docs for webhook format)
   - Create a new Cloudflare Workers project: `wrangler init narad-cloudflare`
   - Copy your modified Narad source code
   - Configure wrangler.toml with your settings (see variables below)
   - Deploy: `wrangler deploy`
   - Set up Telegram webhook to point to `https://your-worker.your-subdomain.workers.dev`

### Variables & Secrets Reference

#### Required Environment Variables:
| Variable | Required | Description | Where to Get |
|---|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key for primary AI models | console.groq.com |
| `TELEGRAM_BOT_TOKEN` | ✅ | Telegram Bot token | @BotFather on Telegram |
| `TELEGRAM_CHAT_ID` | ✅ | Your numeric Telegram user ID | @userinfobot on Telegram |
| `OPENROUTER_API_KEY` | Optional | Fallback models (Gemini, DeepSeek) | openrouter.ai |
| `AGI_WORKER_URL` | Optional | Custom AGI worker URL | Default: https://narad.pages.dev |

#### For OCI VM Deployment:
Set these in your `.env` file (see `.env.example`)

#### For Cloudflare Deployment:
Add these to your wrangler.toml `[vars]` section or Cloudflare dashboard Secrets:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID` 
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY` (optional)
- `AGI_WORKER_URL` (optional)

#### For GitHub Actions (if using CI/CD):
Add these to your GitHub repository Secrets:
- `GROQ_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `OPENROUTER_API_KEY` (optional)
- `CLOUDFLARE_ACCOUNT_ID` (for wrangler deploy)
- `CLOUDFLARE_API_TOKEN` (for wrangler deploy)

### GitHub Actions Example (.github/workflows/deploy.yml):
```yaml
name: Deploy to Cloudflare
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run build
    - name: Deploy to Cloudflare
      uses: cloudflare/wrangler-action@2.0.0
      with:
        apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

---

## Related

- [sdachary/nisha](https://github.com/sdachary/nisha) — Main platform monorepo
- AGI worker: `services/agi/` in nisha repo
- CloudProvision: `services/cloudprovision/` in nisha repo

---

*Proprietary — Nisha Platform*
