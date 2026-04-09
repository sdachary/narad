---
name: soft-ui-aesthetics
description: Expert in soft, approachable UI design. Creates interfaces with subtle depth, gentle shadows, muted palettes, and forgiving interactions.
---

# Soft UI Aesthetics Skill

## 1. DESIGN ETHOS
Soft UI (aka Neumorphism, Soft Plastic) creates interfaces that feel tangible, tactile, and human. It reduces cognitive load through visual gentleness.

## 2. CORE PRINCIPLES

### Depth Without Harshness
- Use soft inner shadows for extruded elements
- Use subtle outer shadows for floating elements
- Avoid hard drop shadows — always use blur ≥ 20px
- Layer depth: background < surface < elevated < floating

### Color Philosophy
- Background is never pure white or pure black
- Use warm off-whites (#F5F5F7, #FAFAFA) for light mode
- Use warm charcoals (#1C1C1E, #2C2C2E) for dark mode
- Accent colors should be pastel or muted, not saturated

### Surface Treatment
- Elements should feel like they're carved from the same material
- Use subtle gradients to simulate light direction
- Create "fake" lighting with asymmetric shadows (light from top-left)
- Rounded corners are essential — 16px minimum, 24px preferred

## 3. SOFT SHADOW SYSTEM

```css
:root {
  /* Light mode soft shadows */
  --soft-shadow-raised: 
    8px 8px 16px rgba(0, 0, 0, 0.08),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
    
  --soft-shadow-pressed:
    inset 4px 4px 8px rgba(0, 0, 0, 0.08),
    inset -4px -4px 8px rgba(255, 255, 255, 0.8);
    
  --soft-shadow-floating:
    16px 16px 32px rgba(0, 0, 0, 0.1),
    -8px -8px 24px rgba(255, 255, 255, 0.6);
    
  /* Dark mode soft shadows */
  --soft-shadow-raised-dark:
    8px 8px 16px rgba(0, 0, 0, 0.4),
    -6px -6px 12px rgba(255, 255, 255, 0.05);
    
  --soft-shadow-pressed-dark:
    inset 4px 4px 8px rgba(0, 0, 0, 0.4),
    inset -4px -4px 8px rgba(255, 255, 255, 0.03);
}
```

## 4. COMPONENT TREATMENT

### Buttons
- Never flat — always have a raised appearance
- On press: switch to pressed shadow (inset)
- Use subtle gradient for surface variation
- Border-radius: 50px (pill shape) or 16px

### Cards & Containers
- Soft raised appearance as default state
- Hover: slightly more raised (increase shadow distance)
- Content within has subtle inset border
- No hard borders — use shadow boundaries

### Inputs & Fields
- Inset soft shadow for input field (carved in)
- Label floats on focus with smooth transition
- Focus state adds accent color glow ring

### Toggles & Switches
- Track has pressed (inset) appearance
- Thumb has raised appearance
- On toggle: thumb slides with subtle bounce

## 5. MOTION & INTERACTION

### Easing
- Use gentle easings: `cubic-bezier(0.4, 0, 0.2, 1)`
- Durations: 200-400ms (not too fast, not slow)
- Spring physics for bouncy interactions

### Micro-Interactions
- Press: element "compresses" (shadow inverts)
- Hover: element "lifts" (shadow expands outward)
- Focus: subtle glow ring appears
- Loading: gentle pulse animation

### State Transitions
- Never abrupt — always interpolate shadows
- Color transitions: 200ms ease
- Transform transitions: 300ms with slight overshoot

## 6. TYPOGRAPHY FOR SOFT UI

- Use rounded, friendly sans-serif fonts
- Inter, Nunito, Quicksand, or system rounded
- Font weights: prefer 400-500, avoid bold
- Letter spacing: slightly increased for readability
- Text colors: never pure black (#000), use #333-#555

## 7. FORBIDDEN PATTERNS

- Flat, material-style design
- Hard drop shadows
- High contrast borders
- Vibrant, saturated accent colors
- Sharp corners (anything < 12px)
- Brutalist or stark interfaces

## 8. LIGHT + DARK ADAPTATION

### Light Mode
- Background: #F0F0F3 or similar
- Surface tint: slight warm or cool based on brand
- Shadows: light source from top-left

### Dark Mode
- Background: #1C1C1E or similar
- Surface tint: slight elevation in brightness
- Shadows: light source from top-left, less contrast

---

**Soft UI creates interfaces users want to touch. Make everything feel gentle.**