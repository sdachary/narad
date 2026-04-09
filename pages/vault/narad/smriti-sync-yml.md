---
source: "/home/runner/work/narad/narad/sync_temp/narad/.github/workflows/smriti-sync.yml"
project: "narad"
role: config
language: yaml
frameworks: [docker, github-actions]
lines: 103
size: 3723 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, docker, github-actions, project/narad, yaml]
---

# smriti-sync.yml

> Configuration file for the project using **docker, github-actions** (103 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/.github/workflows/smriti-sync.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | docker, github-actions |
| **Lines** | 103 |
| **Size** | 3723 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Smriti Brain Sync

on:
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
          if [ -f pages/smriti_graph.json ]; then
            echo "=== Smriti Graph Report ==="
            echo "Node Count: $(jq '.metadata.nodeCount // .nodes | length' pages/smriti_graph.json)"
            echo "Header Nodes: $(jq '.metadata.headerCount // 0' pages/smriti_graph.json)"
            echo "Link Count: $(jq '.metadata.linkCount // .links | length' pages/smriti_graph.json)"
            echo "Tags: $(jq '.metadata.tagCount // 0' pages/smriti_graph.json)"
            echo "Generated: $(jq -r '.metadata.generated // "N/A"' pages/smriti_graph.json)"
          fi

      - name: 🚀 Commit and Push Knowledge
        run: |
          git config --local user.email "narad-bot@github.com"
          git config --local user.name "Narad (Smriti Bot)"
          
          # Sync to web-accessible vault
          mkdir -p pages/vault
          cp -r smriti/Projects/* pages/vault/
          
          # Check for changes
          if git diff --quiet -- pages/smriti_graph.json pages/vault/; then
            echo "No changes to commit"
          else
            git add smriti/Projects/ smriti/.obsidian/graph.json pages/smriti_graph.json pages/vault/
            git commit -m "🧠 Smriti: Automated knowledge & web-vault refresh [skip ci]"
            git push
            echo "✅ Changes pushed successfully"
          fi

```
