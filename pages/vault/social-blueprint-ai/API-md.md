---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/docs/API.md"
project: "social-blueprint-ai"
role: auth
language: markdown
frameworks: []
lines: 76
size: 1401 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/social-blueprint-ai]
---

# API.md

> Authentication / authorization module (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/docs/API.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 76 |
| **Size** | 1401 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Social Blueprint AI API Documentation

## Base URL
`https://social-blueprint-worker.your-subdomain.workers.dev/api/v1`

## Authentication
All protected endpoints require a Bearer token in the `Authorization` header.
`Authorization: Bearer <your_jwt_token>`

## Public Endpoints

### 1. Health Check
`GET /health`
Returns system status.

### 2. Google OAuth URL
`GET /auth/google/url`
Returns the Google OAuth consent URL.

### 3. Google OAuth Callback
`GET /auth/google/callback`
Handles the code exchange and redirects back to the app.

### 4. Login
`POST /auth/login`
**Rate Limited:** 5 attempts per 15 mins.
**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### 5. Register
`POST /auth/register`
**Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

## Protected Endpoints

### 1. Profiles
`GET /profiles?page=1&limit=20`
Returns a paginated list of social media profiles.

`POST /profiles`
Create a new profile.
**Body:**
```json
{
  "platform": "Instagram",
  "handle": "username",
  "followers": 1500,
  "engagement_rate": 4.5
}
```

### 2. Audits
`GET /audits/:profileId`
Returns the latest audit results for a profile.

`POST /audits`
Save a new audit result.

### 3. AI Analysis
`POST /ai/analyze`
Invoke Gemini AI for custom analysis.

### 4. Payments
`POST /create-checkout-session`
Create a Stripe Checkout session.

```
