---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/FEATURES.md"
project: "vishwakarma"
role: auth
language: markdown
frameworks: [docker]
lines: 296
size: 7244 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [auth, docker, documentation, markdown, project/vishwakarma]
---

# FEATURES.md

> Authentication / authorization module using **docker** (296 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/FEATURES.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 296 |
| **Size** | 7244 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Vishwakarma Features Guide

This document details how to enable and use each new feature in Vishwakarma.

---

## 1. Swarm Orchestration

### What it does
Coordinate multiple specialized agents for complex deployment workflows using different topologies (mesh, hierarchical, ring, star).

### Setup
No additional setup required - uses existing KV namespace.

### Usage
```bash
# Get swarm status
curl https://vishwakarma.pages.dev/api/swarm/status

# Execute single task
curl -X POST https://vishwakarma.pages.dev/api/swarm/execute \
  -H "Content-Type: application/json" \
  -d '{
    "task": {
      "type": "infrastructure",
      "action": "plan",
      "workspace": "production"
    },
    "options": {
      "parallel": false,
      "topology": "hierarchical"
    }
  }'

# Execute workflow
curl -X POST https://vishwakarma.pages.dev/api/swarm/workflow \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "steps": [
        {"name": "plan", "agents": ["terraform"]},
        {"name": "scan", "agents": ["security"]},
        {"name": "deploy", "agents": ["cicd"]}
      ],
      "parallel": false
    }
  }'
```

### Available Topologies
| Topology | Use Case |
|----------|----------|
| `hierarchical` | Sequential approval flow |
| `mesh` | All agents work in parallel |
| `ring` | Round-robin task distribution |
| `star` | Central coordinator + workers |

---

## 2. Deployment Agents

### What it does
13 specialized agents for different deployment tasks.

### Setup
No additional setup required.

### Usage
```bash
# List all agents
curl https://vishwakarma.pages.dev/api/agents

# Get specific agent
curl https://vishwakarma.pages.dev/api/agents/terraform
```

### Agent Details

| Agent | Role | Best For |
|-------|------|----------|
| terraform | Infrastructure | OCI provisioning |
| github | Repository | PRs, releases |
| security | Security | Scans, audits |
| cicd | Automation | Build/deploy |
| database | Data | Migrations |
| monitoring | Observability | Dashboards |
| docker | Container | Images |
| kubernetes | Orchestration | K8s deployments |
| backup | Data | Backups |
| network | Infrastructure | DNS, VPN |
| ssl | Security | Certificates |
| dns | Infrastructure | DNS records |
| oci | Infrastructure | OCI resources |

---

## 3. MLE-STAR Workflow

### What it does
Machine Learning Engineering via Search and Targeted Refinement - optimizes ML workflows and automates agent selection.

### Setup
Add to Cloudflare dashboard > Vishwakarma > Settings:
- `GROQ_API_KEY` - For LLM-based optimization

### Usage
```bash
# Run ML optimization
curl -X POST https://vishwakarma.pages.dev/api/mle-star/run \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "dataset": "data.csv",
      "target": "accuracy",
      "features": ["cpu", "memory"]
    },
    "options": {
      "maxIterations": 10,
      "useLLM": true
    }
  }'

# Run auto-agent (automatic agent selection)
curl -X POST https://vishwakarma.pages.dev/api/auto-agent/run \
  -H "Content-Type: application/json" \
  -d '{
    "complexity": "enterprise",
    "options": {"timeout": 300000}
  }'

# Run custom workflow
curl -X POST https://vishwakarma.pages.dev/api/workflow/run \
  -H "Content-Type: application/json" \
  -d '{
    "workflow": {
      "steps": [
        {"name": "build", "agent": "cicd", "action": "build"},
        {"name": "test", "agent": "cicd", "action": "test"},
        {"name": "deploy", "agent": "cicd", "action": "deploy"}
      ]
    },
    "options": {"failFast": true}
  }'
```

---

## 4. RBAC (Role-Based Access Control)

### What it does
Granular permissions for different user roles with session management.

### Setup
No additional setup - uses existing KV namespace.

### Roles
| Role | Permissions |
|------|-------------|
| `admin` | Full access (*) |
| `operator` | provision, monitor, backup, restore |
| `viewer` | view |
| `client` | self_service, view |

### Usage
```bash
# List roles
curl https://vishwakarma.pages.dev/api/rbac/roles

# Check permission
curl -X POST https://vishwakarma.pages.dev/api/rbac/check \
  -H "Content-Type: application/json" \
  -d '{"role": "operator", "permission": "provision"}'

# Create session
curl -X POST https://vishwakarma.pages.dev/api/auth/session \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user@example.com",
    "role": "client",
    "expiresIn": 86400
  }'

# Response includes token for subsequent requests
```

---

## 5. SSO Integration

### What it does
Single Sign-On via Google OAuth or OIDC.

### Setup
Add to Cloudflare dashboard:
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- Or `OIDC_*` variables for generic OIDC

### Usage
```bash
# Setup SSO
curl -X POST https://vishwakarma.pages.dev/api/sso/setup \
  -H "Content-Type: application/json" \
  -d '{
    "provider": "google",
    "clientId": "xxx.apps.googleusercontent.com",
    "clientSecret": "xxx",
    "authorizedDomains": ["example.com"],
    "roleMapping": {"example.com": "client"}
  }'

# Login flow redirects to Google OAuth
# After successful auth, creates session automatically
```

---

## 6. Whitelabeling

### What it does
Customize appearance per client - colors, logos, CSS.

### Setup
No additional setup - uses existing KV namespace.

### Usage
```bash
# Get default theme
curl https://vishwakarma.pages.dev/api/whitelabel/config

# Get client theme
curl https://vishwakarma.pages.dev/api/whitelabel/client/acme-corp

# Set client theme
curl -X POST https://vishwakarma.pages.dev/api/whitelabel/client/acme-corp \
  -H "Content-Type: application/json" \
  -d '{
    "primaryColor": "#ff6b35",
    "secondaryColor": "#1a1a2e",
    "accentColor": "#00d4ff",
    "companyName": "Acme Cloud",
    "logoUrl": "https://acme.com/logo.png",
    "customCSS": ".btn-primary { border-radius: 12px; }"
  }'
```

### Theme Variables
| Variable | Description |
|----------|-------------|
| `primaryColor` | Main brand color |
| `secondaryColor` | Background color |
| `accentColor` | Highlight color |
| `companyName` | Custom company name |
| `logoUrl` | Logo image URL |
| `faviconUrl` | Favicon URL |
| `supportEmail` | Support email |
| `customCSS` | Additional CSS |

---

## Environment Variables Summary

| Variable | Required | Feature |
|----------|----------|---------|
| `GROQ_API_KEY` | Yes (for AI) | Brahma AI, MLE-STAR |
| `GITHUB_PAT` | Yes (for provisioning) | GitHub Actions |
| `RESEND_API_KEY` | No | Email notifications |
| `R2_*` | No | Backup/Restore |
| `QDRANT_*` | No | Vector memory |
| `GOOGLE_CLIENT_*` | No | SSO |
| `OIDC_*` | No | SSO |
| `ADMIN_PASSWORD` | Yes | Admin access |

---

## Troubleshooting

### Swarm execution fails
- Check all agents are registered: `/api/swarm/status`
- Verify task type matches agent capabilities

### RBAC returns unauthorized
- Ensure session token is included in requests
- Check role has required permission

### SSO login fails
- Verify client ID/secret are correct
- Check authorized domains include user's email domain

### Whitelabel not applying
- Ensure client ID matches exactly
- Clear browser cache after changes

### MLE-STAR times out
- Reduce `maxIterations`
- Increase timeout in options

```
