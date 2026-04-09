---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ARCHITECTURE-md-md-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 300
size: 9194 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, docker, documentation, markdown, project/narad]
---

# ARCHITECTURE-md-md-md-md-md.md

> Configuration file for the project using **docker** (300 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ARCHITECTURE-md-md-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 300 |
| **Size** | 9194 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ARCHITECTURE-md-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 262
size: 8409 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [config, docker, documentation, markdown, project/narad]
---

# ARCHITECTURE-md-md-md-md.md

> Configuration file for the project using **docker** (262 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ARCHITECTURE-md-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 262 |
| **Size** | 8409 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ARCHITECTURE-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 224
size: 7633 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, docker, documentation, markdown, project/narad]
---

# ARCHITECTURE-md-md-md.md

> Configuration file for the project using **docker** (224 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ARCHITECTURE-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 224 |
| **Size** | 7633 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ARCHITECTURE-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 186
size: 6866 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, docker, documentation, markdown, project/narad]
---

# ARCHITECTURE-md-md.md

> Configuration file for the project using **docker** (186 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ARCHITECTURE-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 186 |
| **Size** | 6866 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/career-ops/ARCHITECTURE-md.md"
project: "narad"
role: config
language: markdown
frameworks: [docker]
lines: 148
size: 6098 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [config, docker, documentation, markdown, project/narad]
---

# ARCHITECTURE-md.md

> Configuration file for the project using **docker** (148 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/career-ops/ARCHITECTURE-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 148 |
| **Size** | 6098 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/career-ops/docs/ARCHITECTURE.md"
project: "career-ops"
role: config
language: markdown
frameworks: [docker]
lines: 110
size: 5377 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [config, docker, documentation, markdown, project/career-ops]
---

# ARCHITECTURE.md

> Configuration file for the project using **docker** (110 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/docs/ARCHITECTURE.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 110 |
| **Size** | 5377 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Architecture

## System Overview

```
                    ┌─────────────────────────────────┐
                    │         Claude Code Agent        │
                    │   (reads CLAUDE.md + modes/*.md) │
                    └──────────┬──────────────────────┘
                               │
            ┌──────────────────┼──────────────────────┐
            │                  │                       │
     ┌──────▼──────┐   ┌──────▼──────┐   ┌───────────▼────────┐
     │ Single Eval  │   │ Portal Scan │   │   Batch Process    │
     │ (auto-pipe)  │   │  (scan.md)  │   │   (batch-runner)   │
     └──────┬──────┘   └──────┬──────┘   └───────────┬────────┘
            │                  │                       │
            │           ┌──────▼──────┐          ┌────▼─────┐
            │           │ pipeline.md │          │ N workers│
            │           │ (URL inbox) │          │ (claude -p)
            │           └─────────────┘          └────┬─────┘
            │                                          │
     ┌──────▼──────────────────────────────────────────▼──────┐
     │                    Output Pipeline                      │
     │  ┌──────────┐  ┌────────────┐  ┌───────────────────┐  │
     │  │ Report.md│  │  PDF (HTML  │  │ Tracker TSV       │  │
     │  │ (A-F eval)│  │  → Puppeteer)│  │ (merge-tracker)  │  │
     │  └──────────┘  └────────────┘  └───────────────────┘  │
     └────────────────────────────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  data/applications.md │
                    │  (canonical tracker)  │
                    └──────────────────────┘
```

## Evaluation Flow (Single Offer)

1. **Input**: User pastes JD text or URL
2. **Extract**: Playwright/WebFetch extracts JD from URL
3. **Classify**: Detect archetype (1 of 6 types)
4. **Evaluate**: 6 blocks (A-F):
   - A: Role summary
   - B: CV match (gaps + mitigation)
   - C: Level strategy
   - D: Comp research (WebSearch)
   - E: CV personalization plan
   - F: Interview prep (STAR stories)
5. **Score**: Weighted average across 10 dimensions (1-5)
6. **Report**: Save as `reports/{num}-{company}-{date}.md`
7. **PDF**: Generate ATS-optimized CV (`generate-pdf.mjs`)
8. **Track**: Write TSV to `batch/tracker-additions/`, auto-merged

## Batch Processing

The batch system processes multiple offers in parallel:

```
batch-input.tsv    →  batch-runner.sh  →  N × claude -p workers
(id, url, source)     (orchestrator)       (self-contained prompt)
                           │
                    batch-state.tsv
                    (tracks progress)
```

Each worker is a headless Claude instance (`claude -p`) that receives the full `batch-prompt.md` as context. Workers produce:
- Report .md
- PDF
- Tracker TSV line

The orchestrator manages parallelism, state, retries, and resume.

## Data Flow

```
cv.md                    →  Evaluation context
article-digest.md        →  Proof points for matching
config/profile.yml       →  Candidate identity
portals.yml              →  Scanner configuration
templates/states.yml     →  Canonical status values
templates/cv-template.html → PDF generation template
```

## File Naming Conventions

- Reports: `{###}-{company-slug}-{YYYY-MM-DD}.md` (3-digit zero-padded)
- PDFs: `cv-candidate-{company-slug}-{YYYY-MM-DD}.pdf`
- Tracker TSVs: `batch/tracker-additions/{id}.tsv`

## Pipeline Integrity

Scripts maintain data consistency:

| Script | Purpose |
|--------|---------|
| `merge-tracker.mjs` | Merges batch TSV additions into applications.md |
| `verify-pipeline.mjs` | Health check: statuses, duplicates, links |
| `dedup-tracker.mjs` | Removes duplicate entries by company+role |
| `normalize-statuses.mjs` | Maps status aliases to canonical values |
| `cv-sync-check.mjs` | Validates setup consistency |

## Dashboard TUI

The `dashboard/` directory contains a standalone Go TUI application that visualizes the pipeline:

- Filter tabs: All, Evaluada, Aplicado, Entrevista, Top >=4, No Aplicar
- Sort modes: Score, Date, Company, Status
- Grouped/flat view
- Lazy-loaded report previews
- Inline status picker

```

```

```

```

```

```
