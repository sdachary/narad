---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/API.md"
project: "vishwakarma"
role: auth
language: markdown
frameworks: [typescript]
lines: 57
size: 1447 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [auth, documentation, markdown, project/vishwakarma, typescript]
---

# API.md

> Authentication / authorization module using **typescript** (57 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/API.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 57 |
| **Size** | 1447 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# API Documentation

## Services

### AGI Nexus API
Base URL: `https://vishwakarma-agi.pages.dev/api`

**POST /chat**
Send a message to the AGI.
- Request: `{ message: string, session_id?: string }`
- Response: `{ reply: string, session_id: string }`
- Errors: 400 (invalid input), 500 (thinking/connect error)

**GET /health**
Service health check.
- Response: `{ status: "ok", service: "agi-nexus", checks: {...} }`
- Status: 200 (ok), 503 (error)

---

### SyncLedger API
Base URL: `https://syncledger.pages.dev/api`

**POST /auth/login**
Authenticate user.
- Request: `{ email: string, password: string }`
- Response: `{ token: string, refreshToken: string, user: {...} }`
- Errors: 401 (invalid credentials), 429 (too many attempts)

**POST /businesses/:id/transactions**
Create ledger transaction.
- Headers: `Authorization: Bearer <token>`
- Request: `{ type: "income|expense|...", amount: number, ... }`
- Response: `{ id: string, ... }`
- Errors: 401 (unauthorized), 400 (invalid input)

**GET /health**
Service health check.
- Response: `{ status: "ok", service: "syncledger", checks: {...} }`

---

### Cloud Provisioning API
Base URL: `https://vishwakarma.pages.dev/api`

**GET /health**
Service health check.
- Response: `{ status: "ok", service: "vishwakarma" }`

---

### Gold SaaS Shield API
Base URL: `https://gold-saas.pages.dev`

**GET /health**
Service health check.
- Response: `{ status: "ok", service: "gold-saas-shield" }`

```
