---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/deploy-yml-md.md"
project: "narad"
role: config
language: markdown
frameworks: [cloudflare-workers, github-actions, vite]
lines: 125
size: 2991 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [cloudflare-workers, config, documentation, github-actions, markdown, project/narad, vite]
---

# deploy-yml-md.md

> Configuration file for the project using **cloudflare-workers, github-actions, vite** (125 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/deploy-yml-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, github-actions, vite |
| **Lines** | 125 |
| **Size** | 2991 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/social-blueprint-ai/deploy-yml.md"
project: "narad"
role: config
language: markdown
frameworks: [cloudflare-workers, github-actions, vite]
lines: 87
size: 2087 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [cloudflare-workers, config, documentation, github-actions, markdown, project/narad, vite]
---

# deploy-yml.md

> Configuration file for the project using **cloudflare-workers, github-actions, vite** (87 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/social-blueprint-ai/deploy-yml.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, github-actions, vite |
| **Lines** | 87 |
| **Size** | 2087 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/.github/workflows/deploy.yml"
project: "social-blueprint-ai"
role: config
language: yaml
frameworks: [cloudflare-workers, github-actions, vite]
lines: 49
size: 1189 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [cloudflare-workers, code, config, github-actions, project/social-blueprint-ai, vite, yaml]
---

# deploy.yml

> Configuration file for the project using **cloudflare-workers, github-actions, vite** (49 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/.github/workflows/deploy.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | cloudflare-workers, github-actions, vite |
| **Lines** | 49 |
| **Size** | 1189 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Deploy Social Blueprint AI

on:
  push:
    branches: [main, master]
  pull_request:
    branches: [main, master]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Frontend Dependencies
        run: npm ci

      - name: Lint Frontend
        run: npm run lint

      - name: Build Frontend
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Install Worker Dependencies
        run: npm ci --prefix worker

      - name: Deploy Worker
        if: github.event_name == 'push'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          workingDirectory: 'worker'
          command: deploy

      - name: Deploy Pages
        if: github.event_name == 'push'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=social-blueprint-ai

```

```

```
