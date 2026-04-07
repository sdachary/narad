---
source: "/home/deepak/Work/unnati/README.md"
project: "unnati"
role: docs
language: markdown
frameworks: []
lines: 67
size: 2532 bytes
last_modified: "2026-04-07 17:52"
scanned: "2026-04-07 17:52"
tags: [docs, documentation, markdown, project/unnati]
---

# README.md

> Documentation (67 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/README.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 67 |
| **Size** | 2532 bytes |
| **Modified** | 2026-04-07 17:52 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Unnati AI Job Hunter 🚀

Unnati is a fully automated, zero-cost AI job hunting platform built with **Next.js 15**, **Supabase**, and **Cloudflare Pages**. It discovers jobs using the **Adzuna API** and automatically applies to them using a **Hugging Face Playwright Worker**.

---

## 🛠 Project Structure

- **`/src/app`**: The Next.js frontend and Edge-compatible API routes.
- **`/src/lib`**: Supabase client and shared utilities.
- **`/docker`**: The "Apply Worker" source code for deployment on Hugging Face.

---

## 🔐 Environment Variables (Registry)

You must set these variables in your **Cloudflare Dashboard** AND your **Hugging Face Space**.

| Variable | Source | Required For |
| :--- | :--- | :--- |
| `SUPABASE_URL` | Supabase Dashboard | Database Connectivity |
| `SUPABASE_ANON_KEY` | Supabase Dashboard | Database Authentication |
| `OPENROUTER_API_KEY` | OpenRouter | AI Resume/Cover Letter Refinement |
| `ADZUNA_APP_ID` | Adzuna Developers | Job Search Discovery |
| `ADZUNA_APP_KEY` | Adzuna Developers | Job Search Discovery |

---

## 🚀 Deployment Guide

### Phase 1: The Dashboard (Cloudflare Pages)
1. **Fork this repository** to your GitHub account.
2. Go to **Cloudflare Pages** and click "Connect to Git."
3. Select the `unnati` repository.
4. **Build Settings**:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npm run pages:build`
   - **Output Directory**: `.vercel/output/static`
   - **Compatibility Flag**: `nodejs_compat` (Mandatory)
5. Add all **Environment Variables** in the Cloudflare Settings tab.

### Phase 2: The Database (Supabase)
1. Create a `user_profiles` table for your preferences.
2. Create an `applications` table for job tracking.
3. **Important**: Add a UNIQUE constraint on `job_url` in the `applications` table to prevent duplicates.

### Phase 3: The Runner (Hugging Face Spaces)
1. Go to [Hugging Face Spaces](https://huggingface.co/new-space).
2. Create a new Space with **Docker SDK**.
3. Upload the contents of the `/docker` folder:
   - `Dockerfile`
   - `worker.js`
   - `package.json`
4. Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `OPENROUTER_API_KEY` to the Space Secrets.

---

## 📈 Usage

1. **Dashboard**: Upload your resume and set your Job Roles/Location.
2. **Toggle Hunt**: Switch the "Automatic Hunt" toggle to **ON**.
3. **Sit Back**: The system will now scan for jobs every few hours and start the application process automatically!

---

## ⚖️ License
MIT - Created with ❤️ by Nisha Orchestrator & The Unnati Team.

```
