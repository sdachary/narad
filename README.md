# Narad

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

Narad is a serverless AI workspace deployed on Cloudflare Pages with a Supabase-powered learning brain, featuring platform-wide observability and enhanced connectivity.

---

## What Is Narad

- **Type**: AI workspace + cognitive assistant
- **Platform**: Cloudflare Pages (serverless)
- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Hono (CF Workers/Pages Functions)
- **Observability**: Prometheus metrics endpoint at `/api/metrics`
- **Connectivity**: Unified platform adapter system (Telegram, WhatsApp, Slack, Teams)

---

## 🧠 Brain (Supabase)

Narad learns from conversations and stores knowledge in **brain**, powered by **Supabase PostgreSQL** with pgvector for semantic search and Neo4j knowledge graph for relationship mapping.

### Projects in Brain
narad, unnati, kanak, career-ops, chitragupta, vishwakarma, social-blueprint-ai

### Knowledge Graph Features
- Entity extraction from conversations (Person, Project, Concept, Tool)
- Relationship inference and storage
- Graph-powered recommendations and related content
- Path finding and similarity search
- Integration with existing RAG system

---

## 🚀 Features

### AI & Providers
| Provider | Status | Models |
|----------|--------|--------|
| Groq | ✅ Default | llama-3.1-8b-instant, llama-3.3-70b-versatile, mixtral-8x7b-32768 |
| Cerebras | ✅ | llama-3.1-8b, llama-3.3-70b, qwen3-235b |
| Cloudflare Workers AI | ✅ | @cf/meta/llama-3.1-8b-instruct, @cf/meta/llama-3.3-70b-instruct |
| OpenRouter | ✅ | google/gemma-2-9b-it:free, meta-llama/llama-3.1-70b-instruct |
| HuggingFace | ✅ | meta-llama/Llama-3.2-8B-Instruct |
| GitHub Models | ✅ | Llama-3.3-70B-Instruct, GPT-4o, DeepSeek-R1 |
| NVIDIA NIM | ✅ | meta/llama-3.1-8b-instruct, deepseek-ai/deepseek-r1 |
| OpenAI | ✅ | gpt-4o-mini, gpt-4o |
| Anthropic | ✅ | claude-3-haiku, claude-3-sonnet, claude-3-opus |
| Gemini | ✅ | gemini-1.5-flash, gemini-1.5-pro |

### Commands
| Command | Description |
|---------|-------------|
| `/spec` | Create specification (Spec Driven Development) |
| `/plan` | Create plan (Task Breakdown) |
| `/build` | Build code (Incremental Implementation) |
| `/test` | Run tests (Test Driven Development) |
| `/review` | Review code (Code Review & Quality) |
| `/code-simplify` | Simplify code (Reduce Complexity) |
| `/ship` | Ship to production (Shipping & Launch) |
| `/cerebras` | Switch to Cerebras provider |
| `/cloudflare` | Switch to Cloudflare Workers AI |
| `/groq` | Switch to Groq provider |
| `/openrouter` | Switch to OpenRouter provider |
| `/github` | Switch to GitHub Models |
| `/models` | List available models |
| `/brain` | Show brain status |
| `/brain search <q>` | Search vault files |
| `/brain insights` | View learned insights |
| `/search <query>` | Web search |
| `/last30days <topic>` | Deep research |

### Backend Services
- **Memory**: KV-based conversation memory with semantic search
- **RAG**: Hybrid vector + keyword retrieval system
- **Session Sync**: Cross-session memory persistence
- **Research**: Deep research with 30-day lookback
- **GitHub Integration**: Repository analysis and dispatch triggers
- **Skills**: MCP-compatible skill system
- **MCP**: Model Context Protocol connectors
- **Verification**: AI response truth verification
- **Hermes Gateway**: Telegram bot integration
- **Platform Adapters**: Unified messaging system (Telegram, WhatsApp, Slack, Teams)
- **Metrics**: Prometheus endpoint at `/api/metrics` for observability
- **Logging**: Structured JSON logs forwarded to Loki aggregation system

---

## Deployment

### New API Endpoints
- `GET /api/finance/insights` – Returns net‑worth, assets, liabilities and summary.
- `GET /api/portfolio/summary` – Returns portfolio total value, change, changePercent and asset list.

## Deployment

### Cloudflare Pages
```bash
git clone https://github.com/sdachary/narad.git
cd narad
npm install
npm run deploy
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Primary inference |
| `CEREBRAS_API_KEY` | Optional | Cerebras provider |
| `CF_API_TOKEN` | Optional | Cloudflare Workers AI |
| `HF_API_KEY` | Optional | HuggingFace |
| `GITHUB_TOKEN` | Optional | GitHub Models |
| `NVIDIA_API_KEY` | Optional | NVIDIA NIM |
| `OPENAI_API_KEY` | Optional | OpenAI |
| `ANTHROPIC_API_KEY` | Optional | Anthropic |
| `GEMINI_API_KEY` | Optional | Gemini |
| `OPENROUTER_API_KEY` | Optional | OpenRouter |
| `SUPABASE_SERVICE_KEY` | ✅ | Brain storage |
| `SERPER_API_KEY` | Optional | Web Search |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram connector |
| `WHATSAPP_PHONE_NUMBER_ID` | Optional | WhatsApp Business |
| `WHATSAPP_ACCESS_TOKEN` | Optional | WhatsApp Business |
| `SLACK_BOT_TOKEN` | Optional | Slack adapter |
| `SLACK_SIGNING_SECRET` | Optional | Slack adapter |
| `TEAMS_BOT_ID` | Optional | Teams adapter |
| `TEAMS_BOT_PASSWORD` | Optional | Teams adapter |
| `TEAMS_TENANT_ID` | Optional | Teams adapter |
| `PROMETHEUS_URL` | Optional | External Prometheus for federation |
| `LOKI_URL` | Optional | External Loki for log forwarding |
| `NEO4J_URI` | Optional | Neo4j connection URI |
| `NEO4J_USER` | Optional | Neo4j username |
| `NEO4J_PASSWORD` | Optional | Neo4j password |

---

## Tech Stack

- Frontend: React 18, Tailwind CSS, Vite
- Backend: Hono (Cloudflare Pages)
- Storage: Supabase PostgreSQL + pgvector (single project), Neo4j (optional)
- Observability: Prometheus metrics endpoint
- Logging: Structured JSON logs to Loki
- Messaging: Unified platform adapter system
- Security: Rate limiting, CSRF protection, security headers
- Knowledge Graph: Entity extraction and relationship mapping
