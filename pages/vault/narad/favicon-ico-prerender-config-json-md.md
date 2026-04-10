---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/favicon-ico-prerender-config-json.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 76
size: 1748 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [config, documentation, markdown, project/narad]
---

# favicon-ico-prerender-config-json.md

> Configuration file for the project (76 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/favicon-ico-prerender-config-json.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 76 |
| **Size** | 1748 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/unnati/.vercel/output/functions/favicon.ico.prerender-config.json"
project: "unnati"
role: config
language: json
frameworks: []
lines: 38
size: 1011 bytes
last_modified: "2026-04-07 17:52"
scanned: "2026-04-07 17:53"
tags: [code, config, json, project/unnati]
---

# favicon.ico.prerender-config.json

> Configuration file for the project (38 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/.vercel/output/functions/favicon.ico.prerender-config.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 38 |
| **Size** | 1011 bytes |
| **Modified** | 2026-04-07 17:52 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "type": "Prerender",
  "expiration": false,
  "group": 1,
  "bypassToken": "0fa6afca0cdf51216a1e616a1c033533",
  "experimentalBypassFor": [
    {
      "type": "header",
      "key": "next-action"
    },
    {
      "type": "header",
      "key": "content-type",
      "value": "multipart/form-data;.*"
    }
  ],
  "fallback": {
    "type": "FileFsRef",
    "mode": 33188,
    "contentType": "image/x-icon",
    "fsPath": "favicon.ico.prerender-fallback.body"
  },
  "initialHeaders": {
    "cache-control": "public, max-age=0, must-revalidate",
    "content-type": "image/x-icon",
    "x-next-cache-tags": "_N_T_/layout,_N_T_/favicon.ico/layout,_N_T_/favicon.ico/route,_N_T_/favicon.ico",
    "vary": "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch"
  },
  "allowQuery": [],
  "allowHeader": [
    "host",
    "x-matched-path",
    "x-prerender-revalidate",
    "x-prerender-revalidate-if-generated",
    "x-next-revalidated-tags",
    "x-next-revalidate-tag-token"
  ]
}

```

```
