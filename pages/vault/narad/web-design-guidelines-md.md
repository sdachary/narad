---
source: "/home/runner/work/narad/narad/sync_temp/narad/skills/web-design-guidelines.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 39
size: 1231 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# web-design-guidelines.md

> Documentation using **docker, typescript** (39 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/skills/web-design-guidelines.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 39 |
| **Size** | 1231 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.

```
