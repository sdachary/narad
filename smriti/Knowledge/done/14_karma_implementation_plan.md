# Karma Implementation Plan

> Standalone deployment ready for integration with Vishwakarma

**Document Status**: Draft v1.0  
**Last Updated**: April 2026

---

## 1. Current State

### Frontend (karma/frontend/)
| Page | Status | Description |
|------|--------|-------------|
| `index.html` | ✅ Complete | Landing page with hero, flow, wallet |
| `dashboard.html` | ✅ Complete | Dashboard with stats, tasks, node status |
| `wallet.html` | ✅ Complete | Earnings, transactions, payout |
| `setup.html` | ✅ Complete | Node setup guide |

### Backend (karma/backend/)
| Endpoint | Status | Description |
|----------|--------|-------------|
| `/auth/*` | ✅ Working | Registration, login |
| `/nodes/*` | ✅ Working | Node management |
| `/tasks/*` | ✅ Working | Task queue |
| `/earnings/*` | ✅ Working | Earnings engine |

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND                       │
├─────────────────────────────────────────────────────────────────┤
│  index.html    → Landing page (SEO, marketing)          │
│  dashboard.html → User dashboard (protected)      │
│  wallet.html  → Earnings & payouts (protected) │
│  setup.html   → Node setup guide               │
└────────────────────────────────────────────────┘
                          │
                          ▼ API
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND                        │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI (Python) → karam.backend.main            │
│                                                   │
│  /auth      → User registration & login            │
│  /nodes    → Node registration & heartbeat       │
│  /tasks    → Task creation & completion         │
│  /earnings → Earnings calculation             │
└────────────────────────────────────────────────┘
                          │
                          ▼ Database
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE                      │
├─────────────────────────────────────────────────────────────────┤
│  SQLite (dev) → karma.db                        │
│  PostgreSQL (prod) → Supabase                  │
└────────────────────────────────────────────────┘
```

---

## 3. Deployment Configuration

### Phase 1: Standalone Deployment

**Frontend**: Cloudflare Pages
- Build: `None` (static HTML)
- Output: `karma/frontend`

**Backend**: Cloudflare Workers or Python container
- Entry: `backend/main.py`
- Port: `8000`

### Phase 2: Integration Ready

**Shared Components**:
- Single sign-on (Supabase Auth)
- Common API gateway
- Unified dashboard

---

## 4. Implementation Checklist

### Week 1: Core Infrastructure
- [ ] Set up Cloudflare Pages for frontend
- [ ] Deploy FastAPI backend
- [ ] Configure SQLite database
- [ ] Test auth flow end-to-end

### Week 2: Node Agent
- [ ] Create node registration flow
- [ ] Implement heartbeat mechanism
- [ ] Add task queue integration
- [ ] Test task completion flow

### Week 3: Payments
- [ ] Integrate UPI payment gateway
- [ ] Implement escrow model
- [ ] Add TDS calculation
- [ ] Create payout request flow

### Week 4: QA & Launch
- [ ] Security audit
- [ ] Load testing
- [ ] Documentation
- [ ] Go live

---

## 5. API Endpoints

### Authentication
```
POST /auth/register    → Create account
POST /auth/login     → Get JWT token
POST /auth/refresh  → Refresh token
```

### Nodes
```
POST   /nodes/register    → Register node
GET    /nodes/status    → Get node status
POST   /nodes/heartbeat → Update heartbeat
DELETE /nodes/:id       → Deactivate node
```

### Tasks
```
POST   /tasks/create     → Create task
GET    /tasks/next    → Get next task
POST   /tasks/:id/complete → Mark complete
POST   /tasks/:id/fail   → Mark failed
```

### Earnings
```
GET  /earnings/balance → Get balance
GET  /earnings/history → Get history
POST /earnings/withdraw → Request payout
```

---

## 6. Integration Points

### Vishwakarma Bridge

When integrating with Vishwakarma:

```
┌─────────────────────────────────────────────────────────────┐
│                   KARMA PLATFORM (Phase 1)                 │
│                                                             │
│   Users → Task → Queue → Node → Result → Payment              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│               VISHWAKARMA (Phase 2)                       │
│                                                             │
│   Nodes: OCI VMs, self-owned, contributors                 │
│   Integration: API bridge, shared auth, pool                │
└─────────────────────────────────────────────────────────────┘
```

### Bridge API
```python
# vishwakarma → karma integration
POST /bridge/submit-task    → Submit task to karma queue
GET  /bridge/node-status   → Get node availability
POST /bridge/allocate    → Allocate compute
```

---

## 7. Environment Variables

### Required for Backend
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
ENCRYPTION_KEY=base64-key
GROQ_API_KEY=groq-api-key
TELEGRAM_BOT_TOKEN=bot-token
```

### Required for Frontend (optional)
```
VITE_API_URL=/api
VITE_WS_URL=ws://localhost:8000
```

---

## 8. Security

### Implemented
- End-to-end encryption for task payloads
- JWT authentication
- Rate limiting
- Input validation

### Required
- AWS WAF for DDoS
- Cloudflare Access for dashboard
- Audit logging

---

## 9. Monitoring

### Metrics
- `karma_api_requests_total` - API requests
- `karma_job_count_total` - Task counts by status
- `karma_compute_time_seconds` - Compute time
- `karma_wallet_balance` - User balances

### Dashboards
- API performance
- Node health
- Earnings/spending

---

## 10. Rollback Plan

If issues occur:
1. Cloudflare Pages → Revert to previous deployment
2. Backend → Cloudflare Rollback
3. Database → Point to backup

---

## 11. Future: vishwakarma Integration

### Phase 2 Tasks
1. Create bridge API for task routing
2. Add shared authentication
3. Pool internal nodes with external
4. Implement trust-based routing

### Integration Checklist
- [ ] Single auth (Supabase)
- [ ] API gateway
- [ ] Internal node discovery
- [ ] Trust score integration
- [ ] Load balancing

---

## Appendix: Quick Commands

```bash
# Local development
cd karma/frontend && npx serve

# Backend
cd karma && uvicorn backend.main:app --reload

# Deploy frontend
npx wrangler pages deploy karma/frontend

# Deploy backend
npx wrangler deploy karma/backend/main.py
```