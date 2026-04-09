---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/DATA_CONTRACT-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 137
size: 4039 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, docker, documentation, markdown, project/narad]
---

# DATA_CONTRACT-md-md.md

> Configuration file for the project using **docker** (137 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/DATA_CONTRACT-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 137 |
| **Size** | 4039 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/career-ops/DATA_CONTRACT-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 99
size: 3271 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, docker, documentation, markdown, project/narad]
---

# DATA_CONTRACT-md.md

> Configuration file for the project using **docker** (99 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/career-ops/DATA_CONTRACT-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 99 |
| **Size** | 3271 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/career-ops/DATA_CONTRACT.md"
project: "career-ops"
role: config
language: markdown
frameworks: [docker]
lines: 61
size: 2560 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [config, docker, documentation, markdown, project/career-ops]
---

# DATA_CONTRACT.md

> Configuration file for the project using **docker** (61 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/DATA_CONTRACT.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 61 |
| **Size** | 2560 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Data Contract

This document defines which files belong to the **system** (auto-updatable) and which belong to the **user** (never touched by updates).

## User Layer (NEVER auto-updated)

These files contain your personal data, customizations, and work product. Updates will NEVER modify them.

| File | Purpose |
|------|---------|
| `cv.md` | Your CV in markdown |
| `config/profile.yml` | Your identity, targets, comp range |
| `modes/_profile.md` | Your archetypes, narrative, negotiation scripts |
| `article-digest.md` | Your proof points from portfolio |
| `interview-prep/story-bank.md` | Your accumulated STAR+R stories |
| `portals.yml` | Your customized company list |
| `data/applications.md` | Your application tracker |
| `data/pipeline.md` | Your URL inbox |
| `data/scan-history.tsv` | Your scan history |
| `reports/*` | Your evaluation reports |
| `output/*` | Your generated PDFs |
| `jds/*` | Your saved job descriptions |

## System Layer (safe to auto-update)

These files contain system logic, scripts, templates, and instructions that improve with each release.

| File | Purpose |
|------|---------|
| `modes/_shared.md` | Scoring system, global rules, tools |
| `modes/oferta.md` | Evaluation mode instructions |
| `modes/pdf.md` | PDF generation instructions |
| `modes/scan.md` | Portal scanner instructions |
| `modes/batch.md` | Batch processing instructions |
| `modes/apply.md` | Application assistant instructions |
| `modes/auto-pipeline.md` | Auto-pipeline instructions |
| `modes/contacto.md` | LinkedIn outreach instructions |
| `modes/deep.md` | Research prompt instructions |
| `modes/ofertas.md` | Comparison instructions |
| `modes/pipeline.md` | Pipeline processing instructions |
| `modes/project.md` | Project evaluation instructions |
| `modes/tracker.md` | Tracker instructions |
| `modes/training.md` | Training evaluation instructions |
| `modes/de/*` | German language modes |
| `CLAUDE.md` | Agent instructions |
| `*.mjs` | Utility scripts |
| `batch/batch-prompt.md` | Batch worker prompt |
| `batch/batch-runner.sh` | Batch orchestrator |
| `dashboard/*` | Go TUI dashboard |
| `templates/*` | Base templates |
| `fonts/*` | Self-hosted fonts |
| `.claude/skills/*` | Skill definitions |
| `docs/*` | Documentation |
| `VERSION` | Current version number |
| `DATA_CONTRACT.md` | This file |

## The Rule

**If a file is in the User Layer, no update process may read, modify, or delete it.**

**If a file is in the System Layer, it can be safely replaced with the latest version from the upstream repo.**

```

```

```
