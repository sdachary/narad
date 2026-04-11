# Design Spec: Narad Modern Chat Redesign

## 1. Goal & Vision
The goal is to transform Narad from its current "Terminal Editorial" (hacker-style) UI into a "Serene Workspace"—a clean, modern, and approachable chat interface inspired by ChatGPT and Claude. The design prioritizes readability, accessibility, and a premium feel across both laptop and mobile browsers.

## 2. Requirements
- **Approachable Aesthetic:** Move away from high-contrast neon/black to a soft, balanced palette.
- **Centered Layout:** Implement a centered chat thread with a max-width (approx. 768px) on desktop to provide focus.
- **Responsiveness:** Full-width layout on mobile with a drawer-style sidebar.
- **Premium Vibe:** Utilize rounded corners (16px+), subtle shadows, and modern typography (Inter).

## 3. Architecture & Structure
The current React component structure (`Sidebar`, `ChatArea`, `InputArea`, `Header`) will be preserved but their styles and layouts will be fundamentally updated.

### Layout Hierarchy
- **Shell:** A flex container managing the sidebar and main chat area.
- **Sidebar (Collapsible):** 280px width on desktop (collapsible), 100% width drawer on mobile.
- **Main Chat:** A scrollable container with a centered internal wrapper for messages.
- **Thread:** Individual message cards centered horizontally.
- **Input Area:** A floating or bottom-docked pill-shaped input, centered with the chat thread.

## 4. Visual Design Details
- **Colors (Light Mode):**
  - Background: `#F9FAF8` (Gentle "Paper" feel)
  - Cards/Bubbles: `#FFFFFF`
  - Text: `#111827` (Charcoal)
  - Sidebar: `#F3F4F1`
- **Typography:** `Inter, system-ui, sans-serif`.
- **Radiuses:**
  - Main cards: `16px`
  - Input pill: `24px`
- **Transitions:** Smooth CSS transitions for sidebar toggles and message entries.

## 5. Technical Implementation Details
- **Styling:** Use Tailwind CSS or Vanilla CSS variables (leveraging existing project setup).
- **Responsive Breakpoints:** 
  - Mobile: `< 768px` (Sidebar becomes a hidden drawer).
  - Tablet/Laptop: `> 768px` (Centered layout active).
- **Stitch Integration:** Utilize `StitchMCP` to generate/refine high-fidelity components based on the approved mockups.

## 6. Verification Plan
- **Manual UI Audit:** Verify layout centering on high-resolution monitors.
- **Mobile responsiveness:** Test on various screen widths using browser devtools.
- **Visual Contrast:** Ensure WCAG AA compliance for the new color palette.
- **Functional Check:** Ensure all current features (new session, delete session, search, etc.) remain fully functional in the new UI.
