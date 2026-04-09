---
source: "/home/runner/work/narad/narad/sync_temp/unnati/SETUP.md"
project: "unnati"
role: config
language: markdown
frameworks: [cloudflare-workers]
lines: 72
size: 1723 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [cloudflare-workers, config, documentation, markdown, project/unnati]
---

# SETUP.md

> Configuration file for the project using **cloudflare-workers** (72 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/SETUP.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 72 |
| **Size** | 1723 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Unnati - Job Hunt Platform

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Serverless**: Cloudflare Pages
- **Database**: Supabase
- **Storage**: Supabase Storage (for resume uploads)

## Quick Setup

### 1. Database Schema Fix (Required)

If you already have a Supabase project, run this SQL to add the missing column:

```sql
-- Add missing applied_at column to applications table
ALTER TABLE applications ADD COLUMN IF NOT EXISTS applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Also ensure all required columns exist
ALTER TABLE applications ADD COLUMN IF NOT EXISTS job_hash TEXT UNIQUE;
```

### 2. Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=https://unnati.pages.dev
```

### Deploy to Cloudflare Pages

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static
```

## Service Providers Summary

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Cloudflare Pages** | Serverless hosting | 500 min/month |
| **Supabase** | PostgreSQL + Auth + Storage | 500MB DB, 1GB Storage |
| **GitHub** | Code repository | Unlimited repos |

## Project Structure

```
unnati/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── page.tsx       # Main UI
│   │   └── layout.tsx
│   ├── components/
│   └── lib/
├── career-ops/            # AI job application CLI
├── prisma/
├── public/
├── wrangler.toml
└── package.json
```

```
