---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/style-css-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 1063
size: 22410 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad]
---

# style-css-md-md-md.md

> Documentation (1063 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/style-css-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 1063 |
| **Size** | 22410 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/style-css-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 1025
size: 21708 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad]
---

# style-css-md-md.md

> Documentation (1025 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/style-css-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 1025 |
| **Size** | 21708 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/style-css-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 987
size: 21018 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# style-css-md.md

> Documentation (987 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/style-css-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 987 |
| **Size** | 21018 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/style-css.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 949
size: 20337 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# style-css.md

> Documentation (949 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/style-css.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 949 |
| **Size** | 20337 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/style.css"
project: "narad"
role: style
language: css
frameworks: []
lines: 912
size: 19718 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, css, project/narad, style]
---

# style.css

> Stylesheet (912 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/style.css` |
| **Role** | style |
| **Language** | css |
| **Frameworks** | — |
| **Lines** | 912 |
| **Size** | 19718 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```css
/* Narad - Anthropic Frontend Design Style */

/* ============================================
   CSS Variables - Distinctive Aesthetic
   ============================================ */
:root {
    /* Typography - Distinctive choices */
    --font-display: 'Playfair Display', Georgia, serif;
    --font-body: 'Source Serif 4', 'Libre Baskerville', Georgia, serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
    
    /* Color Palette - Warm editorial dark */
    --bg-deep: #0c0c0c;
    --bg-primary: #141414;
    --bg-elevated: #1a1a1a;
    --bg-surface: #222222;
    --bg-hover: #2a2a2a;
    
    /* Text hierarchy */
    --text-primary: #f5f5f0;
    --text-secondary: #a8a8a0;
    --text-muted: #6b6b65;
    --text-subtle: #4a4a45;
    
    /* Accent - Warm amber/gold */
    --accent-primary: #d4a574;
    --accent-hover: #e8bc8a;
    --accent-muted: #a67c52;
    --accent-subtle: #8b6914;
    
    /* Semantic */
    --success: #7cb87c;
    --error: #c75050;
    --warning: #d4a574;
    --info: #7c9cc7;
    
    /* Chat bubbles */
    --user-bubble: #2a2520;
    --user-bubble-border: #3d352a;
    --assistant-bubble: transparent;
    
    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 40px;
    --space-2xl: 64px;
    
    /* Layout */
    --sidebar-width: 260px;
    --header-height: 56px;
    --input-height: 52px;
    --max-content-width: 720px;
    
    /* Effects */
    --transition-fast: 150ms ease;
    --transition-normal: 250ms ease;
    --transition-slow: 400ms ease;
    --shadow-soft: 0 2px 8px rgba(0,0,0,0.3);
    --shadow-medium: 0 4px 16px rgba(0,0,0,0.4);
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 20px;
}

/* Light mode */
[data-theme="light"] {
    --bg-deep: #faf9f7;
    --bg-primary: #ffffff;
    --bg-elevated: #f5f4f1;
    --bg-surface: #eceae5;
    --bg-hover: #e5e3dd;
    
    --text-primary: #1a1a18;
    --text-secondary: #5a5a55;
    --text-muted: #8a8a85;
    --text-subtle: #ababab;
    
    --accent-primary: #8b6914;
    --accent-hover: #a67c1a;
    --accent-muted: #6b5210;
    --accent-subtle: #d4a574;
    
    --user-bubble: #f0ede8;
    --user-bubble-border: #e0ddd5;
    --assistant-bubble: transparent;
    
    --shadow-soft: 0 2px 8px rgba(0,0,0,0.08);
    --shadow-medium: 0 4px 16px rgba(0,0,0,0.12);
}

/* ============================================
   Base Styles
   ============================================ */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 15px;
    line-height: 1.65;
}

body {
    font-family: var(--font-body);
    background: var(--bg-deep);
    color: var(--text-primary);
    height: 100vh;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Skip link */
.skip-link {
    position: absolute;
    top: -60px;
    left: 0;
    background: var(--accent-primary);
    color: var(--bg-deep);
    padding: var(--space-sm) var(--space-md);
    z-index: 9999;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
    transition: top var(--transition-fast);
}

.skip-link:focus {
    top: 0;
}

/* ============================================
   Layout
   ============================================ */
.sidebar-layout {
    display: flex;
    height: 100vh;
    background: var(--bg-deep);
}

.terminal-sidebar {
    width: var(--sidebar-width);
    background: var(--bg-primary);
    border-right: 1px solid var(--bg-surface);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    transition: width var(--transition-normal), opacity var(--transition-normal);
    overflow: hidden;
}

.terminal-sidebar.collapsed {
    width: 0;
    opacity: 0;
}

.sidebar-header {
    padding: var(--space-md) var(--space-lg);
    border-bottom: 1px solid var(--bg-surface);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.sidebar-header h3 {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--text-muted);
}

.session-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-sm);
}

.session-item {
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 13px;
    font-family: var(--font-body);
    transition: all var(--transition-fast);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.session-item:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.session-item.active {
    background: var(--bg-surface);
    color: var(--text-primary);
}

.terminal-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

/* ============================================
   Header
   ============================================ */
.terminal-header {
    height: var(--header-height);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-lg);
    flex-shrink: 0;
}

.header-left {
    display: flex;
    align-items: center;
    gap: var(--space-md);
}

.terminal-title {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text-muted);
    letter-spacing: -0.3px;
}

.sidebar-toggle-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-toggle-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

.header-right {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.header-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
}

.header-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

/* Mode selector */
.mode-selector {
    display: flex;
    gap: 2px;
    background: var(--bg-surface);
    padding: 3px;
    border-radius: var(--radius-md);
}

.mode-chip {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 6px 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    letter-spacing: 0.5px;
}

.mode-chip:hover {
    color: var(--text-secondary);
}

.mode-chip.active {
    background: var(--bg-primary);
    color: var(--accent-primary);
    box-shadow: var(--shadow-soft);
}

/* Character select */
.character-select {
    background: var(--bg-surface);
    border: 1px solid var(--bg-hover);
    color: var(--text-primary);
    padding: 8px 12px;
    font-family: var(--font-body);
    font-size: 12px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    min-width: 120px;
}

.character-select:hover {
    border-color: var(--accent-muted);
}

.character-select:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.15);
}

/* Status badge */
.status-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    cursor: pointer;
    padding: 6px 10px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.status-badge:hover {
    background: var(--bg-hover);
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--success);
    animation: pulse 2s infinite;
}

.status-dot.error {
    background: var(--error);
    animation: none;
}

.status-dot.loading {
    background: var(--warning);
    animation: pulse 1s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Smriti button */
.smriti-pill-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--bg-surface);
    border: 1px solid var(--bg-hover);
    color: var(--text-secondary);
    padding: 8px 14px;
    font-family: var(--font-mono);
    font-size: 11px;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.smriti-pill-btn:hover {
    border-color: var(--accent-muted);
    color: var(--accent-primary);
}

.smriti-icon {
    width: 14px;
    height: 14px;
    background: linear-gradient(135deg, var(--accent-primary), var(--accent-muted));
    border-radius: 3px;
}

/* Theme toggle */
#theme-toggle-btn {
    background: transparent;
    border: none;
    color: var(--text-secondary);
    padding: var(--space-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 18px;
}

#theme-toggle-btn:hover {
    background: var(--bg-hover);
    color: var(--accent-primary);
}

/* ============================================
   Chat Area
   ============================================ */
.terminal-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-xl) var(--space-lg);
    background: var(--bg-deep);
    scroll-behavior: smooth;
}

.message {
    max-width: var(--max-content-width);
    margin: 0 auto var(--space-xl);
    display: flex;
    gap: var(--space-md);
    animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.message .prompt {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-subtle);
    flex-shrink: 0;
    width: 80px;
    padding-top: 4px;
    letter-spacing: -0.3px;
}

.message-content {
    flex: 1;
    min-width: 0;
}

/* For assistant messages - plain text content (app.js pattern) */
.message.assistant .message-content {
    background: transparent;
    color: var(--text-primary);
    padding: 0;
    line-height: 1.8;
}

/* User message */
.message.user {
    flex-direction: row-reverse;
}

.message.user .prompt {
    display: none;
}

.message.user .message-header {
    display: none;
}

.message.user .message-content {
    display: inline-block;
    background: var(--user-bubble);
    border: 1px solid var(--user-bubble-border);
    color: var(--text-primary);
    padding: var(--space-md) var(--space-lg);
    border-radius: var(--radius-xl) var(--radius-xl) var(--radius-sm) var(--radius-xl);
    max-width: 85%;
    text-align: left;
    line-height: 1.7;
}

/* Message content inner HTML styling (for rendered markdown) */
.message-content p {
    margin-bottom: var(--space-md);
}

.message-content p:last-child {
    margin-bottom: 0;
}

.message-content code {
    background: var(--bg-surface);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 0.9em;
    color: var(--accent-primary);
}

.message-content pre {
    background: var(--bg-primary);
    border: 1px solid var(--bg-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    overflow-x: auto;
    margin: var(--space-md) 0;
}

.message-content pre code {
    background: transparent;
    padding: 0;
    color: var(--text-primary);
}

/* Headings */
.message-content h1,
.message-content h2,
.message-content h3,
.message-content h4 {
    font-family: var(--font-display);
    color: var(--text-primary);
    margin: var(--space-lg) 0 var(--space-sm);
    font-weight: 600;
    line-height: 1.3;
}

.message-content h1 { font-size: 1.6em; }
.message-content h2 { font-size: 1.4em; }
.message-content h3 { font-size: 1.2em; }

/* Lists */
.message-content ul,
.message-content ol {
    padding-left: var(--space-lg);
    margin: var(--space-md) 0;
}

.message-content li {
    margin-bottom: var(--space-xs);
}

/* Blockquote */
.message-content blockquote {
    border-left: 3px solid var(--accent-muted);
    padding-left: var(--space-md);
    margin: var(--space-md) 0;
    color: var(--text-secondary);
    font-style: italic;
}

/* Links */
.message-content a {
    color: var(--accent-primary);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color var(--transition-fast);
}

.message-content a:hover {
    border-bottom-color: var(--accent-primary);
}

/* Tables */
.message-content table {
    border-collapse: collapse;
    width: 100%;
    margin: var(--space-md) 0;
    font-size: 0.95em;
}

.message-content th,
.message-content td {
    border: 1px solid var(--bg-surface);
    padding: var(--space-sm) var(--space-md);
    text-align: left;
}

.message-content th {
    background: var(--bg-surface);
    font-family: var(--font-mono);
    font-size: 0.85em;
    font-weight: 600;
    color: var(--text-secondary);
}

/* Message actions */
.message-actions {
    display: none;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
}

.message:hover .message-actions {
    display: flex;
}

.message-action-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 10px;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
}

.message-action-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

/* ============================================
   Input Area
   ============================================ */
.terminal-footer {
    background: var(--bg-primary);
    border-top: 1px solid var(--bg-surface);
    padding: var(--space-md) var(--space-lg);
}

.input-line {
    display: flex;
    align-items: flex-end;
    gap: var(--space-sm);
    max-width: var(--max-content-width);
    margin: 0 auto;
    background: var(--bg-surface);
    border: 1px solid var(--bg-hover);
    border-radius: var(--radius-lg);
    padding: var(--space-sm);
    transition: all var(--transition-fast);
}

.input-line:focus-within {
    border-color: var(--accent-muted);
    box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.1);
}

.input-line .prompt {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-subtle);
    padding: var(--space-sm) var(--space-sm) var(--space-sm) var(--space-md);
    flex-shrink: 0;
}

#user-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-body);
    font-size: 14px;
    resize: none;
    min-height: 24px;
    max-height: 200px;
    line-height: 1.6;
    outline: none;
}

#user-input::placeholder {
    color: var(--text-muted);
}

.input-controls {
    display: flex;
    gap: var(--space-xs);
    padding-right: var(--space-xs);
}

.icon-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 8px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
}

#send-btn {
    background: var(--accent-primary);
    border: none;
    color: var(--bg-deep);
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
    flex-shrink: 0;
}

#send-btn:hover {
    background: var(--accent-hover);
    transform: scale(1.05);
}

#send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

/* ============================================
   Search Overlay
   ============================================ */
.search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 120px;
    z-index: 1000;
    backdrop-filter: blur(4px);
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.search-container {
    background: var(--bg-primary);
    border: 1px solid var(--bg-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-md);
    width: 520px;
    max-width: 90%;
    box-shadow: var(--shadow-medium);
}

#chat-search-input {
    width: 100%;
    background: var(--bg-surface);
    border: 1px solid var(--bg-hover);
    color: var(--text-primary);
    padding: var(--space-md);
    font-family: var(--font-body);
    font-size: 14px;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
}

#chat-search-input:focus {
    outline: none;
    border-color: var(--accent-primary);
}

/* ============================================
   Loading Animation
   ============================================ */
.typing-indicator {
    display: flex;
    gap: 5px;
    padding: var(--space-md) 0;
}

.typing-indicator .dot {
    width: 7px;
    height: 7px;
    background: var(--accent-muted);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
    0%, 80%, 100% { 
        transform: scale(0.7);
        opacity: 0.4;
    }
    40% { 
        transform: scale(1);
        opacity: 1;
    }
}

/* ============================================
   Scrollbar
   ============================================ */
::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: var(--bg-surface);
    border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--bg-hover);
}

/* ============================================
   Focus States
   ============================================ */
*:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
    .terminal-header {
        padding: 0 var(--space-md);
    }
    
    .terminal-body {
        padding: var(--space-lg) var(--space-md);
    }
    
    .message .prompt {
        display: none;
    }
    
    .mode-selector {
        display: none;
    }
    
    .smriti-pill-btn span {
        display: none;
    }
    
    .character-select {
        min-width: 100px;
    }
    
    .message.user .message-content {
        max-width: 95%;
    }
    
    .sidebar-header h3 {
        display: none;
    }
}

/* ============================================
   Stop Button
   ============================================ */
.stop-btn {
    display: none;
}

.stop-btn.visible {
    display: block;
}

/* ============================================
   Hidden Elements (for JS compatibility)
   ============================================ */
#image-input,
#image-upload-btn,
#image-preview,
#usage-ring,
#clear-chat-btn,
#voice-output-btn {
    display: none;
}
```

```

```

```

```
