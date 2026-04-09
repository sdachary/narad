---
source: "/home/runner/work/narad/narad/sync_temp/narad/DEPLOYMENT.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers, docker, github-actions]
lines: 101
size: 3524 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [cloudflare-workers, docker, docs, documentation, github-actions, markdown, project/narad]
---

# DEPLOYMENT.md

> Documentation using **cloudflare-workers, docker, github-actions** (101 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/DEPLOYMENT.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker, github-actions |
| **Lines** | 101 |
| **Size** | 3524 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Narad Cloud-First Deployment Guide

This guide details how to deploy the Narad Neural Workspace to Cloudflare Pages with full GitHub Actions integration for the "Zero-Laptop" development experience.

---

## ☁️ 1. Cloudflare Pages Setup

### 📦 Deployment
1.  Clone the repository and enter the directory.
2.  Deploy the `pages/` directory:
    ```bash
    npx wrangler pages deploy pages --project-name narad
    ```

### 🗄️ Persistence (KV)
Narad uses Cloudflare KV for cross-device session synchronization.
1.  Go to the **Cloudflare Dashboard** > **Workers & Pages** > **KV**.
2.  Create a new namespace named `NARAD_DATA`.
3.  In your Pages project settings, go to **Settings** > **Functions** > **KV namespace bindings**.
4.  Bind `NARAD_DATA` to the `NARAD_DATA` namespace you created.

### 🤖 AI Workers Binding
1.  In your Pages project settings, go to **Settings** > **Functions** > **AI bindings**.
2.  Add a binding named `AI`.

### 🔑 Environment Variables
Add these under **Settings** > **Variables and Secrets**:

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | (Required) Primary inference for Narad |
| `SMRITI_SYNC_TOKEN` | GitHub PAT with `repo` scope for background tasks |
| `SERPER_API_KEY` | Required for `/search` and `/last30days` |
| `FIRECRAWL_API_KEY` | (Optional) For high-fidelity web scraping |
| `ENVIRONMENT` | Set to `production` |
| `PRIMARY_MODEL` | Set to `llama-3.3-70b-versatile` |

---

## 🐙 2. GitHub Integration

### 🛡️ Repository Secrets
For the "Cloud Builder" and "Smriti Sync" to work, you must add secrets to your Narad repository:
1.  Go to **Settings** > **Secrets and variables** > **Actions**.
2.  Add `SMRITI_SYNC_TOKEN`: Your Personal Access Token (Classic) with `repo` permissions.

### 🏗️ Background Builder (narad-builder.yml)
To enable the `/build` command, you need a workflow in your repository (or target repository) that listens for the `narad_build` event.

**Example `.github/workflows/narad-builder.yml`**:
```yaml
name: Narad Cloud Builder
on:
  repository_dispatch:
    types: [narad_build]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Architect Project
        run: |
          mkdir -p projects/${{ github.event.client_payload.projectName }}
          echo "Architecting: ${{ github.event.client_payload.prompt }}"
          # Add logic to call AI or script to generate files
      - name: Commit & Push
        run: |
          git config user.name "Narad Neural Kernel"
          git config user.email "narad@sdachary.org"
          git add .
          git commit -m "build: architected ${{ github.event.client_payload.projectName }}"
          git push
```

---

## 🔄 3. Smriti Sync (Multi-Repo)
To sync knowledge from other repositories into Narad:
1.  Add the `SMRITI_SYNC_TOKEN` to your other repo as well.
2.  Add a workflow to the other repo:
    ```yaml
    on: [push]
    jobs:
      sync:
        runs-on: ubuntu-latest
        steps:
          - run: |
              curl -X POST https://api.github.com/repos/YOUR_USER/narad/dispatches \
              -H "Authorization: token ${{ secrets.SMRITI_SYNC_TOKEN }}" \
              -d '{"event_type": "smriti_update"}'
    ```

---

## ✅ Post-Deployment Verification
- Open your Narad URL (`https://narad.pages.dev`).
- Type `/health` to verify service status.
- Try `/last30days AI Agents` to test the research engine.
- Create a new session in the sidebar to test KV persistence.

```
