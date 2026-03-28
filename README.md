# Narad v2 🔮

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is the private R&D intelligence brain and web interface for the [Nisha Platform](https://github.com/sdachary/nisha). Deployed as a serverless Cloudflare Worker. Built on Clean Architecture.

---

## ✨ What's New (March 2026)

### Security Hardening 🔐
- **XSS Prevention**: DOMPurify + safe DOM APIs
- **CSRF Protection**: Token-based validation
- **Input Validation**: Strict schema validation
- **Rate Limiting**: 10 requests/minute
- **Security Headers**: CSP, X-Frame-Options, Referrer-Policy

### Premium UI 🎨
- **Glassmorphism Design**: Modern 2025 color palette
- **SVG Usage Ring**: Animated progress indicator
- **Smooth Animations**: Message entrance, cursor blink
- **Mobile-First**: Fully responsive (320px - 1920px+)

### Monitoring & Observability 📊
- **Enhanced Health**: `/api/health` with KV, providers, rate limit checks
- **Metrics Endpoint**: `/api/metrics` with response times (avg, p95)
- **Error Tracking**: `/api/errors` with 24hr KV storage

---

## Architecture

```
                           ┌─────────────────────┐
                           │     You (Web)       │
                           └──────────┬──────────┘
                                      │
                           ┌──────────▼──────────┐
                           │  Cloudflare Worker  │
                           │ (narad-brain)       │
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
```
                            ┌─────────────────────┐
                            │     You (Web)       │
                            └──────────┬──────────┘
                                       │
                            ┌──────────▼──────────┐
                            │  Cloudflare Worker  │
                            │ (narad-brain)       │
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
```
                           ┌─────────────────────┐
                           │     You (Web)       │
                           └──────────┬──────────┘
                                      │
                           ┌──────────▼──────────┐
                           │  Cloudflare Worker  │
                           │ (narad-brain)       │
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
# 1. Clone the repository
git clone https://github.com/sdachary/narad.git ~/narad
cd ~/narad

# 2. Set up env
cp .env.example .env
nano .env   # fill in GROQ_API_KEY

# 3. Install everything
chmod +x scripts/install.sh
./scripts/install.sh

# 4. Verify
# The Cloudflare Worker is deployed via wrangler
# Access your worker at the URL provided after wrangler deploy
```

---

## Web Interface Usage

Narad is accessed through its web interface at the Cloudflare Worker URL. The interface provides:

- **Chat Interface**: Ask questions, request research, generate code, and more
- **Usage Panel**: Real-time tracking of token consumption by agent type
- **Persistent Memory**: Chat history is saved and can be cleared as needed
- **Message Management**: Ability to delete individual messages to remove clutter

### Available Commands (via chat interface):

| Command | What it does |
|---|---|
| `/ask <query>` | Direct question to the AI brain |
| `/idea <text>` | Capture and store an R&D idea |
| `/recall <query>` | Search stored memory by topic |
| `/research <topic>` | Web search + AI summary |
| `/draft <request>` | Generate docs, plans, or code |
| `/nisha` | Status of all Nisha platform services |
| `/digest` | Summary of recent R&D ideas |
| `/experiment <n>` | Look up experiment status |
| `/build <description>` | **NEW**: Activate Multi-Agent System to build apps/websites/solutions |
| `[file upload]` | Upload .md file to refresh knowledge base |

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send a message to Narad |
| `/api/health` | GET | Health status with detailed checks |
| `/api/metrics` | GET | Request counts, response times |
| `/api/usage` | GET | Token usage by agent type |
| `/api/csrf-token` | GET | Get CSRF token |
| `/api/feedback` | POST | Submit feedback on responses |
| `/api/errors` | GET | Recent errors from KV store |

---

## Scheduled Jobs

| Job | Schedule | Behavior |
|---|---|---|
| Morning Digest | 8:00 AM IST daily | System health check + ideas summary |
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

### Cloudflare Workers Deployment (Native Support)
**Note**: The current implementation now includes native Cloudflare Workers support with persistent storage via KV namespaces. The frontend has been enhanced with real-time usage tracking and persistent chat history.

#### Prerequisites:
- Cloudflare account
- wrangler CLI installed (`npm install -g wrangler`)
- GitHub repository for your code
- KV namespace named `NARAD_DATA` bound to your worker

#### Steps:
1. Fork or clone this repository
2. Create a new Cloudflare Workers project: `wrangler init narad-cloudflare`
3. Copy the contents of the `narad-brain/` directory to your Cloudflare Workers project
4. Configure wrangler.toml with your settings:
   ```toml
   name = "narad"
   main = "_worker.js"
   compatibility_date = "2024-07-29"

   [vaults]
   binding = "VAULT"

   [[kv_namespaces]]
   binding = "NARAD_DATA"
   id = "your_kv_namespace_id"

   [vars]
   GROQ_API_KEY = "your_groq_api_key_here"
   TELEGRAM_BOT_TOKEN = "your_telegram_bot_token_here"
   TELEGRAM_CHAT_ID = "your_telegram_chat_id_here"
   OPENROUTER_API_KEY = "optional_openrouter_api_key"
   AGI_WORKER_URL = "optional_custom_agi_worker_url"
   LOG_LEVEL = "info"
   PRIMARY_MODEL = "llama-3.3-70b-versatile"
   ```
5. Deploy: `wrangler deploy`
6. Set up Telegram webhook to point to `https://your-worker.your-subdomain.workers.dev`
   (The worker now handles webhook requests natively - no modification needed!)

#### Features:
- ✅ Native Cloudflare Workers support (no modifications needed)
- ✅ Persistent chat history via KV storage
- ✅ Real-time token usage tracking with limits
- ✅ Multi-agent system with specialized agents
- ✅ Zero-cost deployment on Cloudflare Workers free tier
- ✅ Enhanced UI with usage panel and message deletion capabilities

---

## Security

### Implemented Protections

| Protection | Status | Description |
|------------|--------|-------------|
| XSS Prevention | ✅ | DOMPurify + DOM APIs (no innerHTML) |
| CSRF Protection | ✅ | Token validation on all mutating endpoints |
| Input Validation | ✅ | Zod-like schemas for message, session, history |
| Rate Limiting | ✅ | 10 req/min per IP, burst limit 3 |
| Security Headers | ✅ | CSP, X-Frame-Options, Referrer-Policy |

### Testing

```bash
# Run security tests
npm run test:unit

# Run all tests
npm run test:all
```

---

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

## Testing

```bash
# Install dependencies
npm install

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests (requires Playwright)
npm run test:e2e

# Run all tests
npm run test:all
```

### Test Coverage
- **Unit Tests**: XSS prevention, input validation, rate limiting
- **Integration**: API schema validation, CSRF enforcement
- **E2E**: Chat functionality, accessibility, responsive design

---

## Related

- [sdachary/nisha](https://github.com/sdachary/nisha) — Main platform monorepo
- AGI worker: `services/agi/` in nisha repo
- CloudProvision: `services/cloudprovision/` in nisha repo

---

*Proprietary — Nisha Platform*
