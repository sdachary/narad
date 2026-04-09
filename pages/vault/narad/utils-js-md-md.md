---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/utils-js-md.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 111
size: 2423 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [config, documentation, markdown, project/narad]
---

# utils-js-md.md

> Configuration file for the project (111 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/utils-js-md.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 111 |
| **Size** | 2423 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/utils-js.md"
project: "narad"
role: config
language: markdown
frameworks: []
lines: 73
size: 1723 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [config, documentation, markdown, project/narad]
---

# utils-js.md

> Configuration file for the project (73 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/utils-js.md` |
| **Role** | config |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 73 |
| **Size** | 1723 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/utils.js"
project: "kanak"
role: config
language: javascript
frameworks: []
lines: 36
size: 1057 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:38"
tags: [code, config, javascript, project/kanak]
---

# utils.js

> Configuration file for the project (36 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/pages/utils.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 36 |
| **Size** | 1057 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * utils.js — Shared utility functions for Gold SaaS
 * Include this on every page AFTER config.js and auth-check.js
 */

/**
 * 🛡️ sanitize() — Cleans a value so it cannot run as HTML or JavaScript.
 * ALWAYS use this when putting database values into innerHTML.
 *
 * Example:  ${sanitize(m.shop_name)}   instead of   ${m.shop_name}
 */
function sanitize(value) {
    if (value === null || value === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(value);
    return div.innerHTML;
}

/**
 * formatINR() — Formats a number as Indian Rupees
 * Example: formatINR(123456)  →  "₹1,23,456"
 */
function formatINR(amount) {
    return '₹' + Number(amount || 0).toLocaleString('en-IN');
}

/**
 * formatDate() — Formats a date string nicely
 * Example: formatDate("2026-03-05")  →  "05 Mar 2026"
 */
function formatDate(dateStr) {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
}
```

```

```
