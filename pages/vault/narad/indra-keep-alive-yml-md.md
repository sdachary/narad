---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/indra/indra-keep-alive-yml.md"
project: "narad"
role: config
language: markdown
frameworks: [github-actions]
lines: 53
size: 1103 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, github-actions, markdown, project/narad]
---

# indra-keep-alive-yml.md

> Configuration file for the project using **github-actions** (53 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/indra/indra-keep-alive-yml.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | github-actions |
| **Lines** | 53 |
| **Size** | 1103 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/indra/.github/workflows/indra-keep-alive.yml"
project: "indra"
role: config
language: yaml
frameworks: [github-actions]
lines: 15
size: 337 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [code, config, github-actions, project/indra, yaml]
---

# indra-keep-alive.yml

> Configuration file for the project using **github-actions** (15 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `indra/.github/workflows/indra-keep-alive.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | github-actions |
| **Lines** | 15 |
| **Size** | 337 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Indra Keep-Alive

on:
  schedule:
    - cron: '*/7 * * * *' # Every 7 minutes
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Indra
        run: |
          curl -s https://indra.onrender.com/healthz || curl -s https://indra.onrender.com/
          echo "Ping sent to Indra at $(date)"

```

```
