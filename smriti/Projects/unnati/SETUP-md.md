---
source: "/home/deepak/Work/unnati/SETUP.md"
project: "unnati"
role: config
language: markdown
frameworks: [cloudflare-workers]
lines: 139
size: 3610 bytes
last_modified: "2026-04-07 00:25"
scanned: "2026-04-07 00:25"
tags: [cloudflare-workers, config, documentation, markdown, project/unnati]
---

# SETUP.md

> Configuration file for the project using **cloudflare-workers** (139 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/SETUP.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers |
| **Lines** | 139 |
| **Size** | 3610 bytes |
| **Modified** | 2026-04-07 00:25 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Unnati - Job Hunt Platform

## Tech Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Serverless**: Cloudflare Pages
- **Database**: Supabase (dedicated schema: `unnati`)
- **Storage**: Supabase Storage (for resume uploads)

## Setup Guide

### 1. Database Setup (Supabase)

**Option A: Dedicated Schema (Recommended)**
```sql
-- Run this in your existing Supabase SQL Editor
-- Creates a dedicated 'unnati' schema for your job hunt app

-- Create schema
CREATE SCHEMA IF NOT EXISTS unnati;

-- Create tables in unnati schema
CREATE TABLE IF NOT EXISTS unnati.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unnati.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES unnati.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  job_title TEXT NOT NULL,
  job_url TEXT,
  status TEXT DEFAULT 'APPLIED',
  resume_url TEXT,
  cover_letter TEXT,
  notes TEXT,
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS unnati.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES unnati.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE unnati.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE unnati.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE unnati.resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own data" ON unnati.users
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own applications" ON unnati.applications
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own resumes" ON unnati.resumes
  FOR ALL USING (auth.uid() = user_id);
```

### 2. Storage Setup
1. Go to Supabase Dashboard → Storage
2. Create new bucket: `unnati-resumes`
3. Add policy for authenticated users to upload/download

### 3. Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App
NEXT_PUBLIC_APP_URL=https://unnati.pages.dev
```

### 4. Deploy to Cloudflare Pages

```bash
# Install dependencies
npm install

# Build the app
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy .vercel/output/static
```

### 5. GitHub Repository

Create a repository and push your code:

```bash
cd /home/deepak/Work/unnati
git init
git add .
git commit -m "Initial commit: Unnati job hunt platform"

# Create repo on GitHub and add remote
git remote add origin https://github.com/yourusername/unnati.git
git branch -M main
git push -u origin main
```

Then connect the repo to Cloudflare Pages in the dashboard.

## Service Providers Summary

| Service | Purpose | Free Tier |
|---------|---------|-----------|
| **Cloudflare Pages** | Serverless hosting | 500 min/month, unlimited sites |
| **Supabase** | PostgreSQL + Auth + Storage | 500MB DB, 1GB Storage, 50k MAU |
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
