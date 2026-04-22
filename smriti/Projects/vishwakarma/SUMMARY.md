# vishwakarma

> Cloud Infrastructure Provisioning on Cloudflare

## Overview

**Purpose:** Automated cloud provisioning and deployment
**Stack:** Cloudflare Workers, Ansible, Terraform, TypeScript
**URL:** https://vishwakarma.pages.dev

## Key Files

| File | Purpose |
|------|---------|
| `pages/_worker.js` | Main worker |
| `wrangler.toml` | Cloudflare config |

## APIs

- `/health` - Health check
- `/provision` - Provision resources
- `/status` - Deployment status

## Configuration

- KV: VISHWA namespace
- Triggers: GitHub Actions, manual