---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/docs/DEPLOYMENT.md"
project: "chitragupta"
role: docs
language: markdown
frameworks: [cloudflare-workers, vite]
lines: 62
size: 2158 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [cloudflare-workers, docs, documentation, markdown, project/chitragupta, vite]
---

# DEPLOYMENT.md

> Documentation using **cloudflare-workers, vite** (62 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/docs/DEPLOYMENT.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, vite |
| **Lines** | 62 |
| **Size** | 2158 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Chitragupta: Unified Cloudflare Deployment Guide

Chitragupta is now a **unified Cloudflare Pages project**. This means your Frontend (Vite) and Backend (Hono Worker) are deployed together as a single unit.

## 1. Prerequisites
- [x] A [Cloudflare account](https://dash.cloudflare.com/sign-up).
- [x] Code pushed to your **GitHub repository**.
- [x] [Supabase project](https://supabase.com/) credentials.

---

## 2. Deploy to Cloudflare Pages

1.  **Create New Project**:
    - Go to **Workers & Pages** > **Create** > **Pages** > **Connect to Git**.
    - Select your repository.
2.  **Build Settings**:
    - **Project Name**: `chitragupta` (or your preferred name).
    - **Root Directory**: `services/syncledger`
    - **Framework Preset**: `Vite`
    - **Build Command**: `npm install && npm run build`
    - **Build Output Directory**: `dist`
3.  **Environment Variables**:
    Go to **Settings > Variables > Production** and add:
    
    | Variable Name | Description | Example |
    | :--- | :--- | :--- |
    | `VITE_API_URL` | Frontend API endpoint | `/api` (or fully qualified URL) |
    | `SUPABASE_URL` | Your Supabase Project URL | `https://xyz.supabase.co` |
    | `SUPABASE_ANON_KEY` | Supabase Public Key | `your-anon-key` |
    | `SUPABASE_SERVICE_ROLE_KEY`| Supabase Service Key | `your-service-role-key` |
    | `SUPABASE_SCHEMA` | (Optional) Private Schema | `public` (default) |
    | `JWT_SECRET` | Secure Random String | `openssl rand -base64 32` |
    | `JWT_REFRESH_SECRET` | Secure Random String | `openssl rand -base64 32` |

    > [!IMPORTANT]
    > For the **Backend** to work, you MUST set all `SUPABASE_*` and `JWT_*` variables in the Pages Dashboard. These are inherited by the `_worker.js` function.

4.  **Finish**: Click **Save and Deploy**.

---

## 🛠️ Development & Local Testing

To run the entire platform locally:
```bash
cd services/syncledger
npm install
npm run dev
```

To test the production build locally with Wrangler:
```bash
npm run build
npx wrangler pages dev dist
```

---

## 🛡️ Security
- Enable **Row Level Security (RLS)** in Supabase.
- Never commit your `.env` files or share secrets.

```
