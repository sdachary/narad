---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/index.html"
project: "narad"
role: page
language: html
frameworks: [docker, typescript]
lines: 153
size: 9271 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [code, docker, html, page, project/narad, typescript]
---

# index.html

> Web page using **docker, typescript** (153 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/index.html` |
| **Role** | page |
| **Language** | html |
| **Frameworks** | docker, typescript |
| **Lines** | 153 |
| **Size** | 9271 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Narad | Terminal AI</title>
    <meta name="description" content="A simple, powerful MacBook Terminal-themed AI chat interface with neural workspace modes.">
    <meta name="csrf-token" content="">
    <meta name="api-base" content="">
    <meta name="theme-color" content="#0a0a0a">
    <meta property="og:title" content="Narad - Terminal AI">
    <meta property="og:description" content="Neural workspace AI assistant with terminal-inspired interface">
    <meta property="og:type" content="website">
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600&display=swap" rel="stylesheet">
    <link rel="preload" as="style" href="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/styles/github-dark.min.css"></noscript>
    <script src="https://cdn.jsdelivr.net/npm/marked@15.0.6/marked.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/core.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/languages/javascript.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/languages/python.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/languages/bash.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/languages/json.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/languages/css.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/languages/xml.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/highlight.js@11.11.1/lib/languages/sql.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/dompurify@3.2.4/dist/purify.min.js" defer></script>
    <script src="https://unpkg.com/lucide@latest" defer></script>
</head>
<body>
    <a href="#chat-messages" class="skip-link">Skip to main content</a>
    <div class="sidebar-layout">
        <aside class="terminal-sidebar collapsed" id="sidebar">
            <div class="sidebar-header">
                <h3>NEURAL CHANNELS</h3>
                <button id="new-chat-btn" class="icon-btn" title="New Session">
                    <i data-lucide="plus"></i>
                </button>
            </div>
            <div id="session-list" class="session-list">
                <!-- Sessions populated from app.js -->
            </div>
        </aside>

        <div class="terminal-window">
        <header class="terminal-header">
            <button id="sidebar-toggle" class="sidebar-toggle-btn" aria-label="Toggle sidebar navigation" role="button" tabindex="0">
                <i data-lucide="menu" aria-hidden="true"></i>
            </button>
            <div class="terminal-title">Narad @ macOS — zsh</div>
            
            <div class="header-right">
                <button id="theme-toggle-btn" class="header-btn" title="Toggle Theme" aria-label="Toggle dark/light theme" role="button" tabindex="0">
                    <i data-lucide="moon" id="theme-icon" aria-hidden="true"></i>
                </button>
                <div class="mode-selector" id="mode-selector" role="radiogroup" aria-label="Select AI mode">
                    <button class="mode-chip" data-mode="casual" role="radio" aria-checked="false" aria-label="Casual mode">CASUAL</button>
                    <button class="mode-chip" data-mode="rnd" role="radio" aria-checked="false" aria-label="Research and Development mode">R&D</button>
                    <button class="mode-chip" data-mode="build" role="radio" aria-checked="false" aria-label="Build mode">BUILD</button>
                </div>
                <select id="character-select" class="character-select">
                    <option value="default">Default</option>
                    <optgroup label="── Communication Style ──">
                        <option value="professional">Professional</option>
                        <option value="casual">Casual</option>
                        <option value="mentor">Mentor</option>
                        <option value="technical">Technical</option>
                        <option value="concise">Concise</option>
                    </optgroup>
                    <optgroup label="── Local Skill Agents ──">
                        <option value="financial_advisor">Financial Advisor</option>
                        <option value="systematic_debugger">Systematic Debugger</option>
                        <option value="frontend_architect">Frontend Architect</option>
                        <option value="database_engineer">Database Engineer</option>
                        <option value="testing_lead">Testing & QA Lead</option>
                        <option value="multi_agent_expert">Multi-Agent Systems Expert</option>
                        <option value="knowledge_architect">Knowledge Architect</option>
                        <option value="review_specialist">Review Specialist</option>
                        <option value="mcp_designer">MCP Designer</option>
                    </optgroup>
                </select>
                <button id="search-btn" class="header-btn" title="Search (⌘F)" aria-label="Search in conversation" role="button" tabindex="0">
                    <i data-lucide="search" aria-hidden="true"></i>
                </button>
                <button id="clear-history-btn" class="header-btn" title="Clear (⌘K)" aria-label="Clear chat history" role="button" tabindex="0">
                    <i data-lucide="trash-2" aria-hidden="true"></i>
                </button>
                <button id="stop-search-btn" class="header-btn stop-btn" style="display:none;" title="Stop (⌃C)" aria-label="Stop current operation" role="button" tabindex="0">
                    <i data-lucide="square" aria-hidden="true"></i>
                </button>
                <div class="status-badge" id="service-status" onclick="checkApiHealth();">
                    <span class="status-dot" id="api-dot"></span>
                    <span class="status-text" id="api-status">Connecting...</span>
                </div>
                <button id="help-btn" class="header-btn" title="Help & Commands">
                    <i data-lucide="help-circle"></i>
                </button>
            </div>
        </header>

        <main class="terminal-body" id="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
            <div class="message assistant" role="article" aria-label="Assistant message">
                <span class="prompt">[narad@system]</span>
                <div class="message-content">Hello. I am Narad, your Terminal AI. How can I assist you today?</div>
            </div>
        </main>

        <footer class="terminal-footer">
            <form id="chat-form" class="input-line">
                <span class="prompt">[user@macos] &gt;</span>
                <textarea id="user-input" placeholder="Type a message or command..." autocomplete="off" rows="1" aria-label="Type your message" role="combobox" aria-multiline="false"></textarea>
                <div class="input-controls">
                    <button type="button" id="voice-input-btn" class="icon-btn" title="Voice Input">
                        <i data-lucide="mic"></i>
                    </button>
                    <button type="submit" id="send-btn" class="icon-btn">
                        <i data-lucide="send"></i>
                    </button>
                </div>
            </form>
        </footer>
    </div>

    <!-- Search Overlay -->
    <div id="chat-search-overlay" class="search-overlay" style="display:none;">
        <div class="search-container">
            <input type="text" id="chat-search-input" placeholder="Search messages...">
            <button id="search-close-btn" class="header-btn">✕</button>
        </div>
    </div>

    <!-- UI Components for functionality (hidden or integrated) -->
    <div style="display:none;">
        <input type="file" id="image-input" accept="image/*">
        <button id="image-upload-btn"></button>
        <div id="image-preview"></div>
        <div id="usage-ring">
            <span class="tokens"></span>
            <span class="percent"></span>
            <circle class="ring-progress"></circle>
        </div>
        <button id="clear-chat-btn"></button>
        <button id="voice-output-btn"></button>
    </div>

    </div>

    <script src="app.js" type="module" defer></script>
</body>
</html>

```
