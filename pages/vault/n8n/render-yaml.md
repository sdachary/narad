---
project: "n8n"
type: 
status: active
priority: medium
tags: [code, config, project/n8n, yaml]
source: "/home/deepak/Work/n8n/render.yaml"
role: config
language: yaml
frameworks: []
lines: 50
size: 1519 bytes
last_modified: "2026-03-10 12:06"
scanned: "2026-04-07 10:16"
---

# render.yaml

> Configuration file for the project (50 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `n8n/render.yaml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | — |
| **Lines** | 50 |
| **Size** | 1519 bytes |
| **Modified** | 2026-03-10 12:06 |

## 🔗 Related Files

—

## 📄 Content

```yaml
services:
  - type: web
    name: n8n-sovereign
    env: docker
    plan: free
    region: ohio 
    dockerContext: .
    image:
      url: docker.io/n8nio/n8n:latest
    dockerCommand: n8n start
    envVars:
      - key: N8N_PORT
        value: 10000
      - key: PORT
        value: 10000
      - key : N8N_ENCRYPTION_KEY
        value: KOfrwSiy67AVcikrqotEqospdu6CkPOk
      - key: WEBHOOK_URL
        value: https://n8n-sovereign.onrender.com/ 
      # DATABASE: Connecting to Supabase
      - key: N8N_SOURCECONTROL_ENABLED 
        value: "true"
      - key: N8N_VERSION_NOTIFICATIONS_ENABLED
        value: "true"
      - key: DB_TYPE
        value: postgresdb
      - key: DB_POSTGRESDB_HOST
        value: aws-1-ap-southeast-2.pooler.supabase.com
      - key: DB_POSTGRESDB_PORT
        value: 6543
      - key: DB_POSTGRESDB_USER
        value: postgres.lpyatghqeqnbcnedregw
      - key: DB_POSTGRESDB_PASSWORD
        value: 4ZprEopEeZ7Ht52o
      - key: DB_POSTGRESDB_DATABASE
        value: postgres
      - key: DB_POSTGRESDB_SCHEMA
        value: n8n
      
      # SOURCE CONTROL: Auto-sync with GitHub
      - key: N8N_SOURCECONTROL_REPO_URL
        value: https://github.com/sdachary/n8n-automated-backup.git
      - key: N8N_SOURCECONTROL_HTTPS_USER
        value: sdachary
      - key: N8N_SOURCECONTROL_HTTPS_TOKEN
        value: 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
      - key: N8N_SOURCECONTROL_BRANCH
        value: main
      - key: N8N_SOURCECONTROL_PULL_ON_STARTUP
        value: "true"

```
