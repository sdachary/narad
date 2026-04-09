---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/src/index.css"
project: "social-blueprint-ai"
role: style
language: css
frameworks: [tailwind]
lines: 31
size: 852 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:46"
tags: [code, css, project/social-blueprint-ai, style, tailwind]
---

# index.css

> Stylesheet using **tailwind** (31 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/src/index.css` |
| **Role** | style |
| **Language** | css |
| **Frameworks** | tailwind |
| **Lines** | 31 |
| **Size** | 852 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Space Grotesk", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}

@layer base {
  :root {
    --bg-primary: #ffffff;
    --text-primary: #0f172a;
    --border-color: #e2e8f0;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-primary: #0f172a;
      --text-primary: #f8fafc;
      --border-color: #1e293b;
    }
  }

  body {
    @apply font-sans text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100;
  }
  h1, h2, h3, h4 {
    @apply font-display tracking-tight text-slate-900 dark:text-slate-50;
  }
}

```
