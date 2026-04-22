# narad

> AI Workspace & Command Center on Cloudflare Pages

## Overview

**Purpose:** Unified AI workspace with service monitoring, knowledge graph, and voice assistant
**Stack:** Cloudflare Pages, Hono, Vite, TypeScript
**URL:** https://narad-7hc.pages.dev

## Key Files

| File | Purpose |
|------|---------|
| `pages/_worker.js` | Main worker entry |
| `pages/routes/command-center.js` | Service dashboard + graph view |
| `pages/services/observer.js` | Service polling (6 services) |
| `pages/services/reporter.js` | Alerts & reports |
| `pages/services/smriti-graph.js` | Knowledge graph from smriti |

## Architecture

```
┌─────────────────────────────────────────┐
│           Cloudflare Pages               │
│  ┌─────────────────────────────────┐    │
│  │  Hono Router                    │    │
│  │  /api/*   /command-center  /brain│    │
│  └─────────────────────────────────┘    │
│         │         │         │           │
│    observer   reporter   brain         │
│         │         │         │           │
│    ┌────┴────┐   ┌┴────┐  ┌─┴────┐     │
│    │  KV     │   │  KV │  │Supabase     │
│    │NARAD_   │   │OBSERVER│brain_│     │
│    │DATA     │   │_KV   │docs   │     │
│    └─────────┘   └──────┘└──────┘     │
└─────────────────────────────────────────┘
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/observer/services` | Poll all 6 services |
| `/api/reporter/alerts` | Get active alerts |
| `/api/smriti/graph` | Knowledge graph data |
| `/command-center` | Dashboard UI |
| `/brain` | AI brain chat |

## KV Bindings

| Binding | ID | Purpose |
|---------|-----|---------|
| NARAD_DATA | ca98881c... | General storage |
| OBSERVER_KV | ca98881c... | Service status cache |
| TASK_QUEUE | cbc8f3af... | MCP task queue |

## Cron Jobs

- `*/5 * * * *` - Service polling every 5 minutes

## MCP Servers

- `mcp-task-queue/` - Cloudflare Worker for task orchestration
- `mcp-second-brain/` - Local Node server for smriti search