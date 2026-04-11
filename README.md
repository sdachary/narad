# Narad

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

**Narad** is a modern AI workspace and cognitive assistant deployed as a serverless Cloudflare Pages app with a self-learning brain.

---

## 🧠 Self-Learning Brain (Smriti)

Narad learns from conversations and stores knowledge in **Smriti** (also known as NeuBrain), a local-first repository for structured knowledge and project tracking.

### Repository Goals
- **Portability**: Standard Markdown content with minimal tool dependence.
- **Automation**: Scripts for scanning local work and auto-generating summaries.
- **Privacy**: Local-first by design.

### Structure
- `/Inbox`: Catch-all for new, unfiled notes and quick captures.
- `/Knowledge`: Permanent notes and structured knowledge.
- `/Projects`: Sub-projects with auto-generated indexes.
- `/Scripts`: Maintenance and enrichment tools.

### Features
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

---

## 🤖 Multi-Agent System

Narad uses specialized agents for different tasks. You can trigger them using specific syntax:

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

---

## 🚀 Key Features

### 1. RAG (Retrieval-Augmented Generation)
Hybrid search combining vector embeddings + keyword matching for better knowledge retrieval.
- **Setup**: Ensure `AI` binding is configured in `wrangler.toml`.
- **Usage**: Use `/api/rag/add` to index and `/api/rag/search` to retrieve.

### 2. Web Search
Integrated search via Serper (Google) and Firecrawl.
- **Commands**: `/search <query>`
- **Research**: `/last30days <topic>` for deep research.

### 3. MCP Connectors
Connect to external services (GitHub, Notion, Slack, etc.) via the Model Context Protocol.

### 4. Truth Verification
Verify AI responses against a truth threshold (0.95 by default) before returning to the user.

### 5. Memory System
Persistent SQLite-style memory for conversations, messages, and long-term memories.

---

## 🎨 Serene Workspace UI
- **Modern Aesthetic**: Clean, Claude-inspired "Serene" layout.
- **Centered Thread**: Focused chat environment.
- **Glassmorphism**: Backdrop blur and translucency.
- **Dual Themes**: Hand-crafted Light and Dark modes.
- **Keyboard Shortcuts**: 
  - `⌘K`: Clear chat
  - `⌘T`: Toggle theme
  - `⌘F`: Search
  - `/`: Command palette
  - `Ctrl+C`: Stop processing

---

## ☁️ Deployment Guide

### Cloudflare Pages Setup
1. **Clone & Install**:
   ```bash
   git clone https://github.com/sdachary/narad.git
   cd narad
   npm install
   ```
2. **Deploy**:
   ```bash
   npx wrangler pages deploy pages --project-name narad
   ```
3. **KV Persistence**: Bind a KV namespace named `NARAD_DATA` to your Pages project.
4. **AI Workers Binding**: Add an AI binding named `AI` in your Pages settings.

### GitHub Integration
Add `SMRITI_SYNC_TOKEN` (GitHub PAT with `repo` scope) to your repository secrets to enable background sync and cloud builder features.

---

## 🔌 Connectors Setup

### Telegram Bot (Hermes Gateway)
1. Create a bot via [@BotFather](https://t.me/botfather).
2. Set `TELEGRAM_BOT_TOKEN` in Cloudflare secrets.
3. Configure your numeric ID in `connectors.js` under `allowedUsers`.
4. Set webhook:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
     -d "url=https://your-app.pages.dev/api/hermes-webhook"
   ```

### Discord Bot
1. Create an app in the [Discord Developer Portal](https://discord.com/developers/applications).
2. Enable **Message Content Intent**.
3. Set `DISCORD_BOT_TOKEN` in Cloudflare secrets.
4. Configure `serverMappings` in `connectors.js`.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|-----------|-------------|
| `GROQ_API_KEY` | ✅ | Primary inference (Llama 3) |
| `ANTHROPIC_API_KEY` | Optional | Claude 3.5 Sonnet |
| `GEMINI_API_KEY` | Optional | Gemini 1.5 Pro/Flash |
| `OPENAI_API_KEY` | Optional | GPT-4o / GPT-4o-mini |
| `OPENROUTER_API_KEY` | Optional | Routing to various models |
| `SERPER_API_KEY` | Optional | Web Search functionality |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram integration |
| `SMRITI_SYNC_TOKEN` | Optional | Knowledge synchronization |

---

## 🛠️ Tech Stack & Security

- **Frontend**: React 18, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Hono (Cloudflare Workers/Pages Functions)
- **Storage**: Cloudflare Workers KV & SQLite (D1)
- **Security**: 
  - XSS Prevention (DOMPurify)
  - CSRF Protection (Token-based)
  - Rate Limiting (60 req/min)
  - Security Headers (CSP, X-Frame-Options, HSTS)

---
*Created and maintained by the Narad Neural Kernel.*
