---
source: "https://github.com/AnmolSaini16/mapcn"
project: "narad"
role: "research"
type: "R&D"
status: "pending-discussion"
priority: "medium"
tags: [react-components, maps, maplibre, tailwind, shadcn-ui, open-source, R&D]
---

# MapCN - R&D Research

> "Beautiful map components. 100% Free, Zero config, one command setup."

## Quick Summary

MapCN is a free, open-source React component library for maps. Built on MapLibre GL, styled with TailwindCSS, and compatible with shadcn/ui patterns. Zero configuration, one-command setup.

| Property | Value |
|----------|-------|
| **Stars** | 7k |
| **Forks** | 363 |
| **Commits** | 71 |
| **License** | MIT |
| **Language** | TypeScript (97.9%) |
| **URL** | https://mapcn.dev |

## Core Features

### Theme-Aware
- Automatic light/dark mode adaptation
- Seamless theme switching

### Zero Config
- Works out of the box with sensible defaults
- No complex setup required

### shadcn/ui Compatible
- Uses same patterns and styling conventions
- Fits naturally with existing shadcn projects

### MapLibre GL Powered
- Full access to MapLibre's mapping capabilities
- No vendor lock-in

### Composable Components
- Build complex map UIs with simple, declarative components
- Modular and reusable

### Additional Features
- **Markers & Popups**: Rich marker system with tooltips and labels
- **Routes**: Draw paths on maps
- **Controls**: Zoom, compass, locate, fullscreen

## Tech Stack

| Layer | Technology |
|-------|------------|
| Maps | MapLibre GL |
| Styling | TailwindCSS |
| UI Pattern | shadcn/ui |
| Framework | React / Next.js |

## Basemap Terms

- **Commercial use**: Requires CARTO Enterprise license
- **Non-commercial**: Free under CARTO basemap terms
- **Alternative**: OpenStreetMap, MapTiler, Stadia Maps

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  MapCN Components               │
├─────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ Map      │ │ Markers  │ │ Popups            ││
│  │ (Base)   │ │ Layers   │ │ Tooltips          ││
│  └──────────┘ └──────────┘ └──────────────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ Routes   │ │ Controls │ │ Overlays         ││
│  │ Paths    │ │ Zoom/Loc │ │ Custom layers    ││
│  └──────────┘ └──────────┘ └──────────────────┘│
├─────────────────────────────────────────────────┤
│              MapLibre GL JS                      │
├─────────────────────────────────────────────────┤
│         Tile Providers (CARTO/OSM)              │
└─────────────────────────────────────────────────┘
```

## Competitive Landscape

| Tool | Type | Key Difference |
|------|------|----------------|
| **react-map-gl** | Library | More complex setup |
| **Mapbox GL JS** | SaaS | Not free |
| **Leaflet** | Library | Not WebGL-powered |
| **Google Maps** | SaaS | Not open |

**Unique Value**: Only free, zero-config, shadcn-compatible MapLibre wrapper for React.

## What Can We Do With This? (For Discussion)

### 1. **Map Components for Narad UI**
- Use in Narad's dashboard or visualization
- Add location-based features

### 2. **Build Location Features**
- Track agent/task locations
- Visualize spatial data

### 3. **Customize for Enterprise**
- Add CARTO Enterprise for commercial use
- Create custom tile pipelines

### 4. **Extend Components**
- Add clustering, heatmaps, geocoding
- Build domain-specific map widgets

### 5. **Study for Component Library**
- Learn shadcn/ui patterns
- Apply to other component needs

## Next Steps

- [ ] Identify map requirements in Narad
- [ ] Evaluate feature completeness
- [ ] Plan integration approach

## Resources

- [GitHub](https://github.com/AnmolSaini16/mapcn)
- [Documentation](https://mapcn.dev/docs)
- [Demo](https://mapcn.dev/docs/basic-map)