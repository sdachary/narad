---
source: "/home/deepak/Work/unnati/.vercel/output/functions/_not-found.rsc.prerender-config.json"
project: "unnati"
role: config
language: json
frameworks: []
lines: 38
size: 984 bytes
last_modified: "2026-04-07 17:52"
scanned: "2026-04-07 17:53"
tags: [code, config, json, project/unnati]
---

# _not-found.rsc.prerender-config.json

> Configuration file for the project (38 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/.vercel/output/functions/_not-found.rsc.prerender-config.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 38 |
| **Size** | 984 bytes |
| **Modified** | 2026-04-07 17:52 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "type": "Prerender",
  "expiration": false,
  "group": 2,
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
    "fsPath": "_not-found.rsc.prerender-fallback.rsc"
  },
  "initialHeaders": {
    "x-nextjs-stale-time": "300",
    "x-nextjs-prerender": "1",
    "x-next-cache-tags": "_N_T_/layout,_N_T_/_not-found/layout,_N_T_/_not-found/page,_N_T_/_not-found",
    "vary": "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch",
    "content-type": "text/x-component"
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
