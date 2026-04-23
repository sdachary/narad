---
source: "https://github.com/Gitlawb/openclaude"
project: "narad"
role: "research"
type: "R&D"
status: "pending-discussion"
priority: "high"
tags: [coding-agent, multi-provider, open-source, cli, R&D]
---

# OpenClaude - R&D Research

> "Open-source coding-agent CLI for OpenAI, Gemini, DeepSeek, Ollama, Codex, GitHub Models, and 200+ models"

## Quick Summary

OpenClaude is an open-source coding agent CLI forked from Claude Code, supporting 200+ models via OpenAI-compatible APIs. Maintains the terminal-first workflow with prompts, tools, agents, MCP, slash commands, and streaming output.

| Property | Value |
|----------|-------|
| **Stars** | 19.9k |
| **Forks** | 7k |
| **Commits** | 367 |
| **License** | MIT |
| **Language** | TypeScript (99.4%) |
| **URL** | https://github.com/Gitlawb/openclaude |

## Core Features

### Multi-Provider Support
- **OpenAI-compatible**: OpenAI, OpenRouter, DeepSeek, Groq, Mistral, LM Studio
- **Google Gemini**: API key, access token, local ADC
- **GitHub Models**: Interactive onboarding
- **Codex**: Uses existing credentials
- **Ollama**: Local inference
- **Atomic Chat**: Apple Silicon backend
- **Bedrock/Vertex/Foundry**: Enterprise integrations

### Agent Routing
Route different agents to different models for cost optimization:
```json
{
  "agentRouting": {
    "Explore": "deepseek-chat",
    "Plan": "gpt-4o",
    "frontend-dev": "deepseek-chat",
    "default": "gpt-4o"
  }
}
```

### Features
- **Tool-driven workflows**: Bash, file tools, grep, glob, agents, MCP
- **Streaming responses**: Real-time token output
- **Tool calling**: Multi-step tool loops
- **Images**: URL and base64 inputs
- **Provider profiles**: Saved configurations

### gRPC Server
Headless mode for integration into other applications:
- Bidirectional streaming
- Real-time text chunks and tool calls
- Request permissions via `action_required` event

### Web Search & Fetch
- Default: DuckDuckGo for non-Anthropic models
- Optional: Firecrawl for more reliable results

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  OpenClaude CLI                  │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │ Provider    │  │ Agent       │  │ MCP     ││
│  │ Abstraction │  │ Router      │  │ Server  ││
│  └─────────────┘  └─────────────┘  └─────────┘│
├─────────────────────────────────────────────────┤
│  Tool Layer: Bash, File, Grep, Glob, Web      │
└─────────────────────────────────────────────────┘
```

## What Can We Do With This? (For Discussion)

### 1. **Multi-Provider Orchestration**
- Use OpenClaude's provider abstraction for Narad
- Route tasks to cheapest capable model

### 2. **gRPC Integration**
- Embed into Narad's application
- CI/CD pipeline integration

### 3. **Local Model Support**
- Run Narad on Ollama for privacy
- Offline capability

### 4. **Study for CLI Design**
- Learn from their slash commands
- Apply patterns to Narad CLI

## Next Steps

- [ ] Evaluate provider routing for Narad
- [ ] Plan gRPC integration approach
- [ ] Assess local model requirements

## Resources

- [GitHub](https://github.com/Gitlawb/openclaude)
- [Discord](https://github.com/Gitlawb/openclaude/discussions)