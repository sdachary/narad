---
project: narad
type: 
status: active
priority: medium
tags: [project/narad]
---

# Narad

> *In Hindu mythology, Narad was the omniscient messenger — always watching, always knowing, always connecting the right information to the right moment.*

Narad is a serverless Chat API and platform adapter gateway deployed on Cloudflare Pages, featuring platform-wide observability and unified connectivity across messaging platforms.

---

## What Is Narad

- **Type**: Chat API + Platform Adapter Gateway
- **Platform**: Cloudflare Pages (serverless)
- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Hono (CF Workers/Pages Functions)
- **API**: Chat completion endpoint at `/api/chat`
- **Observability**: Prometheus metrics endpoint at `/api/metrics`
- **Connectivity**: Unified platform adapter system (Telegram, WhatsApp, Slack, Teams)

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

### Backend Services
- **Hermes Gateway**: Telegram bot integration
- **Platform Adapters**: Unified messaging system (Telegram, WhatsApp, Slack, Teams)
- **Metrics**: Prometheus endpoint at `/api/metrics` for observability
- **Logging**: Structured JSON logs forwarded to Loki aggregation system

---

## API Usage

### Chat API
Access the Chat API directly:

```bash
curl -s https://narad.pages.dev/api/chat -X POST \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"hello"}]}'
```

### Metrics
Prometheus metrics are available at `/api/metrics`.

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

---

## Tech Stack

- Frontend: React 18, Tailwind CSS, Vite
- Backend: Hono (Cloudflare Pages)
- Observability: Prometheus metrics endpoint
- Logging: Structured JSON logs to Loki
- Messaging: Unified platform adapter system (Telegram, WhatsApp, Slack, Teams)
- Security: Rate limiting, CSRF protection, security headers
