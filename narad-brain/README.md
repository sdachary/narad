# Narad Brain

Standalone intelligence for the Nisha Platform. Cloudflare Worker + Pages.

## Quick Start

```bash
cd narad-brain
npx wrangler pages deploy pages --project-name narad
```

## Structure

```
narad-brain/
├── pages/           # Worker + UI
│   ├── _worker.js   # Main worker
│   ├── app.js       # Frontend JS
│   ├── index.html   # UI
│   └── style.css    # Styles
└── warehouse/       # Agent configs
```

## Configuration

Set secrets in Cloudflare dashboard:
- `GROQ_API_KEY`
- `OPENROUTER_API_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

See [CLOUDFLARE_SETUP.md](./CLOUDFLARE_SETUP.md) for details.
