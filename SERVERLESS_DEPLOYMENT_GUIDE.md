# Narad Serverless Deployment Guide

This guide will help you deploy Narad as a serverless application using Cloudflare Workers, Convex, and Qdrant, configured entirely through environment variables (zero code changes needed for deployment).

## Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌────────────────────┐
│   Telegram      │    │ Cloudflare       │    │   Convex/          │
│   Webhook       │───▶│ Workers          │    │   Qdrant           │
└─────────────────┘    │ (Main App)       │    │   (Memory/Vector)  │
                       └─────────┬────────┘    └──────────┬────────┘
                                 │                        │
                   ┌─────────────▼────────┐    ┌──────────▼────────┐
                   │ Cloudflare R2        │    │ Cloudflare        │
                   │ (Knowledge Storage)  │    │ Cron Triggers     │
                   └──────────────────────┘    └───────────────────┘
                                 ▲                        ▲
                                 │                        │
                           ┌─────┴─────┐            ┌─────┴─────┐
                           │ Narad-    │            │ Other     │
                           │ brain     │◄───────────┤ Services  │
                           │ (CF Pages)│            │           │
                           └───────────┘            └───────────┘
```

## Services to Sign Up For

| Service | Purpose | Free Tier | Setup Required |
|---------|---------|-----------|----------------|
| **Cloudflare Workers** | Main application logic | 100k requests/day | Account + API token |
| **Convex** | Primary database (replaces SQLite) | 1M function invocations/month | Project + deployment key |
| **Qdrant Cloud** | Vector memory/storage (replaces file-based knowledge) | 1GB storage, 10M vectors | Cluster + API key |
| **Cloudflare Pages** | Already have (narad-brain - AGI worker) | 500 builds/month | Already configured |

## Step-by-Step Deployment

### 1. Prerequisites
- npm installed
- wrangler CLI installed: `npm install -g wrangler`
- Accounts created for all services above

### 2. Service Setup

#### Cloudflare Workers
```bash
# Login to Cloudflare
wrangler login

# Create Worker project structure (already done in serverless/ directory)
cd narad/serverless
wrangler init . --site ./public  # If you have static assets
```

#### Convex Database
1. Go to [convex.dev](https://www.convex.dev/) and create account
2. Create new project
3. Note down:
   - Deployment URL (e.g., `your-project.convex.cloud`)
   - Access key (from Settings → General)

#### Qdrant Cloud
1. Go to [cloud.qdrant.io](https://cloud.qdrant.io/) and create account
2. Create new cluster (free tier)
3. Note down:
   - Cluster URL (e.g., `your-cluster.cloud.qdrant.io`)
   - API key
   - Create collection named `narad_memory` (vector size 1536 for OpenAI embeddings)

#### Telegram Bot
1. Talk to @BotFather on Telegram
2. Use `/setwebhook` to set your webhook URL:
   ```
   https://your-worker.your-subdomain.workers.dev/telegram/webhook/<YOUR_BOT_TOKEN>
   ```
3. Get your bot token and chat ID (from @userinfobot)

### 3. Configure Environment Variables

#### In Cloudflare Workers Dashboard:
1. Go to Workers & Pages → Your Worker Service → Settings → Variables
2. Add these secrets:

```
# Core Services (REQUIRED)
CONVEX_DEPLOYMENT_URL=your-project.convex.cloud
CONVEX_ACCESS_KEY=your-convex-access-key
QDRANT_URL=your-cluster.cloud.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=narad_memory

# AI Services (REQUIRED - you likely have these)
GROQ_API_KEY=your-groq-key-from-console.groq.com
TELEGRAM_BOT_TOKEN=your-telegram-bot-token-from-BotFather
TELEGRAM_CHAT_ID=your-telegram-chat-id-from-userinfobot

# Optional Enhancements
OPENAI_API_KEY=your-openai-key  # For advanced features (optional)
LOG_LEVEL=info
AGI_WORKER_URL=https://narad-7hc.pages.dev  # Your existing narad-brain
```

### 4. Directory Structure for Deployment
Your `narad/serverless` directory should look like this:

```
narad/serverless/
├── src/
│   ├── index.js              # Cloudflare Worker entry point
│   ├── infrastructure/       # Service adapters
│   │   ├── memory/
│   │   │   ├── ConvexMemoryStore.js
│   │   │   └── QdrantKnowledgeLoader.js
│   │   ├── telegram/
│   │   │   └── TelegramWebhookHandler.js
│   │   └── scheduler/
│   │       └── CloudflareCronAdapter.js
│   └── application/          # Your existing use cases (copied from main)
├── narad-brain/              # Keep as reference (already deployed)
├── wrangler.toml             # Cloudflare Workers config
└── .env.example              # Template for local development
```

### 5. Deployment

#### Local Testing
```bash
# From narad/serverless directory
wrangler dev  # Tests locally with live reload
```

#### Production Deployment
```bash
wrangler publish  # Deploys to Cloudflare Workers
```

### 6. Verification

After deployment:
1. Visit `https://your-worker.your-subdomain.workers.dev/health` should return `{"status":"ok"}`
2. Send a message to your Telegram bot - it should respond
3. Check Cloudflare Workers logs for any errors

## Security Considerations

✅ **Secrets Management**: All sensitive values are stored as Cloudflare Worker secrets, never in code
✅ **Principle of Least Privilege**: Each service only gets the permissions it needs
✅ **Network Security**: All communication happens over HTTPS/TLS
✅ **Input Validation**: Telegram webhook includes signature verification
✅ **No Data Leaks**: Error messages don't expose internal details or secrets

## Files Created for Serverless Version

The following files have been created in the `serverless/` directory:

1. `src/index.js` - Main Cloudflare Worker entry point
2. `src/infrastructure/memory/ConvexMemoryStore.js` - Convex-based memory store
3. `src/infrastructure/memory/QdrantKnowledgeLoader.js` - Qdrant-based knowledge loader
4. `src/infrastructure/telegram/TelegramWebhookHandler.js` - Telegram webhook handler
5. `src/infrastructure/scheduler/CloudflareCronAdapter.js` - Cloudflare Cron adapter
6. `wrangler.toml` - Cloudflare Workers configuration
7. `.env.example` - Template for local development environment variables

## Cleanup Recommendations

The following files/folders can be safely removed from the main repository as they're either:
- Duplicated/obsolete guides
- Node modules documentation (shouldn't be in repo anyway)
- Old migration documents superseded by this serverless approach

```
# Safe to remove:
MIGRATION.md
MAS_UPGRADE_ROADMAP.md
SERVERLESS_MIGRATION_PLAN.md
./narad-brain/node_modules/*/README.md
./narad-brain/node_modules/*/changelog.md
./narad-brain/node_modules/*/History.md
./narad-brain/node_modules/*/CHANGELOG.md
./narad-brain/node_modules/*/LICENSE.md
./narad-brain/node_modules/*/LICENSES
./narad-brain/node_modules/*/SECURITY.md
```

## Development Workflow

1. Make changes to application logic in `src/application/` (your existing use cases)
2. Test locally with `wrangler dev`
3. Deploy with `wrangler publish`
4. Monitor logs in Cloudflare dashboard
5. Update environment variables as needed through dashboard (no redeploy required for env var changes)

## Going Beyond - J.A.R.V.I.S.-Style Features

Once the base serverless deployment is working, you can incrementally add:

1. **Personal Knowledge Base**: Upload your documents/notes to Qdrant
2. **Voice Interface**: Use Telegram voice notes → speech-to-text → Narad → text-to-speech
3. **Proactive Assistance**: Use Convex to store preferences, habits, calendar events
4. **Environment Control**: Extend GitWorkflowManager to control smart home devices
5. **Learning System**: Fine-tune responses based on your interaction patterns

All these can be added without changing the deployment model - just add new environment variables and enhance the existing adapters.

---

**Note**: Your existing `narad-brain` on Cloudflare Pages continues to work as the AGI worker - no changes needed there. This deployment replaces only the main Narad application with a serverless equivalent.