# Narad

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is a modern AI workspace and cognitive assistant deployed as a serverless Cloudflare Pages app with a self-learning brain.

---

## Features

### 🧠 Self-Learning Brain (Smriti)

Narad learns from conversations and stores knowledge:

| Feature | Description |
|---------|-------------|
| Auto-index | Indexes vault files on first use |
| Context query | Searches knowledge before responding |
| Learn from chat | Stores important conversations |
| Insights | View learned items in modal |

**Commands (in Chat):**
```bash
/brain              # Show brain status
/brain search <q>   # Search vault files
/brain insights     # View learned insights in modal
```

**Projects in Brain:** narad, vishwakarma, chitragupta, indra, smriti

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
/dev+reviewer: review this     # Parallel execution  
/chain:dev->writer->reviewer: build feature  # Sequential
```

### 🎨 Serene Workspace UI
- **Modern Aesthetic**: Clean, Claude-inspired "Serene" layout with a focus on whitespace and legibility.
- **Centered Thread**: Focused chat environment with centered message bubbles.
- **Glassmorphism**: Backdrop blur and translucency in header and input pill.
- **Responsive Shell**: Collapsible sidebar drawer with smooth transitions for mobile and desktop.
- **Syntax Highlighting**: Beautiful code blocks with high contrast.
- **Dual Themes**: Hand-crafted Light and Dark modes.
- **Keyboard Shortcuts**: (⌘K - Clear, ⌘T - Theme, Ctrl+C - Stop, / - Commands).

### 🌐 Web Search
Integrated search via Serper and Firecrawl.

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
# Clone the repository
git clone https://github.com/sdachary/narad.git
cd narad

# Install dependencies
npm install

# Build the project (React frontend + Hono backend)
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

*Deployment via GitHub Actions: Pushing to the `main` branch triggers an automatic build and deployment.*

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
| `/api/brain/stats` | GET | Brain status |
| `/api/brain/search` | GET | Search vault |
| `/api/brain/insights` | GET | View insights |
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

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Hono (Cloudflare Workers/Pages Functions)
- **AI Engine**: Groq (Llama 3), Anthropic (Claude 3.5), OpenAI, Gemini
- **Storage**: Cloudflare Workers KV (Session storage & RAG index)
- **Styling**: Modern "Serene" Design System (Light/Dark glassmorphism)
- **Security**: DOMPurify, CSRF tokens, Rate Limiting

---

## Security

- XSS Prevention (DOMPurify)
- CSRF Protection
- Rate Limiting (60 req/min)
- Security Headers (CSP, X-Frame-Options)