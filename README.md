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
| **RAG Architecture** | Hybrid vector + keyword search (NEW) |
| **Web Search** | Serper, Firecrawl backends (NEW) |
| **MCP Connectors** | GitHub, Notion, Slack, Postgres, S3 (NEW) |
| **Truth Verification** | 0.95 threshold AI response validation (NEW) |

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
│  │ /api/chat │ /api/rag/* │ /api/search │ /api/mcp/*  │ │
│  │ /api/memory/* │ /api/verification/* │ ...          │ │
│  └─────────────────────────────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────▼────────────────────────────┐ │
│  │         Multi-Agent System (MAS) Core              │ │
│  │  TaskManager → SubtaskManager → AgentManager       │ │
│  │  Agent Warehouse (8 optimized agents)              │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│  ┌───────────────────────▼────────────────────────────┐ │
│  │              NEW: RAG & Search System              │ │
│  │  Vector Index │ Keyword Index │ Hybrid Search       │ │
│  │  Web Search (Serper/Firecrawl) │ MCP Connectors    │ │
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

## 🔍 RAG (Retrieval-Augmented Generation)

### Add Documents to Knowledge Base

```bash
curl -X POST https://narad.pages.dev/api/rag/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Project Documentation",
    "content": "This project uses Next.js 14 with TypeScript...",
    "source": "manual"
  }'
```

### Search Knowledge Base

```bash
curl -X POST https://narad.pages.dev/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How to configure the project?",
    "topK": 5,
    "hybridMode": true
  }'
```

### Get RAG Stats

```bash
curl https://narad.pages.dev/api/rag/stats
```

---

## 🌐 Web Search

### Single Provider Search

```bash
# Serper (Google)
curl -X POST https://narad.pages.dev/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "latest AI news 2026",
    "provider": "serper",
    "limit": 10
  }'

# Firecrawl
curl -X POST https://narad.pages.dev/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "react documentation",
    "provider": "firecrawl",
    "limit": 5
  }'
```

### Multi-Provider Search

```bash
curl -X POST https://narad.pages.dev/api/search/multi \
  -H "Content-Type: application/json" \
  -d '{
    "query": "cloudflare workers tutorial",
    "providers": ["serper", "firecrawl"],
    "limit": 10
  }'
```

### Scrape URL

```bash
curl -X POST https://narad.pages.dev/api/search/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/page"
  }'
```

---

## 🔗 MCP Connectors

### Connect to Services

```bash
# GitHub
curl -X POST https://narad.pages.dev/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{"connectorType": "github", "config": {}}'

# Notion
curl -X POST https://narad.pages.dev/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{"connectorType": "notion", "config": {"databaseId": "xxx"}}'

# Slack
curl -X POST https://narad.pages.dev/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{"connectorType": "slack", "config": {}}'
```

### Query Connector

```bash
curl -X POST https://narad.pages.dev/api/mcp/query \
  -H "Content-Type: application/json" \
  -d '{
    "connectorId": "github:123456789",
    "query": {"owner": "sdachary", "repo": "nisha", "query": "function"}
  }'
```

### List Available Connectors

```bash
curl https://narad.pages.dev/api/mcp/connectors
```

---

## ✅ Truth Verification

### Verify AI Response

```bash
curl -X POST https://narad.pages.dev/api/verification/verify \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is the capital of France?",
    "result": "Paris is the capital of France.",
    "threshold": 0.95
  }'
```

### Get Verification Stats

```bash
curl https://narad.pages.dev/api/verification/stats
```

### Verification History

```bash
curl "https://narad.pages.dev/api/verification/history?limit=50"
```

---

## 💾 Memory System

### Save Memory

```bash
curl -X POST https://narad.pages.dev/api/memory/save \
  -H "Content-Type: application/json" \
  -d '{
    "key": "important-note",
    "content": "User prefers dark mode",
    "type": "preference",
    "importance": 8
  }'
```

### Search Memories

```bash
curl -X POST https://narad.pages.dev/api/memory/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "preferences",
    "type": "preference",
    "limit": 10
  }'
```

### Get Memory Stats

```bash
curl https://narad.pages.dev/api/memory/stats
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
| `/api/rag/add` | POST | Add document |
| `/api/rag/search` | POST | Search RAG |
| `/api/rag/stats` | GET | RAG stats |
| `/api/search` | POST | Web search |
| `/api/search/multi` | POST | Multi-provider search |
| `/api/search/scrape` | POST | Scrape URL |
| `/api/mcp/connect` | POST | Connect MCP |
| `/api/mcp/query` | POST | Query connector |
| `/api/mcp/connectors` | GET | List connectors |
| `/api/verification/verify` | POST | Verify truth |
| `/api/verification/stats` | GET | Verification stats |
| `/api/memory/save` | POST | Save memory |
| `/api/memory/search` | POST | Search memories |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Groq API key |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram bot |
| `TELEGRAM_CHAT_ID` | Optional | Telegram chat ID |
| `OPENROUTER_API_KEY` | Optional | Fallback models |
| `SERPER_API_KEY` | Optional | Serper web search |
| `FIRECRAWL_API_KEY` | Optional | Firecrawl search/scrape |
| `AI` | Optional | Workers AI binding |

### Required for RAG
- `AI` - Workers AI binding for vector embeddings

### Required for Web Search (choose one or both)
- `SERPER_API_KEY` - Get at [serper.dev](https://serper.dev)
- `FIRECRAWL_API_KEY` - Get at [firecrawl.dev](https://firecrawl.dev)

### Required for MCP Connectors
- GitHub: `GITHUB_API_KEY`
- Notion: `NOTION_API_KEY`
- Slack: `SLACK_BOT_TOKEN`

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
