---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/smriti-sync-yml-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker, github-actions]
lines: 183
size: 5534 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [config, docker, documentation, github-actions, markdown, project/narad]
---

# smriti-sync-yml-md.md

> Configuration file for the project using **docker, github-actions** (183 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/smriti-sync-yml-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker, github-actions |
| **Lines** | 183 |
| **Size** | 5534 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/smriti-sync-yml.md"
project: "narad"
role: config
language: markdown
frameworks: [docker, github-actions]
lines: 145
size: 4712 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, docker, documentation, github-actions, markdown, project/narad]
---

# smriti-sync-yml.md

> Configuration file for the project using **docker, github-actions** (145 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/smriti-sync-yml.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker, github-actions |
| **Lines** | 145 |
| **Size** | 4712 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/.github/workflows/smriti-sync.yml"
project: "narad"
role: config
language: yaml
frameworks: [docker, github-actions]
lines: 108
size: 3924 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, config, docker, github-actions, project/narad, yaml]
---

# smriti-sync.yml

> Configuration file for the project using **docker, github-actions** (108 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/.github/workflows/smriti-sync.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | docker, github-actions |
| **Lines** | 108 |
| **Size** | 3924 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Smriti Brain Sync

on:
  push:
    branches:
      - main
  repository_dispatch:
    types: [smriti_update]
  workflow_dispatch:
    inputs:
      mode:
        description: 'Sync mode'
        required: false
        default: 'update'
        type: choice
        options:
          - update
          - force-full

# Ensure only one sync runs at a time
concurrency:
  group: smriti-sync
  cancel-in-progress: false

jobs:
  sync:
    runs-on: ubuntu-latest
    if: github.event_name == 'push' || github.event_name == 'workflow_dispatch'
    steps:
      - name: 🛰️ Checkout Narad
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.SMRITI_SYNC_TOKEN }}
          persist-credentials: true

      - name: 🐍 Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'

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
          
          # Generate Knowledge Graph JSON (incremental mode by default)
          echo "--- Generating Knowledge Map ---"
          MODE="${{ github.event.inputs.mode }}"
          if [ "$MODE" = "force-full" ]; then
            echo "Forcing full regeneration..."
            python3 smriti/Scripts/generate_graph.py --force-full
          else
            echo "Running incremental update..."
            python3 smriti/Scripts/generate_graph.py --update
          fi

      - name: 📊 Generate Stats Report
        run: |
          # Extract metadata from generated graph
          if [ -f smriti/smriti_graph.json ]; then
            echo "=== Smriti Graph Report ==="
            echo "Node Count: $(jq '.metadata.nodeCount // .nodes | length' smriti/smriti_graph.json)"
            echo "Header Nodes: $(jq '.metadata.headerCount // 0' smriti/smriti_graph.json)"
            echo "Link Count: $(jq '.metadata.linkCount // .links | length' smriti/smriti_graph.json)"
            echo "Tags: $(jq '.metadata.tagCount // 0' smriti/smriti_graph.json)"
            echo "Generated: $(jq -r '.metadata.generated // "N/A"' smriti/smriti_graph.json)"
          fi

      - name: 🚀 Commit and Push Knowledge
        run: |
          git config --local user.email "narad-bot@github.com"
          git config --local user.name "Narad (Smriti Bot)"
          
          # Sync to web-accessible vault (smaller than full graph files)
          mkdir -p pages/vault
          cp -r smriti/Projects/* pages/vault/
          
          # Check for changes in smriti projects and vault only
          # (smriti_graph.* are gitignored to avoid Pages 25MB limit)
          if git diff --quiet -- smriti/ pages/vault/; then
            echo "No changes to commit"
          else
            git add smriti/Projects/ smriti/.obsidian/graph.json pages/vault/
            git commit -m "🧠 Smriti: Automated knowledge sync [skip ci]"
            git push
            echo "✅ Changes pushed successfully"
          fi
```

```

```
