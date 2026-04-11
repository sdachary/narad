# Narad Modern Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Narad UI into a "Serene Workspace" (Claude/ChatGPT inspired) and ensure robust backend wiring.

**Architecture:** Update central CSS tokens, implement centered horizontal layout for the chat thread, modernize component-level styling, and verify backend API integration.

**Tech Stack:** React, Tailwind CSS, Lucide Icons, Fetch API.

---

### Task 1: Global Theme & Tokens
Update the visual foundations for the "Serene" look.

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Update CSS Variables**
  Replace current values in `:root` and `[data-theme='dark']` with softer palette:
  - Background: `#F9FAF8`
  - Secondary Bg: `#F3F4F1`
  - Message/Card Bg: `#FFFFFF`
  - Accent: `#4F46E5`
  - Text: `#111827`
- [ ] **Step 2: Large Radiuses & Smooth Shadows**
  Update `.rounded-*` and shadow utilities in `index.css`.
- [ ] **Step 3: Commit**
  `git add src/index.css && git commit -m "style: update theme tokens for serene workspace"`

### Task 2: Responsive Shell & Sidebar
Ensure the core layout is centered and responsive.

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/components/Sidebar.jsx`
- Modify: `src/components/Header.jsx`

- [ ] **Step 1: Refine Sidebar Styling**
  Apply softer backgrounds and modern list spacing in `Sidebar.jsx`.
- [ ] **Step 2: Center the Chat thread**
  Ensure `App.jsx` uses a centered container for the main content area.
- [ ] **Step 3: Commit**
  `git add src/App.jsx src/components/Sidebar.jsx src/components/Header.jsx && git commit -m "style: modernize shell and sidebar"`

### Task 3: ChatArea & Messages
Redesign bubbles into modern blocks.

**Files:**
- Modify: `src/components/ChatArea.jsx`

- [ ] **Step 1: Redesign Message Bubbles**
  Update message map: User as soft cards, Assistant as clean text blocks.
- [ ] **Step 2: Commit**
  `git add src/components/ChatArea.jsx && git commit -m "style: redesign chat bubbles"`

### Task 4: Modern Pill Input
Transform the input area.

**Files:**
- Modify: `src/components/InputArea.jsx`

- [ ] **Step 1: Styling the Input Pill**
  Update `InputArea.jsx` to be a centered floating pill with a subtle shadow.
- [ ] **Step 2: Commit**
  `git add src/components/InputArea.jsx && git commit -m "style: transform input into floating pill"`

### Task 5: Backend Wiring & Verification
Verify backend connectivity in the new UI.

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/lib/api.js`

- [ ] **Step 1: Verify API integration**
  Confirm the new UI correctly triggers `sendChat` and handles the response.
- [ ] **Step 2: Verification Run**
  Run `npm run dev` and test a full chat flow (Send -> Receive -> History).
- [ ] **Step 3: Final Commit**
  `git commit -am "chore: final backend wiring and cleanup"`
