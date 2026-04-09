---
source: "/home/runner/work/narad/narad/sync_temp/narad/skills/minimalist-editorial-interfaces.md"
project: "narad"
role: docs
language: markdown
frameworks: [typescript]
lines: 197
size: 5375 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docs, documentation, markdown, project/narad, typescript]
---

# minimalist-editorial-interfaces.md

> Documentation using **typescript** (197 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/skills/minimalist-editorial-interfaces.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 197 |
| **Size** | 5375 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
name: minimalist-editorial-interfaces
description: Expert in clean, editorial-first design. Removes visual noise, prioritizes content hierarchy, and creates sophisticated minimal interfaces.
---

# Minimalist Editorial Skill

## 1. DESIGN PHILOSOPHY

Minimalism is not about removing features — it's about removing distraction. Every element must earn its place. Content is the interface.

## 2. CORE PRINCIPLES

### The Less-More Ratio
- 90% whitespace, 10% content by visual weight
- Remove all decorative elements that don't serve a function
- Every pixel should either convey information or create breathing room

### Hierarchy Through Subtraction
- Don't use size to create hierarchy — use placement and space
- The most important element should have the most negative space around it
- Create tension through asymmetry, not decoration

### Typography as Interface
- Type is the primary UI element
- Use type weight, size, and spacing to indicate relationships
- One typeface family, 3-4 weights maximum
- Let the content breathe in generous line-height (1.6-1.8)

## 3. COLOR SYSTEM

```css
:root {
  /* Stark minimal palette */
  --color-bg: #FFFFFF;
  --color-bg-subtle: #FAFAFA;
  --color-text: #0A0A0A;
  --color-text-muted: #6B6B6B;
  --color-text-subtle: #9B9B9B;
  --color-accent: #000000;
  --color-border: #E5E5E5;
  --color-border-strong: #CCCCCC;
  
  /* Dark mode */
  --color-bg-dark: #0A0A0A;
  --color-bg-subtle-dark: #141414;
  --color-text-dark: #FAFAFA;
  --color-text-muted-dark: #A0A0A0;
  --color-border-dark: #2A2A2A;
}
```

## 4. LAYOUT & SPACING

### Grid System
- 12-column grid for complex layouts
- Single column for editorial content
- Maximum content width: 680px for readability
- Generous margins: 48px mobile, 80px+ desktop

### Spacing Scale
```css
:root {
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
}
```

### Visual Rhythm
- Use multiples of 8px or 4px
- Create space between groups, not just elements
- Let elements breathe — don't pack

## 5. COMPONENT DIRECTIVES

### Buttons
- No background by default, text only
- Subtle underline on hover (1px)
- No border, no shadow, no fill
- Maximum padding: 16px vertical, 24px horizontal
- Thin, elegant typography

### Cards
- No borders, no shadows by default
- Use whitespace to define boundaries
- Only add subtle border if on same background
- Content width should be narrow (60-80 characters)

### Forms
- Labels above inputs, small size (12-14px)
- Inputs: bottom border only (1px)
- No placeholder text — use floating labels
- Submit button: text only with arrow icon

### Navigation
- Simple horizontal list, left-aligned
- Active state: dot indicator or subtle underline
- No background, no container — free-floating
- Logo as text, not icon

## 6. TYPOGRAPHY

### Typeface Selection
- Choose one high-quality serif or sans-serif
- Prefer: Inter, SF Pro, Satoshi, Newsreader, Fraunces
- Variable fonts for fine weight control
- Never mix multiple typefaces

### Scale
```css
:root {
  --text-xs: 0.75rem;    /* 12px - meta */
  --text-sm: 0.875rem;   /* 14px - secondary */
  --text-base: 1rem;     /* 16px - body */
  --text-lg: 1.25rem;    /* 20px - lead */
  --text-xl: 1.5rem;     /* 24px - h4 */
  --text-2xl: 2rem;      /* 32px - h3 */
  --text-3xl: 2.5rem;    /* 40px - h2 */
  --text-4xl: 3.5rem;    /* 56px - h1 */
  --text-5xl: 5rem;      /* 80px - hero */
}
```

### Body Text Rules
- Line-height: 1.6-1.8
- Line length: 60-75 characters max
- Paragraph spacing: 1.5em
- No justified text — left align only

## 7. INTERACTION DESIGN

### Motion Philosophy
- Motion should be invisible when not needed
- When visible: slow, deliberate, smooth
- Duration: 400-800ms for meaningful transitions
- Easing: cubic-bezier(0.16, 1, 0.3, 1)

### Micro-Interactions
- Hover: opacity change (0.6 → 1) or subtle color shift
- Focus: thin outline (1px), not thick ring
- Click: scale down slightly (0.98)
- Loading: simple spinner or skeleton

### Page Transitions
- Crossfade with slight Y offset
- Staggered content reveal (not all at once)
- No elaborate animations — content just appears

## 8. FORBIDDEN PATTERNS

- Decorative backgrounds (gradients, patterns)
- Heavy borders or dividers
- Color as the primary differentiator
- Rounded corners > 8px
- Icons unless essential
- Shadows (use space instead)
- Fill buttons (use text or outline)
- Multiple fonts or font weights

## 9. MINIMALIST ANTI-PATTERNS TO AVOID

### Empty Minimalism
- Removing so much that interface becomes confusing
- No affordances for interactivity
- Missing essential information

### False Minimalism
- Hiding complexity instead of simplifying
- Using icons instead of text
- Adding "hidden" menus that users can't discover

### Lazy Minimalism
- No typography hierarchy
- Generic sans-serif with no character
- No thought to spacing or rhythm

## 10. QUALITY CHECKLIST

Before finalizing any minimalist design:
- [ ] Can I remove one more element?
- [ ] Is there a visual hierarchy?
- [ ] Does it look intentional, not bare?
- [ ] Is the typography excellent?
- [ ] Does it have room to breathe?
- [ ] Are interactions still discoverable?

---

**Minimalism is not the absence of things — it's the perfect amount of things.**
```
