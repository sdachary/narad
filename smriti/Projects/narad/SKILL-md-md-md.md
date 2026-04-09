---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/SKILL-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 166
size: 4462 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docker, docs, documentation, markdown, project/narad]
---

# SKILL-md-md.md

> Documentation using **docker** (166 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/SKILL-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 166 |
| **Size** | 4462 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/career-ops/SKILL-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 128
size: 3742 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, docs, documentation, markdown, project/narad]
---

# SKILL-md.md

> Documentation using **docker** (128 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/career-ops/SKILL-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 128 |
| **Size** | 3742 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/career-ops/.claude/skills/career-ops/SKILL.md"
project: "career-ops"
role: docs
language: markdown
frameworks: [docker]
lines: 90
size: 3030 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [docker, docs, documentation, markdown, project/career-ops]
---

# SKILL.md

> Documentation using **docker** (90 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/.claude/skills/career-ops/SKILL.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 90 |
| **Size** | 3030 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
name: career-ops
description: AI job search command center -- evaluate offers, generate CVs, scan portals, track applications
user_invocable: true
args: mode
---

# career-ops -- Router

## Mode Routing

Determine the mode from `{{mode}}`:

| Input | Mode |
|-------|------|
| (empty / no args) | `discovery` -- Show command menu |
| JD text or URL (no sub-command) | **`auto-pipeline`** |
| `oferta` | `oferta` |
| `ofertas` | `ofertas` |
| `contacto` | `contacto` |
| `deep` | `deep` |
| `pdf` | `pdf` |
| `training` | `training` |
| `project` | `project` |
| `tracker` | `tracker` |
| `pipeline` | `pipeline` |
| `apply` | `apply` |
| `scan` | `scan` |
| `batch` | `batch` |

**Auto-pipeline detection:** If `{{mode}}` is not a known sub-command AND contains JD text (keywords: "responsibilities", "requirements", "qualifications", "about the role", "we're looking for", company name + role) or a URL to a JD, execute `auto-pipeline`.

If `{{mode}}` is not a sub-command AND doesn't look like a JD, show discovery.

---

## Discovery Mode (no arguments)

Show this menu:

```
career-ops -- Command Center

Available commands:
  /career-ops {JD}      → AUTO-PIPELINE: evaluate + report + PDF + tracker (paste text or URL)
  /career-ops pipeline  → Process pending URLs from inbox (data/pipeline.md)
  /career-ops oferta    → Evaluation only A-F (no auto PDF)
  /career-ops ofertas   → Compare and rank multiple offers
  /career-ops contacto  → LinkedIn power move: find contacts + draft message
  /career-ops deep      → Deep research prompt about company
  /career-ops pdf       → PDF only, ATS-optimized CV
  /career-ops training  → Evaluate course/cert against North Star
  /career-ops project   → Evaluate portfolio project idea
  /career-ops tracker   → Application status overview
  /career-ops apply     → Live application assistant (reads form + generates answers)
  /career-ops scan      → Scan portals and discover new offers
  /career-ops batch     → Batch processing with parallel workers

Inbox: add URLs to data/pipeline.md → /career-ops pipeline
Or paste a JD directly to run the full pipeline.
```

---

## Context Loading by Mode

After determining the mode, load the necessary files before executing:

### Modes that require `_shared.md` + their mode file:
Read `modes/_shared.md` + `modes/{mode}.md`

Applies to: `auto-pipeline`, `oferta`, `ofertas`, `pdf`, `contacto`, `apply`, `pipeline`, `scan`, `batch`

### Standalone modes (only their mode file):
Read `modes/{mode}.md`

Applies to: `tracker`, `deep`, `training`, `project`

### Modes delegated to subagent:
For `scan`, `apply` (with Playwright), and `pipeline` (3+ URLs): launch as Agent with the content of `_shared.md` + `modes/{mode}.md` injected into the subagent prompt.

```
Agent(
  subagent_type="general-purpose",
  prompt="[content of modes/_shared.md]\n\n[content of modes/{mode}.md]\n\n[invocation-specific data]",
  description="career-ops {mode}"
)
```

Execute the instructions from the loaded mode file.

```

```

```
