---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/app/globals.css"
project: "unnati"
role: style
language: css
frameworks: [tailwind]
lines: 26
size: 488 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, css, project/unnati, style, tailwind]
---

# globals.css

> Stylesheet using **tailwind** (26 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/app/globals.css` |
| **Role** | style |
| **Language** | css |
| **Frameworks** | tailwind |
| **Lines** | 26 |
| **Size** | 488 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;
}

```
