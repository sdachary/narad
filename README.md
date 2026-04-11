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

### Schema
- `/supabase/migrations`: Database schema for brain storage
- `/scripts`: Sync scripts for indexing projects

### Projects in Brain
narad, unnati, kanak, career-ops, chitragupta, vishwakarma, social-blueprint-ai

---

## Key Features

| Feature | Description |
|---------|-------------|
| Context Query | Searches knowledge before responding |
| Learn from Chat | Stores important conversations |
| Insights | View learned items via modal |
| Vector Search | Semantic search via pgvector + HNSW |
| RAG | Hybrid vector + keyword retrieval |
| Web Search | Integrated via Serper |
| Truth Verification | Validates AI responses against threshold |

---

## Commands

```
/brain              # Show brain status
/brain search <q>   # Search vault files
/brain insights     # View learned insights
/brain learn <cat> <content>  # Add new insight

/search <query>     # Web search
/last30days <topic> # Deep research
```

---

## Deployment

### Cloudflare Pages
```bash
git clone https://github.com/sdachary/narad.git
cd narad
npm install
npx wrangler pages deploy pages --project-name narad
```

### Supabase Setup
1. Create project at https://supabase.com
2. Run migrations in SQL Editor
3. Add `SUPABASE_SERVICE_KEY` to Cloudflare secrets

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Primary inference (Llama 3) |
| `ANTHROPIC_API_KEY` | Optional | Claude 3.5 Sonnet |
| `SUPABASE_SERVICE_KEY` | ✅ | Brain storage |
| `SERPER_API_KEY` | Optional | Web Search |
| `TELEGRAM_BOT_TOKEN` | Optional | Telegram connector |

---

## Tech Stack

- Frontend: React 18, Tailwind CSS, Vite
- Backend: Hono (Cloudflare)
- Storage: Supabase PostgreSQL + pgvector
- Security: Rate limiting, CSRF protection, security headers