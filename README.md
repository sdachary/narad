# Narad

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is an AI terminal assistant deployed as a serverless Cloudflare Pages app.

---

## Features

### 🤖 Multi-Agent System
8 specialized agents for different tasks:

| Agent | Icon | Use For |
|-------|------|---------|
| dev | ⚡ | Git, test, build, npm, code |
| reviewer | 🔍 | Code review, security audit |
| debugger | 🔧 | Debugging, troubleshooting |
| api | 🔌 | REST/GraphQL, endpoints |
| database | 🗄️ | SQL, queries, migrations |
| infrastructure | 🚀 | Docker, K8s, CI/CD |
| security | 🔒 | Auth, JWT, OAuth |
| writer | ✍️ | Documentation, README |

### Multi-Agent Syntax
```bash
/dev: fix this bug              # Single agent
/dev+reviewer: review this       # Parallel execution  
/chain:dev->writer->reviewer: build feature  # Sequential
```

### 🎨 Modern UI
- Syntax highlighting for code blocks
- Dark/Light theme toggle
- Keyboard shortcuts (⌘K, ⌘T, Ctrl+C)

### 🌐 Web Search
Integrated search via Serper and Firecrawl.

### 📚 Knowledge Base (RAG)
Add and search documents:
```bash
POST /api/rag/add - Add document
POST /api/rag/search - Search knowledge
GET /api/rag/stats - View stats
```

---

## Telegram Bot (Hermes Gateway)

Control Narad from Telegram:

| Command | Description |
|---------|-------------|
| `/start` | Welcome message |
| `/ask <prompt>` | Chat with Narad |
| `/status` | Service status |
| `/help` | Help |

### Setup
```bash
curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
  -d "url=https://narad-7hc.pages.dev/api/hermes-webhook"
```

---

## Smart Provider Routing

Auto-selects best AI provider by task:

| Task | Provider |
|------|----------|
| coding | anthropic |
| debugging | anthropic |
| research | gemini |
| deployment | groq |
| simple | openrouter |

---

## Quick Start

```bash
git clone https://github.com/sdachary/narad.git
cd narad
npx wrangler pages deploy pages --project-name narad
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Chat with AI |
| `/api/chat/history/:id` | GET | Chat history |
| `/api/sessions/:mode` | GET | List sessions |
| `/api/warehouse` | GET | Agent warehouse |
| `/api/skills/:name` | GET | Get skill info |
| `/api/mcp/connectors` | GET | MCP connectors |
| `/api/rag/search` | POST | Search knowledge |
| `/api/hermes-webhook` | POST | Telegram webhook |

---

## Environment Variables

| Variable | Required | Description |
|----------|-----------|-------------|
| `GROQ_API_KEY` | ✅ | Groq API key |
| `ANTHROPIC_API_KEY` | Optional | Anthropic |
| `OPENAI_API_KEY` | Optional | OpenAI |
| `GEMINI_API_KEY` | Optional | Gemini |
| `OPENROUTER_API_KEY` | Optional | OpenRouter |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram bot |

---

## Tech Stack

- **Runtime**: Cloudflare Workers/Pages
- **Framework**: Hono
- **AI**: Groq, Anthropic, OpenAI, Gemini
- **Frontend**: Vanilla JS, CSS Variables

---

## Security

- XSS Prevention (DOMPurify)
- CSRF Protection
- Rate Limiting (60 req/min)
- Security Headers (CSP, X-Frame-Options)