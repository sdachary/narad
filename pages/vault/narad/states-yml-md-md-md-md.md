---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/states-yml-md-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 208
size: 4371 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [config, documentation, markdown, project/narad]
---

# states-yml-md-md-md.md

> Configuration file for the project (208 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/states-yml-md-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 208 |
| **Size** | 4371 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/states-yml-md-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 170
size: 3644 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [config, documentation, markdown, project/narad]
---

# states-yml-md-md.md

> Configuration file for the project (170 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/states-yml-md-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 170 |
| **Size** | 3644 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/states-yml-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 132
size: 2926 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [config, documentation, markdown, project/narad]
---

# states-yml-md.md

> Configuration file for the project (132 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/states-yml-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 132 |
| **Size** | 2926 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/states-yml.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 94
size: 2218 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, markdown, project/narad]
---

# states-yml.md

> Configuration file for the project (94 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/states-yml.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 94 |
| **Size** | 2218 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/career-ops/templates/states.yml"
project: "unnati"
role: config
language: yaml
frameworks: []
lines: 56
size: 1536 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, config, project/unnati, yaml]
---

# states.yml

> Configuration file for the project (56 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/career-ops/templates/states.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | — |
| **Lines** | 56 |
| **Size** | 1536 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```yaml
# Career-Ops — Canonical States
# Source of truth for career-ops (writer) and dashboard (reader).
# Both systems MUST use these exact states.
#
# Rule: The status field in applications.md must contain EXACTLY
# one of these values (case-insensitive). No markdown bold (**),
# no dates, no extra text. Dates go in the date column.

states:
  - id: evaluated
    label: Evaluated
    aliases: [evaluada]
    description: Offer evaluated with report, pending decision
    dashboard_group: evaluated

  - id: applied
    label: Applied
    aliases: [aplicado, enviada, aplicada, sent]
    description: Application submitted
    dashboard_group: applied

  - id: responded
    label: Responded
    aliases: [respondido]
    description: Company has responded (not yet interview)
    dashboard_group: responded

  - id: interview
    label: Interview
    aliases: [entrevista]
    description: Active interview process
    dashboard_group: interview

  - id: offer
    label: Offer
    aliases: [oferta]
    description: Offer received
    dashboard_group: offer

  - id: rejected
    label: Rejected
    aliases: [rechazado, rechazada]
    description: Rejected by company
    dashboard_group: rejected

  - id: discarded
    label: Discarded
    aliases: [descartado, descartada, cerrada, cancelada]
    description: Discarded by candidate or offer closed
    dashboard_group: discarded

  - id: skip
    label: SKIP
    aliases: [no_aplicar, no aplicar, skip, monitor]
    description: Doesn't fit, don't apply
    dashboard_group: skip

```

```

```

```

```
