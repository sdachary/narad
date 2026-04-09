---
source: "/home/runner/work/narad/narad/sync_temp/indra/render.yaml"
project: "indra"
role: config
language: yaml
frameworks: []
lines: 53
size: 1582 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [code, config, project/indra, yaml]
---

# render.yaml

> Configuration file for the project (53 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `indra/render.yaml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | — |
| **Lines** | 53 |
| **Size** | 1582 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```yaml
services:
  - type: web
    name: indra
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
      - key: N8N_ENCRYPTION_KEY
        # value: [REPLACED_FOR_SECURITY_DURING_MIGRATION]
        sync: true
      - key: WEBHOOK_URL
        value: https://indra.onrender.com/ 
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
        # value: [REPLACED_FOR_SECURITY_DURING_MIGRATION]
        sync: true
      - key: DB_POSTGRESDB_DATABASE
        value: postgres
      - key: DB_POSTGRESDB_SCHEMA
        value: n8n
      
      # SOURCE CONTROL: Auto-sync with GitHub
      - key: N8N_SOURCECONTROL_REPO_URL
        value: https://github.com/sdachary/indra.git
      - key: N8N_SOURCECONTROL_HTTPS_USER
        value: sdachary
      - key: N8N_SOURCECONTROL_HTTPS_TOKEN
        # value: [REPLACED_FOR_SECURITY_DURING_MIGRATION]
        sync: true
      - key: N8N_SOURCECONTROL_BRANCH
        value: main
      - key: N8N_SOURCECONTROL_PULL_ON_STARTUP
        value: "true"

```
