---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/career-ops/CUSTOMIZATION-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 114
size: 3154 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, docs, documentation, markdown, project/narad]
---

# CUSTOMIZATION-md.md

> Documentation using **docker** (114 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/career-ops/CUSTOMIZATION-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 114 |
| **Size** | 3154 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/career-ops/docs/CUSTOMIZATION.md"
project: "career-ops"
role: docs
language: markdown
frameworks: [docker]
lines: 76
size: 2460 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [docker, docs, documentation, markdown, project/career-ops]
---

# CUSTOMIZATION.md

> Documentation using **docker** (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/docs/CUSTOMIZATION.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 76 |
| **Size** | 2460 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Customization Guide

## Profile (config/profile.yml)

This is the single source of truth for your identity. All modes read from here.

Key sections:
- **candidate**: Name, email, phone, location, LinkedIn, portfolio
- **target_roles**: Your North Star roles and archetypes
- **narrative**: Your headline, exit story, superpowers, proof points
- **compensation**: Target range, minimum, currency
- **location**: Country, timezone, visa status, on-site availability

## Target Roles (modes/_shared.md)

The archetype table in `_shared.md` determines how offers are scored and CVs are framed. Edit the table to match YOUR career targets:

```markdown
| Archetype | Thematic axes | What they buy |
|-----------|---------------|---------------|
| **Your Role 1** | key skills | what they need |
| **Your Role 2** | key skills | what they need |
```

Also update the "Adaptive Framing" table to map YOUR specific projects to each archetype.

## Portals (portals.yml)

Copy from `templates/portals.example.yml` and customize:

1. **title_filter.positive**: Keywords matching your target roles
2. **title_filter.negative**: Tech stacks or domains to exclude
3. **search_queries**: WebSearch queries for job boards (Ashby, Greenhouse, Lever)
4. **tracked_companies**: Companies to check directly

## CV Template (templates/cv-template.html)

The HTML template uses these design tokens:
- **Fonts**: Space Grotesk (headings) + DM Sans (body) -- self-hosted in `fonts/`
- **Colors**: Cyan primary (`hsl(187,74%,32%)`) + Purple accent (`hsl(270,70%,45%)`)
- **Layout**: Single-column, ATS-optimized

To customize fonts/colors, edit the CSS in the template. Update font files in `fonts/` if switching fonts.

## Negotiation Scripts (modes/_shared.md)

The negotiation section provides frameworks for salary discussions. Replace the example scripts with your own:
- Target ranges
- Geographic arbitrage strategy
- Pushback responses

## Hooks (Optional)

Career-ops can integrate with external systems via Claude Code hooks. Example hooks:

```json
{
  "hooks": {
    "SessionStart": [{
      "hooks": [{
        "type": "command",
        "command": "echo 'Career-ops session started'"
      }]
    }]
  }
}
```

Save hooks in `.claude/settings.json`.

## States (templates/states.yml)

The canonical states rarely need changing. If you add new states, update:
1. `templates/states.yml`
2. `normalize-statuses.mjs` (alias mappings)
3. `modes/_shared.md` (any references)

```

```
