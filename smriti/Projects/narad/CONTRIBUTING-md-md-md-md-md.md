---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/CONTRIBUTING-md-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 217
size: 4971 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# CONTRIBUTING-md-md-md-md.md

> Documentation (217 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/CONTRIBUTING-md-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 217 |
| **Size** | 4971 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/CONTRIBUTING-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 179
size: 4256 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# CONTRIBUTING-md-md-md.md

> Documentation (179 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/CONTRIBUTING-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 179 |
| **Size** | 4256 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/CONTRIBUTING-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 141
size: 3550 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad]
---

# CONTRIBUTING-md-md.md

> Documentation (141 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/CONTRIBUTING-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 141 |
| **Size** | 3550 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/career-ops/CONTRIBUTING-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 103
size: 2843 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docs, documentation, markdown, project/narad]
---

# CONTRIBUTING-md.md

> Documentation (103 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/career-ops/CONTRIBUTING-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 103 |
| **Size** | 2843 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/career-ops/CONTRIBUTING.md"
project: "career-ops"
role: docs
language: markdown
frameworks: []
lines: 65
size: 2196 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [docs, documentation, markdown, project/career-ops]
---

# CONTRIBUTING.md

> Documentation (65 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/CONTRIBUTING.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 65 |
| **Size** | 2196 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Contributing to Career-Ops

Thanks for your interest in contributing! Career-Ops is built with Claude Code, and you can use it for development too.

## Before Submitting a PR

**Please open an issue first to discuss the change you'd like to make.** This helps us align on direction before you invest time coding.

PRs without a corresponding issue may be closed if they don't align with the project's architecture or goals.

### What makes a good PR
- Fixes a bug listed in Issues
- Addresses a feature request that was discussed and approved
- Includes a clear description of what changed and why
- Follows the existing code style and project philosophy (simple, minimal, quality over quantity)

## Quick Start

1. Open an issue to discuss your idea
2. Fork the repo
3. Create a branch (`git checkout -b feature/my-feature`)
4. Make your changes
5. Test with a fresh clone (see [docs/SETUP.md](docs/SETUP.md))
6. Commit and push
7. Open a Pull Request referencing the issue

## What to Contribute

**Good first contributions:**
- Add companies to `templates/portals.example.yml`
- Translate modes to other languages
- Improve documentation
- Add example CVs for different roles (in `examples/`)
- Report bugs via [Issues](https://github.com/santifer/career-ops/issues)

**Bigger contributions:**
- New evaluation dimensions or scoring logic
- Dashboard TUI features (in `dashboard/`)
- New skill modes (in `modes/`)
- Script improvements (`.mjs` utilities)

## Guidelines

- Keep modes language-agnostic when possible (Claude handles both EN and ES)
- Scripts should handle missing files gracefully (check `existsSync` before `readFileSync`)
- Dashboard changes require `go build` — test with real data before submitting
- Don't commit personal data (cv.md, profile.yml, applications.md, reports/)

## Development

```bash
# Scripts
node verify-pipeline.mjs     # Health check
node cv-sync-check.mjs        # Config check

# Dashboard
cd dashboard && go build -o career-dashboard .
./career-dashboard --path .
```

## Need Help?

- [Open an issue](https://github.com/santifer/career-ops/issues)
- [Read the architecture docs](docs/ARCHITECTURE.md)
- Built by [santifer](https://santifer.io)

```

```

```

```

```
