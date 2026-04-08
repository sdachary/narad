---
source: "/home/deepak/Work/career-ops/.github/ISSUE_TEMPLATE/feature_request.yml"
project: "career-ops"
role: config
language: yaml
frameworks: []
lines: 23
size: 625 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [code, config, project/career-ops, yaml]
---

# feature_request.yml

> Configuration file for the project (23 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/.github/ISSUE_TEMPLATE/feature_request.yml` |
| **Role** | config |
| **Language** | yaml |
| **Frameworks** | — |
| **Lines** | 23 |
| **Size** | 625 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```yaml
name: Feature Request
description: Suggest a new feature or improvement
labels: ["enhancement"]
body:
  - type: textarea
    id: problem
    attributes:
      label: Problem
      description: What problem does this solve?
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Proposed solution
      description: How would you like this to work?
    validations:
      required: true
  - type: markdown
    attributes:
      value: |
        ---
        Built by [santifer](https://santifer.io) — see the [architecture docs](docs/ARCHITECTURE.md) for how the system works.

```
