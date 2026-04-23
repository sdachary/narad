# Architecture: Independent Platforms + Unified Reporting

> Updated: April 2026

## Final Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                  INDEPENDENT PLATFORMS                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐          │
│   │    Karma    │    │ Vishwakarma │    │ Chitragupta │          │
│   │  (Compute) │    │  (Infra)    │    │  (Ledger)   │          │
│   ├─────────────┤    ├─────────────┤    ├─────────────┤          │
│   │ SQLite     │    │ Cloudflare │    │ Supabase   │          │
│   │ (Tasks,   │    │ KV + TF    │    │ (Tax only) │          │
│   │  Nodes)    │    │            │    │            │          │
│   └─────────────┘    └─────────────┘    └─────────────┘          │
│          │                   │                   │               │
│          │                   │                   │               │
│          └───────────────────┼─────────────────────┘               │
│                            ↓                                      │
│                  ┌─────────────────────┐                          │
│                  │   Unified Report    │                          │
│                  │   (Lightweight)     │                          │
│                  │   (Karma SQLite)    │ ← Could be PocketBase   │
│                  └─────────────────────┘                          │
│                            ↓                                      │
│                    ITR Filing                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Platform Responsibilities

### Karma (Compute Marketplace)
- **Database**: SQLite (karma.db)
- **Manages**:
  - User accounts (registration, login)
  - Node registration & heartbeats
  - Task queue (Golem/Akash for execution)
  - Earnings calculations
  - Task history
- **Sends to Chitragupta**: 
  - Monthly tax summary (total earnings, GST collected)

### Vishwakarma (Cloud Infrastructure)
- **Database**: Cloudflare KV (metadata)
- **Manages**:
  - GitHub Actions workflows (Terraform)
  - OCI provisioning
  - Client management
- **Sends to Chitragupta**:
  - Monthly cost summary (depreciation, costs)

### Chitragupta (Tax & Compliance)
- **Database**: Supabase (PostgreSQL)
- **Manages**:
  - GST calculations
  - TDS tracking
  - Form 16A generation
  - Annual tax reports
- **Receives from**:
  - Karma: earnings summary
  - Vishwakarma: cost summary

## Data Flow

### Option A: Minimal Integration (Current)

```
Karma: Task completes → Calculate earnings
        ↓
        Every night: Sync summary to Chitragupta
        (not per-task, just totals)
        ↓
Chitragupta: Add to tax report
```

### Why This Works
- Each platform has its own database
- Only summary/totals sync to Chitragupta
- No complex real-time integration
- Each platform can evolve independently

## What Needs to Be Built

### 1. Summary Sync APIs
```python
# In Karma - daily cron job
@app.cron("* 0 * * *")  # Daily at midnight
async def sync_to_chitragupta():
    summary = calculate_monthly_earnings()
    await fetch('https://chitragupta/api/v1/sync/karma', {
        method: 'POST',
        body: summary
    })
```

### 2. Unified Report Dashboard
- Simple view pulling from all 3 sources
- Could be in Chitragupta or separate page

## Migration from Current State

| What Exists | Action |
|-------------|--------|
| `chitragupta/public/_worker.js` | Simplify - keep only tax/ledger |
| `karma/backend/` | Keep as-is for task management |
| `karma/frontend/` | Keep as-is |
| New: Summary sync | Add to Karma backend |

## Why NOT Full Integration

1. **Different data models**: 
   - Karma = tasks, nodes, workers
   - Vishwakarma = OCI, Terraform, VMs
   - Chitragupta = transactions, tax

2. **Independence**: 
   - Can change one platform without breaking others

3. **Simplicity**:
   - Summary sync ≈ 10 API calls/month
   - No real-time complexity

4. **Cost**:
   - No additional database needed
   - Each platform manages its own data