---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/taste-skill-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 335
size: 10427 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# taste-skill-md-md.md

> Documentation using **docker, typescript** (335 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/taste-skill-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 335 |
| **Size** | 10427 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/taste-skill-md.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 297
size: 9651 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# taste-skill-md.md

> Documentation using **docker, typescript** (297 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/taste-skill-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 297 |
| **Size** | 9651 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/skills/taste-skill.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker, typescript]
lines: 260
size: 8906 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docker, docs, documentation, markdown, project/narad, typescript]
---

# taste-skill.md

> Documentation using **docker, typescript** (260 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/skills/taste-skill.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 260 |
| **Size** | 8906 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
name: design-taste-frontend
description: Senior UI/UX Engineer. Architect digital interfaces overriding default LLM biases. Enforces metric-based rules, strict component architecture, CSS hardware acceleration, and balanced design engineering.
---

# High-Agency Frontend Skill

## 1. ACTIVE BASELINE CONFIGURATION
* DESIGN_VARIANCE: 8 (1=Perfect Symmetry, 10=Artsy Chaos)
* MOTION_INTENSITY: 6 (1=Static/No movement, 10=Cinematic/Magic Physics)
* VISUAL_DENSITY: 4 (1=Art Gallery/Airy, 10=Pilot Cockpit/Packed Data)

## 2. ARCHITECTURE & CONVENTIONS

### Component Architecture
- Atomic design with 5 tiers: primitives (buttons, inputs) → molecules (form groups) → organisms (cards, nav) → templates (page layouts) → pages
- Every component MUST have a token-based design system backing (colors, spacing, typography as CSS variables)
- ZERO inline styles — all styles via composition of design tokens
- Components must be composable and reusable with clear API (props/slots)

### Design Tokens
```css
:root {
  /* Palette - Semantic naming */
  --color-surface-primary: #0D0D0D;
  --color-surface-elevated: #1A1A1A;
  --color-text-primary: #FAFAFA;
  --color-text-muted: #A3A3A3;
  --color-accent-primary: #6366F1;
  --color-accent-gradient: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
  
  /* Spacing - 4px base grid */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 2rem;
  --text-4xl: 2.5rem;
  
  /* Motion */
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-sine: cubic-bezier(0.37, 0, 0.63, 1);
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  
  /* Shadows & Elevation */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 24px rgba(99, 102, 241, 0.3);
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

## 3. DESIGN ENGINEERING DIRECTIVES

### CSS Hardware Acceleration
- All transforms and opacity animations use `will-change: transform, opacity`
- Use `transform: translateZ(0)` for GPU layering
- Avoid animating layout-triggering properties (width, height, top, left)
- Prefer `transform` and `opacity` for 60fps animations

### Layout Strategy
- CSS Grid for 2D layouts (dashboards, galleries)
- Flexbox for 1D layouts (lists, navs, button groups)
- Avoid absolute positioning unless absolutely necessary (modals, dropdowns, tooltips)
- Use container queries (`container-type: inline-size`) for responsive components

### Typography Rules
- Line height: 1.5 for body, 1.2 for headings
- Letter spacing: -0.02em for headings, normal for body
- Never use pure black (#000) — use dark surfaces with light text for contrast
- Use optical alignment for icon + text combinations

### Color System
- Dark mode first — default interface is dark with light accents
- Semantic colors: success (#22C55E), warning (#F59E0B), error (#EF4444), info (#3B82F6)
- Use opacity for states: hover (10% lighter), active (15% lighter), disabled (50% opacity)
- Additive color for gradients — never subtract

## 4. CREATIVE PROACTIVITY

### Before Generating Code, ALWAYS:
1. Identify the user's actual goal (not just the surface request)
2. Propose 2-3 design alternatives without prompting
3. Add delightful micro-interactions that serve the user's emotional journey
4. Consider accessibility (color contrast, keyboard nav, screen readers)

### Design Variance Dial (8 = Default)
- 1-3: Corporate/Enterprise — conservative, data-dense, minimal animation
- 4-6: Modern SaaS — balanced, clean, purposeful motion
- 7-9: Creative/Tech — bold, experimental, expressive
- 10: Artistic/Brand — avant-garde, signature moments

### Motion Intensity Dial (6 = Default)
- 1-2: Static — no motion, instant state changes
- 3-4: Functional — subtle transitions on hover/focus
- 5-7: Expressive — choreographed state transitions, staggered reveals
- 8-10: Cinematic — scroll-driven animations, physics-based motion

## 5. PERFORMANCE GUARDRAILS

### Metrics to Enforce
- First Contentful Paint < 1.8s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Total CSS bundle < 50KB (gzipped)
- Zero JavaScript for static content

### Optimization Rules
- Lazy load images below the fold with `loading="lazy"`
- Use CSS containment (`contain: layout style paint`) for complex components
- Debounce scroll listeners, use IntersectionObserver
- Preload critical fonts, use `font-display: swap`
- Inline critical CSS, defer the rest

## 6. DIAL DEFINITIONS

### Visual Density (4 = Default)
- 1-2: Gallery — maximum whitespace, single-column, hero focus
- 3-4: Editorial — comfortable reading, moderate padding, 2-column max
- 5-7: Dashboard — compact but scannable, data-first, dense tables
- 8-10: Cockpit — minimum padding, multi-panel, real-time data

### Component Patterns to Master
- **Cards**: Elevated surfaces with consistent padding (space-4 or space-6), subtle border, shadow on hover
- **Buttons**: Minimum touch target 44px, clear state hierarchy (primary/secondary/ghost)
- **Forms**: Labels above inputs, 48px input height, inline validation
- **Navigation**: Sticky header with blur backdrop, active state indicator
- **Modals**: Centered, backdrop blur, focus trap, escape to close

## 7. AI TELLS / FORBIDDEN PATTERNS

### Generic Output Markers (AVOID)
- "Here's a clean and modern UI..."
- "This component is fully responsive..."
- Basic Tailwind buttons without customization
- Generic placeholder content like "Lorem ipsum"
- Unstyled or barely-styled wireframes
- Missing hover/focus states
- No dark mode consideration

### Design Anti-Patterns
- Using default browser styles
- Flat design without depth signals
-单一色调 without accent variation
- Inconsistent spacing (not on 4px grid)
- Typography hierarchy gaps (skip sizes)
- No transition between states

### Must-Have Differentiators
- Custom cursor states
- Thoughtful micro-interactions on every interactive element
- Loading states that feel brand-aligned
- Empty states that guide action
- Error states that are helpful, not alarming
- Skeleton screens for async content

## 8. CREATIVE ARSENAL

### Micro-Interactions Library
```
hover scale → transform: scale(1.02)
click pulse → transform: scale(0.98) with spring
focus ring → box-shadow with accent color
drag feedback → transform + opacity combo
scroll reveal → opacity + translateY staggered
tab switch → underline slide with ease
toggle → thumb slide with background fill
toast enter → slide + fade from edge
```

### Gradient Recipes
```css
/* Subtle depth */
--gradient-surface: linear-gradient(180deg, #1A1A1A 0%, #0D0D0D 100%);

/* Accent pop */
--gradient-accent: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #D946EF 100%);

/* Glass morphism */
--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-blur: blur(16px);
```

### Animation Patterns
```css
/* Stagger children */
.stagger-children > * {
  animation: fadeUp 0.4s var(--ease-out-expo) both;
}
.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 50ms; }
.stagger-children > *:nth-child(3) { animation-delay: 100ms; }

/* Magnetic hover */
.magnetic:hover {
  transform: translate(var(--x), var(--y));
}
```

## 9. MOTION-ENGINE BENTO PARADIGM

### Bento Grid Principles
- Fixed-ratio grid cells (1:1, 4:3, 16:9, 2:1)
- Asymmetric layouts for visual interest
- Content spans multiple cells for hierarchy
- Gap between cells: 16px-24px
- Rounded corners on grid container, not individual cells

### Bento Component Structure
```
+------------------------------------------+
|  [Large Card - 2x2]  |  [Tall Card - 1x2] |
|                      |--------------------|
|                      |  [Small Card - 1x1]|
|----------------------+--------------------|
| [Wide Card - 2x1]    | [Square - 1x1]    |
+------------------------------------------+
```

### Bento Motion Rules
- Hover: Card lifts with shadow, slight scale
- Click: Ripple from click point, scale down
- Reveal: Cards fade in with stagger, slight Y offset
- Focus: Active card brightens, others dim

---

## ENFORCEMENT

This skill OVERRIDES default LLM tendencies toward:
- Generic Bootstrap/Tailwind defaults
- Plain unstyled HTML
- Lazy "good enough" solutions
- No design system thinking
- Ignoring motion/interaction

Always elevate. Always specify. Always design engineer.
```

```

```
