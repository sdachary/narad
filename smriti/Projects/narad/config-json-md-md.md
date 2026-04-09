---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/config-json-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 305
size: 5800 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [config, documentation, markdown, project/narad]
---

# config-json-md.md

> Configuration file for the project (305 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/config-json-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 305 |
| **Size** | 5800 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/config-json.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 267
size: 5086 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [config, documentation, markdown, project/narad]
---

# config-json.md

> Configuration file for the project (267 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/config-json.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 267 |
| **Size** | 5086 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/unnati/.vercel/output/config.json"
project: "unnati"
role: config
language: json
frameworks: []
lines: 229
size: 4432 bytes
last_modified: "2026-04-07 17:52"
scanned: "2026-04-07 17:53"
tags: [code, config, json, project/unnati]
---

# config.json

> Configuration file for the project (229 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/.vercel/output/config.json` |
| **Role** | config |
| **Language** | json |
| **Frameworks** | — |
| **Lines** | 229 |
| **Size** | 4432 bytes |
| **Modified** | 2026-04-07 17:52 |

## 🔗 Related Files

—

## 📄 Content

```json
{
  "version": 3,
  "routes": [
    {
      "src": "^(?:/((?:[^/]+?)(?:/(?:[^/]+?))*))/$",
      "headers": {
        "Location": "/$1"
      },
      "status": 308,
      "continue": true
    },
    {
      "src": "/_next/__private/trace",
      "dest": "/404",
      "status": 404,
      "continue": true
    },
    {
      "src": "/404/?",
      "status": 404,
      "continue": true,
      "missing": [
        {
          "type": "header",
          "key": "x-prerender-revalidate"
        }
      ]
    },
    {
      "src": "/500",
      "status": 500,
      "continue": true
    },
    {
      "src": "^/?",
      "has": [
        {
          "type": "header",
          "key": "rsc",
          "value": "1"
        }
      ],
      "dest": "/index.rsc",
      "headers": {
        "vary": "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch"
      },
      "continue": true,
      "override": true
    },
    {
      "src": "^/((?!.+\\.rsc).+?)(?:/)?$",
      "has": [
        {
          "type": "header",
          "key": "rsc",
          "value": "1"
        }
      ],
      "dest": "/$1.rsc",
      "headers": {
        "vary": "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch"
      },
      "continue": true,
      "override": true
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/index(\\.action|\\.rsc)",
      "dest": "/",
      "continue": true
    },
    {
      "src": "/_next/data/(.*)",
      "dest": "/_next/data/$1",
      "check": true
    },
    {
      "src": "/\\.prefetch\\.rsc$",
      "dest": "/__index.prefetch.rsc",
      "check": true
    },
    {
      "src": "/(.+)/\\.prefetch\\.rsc$",
      "dest": "/$1.prefetch.rsc",
      "check": true
    },
    {
      "src": "/\\.rsc$",
      "dest": "/index.rsc",
      "check": true
    },
    {
      "src": "/(.+)/\\.rsc$",
      "dest": "/$1.rsc",
      "check": true
    },
    {
      "handle": "resource"
    },
    {
      "src": "/.*",
      "status": 404
    },
    {
      "handle": "miss"
    },
    {
      "src": "/_next/static/.+",
      "status": 404,
      "check": true,
      "dest": "/_next/static/not-found.txt",
      "headers": {
        "content-type": "text/plain; charset=utf-8"
      }
    },
    {
      "handle": "rewrite"
    },
    {
      "src": "/_next/data/(.*)",
      "dest": "/404",
      "status": 404
    },
    {
      "handle": "hit"
    },
    {
      "src": "/_next/static/(?:[^/]+/pages|pages|chunks|runtime|css|image|media|WhVZeJAEWDqUCEmazhlet)/.+",
      "headers": {
        "cache-control": "public,max-age=31536000,immutable"
      },
      "continue": true,
      "important": true
    },
    {
      "src": "/index(?:/)?",
      "headers": {
        "x-matched-path": "/"
      },
      "continue": true,
      "important": true
    },
    {
      "src": "/((?!index$).*?)(?:/)?",
      "headers": {
        "x-matched-path": "/$1"
      },
      "continue": true,
      "important": true
    },
    {
      "handle": "error"
    },
    {
      "src": "/.*",
      "dest": "/404",
      "status": 404
    },
    {
      "src": "/.*",
      "dest": "/500",
      "status": 500
    }
  ],
  "images": {
    "domains": [],
    "sizes": [
      640,
      750,
      828,
      1080,
      1200,
      1920,
      2048,
      3840,
      16,
      32,
      48,
      64,
      96,
      128,
      256,
      384
    ],
    "remotePatterns": [],
    "minimumCacheTTL": 60,
    "formats": [
      "image/webp"
    ],
    "dangerouslyAllowSVG": false,
    "contentSecurityPolicy": "script-src 'none'; frame-src 'none'; sandbox;",
    "contentDispositionType": "attachment"
  },
  "overrides": {
    "404.html": {
      "path": "404",
      "contentType": "text/html; charset=utf-8"
    },
    "500.html": {
      "path": "500",
      "contentType": "text/html; charset=utf-8"
    },
    "_app.rsc.json": {
      "path": "_app.rsc",
      "contentType": "application/json"
    },
    "_error.rsc.json": {
      "path": "_error.rsc",
      "contentType": "application/json"
    },
    "_document.rsc.json": {
      "path": "_document.rsc",
      "contentType": "application/json"
    },
    "404.rsc.json": {
      "path": "404.rsc",
      "contentType": "application/json"
    },
    "_next/static/not-found.txt": {
      "contentType": "text/plain"
    }
  },
  "framework": {
    "version": "15.5.2"
  },
  "crons": []
}

```

```

```
