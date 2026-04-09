---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/RUNBOOK-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 79
size: 1836 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad]
---

# RUNBOOK-md.md

> Documentation (79 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/RUNBOOK-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 79 |
| **Size** | 1836 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/docs/platform/RUNBOOK.md"
project: "vishwakarma"
role: docs
language: markdown
frameworks: []
lines: 41
size: 1150 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/vishwakarma]
---

# RUNBOOK.md

> Documentation (41 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/docs/platform/RUNBOOK.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 41 |
| **Size** | 1150 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Incident Response Runbook

## Service Is Down (503/504)
1. Check status page: https://www.cloudflarestatus.com/
2. Check Cloudflare dashboard for errors
3. Check Sentry for exceptions
4. Check if secrets are configured
5. Rollback last deployment if needed
6. Alert team in Slack

## High Error Rate (>1%)
1. Check Sentry dashboard
2. Identify common error pattern
3. Check if external service down (Supabase, Qdrant, etc.)
4. Look at recent deploys - rollback if needed
5. Fix in code and redeploy

## Slow Responses (>5s)
1. Check Cloudflare Analytics → Cache
2. Check database query performance
3. Check if rate limiting is too aggressive
4. Look for N+1 queries
5. Add caching if needed

## Database Connection Failed
1. Verify connection string is correct
2. Check if database is up
3. Check firewall rules
4. Try reconnecting
5. Failover to replica if available

## Out of Memory
1. Check if KV namespace is full
2. Clean up old sessions
3. Increase worker memory if possible
4. Optimize code for memory usage

## Escalation
- Page on-call engineer: [contact]
- Notify stakeholders: status page update
- Post mortem after incident resolved

```

```
