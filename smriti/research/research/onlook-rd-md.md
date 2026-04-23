---
source: "https://github.com/onlook-dev/onlook"
project: "narad"
role: "research"
type: "R&D"
status: "pending-discussion"
priority: "high"
tags: [ai, visual-coding, nextjs, design-to-code, competitive-analysis, R&D]
---

# Onlook - R&D Research

> "Cursor for Designers" - An open-source AI-first visual code editor for Next.js + TailwindCSS

## Quick Summary

Onlook is an open-source visual-first code editor that lets you build websites/apps by pointing, clicking, and using AI chat. It runs in the browser and edits code in real-time. Think of it as **Figma meets VS Code meets AI** — but for building actual working apps.

| Property | Value |
|----------|-------|
| **Stars** | 25.1k |
| **Forks** | 1.9k |
| **License** | Apache 2.0 |
| **Language** | TypeScript (99.2%) |
| **URL** | https://onlook.com |

## Core Features

### AI-Powered Creation
- Create apps from text prompts
- Import from images (AI interprets design)
- Import from Figma
- Import from GitHub repo
- Generate PRs to existing repos

### Visual Editing
- Figma-like drag-and-drop interface
- Real-time preview in iframe
- Right-click any element → jump to code
- Draw new divs, rearrange via drag
- Tailwind style adjustments via toolbar
- Layer browsing & component detection
- Branching for design experiments

### Collaboration
- Real-time multi-user editing
- Comments & annotations

### Deployment
- One-click deploy with sharable links
- Custom domain support

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Onlook Editor                       │
│  (Next.js + Tailwind + tRPC + Drizzle + Supabase)  │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              CodeSandbox SDK                         │
│              (Web Container)                         │
│  - Loads Next.js code                                │
│  - Runs dev server                                   │
│  - Serves preview via iframe                         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│              DOM Instrumentation                     │
│  - Maps DOM elements → code location                 │
│  - Bi-directional sync (visual ↔ code)              │
└─────────────────────────────────────────────────────┘
```

**Key Innovation**: The DOM-to-code mapping layer. When you edit visually, it edits the actual source code. When you edit code, the visual preview updates.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TailwindCSS, tRPC |
| Database | Supabase (Auth, DB, Storage) + Drizzle ORM |
| AI | AI SDK, OpenRouter, Morph, Relace |
| Sandbox | CodeSandboxSDK, Freestyle |
| Runtime | Bun, Docker |

## Competitive Landscape

| Tool | Type | Key Difference |
|------|------|----------------|
| **Bolt.new** | AI-only | No visual editing |
| **Lovable** | AI-only | No visual editing |
| **V0** | AI-only | No visual editing |
| **Cursor** | AI code editor | No visual UI editing |
| **Figma** | Design tool | No code generation |
| **Webflow** | Visual builder | No AI integration |

Onlook uniquely combines: **AI chat + Visual editing + Code-level control**

## What Can We Do With This? (For Discussion)

### 1. **Build a Similar Product**
- Fork and adapt for different frameworks (Vue, Svelte, React Native)
- Target specific niches (e.g., e-commerce builders, internal tools)

### 2. **Use as a Component**
- Embed the visual editor into your own SaaS
- Offer "visual site builder" to your customers

### 3. **Learn from Architecture**
- DOM instrumentation patterns
- AI + IDE integration
- Web container sandboxing

### 4. **Internal Tooling**
- Rapid prototyping for your team
- Design-to-code pipeline

### 5. **Enterprise/Hosting**
- Offer managed instances
- Add SSO, audit logs, team features

## Next Steps

- [ ] Discuss strategic alignment with Narad goals
- [ ] Evaluate build vs. buy decision
- [ ] Identify potential integration points
- [ ] Assess technical feasibility for our stack

## Resources

- [GitHub](https://github.com/onlook-dev/onlook)
- [Documentation](https://docs.onlook.com)
- [Demo](https://youtu.be/RSX_3EaO5eU)
- [Discord](https://discord.gg/hERDfFZCsH)