# Narad v2

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is a private R&D intelligence brain for the [Nisha Platform](https://github.com/sdachary/nisha). Deployed as a serverless Cloudflare Worker.

---

## What's New (April 2026)

| Feature | Description |
|---------|-------------|
| **Modern UI** | Syntax highlighting, Markdown rendering, code blocks |
| **PWA Support** | Installable app, works offline |
| **Theme Toggle** | Dark/Light mode with keyboard shortcut |
| **Chat Search** | Search through messages (⌘F) |
| **Typing Indicator** | Animated dots during generation |
| **Quick Reactions** | 👍👎 feedback on responses |
| **Agent Warehouse** | 8 optimized agents for daily use |
| **Multi-Agent** | Parallel (`/dev+reviewer:`) and chains (`/chain:dev->writer:`) |
| **Voice I/O** | STT (Whisper) + TTS (MeloTTS) |
| **Image Upload** | AI analysis with `@cf/unum/uform-gen2-qwen-7b` |
| **Semantic Memory** | Workers AI embeddings with TF-IDF fallback |

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER INTERFACES                      │
│     Web UI (narad.pages.dev)  │  Telegram Bot           │
└───────────────────────────────┼─────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────┐
│              CLOUDFLARE WORKER (Serverless)             │
│  ┌─────────────────────────────────────────────────────┐ │
│  │ /api/chat │ /api/memory/* │ /api/multi-agent │ ...  │ │
│  └─────────────────────────────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────▼────────────────────────────┐ │
│  │         Multi-Agent System (MAS) Core              │ │
│  │  TaskManager → SubtaskManager → AgentManager       │ │
│  │  Agent Warehouse (8 optimized agents)              │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────▼────────────────────────────┐ │
│  │     AI Providers Pool (Fallback Chain)             │ │
│  │  Groq → OpenRouter → Mistral → Gemini             │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────▼────────────────────────────┐ │
│  │  KV Storage │ Workers AI │ Rate Limiting           │ │
│  └────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Quick Start

```bash
# Clone
git clone https://github.com/sdachary/narad.git ~/narad
cd ~/narad

# Deploy
npx wrangler pages deploy pages --project-name narad
```

---

## Features

### 🎨 Modern UI
- **Syntax Highlighting** - Code blocks with highlight.js (JS, Python, Bash, JSON, CSS, SQL)
- **Markdown Rendering** - Tables, lists, headers, formatted code
- **Theme Toggle** - Dark/Light mode (⌘T or click moon icon)
- **Responsive** - Works on desktop and mobile

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Clear chat |
| `⌘F` / `Ctrl+F` | Search messages |
| `⌘T` / `Ctrl+T` | Toggle theme |
| `Ctrl+C` | Stop generation |

### 🤖 Agent Warehouse

8 agents optimized for daily use:

| Agent | Icon | Priority | Description |
|-------|------|----------|-------------|
| dev | ⚡ | Daily | Git, test, build, npm |
| reviewer | 🔍 | Daily | Code review, security |
| debugger | 🔧 | Daily | Debugging, troubleshooting |
| api | 🔌 | Specialized | REST/GraphQL, OpenAPI |
| database | 🗄️ | Specialized | SQL, migrations |
| infrastructure | 🚀 | Specialized | Docker, K8s, CI/CD |
| security | 🔒 | Specialized | Auth, JWT, OAuth |
| writer | ✍️ | Specialized | Docs, README |

### Multi-Agent Syntax

```bash
/dev: fix this bug          # Single agent
/dev+reviewer: task         # Parallel execution
/chain:dev->writer->reviewer: build feature  # Sequential chain
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/chat` | POST | Send message |
| `/api/health` | GET | Health status |
| `/api/memory/store` | POST | Store memory |
| `/api/memory/search` | POST | Search memory |
| `/api/multi-agent` | POST | Multi-agent execution |
| `/api/usage` | GET | Token usage |
| `/api/feedback` | POST | Submit feedback |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Groq API key |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram bot |
| `TELEGRAM_CHAT_ID` | Optional | Telegram chat ID |
| `OPENROUTER_API_KEY` | Optional | Fallback models |

---

## Security

| Protection | Status |
|------------|--------|
| XSS Prevention | ✅ DOMPurify + safe DOM APIs |
| CSRF Protection | ✅ Token validation |
| Rate Limiting | ✅ 60 req/min |
| Security Headers | ✅ CSP, X-Frame-Options |

---

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Framework**: Hono
- **AI**: Groq, OpenRouter, Mistral, Gemini
- **Frontend**: Vanilla JS, CSS Variables
- **Build**: Wrangler v4

---

*Proprietary — Nisha Platform*
