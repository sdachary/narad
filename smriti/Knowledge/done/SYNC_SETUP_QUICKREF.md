# 🚀 Quick Setup Guide - Tomorrow

> Follow these steps in order to complete the sync setup.

---

## Generate API Keys

```bash
# Generate a secure key for sync
openssl rand -base64 32
# Example output: 
```

---

## Step 1: Configure Karma (Auto Key Rotation)

Create/edit `karma/.env`:

```bash
# Append these to karma/.env

CHITRAGUPTA_URL=https://chitragupta.pages.dev
CHITRAGUPTA_API_KEY=xK9mP2vL8nR4wQ7yT3zA1bC5dE6fG8hJ0kN2mP4qR6sT8uV0wX2yZ4
SYNC_ENABLED=true
```

> Key auto-rotates every 30 days, Karma fetches new key automatically.

---

## Step 2: Configure Chitragupta

Edit `chitragupta/wrangler.toml`:

```toml
[vars]
# Add these:
CHITRAGUPTA_SYNC_KEY=xK9mP2vL8nR4wQ7yT3zA1bC5dE6fG8hJ0kN2mP4qR6sT8uV0wX2yZ4
MAIN_ORG_ID=00000000-0000-0000-0000-000000000001
```

---

## Key Rotation

- Keys auto-rotate every 30 days
- Previous key valid for 7 days after rotation
- Karma fetches new key automatically on 401

```bash
# Manual rotate (if needed)
curl -X POST https://chitragupta.pages.dev/api/v1/sync/rotate \
  -H "Authorization: Bearer <xK9mP2vL8nR4wQ7yT3zA1bC5dE6fG8hJ0kN2mP4qR6sT8uV0wX2yZ4>"
```

---

## Step 3: Test Sync

```bash
# Terminal 1: Start Karma
cd karma
uvicorn backend.main:app --reload

# Terminal 2: Test sync
curl -X POST "http://localhost:8000/sync/summary?month=2026-04"
```

Expected response:
```json
{
  "success": true,
  "summary": {
    "month": "2026-04",
    "task_count": 0,
    "total_earnings": 0,
    "gst_collected": 0
  }
}
```

---

## Step 4: Deploy

```bash
# Deploy Karma
cd karma
npx wrangler deploy

# Deploy Chitragupta
cd ../chitragupta
npx wrangler deploy
```

---

## Step 5: Verify in Chitragupta

1. Go to: https://chitragupta.pages.dev/api/v1/compliance/report
2. Or check Supabase → transactions table

---

## Checklist

- [ ] Generated API key
- [ ] Added to karma/.env
- [ ] Added to chitragupta wrangler.toml
- [ ] Tested locally
- [ ] Deployed both
- [ ] Verified data

---

## If Issues

```bash
# Check health
curl http://localhost:8000/health
curl https://chitragupta.pages.dev/api/health

# Check sync logs in Karma
curl http://localhost:8000/sync/tax-summary
```

---

## Commands Summary

| Command | What it does |
|---------|--------------|
| `curl -X POST http://localhost:8000/sync/summary` | Run manual sync |
| `curl http://localhost:8000/sync/tax-summary` | Get tax data |
| `npx wrangler deploy` | Deploy to Cloudflare |

---

**Time estimate: 15-20 minutes**