---
source: "/home/runner/work/narad/narad/sync_temp/narad/FEATURES.md"
project: "narad"
role: docs
language: markdown
frameworks: [cloudflare-workers, docker]
lines: 196
size: 4603 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [cloudflare-workers, docker, docs, documentation, markdown, project/narad]
---

# FEATURES.md

> Documentation using **cloudflare-workers, docker** (196 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/FEATURES.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | cloudflare-workers, docker |
| **Lines** | 196 |
| **Size** | 4603 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
# Narad Features Guide

This document details how to enable and use each new feature in Narad.

---

## 1. RAG (Retrieval-Augmented Generation)

### What it does
Hybrid search combining vector embeddings + keyword matching for better knowledge retrieval.

### Setup
1. Ensure `AI` binding is configured in `wrangler.toml`:
```toml
[ai]
binding = "AI"
```

2. Deploy with Workers AI enabled:
```bash
npx wrangler pages deploy pages --project-name narad
```

### Usage
```bash
# Add a document
curl -X POST https://narad.pages.dev/api/rag/add \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Documentation",
    "content": "The API uses REST with JWT authentication...",
    "source": "docs"
  }'

# Search
curl -X POST https://narad.pages.dev/api/rag/search \
  -H "Content-Type: application/json" \
  -d '{"query": "authentication", "topK": 5}'
```

---

## 2. Web Search

### What it does
Search the web using Serper (Google) or Firecrawl.

### Setup
Add to Cloudflare dashboard > Narad > Settings > Environment Variables:
- `SERPER_API_KEY` - Get at [serper.dev](https://serper.dev)
- `FIRECRAWL_API_KEY` - Get at [firecrawl.dev](https://firecrawl.dev)

### Usage
```bash
# Single provider
curl -X POST https://narad.pages.dev/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "latest news", "provider": "serper"}'

# Multi-provider (merges results)
curl -X POST https://narad.pages.dev/api/search/multi \
  -H "Content-Type: application/json" \
  -d '{"query": "react 19", "providers": ["serper", "firecrawl"]}'
```

---

## 3. MCP Connectors

### What it does
Connect to external services (GitHub, Notion, Slack, etc.) via MCP protocol.

### Setup
Add API keys to Cloudflare dashboard:
- `GITHUB_API_KEY` - GitHub PAT with repo scope
- `NOTION_API_KEY` - Notion integration token
- `SLACK_BOT_TOKEN` - Slack bot token

### Available Connectors
| Connector | Required Env Var |
|-----------|-----------------|
| GitHub | `GITHUB_API_KEY` |
| Notion | `NOTION_API_KEY` |
| Slack | `SLACK_BOT_TOKEN` |
| Postgres | (external service) |
| S3/R2 | (external service) |

### Usage
```bash
# Connect
curl -X POST https://narad.pages.dev/api/mcp/connect \
  -H "Content-Type: application/json" \
  -d '{"connectorType": "github"}'

# Query (use connectorId from connect response)
curl -X POST https://narad.pages.dev/api/mcp/query \
  -H "Content-Type: application/json" \
  -d '{
    "connectorId": "github:123456789",
    "query": {"owner": "sdachary", "repo": "nisha", "query": "README"}
  }'
```

---

## 4. Truth Verification

### What it does
Verify AI responses against a truth threshold (0.95 by default) before returning to user.

### Setup
No additional setup - uses existing Groq/OpenRouter API.

### Usage
```bash
curl -X POST https://narad.pages.dev/api/verification/verify \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is 2+2?",
    "result": "4",
    "threshold": 0.95
  }'
```

### Response
```json
{
  "verified": true,
  "confidence": 0.98,
  "accuracy": 0.99,
  "meetsThreshold": true,
  "threshold": 0.95
}
```

---

## 5. Memory System

### What it does
Persistent SQLite-style memory with tables for conversations, messages, memories, verifications.

### Setup
No additional setup - uses KV namespace.

### Usage
```bash
# Save memory
curl -X POST https://narad.pages.dev/api/memory/save \
  -H "Content-Type: application/json" \
  -d '{
    "key": "user-preference",
    "content": "Prefers dark mode",
    "type": "preference",
    "importance": 7
  }'

# Search memories
curl -X POST https://narad.pages.dev/api/memory/search \
  -H "Content-Type: application/json" \
  -d '{"query": "preference", "limit": 10}'
```

---

## Environment Variables Summary

| Variable | Required | Feature |
|----------|----------|---------|
| `GROQ_API_KEY` | Yes | AI Chat |
| `AI` binding | Yes | RAG, Voice, Image |
| `SERPER_API_KEY` | No | Web Search |
| `FIRECRAWL_API_KEY` | No | Web Search, Scraping |
| `GITHUB_API_KEY` | No | MCP Connector |
| `NOTION_API_KEY` | No | MCP Connector |
| `SLACK_BOT_TOKEN` | No | MCP Connector |

---

## Troubleshooting

### RAG not working
- Check Workers AI is enabled in your Cloudflare account
- Verify `AI` binding in `wrangler.toml`

### Search returns errors
- Verify API keys are set in Cloudflare dashboard
- Check Serper/Firecrawl account has credits remaining

### MCP connector fails
- Verify API token has required permissions
- Check connector is in the supported list

### Verification always fails
- Lower threshold: `"threshold": 0.7`
- Check AI provider is responding correctly

```
