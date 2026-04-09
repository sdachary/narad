---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/API_ENDPOINTS-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [vite]
lines: 104
size: 2632 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad, vite]
---

# API_ENDPOINTS-md-md.md

> Authentication / authorization module using **vite** (104 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/API_ENDPOINTS-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | vite |
| **Lines** | 104 |
| **Size** | 2632 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/chitragupta/API_ENDPOINTS-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [vite]
lines: 66
size: 1873 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad, vite]
---

# API_ENDPOINTS-md.md

> Authentication / authorization module using **vite** (66 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/chitragupta/API_ENDPOINTS-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | vite |
| **Lines** | 66 |
| **Size** | 1873 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/chitragupta/docs/API_ENDPOINTS.md"
project: "chitragupta"
role: auth
language: markdown
frameworks: [vite]
lines: 28
size: 1137 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, documentation, markdown, project/chitragupta, vite]
---

# API_ENDPOINTS.md

> Authentication / authorization module using **vite** (28 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `chitragupta/docs/API_ENDPOINTS.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | vite |
| **Lines** | 28 |
| **Size** | 1137 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Chitragupta API Endpoints

Base URL: `https://syncledger-api.vishwakarma-ops.pages.dev/api`

## Authentication
- **Headers**: All protected endpoints require `Authorization: Bearer <token>`.
- `POST /auth/signup` - Register owner and business (returns JWT)
- `POST /auth/login` - User login (returns JWT)
- `POST /auth/refresh` - Refresh JWT token

## Businesses
- `GET /businesses/:businessId` - Get business details
- `GET /businesses/:businessId/members` - List members
- `POST /businesses/:businessId/invite-partner` - Invite partner (stub)

## Transactions
- `GET /businesses/:businessId/transactions` - List transactions
- `POST /businesses/:businessId/transactions` - Create transaction
- `PUT /businesses/:businessId/transactions/:txnId` - Update transaction
- `DELETE /businesses/:businessId/transactions/:txnId` - Delete transaction

## Services
- `GET /businesses/:businessId/services` - List services
- `POST /businesses/:businessId/services` - Create service

## Settlements
- `GET /businesses/:businessId/settlements/calculate` - Calculate balances
- `POST /businesses/:businessId/settlements` - Create settlement record

```

```

```
