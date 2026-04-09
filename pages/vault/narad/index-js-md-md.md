---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/index-js-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 146
size: 2949 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# index-js-md.md

> Documentation (146 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/index-js-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 146 |
| **Size** | 2949 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/index-js.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 108
size: 2273 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad]
---

# index-js.md

> Documentation (108 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/index-js.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 108 |
| **Size** | 2273 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/config/index.js"
project: "narad"
role: config
language: javascript
frameworks: []
lines: 68
size: 1412 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, javascript, project/narad]
---

# index.js

> Configuration file for the project (68 lines).

**Key exports:** `EMBEDDING_MODEL`, `EMBEDDING_DIM`, `SEMANTIC_MEMORY_CONFIG`, `AI_BUDGET_CONFIG`, `DAILY_LIMITS`, `RATE_LIMIT`, `CSRF_TRUSTED_ORIGINS`, `ALLOWED_ORIGINS`, +1 more

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/config/index.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 68 |
| **Size** | 1412 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```javascript
export const EMBEDDING_MODEL = '@cf/baai/bge-base-en-v1.5';
export const EMBEDDING_DIM = 768;

export const SEMANTIC_MEMORY_CONFIG = {
  maxMemories: 1000,
  similarityThreshold: 0.7,
  topK: 5
};

export const AI_BUDGET_CONFIG = {
  maxDailyEmbeddings: 10000,
  cacheEmbeddingTTL: 3600,
  fallbackOnLimit: true
};

export const DAILY_LIMITS = {
  general: 200000,
  coding: 250000,
  research: 150000,
  debugging: 200000,
  testing: 200000,
  deployment: 150000,
  coder: 250000,
  writer: 150000,
  analyst: 150000,
  architect: 200000
};

export const RATE_LIMIT = {
  maxRequests: 60,
  windowMs: 60000,
  burstLimit: 10
};

export const CSRF_TRUSTED_ORIGINS = [
  'https://narad-7hc.pages.dev/',
  'https://narad-7hc.pages.dev',
  'https://narad.io',
  'http://localhost:8788',
  'http://localhost:3000'
];

export const ALLOWED_ORIGINS = [
  'https://narad-7hc.pages.dev/',
  'https://narad-7hc.pages.dev',
  'https://narad.io',
  'http://localhost:8788',
  'http://localhost:3000',
  'http://localhost:5173'
];

export const STOCK_MAPPINGS = {
  'railtel': 'RAILTEL.NS',
  'tcs': 'TCS.NS',
  'infosys': 'INFY.NS',
  'infy': 'INFY.NS',
  'reliance': 'RELIANCE.NS',
  'hdfc': 'HDFCBANK.NS',
  'irfc': 'IRFC.NS',
  'rvnl': 'RVNL.NS',
  'ireda': 'IREDA.NS',
  'lic': 'LICI.NS',
  'sbi': 'SBIN.NS',
  'adani power': 'ADANIPOWER.NS',
  'adani': 'ADANIENT.NS',
  'zomato': 'ZOMATO.NS',
  'paytm': 'PAYTM.NS'
};

```

```

```
