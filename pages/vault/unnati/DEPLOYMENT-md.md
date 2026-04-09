---
source: "/home/runner/work/narad/narad/sync_temp/unnati/DEPLOYMENT.md"
project: "unnati"
role: docs
language: markdown
frameworks: []
lines: 20
size: 428 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/unnati]
---

# DEPLOYMENT.md

> Documentation (20 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/DEPLOYMENT.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 20 |
| **Size** | 428 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Deployment Guide

## Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `.vercel/output/static`
4. Add environment variables in Settings:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_APP_URL`

## Verify Deployment

```bash
# Health check
curl https://unnati-70z.pages.dev/api/health

# Should return: {"status":"ok",...}
```
```
