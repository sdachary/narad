---
source: "/home/runner/work/narad/narad/sync_temp/kanak/pages/utils.js"
project: "kanak"
role: config
language: javascript
frameworks: []
lines: 36
size: 1057 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
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
| **Modified** | 2026-04-09 14:45 |

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
