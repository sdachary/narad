# Narad

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

Narad is a serverless AI workspace deployed on Cloudflare Pages with a Supabase-powered learning brain.

---

## What Is Narad

- **Type**: AI workspace + cognitive assistant
- **Platform**: Cloudflare Pages (serverless)
- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Hono (CF Workers/Pages Functions)

---

## 🧠 Brain (Supabase)

Narad learns from conversations and stores knowledge in **brain**, powered by **Supabase PostgreSQL** with pgvector for semantic search.

### Projects in Brain
narad, unnati, kanak, career-ops, chitragupta, vishwakarma, social-blueprint-ai

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

---

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

---

## Tech Stack

- Frontend: React 18, Tailwind CSS, Vite
- Backend: Hono (Cloudflare Pages)
- Storage: Supabase PostgreSQL + pgvector
- Security: Rate limiting, CSRF protection, security headers
