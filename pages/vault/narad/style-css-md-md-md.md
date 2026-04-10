---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/style-css-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 885
size: 17452 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [docs, documentation, markdown, project/narad]
---

# style-css-md-md.md

> Documentation (885 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/style-css-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 885 |
| **Size** | 17452 bytes |
| **Modified** | 2026-04-09 16:48 |

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
lines: 847
size: 16762 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docs, documentation, markdown, project/narad]
---

# style-css-md.md

> Documentation (847 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/style-css-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 847 |
| **Size** | 16762 bytes |
| **Modified** | 2026-04-09 16:07 |

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
lines: 809
size: 16081 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# style-css.md

> Documentation (809 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/style-css.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 809 |
| **Size** | 16081 bytes |
| **Modified** | 2026-04-09 15:18 |

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
lines: 772
size: 15462 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [code, css, project/narad, style]
---

# style.css

> Stylesheet (772 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/style.css` |
| **Role** | style |
| **Language** | css |
| **Frameworks** | — |
| **Lines** | 772 |
| **Size** | 15462 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```css
/* Narad - OpenCode CLI TUI Style */

/* ============================================
   OpenCode-inspired Terminal UI
   ============================================ */
:root {
    /* OpenCode TUI Color Palette */
    --bg-deep: #0d1117;
    --bg-primary: #161b22;
    --bg-elevated: #21262d;
    --bg-surface: #30363d;
    --bg-hover: #484f58;
    
    /* Text */
    --text-primary: #e6edf3;
    --text-secondary: #8b949e;
    --text-muted: #6e7681;
    --text-dim: #484f58;
    
    /* OpenCode Orange Accent */
    --accent: #f97316;
    --accent-dim: #c2410c;
    --accent-bright: #fb923c;
    
    /* Semantic */
    --success: #3fb950;
    --error: #f85149;
    --warning: #d29922;
    --info: #58a6ff;
    
    /* User/Assistant */
    --user-msg: #1f6feb;
    --user-msg-text: #ffffff;
    
    /* Typography - Pure monospace */
    --font-mono: 'SF Mono', 'Fira Code', 'JetBrains Mono', Consolas, 'Liberation Mono', Menlo, monospace;
    
    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 12px;
    --space-lg: 16px;
    --space-xl: 24px;
    --space-2xl: 32px;
    
    /* Layout */
    --header-height: 40px;
    --input-height: 44px;
    --sidebar-width: 220px;
    
    /* Effects */
    --radius-sm: 2px;
    --radius-md: 4px;
    --radius-lg: 6px;
    --transition: 120ms ease;
}

/* Light mode */
[data-theme="light"] {
    --bg-deep: #ffffff;
    --bg-primary: #f6f8fa;
    --bg-elevated: #eaeef2;
    --bg-surface: #d0d7de;
    --bg-hover: #d8dee4;
    --text-primary: #1f2328;
    --text-secondary: #656d76;
    --text-muted: #8c959f;
    --text-dim: #bfc4cc;
    --accent: #ea580c;
    --accent-dim: #c2410c;
    --user-msg: #0969da;
}

/* ============================================
   Reset & Base
   ============================================ */
*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    font-size: 13px;
    line-height: 1.5;
}

body {
    font-family: var(--font-mono);
    background: var(--bg-deep);
    color: var(--text-primary);
    height: 100vh;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
}

/* Skip link */
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--accent);
    color: var(--bg-deep);
    padding: var(--space-xs) var(--space-sm);
    z-index: 9999;
    font-size: 11px;
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
}

.terminal-sidebar {
    width: var(--sidebar-width);
    background: var(--bg-primary);
    border-right: 1px solid var(--bg-surface);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
}

.terminal-sidebar.collapsed {
    width: 0;
    overflow: hidden;
}

.sidebar-header {
    height: var(--header-height);
    padding: 0 var(--space-sm);
    border-bottom: 1px solid var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sidebar-header h3 {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: var(--text-muted);
}

.session-list {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-xs);
}

.session-item {
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    color: var(--text-secondary);
    cursor: pointer;
    font-size: 12px;
    transition: var(--transition);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.session-item:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}

.session-item.active {
    background: var(--bg-surface);
    color: var(--accent);
}

.terminal-window {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
}

/* ============================================
   Header - Terminal style
   ============================================ */
.terminal-header {
    height: var(--header-height);
    background: var(--bg-primary);
    border-bottom: 1px solid var(--bg-surface);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-md);
    flex-shrink: 0;
    font-size: 12px;
}

.header-left {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.sidebar-toggle-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
}

.sidebar-toggle-btn:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}

.terminal-title {
    font-size: 12px;
    color: var(--text-secondary);
}

.terminal-title::before {
    content: '●';
    color: var(--success);
    margin-right: var(--space-sm);
    font-size: 8px;
}

.header-right {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
}

.header-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
    font-size: 13px;
    display: flex;
    align-items: center;
}

.header-btn:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}

/* Mode selector - Terminal style pills */
.mode-selector {
    display: flex;
    gap: 1px;
    background: var(--bg-elevated);
    padding: 2px;
    border-radius: var(--radius-sm);
}

.mode-chip {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: 3px 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
    border-radius: 2px;
    transition: var(--transition);
    letter-spacing: 0.3px;
}

.mode-chip:hover {
    color: var(--text-secondary);
}

.mode-chip.active {
    background: var(--bg-deep);
    color: var(--accent);
}

/* Character select - Terminal dropdown */
.character-select {
    background: var(--bg-elevated);
    border: 1px solid var(--bg-surface);
    color: var(--text-primary);
    padding: 4px 8px;
    font-family: var(--font-mono);
    font-size: 11px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
}

.character-select:hover {
    border-color: var(--text-muted);
}

.character-select:focus {
    outline: none;
    border-color: var(--accent);
}

/* Status badge */
.status-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--radius-sm);
    transition: var(--transition);
}

.status-badge:hover {
    background: var(--bg-elevated);
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
}

.status-dot.error {
    background: var(--error);
}

.status-dot.loading {
    background: var(--warning);
    animation: blink 1s infinite;
}

@keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
}

/* Theme toggle */
#theme-toggle-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
    font-size: 14px;
}

#theme-toggle-btn:hover {
    background: var(--bg-elevated);
    color: var(--accent);
}

/* ============================================
   Chat Area - Terminal messages
   ============================================ */
.terminal-body {
    flex: 1;
    overflow-y: auto;
    padding: var(--space-lg);
    background: var(--bg-deep);
}

.message {
    display: flex;
    margin-bottom: var(--space-lg);
}

.message .prompt {
    font-size: 11px;
    color: var(--text-dim);
    flex-shrink: 0;
    width: 100px;
    padding-top: 2px;
}

.message.user .prompt {
    color: var(--user-msg);
}

.message-content {
    flex: 1;
    min-width: 0;
    font-size: 13px;
    line-height: 1.6;
}

/* User message */
.message.user {
    flex-direction: row-reverse;
}

.message.user .prompt {
    display: none;
}

.message.user .message-content {
    background: var(--user-msg);
    color: var(--user-msg-text);
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-md);
    max-width: 80%;
    display: inline-block;
}

/* Assistant message */
.message.assistant .message-content {
    color: var(--text-primary);
    padding: 0;
}

/* Content styling */
.message-content p {
    margin-bottom: var(--space-sm);
}

.message-content p:last-child {
    margin-bottom: 0;
}

.message-content code {
    background: var(--bg-elevated);
    padding: 1px 5px;
    border-radius: 2px;
    font-size: 0.95em;
    color: var(--accent);
}

.message-content pre {
    background: var(--bg-primary);
    border: 1px solid var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-sm);
    overflow-x: auto;
    margin: var(--space-sm) 0;
    font-size: 12px;
}

.message-content pre code {
    background: transparent;
    padding: 0;
    color: var(--text-primary);
}

.message-content a {
    color: var(--accent);
    text-decoration: none;
}

.message-content a:hover {
    text-decoration: underline;
}

.message-content h1,
.message-content h2,
.message-content h3 {
    font-size: 1.1em;
    font-weight: 600;
    margin: var(--space-md) 0 var(--space-sm);
    color: var(--text-primary);
}

.message-content ul,
.message-content ol {
    padding-left: var(--space-lg);
    margin: var(--space-sm) 0;
}

.message-content blockquote {
    border-left: 2px solid var(--bg-surface);
    padding-left: var(--space-md);
    color: var(--text-secondary);
    margin: var(--space-sm) 0;
}

.message-content table {
    border-collapse: collapse;
    width: 100%;
    margin: var(--space-sm) 0;
    font-size: 12px;
}

.message-content th,
.message-content td {
    border: 1px solid var(--bg-surface);
    padding: var(--space-xs) var(--space-sm);
    text-align: left;
}

.message-content th {
    background: var(--bg-elevated);
    font-weight: 600;
}

/* Message actions */
.message-actions {
    display: none;
    gap: var(--space-xs);
    margin-top: var(--space-xs);
}

.message:hover .message-actions {
    display: flex;
}

.message-action-btn {
    background: transparent;
    border: none;
    color: var(--text-dim);
    font-size: 10px;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 2px;
    transition: var(--transition);
}

.message-action-btn:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}

/* ============================================
   Input Area - Terminal prompt
   ============================================ */
.terminal-footer {
    background: var(--bg-primary);
    border-top: 1px solid var(--bg-surface);
    padding: var(--space-sm) var(--space-md);
}

.input-line {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    background: var(--bg-deep);
    border: 1px solid var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-xs) var(--space-sm);
    transition: var(--transition);
}

.input-line:focus-within {
    border-color: var(--accent);
}

.input-line .prompt {
    color: var(--accent);
    font-size: 12px;
    flex-shrink: 0;
}

#user-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-family: var(--font-mono);
    font-size: 13px;
    resize: none;
    min-height: 20px;
    max-height: 150px;
    line-height: 1.5;
    outline: none;
}

#user-input::placeholder {
    color: var(--text-dim);
}

.input-controls {
    display: flex;
    gap: var(--space-xs);
}

.icon-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    padding: var(--space-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon-btn:hover {
    background: var(--bg-elevated);
    color: var(--text-primary);
}

#send-btn {
    background: var(--accent);
    border: none;
    color: var(--bg-deep);
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
    flex-shrink: 0;
}

#send-btn:hover {
    background: var(--accent-bright);
}

#send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 80px;
    z-index: 1000;
}

.search-container {
    background: var(--bg-primary);
    border: 1px solid var(--bg-surface);
    border-radius: var(--radius-md);
    padding: var(--space-sm);
    width: 480px;
    max-width: 90%;
}

#chat-search-input {
    width: 100%;
    background: var(--bg-deep);
    border: 1px solid var(--bg-surface);
    color: var(--text-primary);
    padding: var(--space-sm);
    font-family: var(--font-mono);
    font-size: 13px;
    border-radius: var(--radius-sm);
}

#chat-search-input:focus {
    outline: none;
    border-color: var(--accent);
}

/* ============================================
   Loading
   ============================================ */
.typing-indicator {
    display: flex;
    gap: 4px;
    padding: var(--space-xs) 0;
}

.typing-indicator .dot {
    width: 5px;
    height: 5px;
    background: var(--text-muted);
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
.typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }
.typing-indicator .dot:nth-child(3) { animation-delay: 0s; }

@keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
}

/* ============================================
   Scrollbar
   ============================================ */
::-webkit-scrollbar {
    width: 6px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: var(--bg-surface);
    border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
    background: var(--bg-hover);
}

/* Focus */
*:focus-visible {
    outline: 1px solid var(--accent);
    outline-offset: 1px;
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
    .terminal-header {
        padding: 0 var(--space-sm);
    }
    
    .terminal-body {
        padding: var(--space-md);
    }
    
    .message .prompt {
        display: none;
    }
    
    .mode-selector {
        display: none;
    }
    
    .character-select {
        min-width: 80px;
        font-size: 10px;
    }
    
    .message.user .message-content {
        max-width: 90%;
    }
}

/* Hidden */
.stop-btn {
    display: none;
}

.stop-btn.visible {
    display: block;
}

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
