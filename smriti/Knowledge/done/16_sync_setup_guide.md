# Sync Setup Implementation Guide

> Independent Platforms Sync Setup for Karma → Chitragupta

**Status**: Ready for implementation  
**Last Updated**: April 21, 2026

---

## Prerequisite: What You Need First

| Item | Where to Get |
|------|--------------|
| Supabase URL | Supabase Dashboard → Settings → API |
| Supabase Anon Key | Supabase Dashboard → Settings → API |
| CHITRAGUPTA_SYNC_KEY | Generate locally (see below) |

---

## Step 1: Create Supabase Tables

1. Go to [supabase.com](https://supabase.com) → Your project → SQL Editor
2. Copy contents from `Znext/supabase_schema.sql`
3. Click **Run**

Expected output: Tables created successfully

---

## Step 2: Generate Sync Key

```bash
# Generate a secure key
openssl rand -base64 32
```

Copy the output - this is your `CHITRAGUPTA_SYNC_KEY`

---

## Step 3: Configure Karma (Key Auto-Rotation Enabled)

Create `/home/deepak/Work/karma/.env`:

```bash
# Chitragupta Sync
CHITRAGUPTA_URL=https://chitragupta.pages.dev
CHITRAGUPTA_API_KEY=<your-generated-key>
SYNC_ENABLED=true
```

> **Note**: Key auto-rotates every 30 days. Karma will automatically fetch new key if 401.

---

## Step 4: Configure Chitragupta

Edit `/home/deepak/Work/chitragupta/wrangler.toml`:

```toml
[vars]
CHITRAGUPTA_SYNC_KEY=<your-generated-key>
MAIN_ORG_ID=00000000-0000-0000-0000-000000000001
```

Also add to `.dev.vars` for local testing:

```bash
CHITRAGUPTA_SYNC_KEY=<your-generated-key>
MAIN_ORG_ID=00000000-0000-0000-0000-000000000001
```

---

## Step 5: Start Services

```bash
# Terminal 1: Karma backend
cd karma
uvicorn backend.main:app --reload

# Terminal 2: Chitragupta (local)
cd chitragupta
npx wrangler dev
```

---

## Step 6: Test Sync

```bash
# Trigger sync from Karma
curl -X POST http://localhost:8000/sync/summary
```

Expected response:
```json
{
  "success": true,
  "synced": true,
  "summary": {
    "month": "2026-04",
    "task_count": 47,
    "total_earnings": 3420.00,
    "total_commission": 684.00,
    "gst_collected": 123.12
  }
}
```

---

## Step 7: Verify in Supabase

```sql
-- Check transactions table
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;

-- Check sync logs
SELECT * FROM sync_logs ORDER BY synced_at DESC LIMIT 5;
```

---

## Step 8: Deploy

```bash
# Deploy Karma
cd karma
npm run build
npx wrangler deploy

# Deploy Chitragupta
cd chitragupta
npx wrangler deploy
```

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| 401 Unauthorized | Keys don't match - check both .env and wrangler.toml |
| Table not found | Run supabase_schema.sql in SQL Editor first |
| No data in sync | Run some tasks in Karma first to generate earnings |

---

## Files Changed

| File | Action |
|------|--------|
| `karma/.env` | Create with sync config |
| `karma/backend/main.py` | Already has /sync endpoints |
| `karma/backend/services/sync_service.py` | Already exists |
| `chitragupta/wrangler.toml` | Add sync key |
| `chitragupta/public/_worker.js` | Already has sync接收 endpoints |

---

## Architecture Summary

```
Karma                 Chitragupta              Supabase
   │                      │                      │
   │  POST /sync/summary   │                      │
   │─────────────────────>│                      │
   │                      │  INSERT transactions │
   │                      │────────────────────>│
   │                      │                      │
   │                      │  ←── Monthly tax summary for ITR filing
```

- **What syncs**: Monthly summary (commission + GST), NOT user transactions
- **Why**: Tax compliance only, keep platforms independent
- **When**: Daily at 11:59 PM (configure cron later)

Good night! 🌙