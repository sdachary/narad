---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/smriti-sync-yml-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [github-actions]
lines: 183
size: 4663 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, github-actions, markdown, project/narad]
---

# smriti-sync-yml-md-md.md

> Configuration file for the project using **github-actions** (183 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/smriti-sync-yml-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | github-actions |
| **Lines** | 183 |
| **Size** | 4663 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/smriti-sync-yml-md.md"
project: "narad"
role: config
language: markdown
frameworks: [github-actions]
lines: 145
size: 3864 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, documentation, github-actions, markdown, project/narad]
---

# smriti-sync-yml-md.md

> Configuration file for the project using **github-actions** (145 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/smriti-sync-yml-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | github-actions |
| **Lines** | 145 |
| **Size** | 3864 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/smriti-sync-yml.md"
project: "narad"
role: config
language: markdown
frameworks: [github-actions]
lines: 107
size: 3074 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [config, documentation, github-actions, markdown, project/narad]
---

# smriti-sync-yml.md

> Configuration file for the project using **github-actions** (107 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/smriti-sync-yml.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | github-actions |
| **Lines** | 107 |
| **Size** | 3074 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/.github/workflows/smriti-sync.yml"
project: "narad"
role: config
language: yaml
frameworks: [github-actions]
lines: 69
size: 2321 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, config, github-actions, project/narad, yaml]
---

# smriti-sync.yml

> Configuration file for the project using **github-actions** (69 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/.github/workflows/smriti-sync.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | github-actions |
| **Lines** | 69 |
| **Size** | 2321 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Smriti Brain Sync

on:
  repository_dispatch:
    types: [smriti_update]
  workflow_dispatch:

# Ensure only one sync runs at a time
concurrency:
  group: smriti-sync
  cancel-in-progress: false

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: 🛰️ Checkout Narad
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.SMRITI_SYNC_TOKEN }}
          persist-credentials: true

      - name: 🐍 Set up Python
        uses: actions/setup-python@v5
        with:
          python_version: '3.10'

      - name: 🔄 Sync External Projects
        run: |
          mkdir -p sync_temp
          
          # 1. Sync self (Narad) - Copying local files to avoid cloning again
          # Exclude smriti/ and sync_temp/ to avoid infinite recursion
          echo "--- Syncing self (Narad) ---"
          mkdir -p sync_temp/narad
          rsync -av . sync_temp/narad/ --exclude smriti/ --exclude sync_temp/ --exclude .git/
          
          cd sync_temp
          
          # 2. Sync others
          REPOS=("vishwakarma" "chitragupta" "social-blueprint-ai" "unnati" "indra" "kanak")
          
          for repo in "${REPOS[@]}"; do
            echo "--- Syncing $repo ---"
            git clone --depth 1 "https://x-access-token:${{ secrets.SMRITI_SYNC_TOKEN }}@github.com/sdachary/$repo.git" || echo "Failed to clone $repo, skipping..."
          done
          
          cd ..
          
          # Run the refiner (pointing to the temp sync dir)
          export SMRITI_SOURCE_DIR=$(pwd)/sync_temp
          python3 smriti/Scripts/enhance_notes.py
          
          # Generate Knowledge Graph JSON
          echo "--- Generating Knowledge Map ---"
          python3 smriti/Scripts/generate_graph.py

      - name: 🚀 Commit and Push Knowledge
        run: |
          git config --local user.email "narad-bot@github.com"
          git config --local user.name "Narad (Smriti Bot)"
          
          # Sync to web-accessible vault
          mkdir -p pages/vault
          cp -r smriti/Projects/* pages/vault/
          
          git add smriti/Projects/ smriti/.obsidian/graph.json pages/smriti_graph.json pages/vault/
          git commit -m "🧠 Smriti: Automated knowledge & web-vault refresh [skip ci]" || echo "No changes to commit"
          git push

```

```

```

```
