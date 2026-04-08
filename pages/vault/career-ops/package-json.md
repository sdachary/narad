---
source: "/home/deepak/Work/career-ops/package.json"
project: "career-ops"
role: config
language: json
frameworks: []
lines: 27
size: 904 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [code, config, json, project/career-ops]
---

# package.json

> Configuration file for the project (27 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `career-ops/package.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 27 |
| **Size** | 904 bytes |
| **Modified** | 2026-04-06 23:40 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "name": "career-ops",
  "version": "1.0.0",
  "description": "AI-powered job search pipeline built on Claude Code",
  "scripts": {
    "verify": "node verify-pipeline.mjs",
    "normalize": "node normalize-statuses.mjs",
    "dedup": "node dedup-tracker.mjs",
    "merge": "node merge-tracker.mjs",
    "pdf": "node generate-pdf.mjs",
    "sync-check": "node cv-sync-check.mjs",
    "update:check": "node update-system.mjs check",
    "update": "node update-system.mjs apply",
    "rollback": "node update-system.mjs rollback"
  },
  "keywords": ["ai", "job-search", "claude-code", "career", "automation"],
  "author": "Santiago Fernández de Valderrama <hi@santifer.io> (https://santifer.io)",
  "homepage": "https://santifer.io",
  "repository": {
    "type": "git",
    "url": "https://github.com/santifer/career-ops"
  },
  "license": "MIT",
  "dependencies": {
    "playwright": "^1.58.1"
  }
}

```
