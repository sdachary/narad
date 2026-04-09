---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reader-html-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 392
size: 9833 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# reader-html-md-md-md.md

> Documentation (392 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reader-html-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 392 |
| **Size** | 9833 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reader-html-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 354
size: 9130 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# reader-html-md-md.md

> Documentation (354 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reader-html-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 354 |
| **Size** | 9130 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reader-html-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 316
size: 8436 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad]
---

# reader-html-md.md

> Documentation (316 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reader-html-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 316 |
| **Size** | 8436 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/reader-html.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 278
size: 7751 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docs, documentation, markdown, project/narad]
---

# reader-html.md

> Documentation (278 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/reader-html.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 278 |
| **Size** | 7751 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/reader.html"
project: "narad"
role: page
language: html
frameworks: []
lines: 240
size: 7129 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, html, page, project/narad]
---

# reader.html

> Web page (240 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/reader.html` |
| **Role** | page |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 240 |
| **Size** | 7129 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SMRITI | Knowledge Reader</title>
    <link rel="stylesheet" href="style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&family=Space+Grotesk:wght@300;400;700&display=swap" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        :root {
            --reader-bg: #131313;
            --accent: #00ff00;
            --accent-dim: rgba(0, 255, 0, 0.1);
        }

        body {
            background-color: var(--reader-bg);
            color: #e5e2e1;
            font-family: 'Space Grotesk', sans-serif;
            height: 100dvh;
            overflow: hidden;
        }

        .terminal-container {
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
        }

        /* Top Bar Refinement */
        .reader-header {
            background: #1c1b1b;
            height: 50px;
            display: flex;
            align-items: center;
            padding: 0 20px;
            border-bottom: 1px solid #333;
            gap: 20px;
        }

        .traffic-lights {
            display: flex;
            gap: 8px;
        }

        .light {
            width: 12px;
            height: 12px;
            border-radius: 50%;
        }

        .search-area {
            flex-grow: 1;
            position: relative;
        }

        .search-input {
            width: 100%;
            background: #0e0e0e;
            border: 1px solid #333;
            color: var(--accent);
            font-family: 'Roboto Mono', monospace;
            padding: 6px 12px;
            font-size: 13px;
            outline: none;
            border-radius: 0;
        }

        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #1c1b1b;
            border: 1px solid #444;
            max-height: 300px;
            overflow-y: auto;
            display: none;
            z-index: 1000;
        }

        .search-item {
            padding: 10px;
            cursor: pointer;
            border-bottom: 1px solid #333;
            font-size: 13px;
        }

        .search-item:hover {
            background: var(--accent-dim);
            color: var(--accent);
        }

        /* Content Area */
        .reader-main {
            flex-grow: 1;
            padding: 40px 15%;
            overflow-y: auto;
            line-height: 1.8;
        }

        #indra-summary {
            background: var(--accent-dim);
            border-left: 4px solid var(--accent);
            padding: 20px;
            margin-bottom: 40px;
            font-style: italic;
            color: #fff;
            font-size: 15px;
        }

        .indra-label {
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-size: 11px;
            color: var(--accent);
            display: block;
            margin-bottom: 10px;
        }

        .note-title {
            font-size: 42px;
            font-weight: 700;
            margin-bottom: 10px;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: -1px;
        }

        .note-path {
            font-family: 'Roboto Mono', monospace;
            font-size: 12px;
            color: var(--text-muted);
            margin-bottom: 40px;
            opacity: 0.6;
        }

        .markdown-render {
            font-size: 18px;
            color: #ccc;
        }

        .markdown-render h1, .markdown-render h2 { color: #fff; margin-top: 40px; }
        .markdown-render a { color: var(--accent); text-decoration: none; border-bottom: 1px solid var(--accent-dim); }
        .markdown-render a:hover { background: var(--accent-dim); }
        .markdown-render pre { background: #0e0e0e; padding: 20px; border-radius: 4px; overflow-x: auto; }

        /* Wikilink styling */
        .wikilink {
            color: var(--text-secondary);
            cursor: pointer;
            border-bottom: 1px dotted var(--text-secondary);
        }

        /* Floating Controls */
        .floating-controls {
            position: fixed;
            right: 30px;
            bottom: 30px;
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .neural-map-btn {
            width: 60px;
            height: 60px;
            background: var(--accent);
            border: none;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .neural-map-btn:hover {
            transform: scale(1.1) rotate(10deg);
        }

        .s-logo {
            font-weight: 900;
            font-size: 24px;
            color: #003a00;
        }

        @media (max-width: 768px) {
            .reader-main { padding: 30px 20px; }
            .note-title { font-size: 28px; }
        }
    </style>
</head>
<body>
    <div class="terminal-container">
        <header class="reader-header">
            <div class="traffic-lights">
                <div class="light" style="background: var(--red);"></div>
                <div class="light" style="background: var(--yellow);"></div>
                <div class="light" style="background: var(--green);"></div>
            </div>
            <div class="search-area">
                <input type="text" id="search-bar" class="search-input" placeholder="SEARCH SMRITI VAULT..." autocomplete="off">
                <div id="search-results" class="search-results"></div>
            </div>
            <div class="terminal-title">KNOWLEDGE_READER_v1.2</div>
        </header>

        <main class="reader-main">
            <div id="indra-section" style="display: none;">
                <div id="indra-summary">
                    <span class="indra-label">Indra Transcript</span>
                    <div id="indra-text">Analyzing thought patterns...</div>
                </div>
            </div>

            <h1 id="node-title" class="note-title">LOADING MEMORY...</h1>
            <div id="node-path" class="note-path">/smriti/vault/loading...</div>

            <div id="content" class="markdown-render">
                <!-- Content injected via reader.js -->
            </div>
        </main>

        <div class="floating-controls">
            <button class="neural-map-btn" onclick="window.location.href='/graph.html'" title="Return to Neural Map">
                <span class="s-logo">S</span>
            </button>
        </div>
    </div>

    <script src="reader.js"></script>
</body>
</html>

```

```

```

```

```
