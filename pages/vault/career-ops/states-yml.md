---
source: "/home/deepak/Work/career-ops/states.yml"
project: "career-ops"
role: config
language: yaml
frameworks: []
lines: 56
size: 1536 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [code, config, project/career-ops, yaml]
---

# states.yml

> Configuration file for the project (56 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/states.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | — |
| **Lines** | 56 |
| **Size** | 1536 bytes |
| **Modified** | 2026-04-06 23:40 |

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
