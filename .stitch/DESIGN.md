# Design System Strategy: Terminal Editorial

## 1. Overview & Creative North Star
The Creative North Star for this system is **"The Sovereign Console."** 

We are moving beyond a simple "hacker aesthetic" to create a high-end, editorialized command center. This design system treats the screen not as a webpage, but as a prestigious, high-performance instrument. By merging the brutalist efficiency of a MacBook Terminal with the sophisticated layout of a modern digital broadsheet, we achieve a look that is both authoritative and avant-garde.

To break the "template" look, we embrace **Radical Angularity**. Every corner is a sharp 90-degree angle; every transition is instantaneous or mechanically precise. We reject the "softness" of modern web design in favor of a rigid, intentional architecture that signals power and technical clarity.

---

## 2. Colors & Surface Philosophy
The palette is rooted in absolute contrast. We use deep, obsidian blacks to provide a void-like backdrop, allowing our high-chroma accents to vibrate with intensity.

### The "No-Line" Rule
Traditional UI relies on borders to separate intent. In this system, **1px solid borders are strictly prohibited for structural sectioning.** Boundaries are defined through:
1.  **Background Shifts:** Transitioning from `surface` (#131313) to `surface_container_low` (#1c1b1b).
2.  **Negative Space:** Using the spacing scale to create "rifts" between content blocks.
3.  **Chromatic Anchors:** Using a vertical `primary_container` (#00ff00) sliver to denote an active zone.

### Surface Hierarchy & Nesting
Treat the UI as a series of recessed or extruded modules. 
- **The Void (Base):** Use `surface` for the primary application background.
- **The Sub-Shell (Nesting):** Use `surface_container_lowest` (#0e0e0e) for input areas to create a "sunken" terminal feel.
- **The Elevated Module:** Use `surface_container_high` (#2a2a2a) for floating panels or modal-like overlays.

### Signature Textures & Glassmorphism
While the aesthetic is "hard," we add "soul" through technical glass. Use `surface_variant` (#353535) with a 60% opacity and a `20px backdrop-blur` for the top "traffic light" bar. This creates a subtle sense of depth, suggesting the interface is a high-grade lens sitting over a stream of data.

---

## 3. Typography
We utilize **Space Grotesk** as our monospaced engine. It provides the technical precision of a CLI with the legibility of a premium typeface.

- **Display (Scale: 3.5rem):** Reserved for system-level status or massive "Command" headers. Use `on_surface` with reduced letter-spacing (-0.05em).
- **Headline & Title:** Use for section headers. Primary user actions should be labeled in `headline-sm` using the `primary` (#eaffde) token to ensure they "pop" against the dark void.
- **Body:** Use `body-md` for all system logs and assistant responses.
- **Labels:** Use `label-sm` in `on_secondary_container` (#694600) for "System" metadata and `on_primary_container` (#027100) for "User" metadata.

**The Editorial Twist:** Mix font weights aggressively. Use `Bold` for system commands and `Light` for descriptive prose to create a rhythmic, structured hierarchy.

---

## 4. Elevation & Depth
In a world of sharp corners, depth is achieved through **Tonal Layering** and **Luminous Shadows.**

- **The Layering Principle:** To lift a component, do not use a stroke. Instead, place a `surface_container_highest` (#353535) element atop a `surface_dim` (#131313) background. The contrast in value provides all the separation required.
- **Luminous Shadows:** For floating command palettes, use a shadow with a 40px blur, 0% spread, and 8% opacity, tinted with `primary_fixed_dim` (#02e600). This mimics the "glow" of a CRT monitor rather than a physical shadow.
- **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., in a complex data grid), use the `outline_variant` (#3b4b35) at **15% opacity**. It should be felt, not seen.

---

## 5. Components

### The Header (Top Bar)
- **Background:** `surface_bright` (#393939) with a subtle 10% transparency and backdrop blur.
- **Controls:** Three circular "traffic light" icons (Red, Yellow, Green) positioned left-aligned. No icons or text labels; the color is the function.

### Buttons
- **Primary:** Background `primary_container` (#00ff00), Text `on_primary_fixed` (#002200). 0px border radius.
- **Secondary (System):** Background `secondary_container` (#fdaf00), Text `on_secondary_fixed` (#281800).
- **Tertiary:** No background. `outline` (#84967c) text with a `primary` underline on hover.

### Input Fields
- **State:** "The Command Line."
- **Style:** Background `surface_container_lowest` (#0e0e0e). No borders. A blinking 2px wide cursor using the `primary` (#eaffde) token. 
- **Error State:** Background shifts to `error_container` (#93000a) at 20% opacity. Text becomes `error` (#ffb4ab).

### Cards & Lists
- **Rule:** Absolute prohibition of divider lines. 
- **Execution:** Use vertical rhythm (32px spacing) to separate list items. For cards, use a subtle background shift to `surface_container_low` (#1c1b1b). When a card is "Active," apply a 2px left-border of `primary` (#eaffde).

### The "System Prompt" Chip
- **Usage:** Denotes who is speaking (User vs. System).
- **User:** Rectangular, `primary_container` background, `on_primary` text.
- **System:** Rectangular, `secondary_container` background, `on_secondary` text.

---

## 6. Do's and Don'ts

### Do:
- **Do** embrace the 0px radius. Every corner must be sharp to maintain the "Terminal" integrity.
- **Do** use "Scanning" animations. When content loads, use a subtle top-to-bottom light sweep (using `surface_tint`).
- **Do** lean into Monospaced alignment. Keep text blocks left-aligned to mimic code indentation.

### Don't:
- **Don't** use standard "Drop Shadows." They feel organic and "soft," which contradicts this system's mechanical nature.
- **Don't** use rounded icons. If icons are necessary, use pixel-perfect or sharp-edged glyphs.
- **Don't** use gradients unless they are "Linear Scans"—vertical transitions from a color to its "fixed_dim" variant to simulate screen refresh rates.

### Accessibility Note:
While the aesthetic is high-contrast, ensure that `on_surface_variant` text on `surface` backgrounds maintains a 4.5:1 ratio. If legibility drops, shift the text to `tertiary_fixed` (#e4e2e1).
