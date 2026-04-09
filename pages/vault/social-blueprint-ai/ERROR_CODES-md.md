---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/docs/ERROR_CODES.md"
project: "social-blueprint-ai"
role: auth
language: markdown
frameworks: []
lines: 15
size: 937 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/social-blueprint-ai]
---

# ERROR_CODES.md

> Authentication / authorization module (15 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/docs/ERROR_CODES.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 15 |
| **Size** | 937 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Social Blueprint AI Error Codes

| Code | HTTP Status | Description |
|------|------------|-------------|
| `VALIDATION_ERROR` | 400 | The request input failed Zod schema validation. |
| `BAD_REQUEST` | 400 | The request is malformed or missing required parameters. |
| `UNAUTHORIZED` | 401 | Missing or invalid Bearer token. |
| `FORBIDDEN` | 403 | You do not have permission to access this resource or origin. |
| `NOT_FOUND` | 404 | The requested resource does not exist. |
| `CONFLICT` | 409 | Resource already exists (e.g., email already registered). |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests. Try again in 15 minutes. |
| `INTERNAL_ERROR` | 500 | An unexpected server error occurred. |
| `CONFIG_ERROR` | 500 | Server-side configuration is missing (e.g., API keys). |
| `AI_SERVICE_ERROR` | 502 | The upstream AI service (Gemini) returned an error. |
| `PAYMENT_ERROR` | 500 | Stripe payment session creation failed. |

```
