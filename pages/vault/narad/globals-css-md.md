---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/job-hunt-app/globals-css.md"
project: "narad"
role: docs
language: markdown
frameworks: [tailwind]
lines: 64
size: 1158 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad, tailwind]
---

# globals-css.md

> Documentation using **tailwind** (64 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/job-hunt-app/globals-css.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | tailwind |
| **Lines** | 64 |
| **Size** | 1158 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/deepak/Work/job-hunt-app/src/app/globals.css"
project: "job-hunt-app"
role: style
language: css
frameworks: [tailwind]
lines: 26
size: 488 bytes
last_modified: "2026-04-06 23:40"
scanned: "2026-04-06 23:40"
tags: [code, css, project/job-hunt-app, style, tailwind]
---

# globals.css

> Stylesheet using **tailwind** (26 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `job-hunt-app/src/app/globals.css` |
| **Role** | style |
| **Language** | css |
| **Frameworks** | tailwind |
| **Lines** | 26 |
| **Size** | 488 bytes |
| **Modified** | 2026-04-06 23:40 |

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

```
