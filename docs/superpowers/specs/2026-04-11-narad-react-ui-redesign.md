# Narad React UI Redesign — Specification

**Date**: 2026-04-11
**Status**: Approved
**Tech**: React + Tailwind CSS + 21st.dev

---

## Overview

Migrate narad from vanilla HTML/CSS/JS to React using 21st.dev components. Keep terminal aesthetic with glassmorphism + brutalist touches.

**Preserved**: All functionality (sessions, commands, brain, RAG, multi-agent, keyboard shortcuts)

---

## Layout

```
┌──────────┬─────────────────────────────────────────┐
│ Sidebar  │              Header                   │
│  240px  │              40px                  │
├──────────┼─────────────────────────────────────────┤
│          │                                         │
│ Sessions │           Chat Messages                  │
│          │                                         │
│          │                                         │
├──────────┼─────────────────────────────────────────┤
│          │         Input Area                       │
└──────────┴─────────────────────────────────────────┘
```

---

## Components

### 1. Sidebar
- **Width**: 240px fixed
- **Style**: Glass panel (backdrop-blur, semi-transparent)
- **Elements**:
  - Header: "Sessions" title + New Session button
  - Session list: hover glow, active state with accent border
  - Delete session (appears on hover)

### 2. Header
- **Height**: 40px
- **Elements**:
  - Logo/Title: "narad" with green status dot
  - Buttons: Theme, Search, Clear, Brain Stats, Stop
  - API Status badge

### 3. Chat Area
- **Message bubbles**:
  - User: Green background (#238636), rounded
  - Assistant: Glass card with code support
- **Markdown rendering**: Same as before (marked + highlight.js)
- **Code blocks**: Syntax highlighted, copy button

### 4. Input Area
- **Style**: Glass input field
- **Elements**:
  - Prompt prefix: `>` in accent color
  - Textarea: auto-expand, max 150px
  - Send button: Accent color, glow on hover

### 5. Command Palette
- **Trigger**: `/` key or click input
- **Style**: Floating modal, backdrop blur
- **Elements**: Fuzzy search, command list

### 6. Modals
- **Brain Stats**: Centered glass card
- **Search Overlay**: Semi-transparent backdrop

---

## Color Palette

```css
/* Dark Theme */
--bg: #0d1117;
--bg-secondary: rgba(22, 27, 34, 0.8);  /* with backdrop-filter */
--bg-tertiary: rgba(33, 38, 45, 0.6);
--border: #30363d;

/* Text */
--text: #e6edf3;
--text-secondary: #8b949e;
--text-muted: #6e7681;

/* Accent */
--accent: #58a6ff;
--accent-hover: #79c0ff;

/* Status */
--success: #3fb950;
--error: #f85149;

/* User */
--user-bg: #238636;
--user-text: #ffffff;
```

---

## Typography

- **Font**: JetBrains Mono (keep)
- **Base size**: 14px (up from 13px)
- **Line height**: 1.6

---

## 21st.dev Components to Use

1. `AI Chat Input` — modified for terminal style
2. `Chat Bubbles` — for messages
3. `Command Palette` — for /commands
4. `Glass Card` — for modals
5. `Buttons` — for header actions
6. `Search Modal` — for search overlay

---

## Data Flow

```
React State
├── sessions: Session[]
├── messages: Message[]
├── currentSession: string
├── theme: 'dark' | 'light'
├── isProcessing: boolean
└── showCommands: boolean

LocalStorage
└── narad_sessions: Session[]

API (unchanged)
├── POST /chat
├── GET /brain/stats
└── ...
```

---

## Keyboard Shortcuts (Preserved)

| Shortcut | Action |
|---------|--------|
| Cmd+T | Toggle theme |
| Cmd+K | Clear chat |
| Cmd+F | Search |
| Ctrl+C | Stop |
| / | Command palette |

---

## Acceptance Criteria

1. ✅ All current functionality works
2. ✅ Glass + brutalist aesthetic matches spec
3. ✅ Dark/light theme toggle works
4. ✅ Sessions persist in LocalStorage
5. ✅ Responsive (mobile-friendly sidebar collapses)
6. ✅ Code highlighting preserved
7. ✅ Command palette works