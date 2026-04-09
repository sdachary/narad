---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/README.md"
project: "social-blueprint-ai"
role: docs
language: markdown
frameworks: [cloudflare-workers, docker, vite]
lines: 50
size: 1401 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [cloudflare-workers, docker, docs, documentation, markdown, project/social-blueprint-ai, vite]
---

# README.md

> Documentation using **cloudflare-workers, docker, vite** (50 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/README.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker, vite |
| **Lines** | 50 |
| **Size** | 1401 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Social Blueprint AI

AI-powered social media audit and growth strategy tool built with React + Vite (frontend) and Cloudflare Workers + D1 (backend).

## Features
- **AI Audit**: Comprehensive analysis of social media profiles.
- **JWT Auth**: Secure user registration and login.
- **D1 Database**: Persistent storage for profiles and audits.
- **Growth Strategy**: AI-generated content plans and brand kits.

## Run Locally (Frontend)

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```

## Run Locally (Worker)

1. Install worker dependencies:
   ```bash
   cd worker && npm install
   ```
2. Run wrangler dev:
   ```bash
   npm run dev
   ```

## Deploy to Cloudflare (Pages + Workers + D1)

### Required Environment Variables
Set these in the Cloudflare Dashboard (Pages & Workers):

| Variable            | Description                        |
|---------------------|------------------------------------|
| `GEMINI_API_KEY`    | Google Gemini API key              |
| `JWT_SECRET`        | Secure secret for JWT signing      |
| `APP_URL`           | Frontend URL for CORS              |
| `STRIPE_SECRET_KEY` | Stripe secret key (optional)       |

### Deployment Steps
1. Push to `main` branch to trigger Cloudflare Pages build.
2. Deploy the Worker from the `worker/` directory:
   ```bash
   cd worker && npm run deploy
   ```

```
