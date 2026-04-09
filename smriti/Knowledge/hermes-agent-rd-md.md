---
source: "https://github.com/nousresearch/hermes-agent"
project: "narad"
role: "research"
type: "R&D"
status: "pending-discussion"
priority: "high"
tags: [ai-agent, self-improving, memory, skills, mcp, messaging-gateway, competitive-analysis, R&D]
---

# Hermes Agent - R&D Research

> "The agent that grows with you" - Self-improving AI agent built by Nous Research

## Quick Summary

Hermes Agent is a self-improving AI agent with a built-in learning loop. It creates skills from experience, improves them during use, persists knowledge across sessions, searches past conversations, and builds a user model. Runs on $5 VPS, cloud VMs, or serverless.

| Property | Value |
|----------|-------|
| **Stars** | 37.9k |
| **Forks** | 4.8k |
| **Commits** | 3,514 |
| **License** | MIT |
| **Language** | Python (93.6%) |
| **URL** | https://hermes-agent.nousresearch.com |

## Core Features

### Self-Improving Architecture
- **Skill Creation**: Auto-creates skills from complex tasks
- **Skill Self-Improvement**: Skills improve during use
- **Memory Nudges**: Periodic prompts to persist knowledge
- **Session Search**: FTS5 full-text search across past conversations
- **User Modeling**: Honcho dialectic for building user profiles

### Messaging Gateway
- Telegram, Discord, Slack, WhatsApp, Signal, Email
- Voice memo transcription
- Cross-platform conversation continuity

### Terminal Interfaces
- Local, Docker, SSH, Daytona, Singularity, Modal
- Daytona & Modal offer serverless persistence
- Works on $5 VPS or GPU clusters

### CLI Features
- Full TUI with multiline editing
- Slash-command autocomplete
- Conversation history
- Streaming tool output
- Interruption and redirect

### AI Model Support
- Nous Portal, OpenRouter (200+ models), z.ai/GLM
- Kimi/Moonshot, MiniMax, OpenAI, Anthropic
- Switch models with `hermes model` - no code changes

### Additional Features
- Scheduled automations (cron) with platform delivery
- Sub-agent spawning for parallel workstreams
- Batch trajectory generation
- RL environments (Atropos)
- Trajectory compression for training

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Hermes Agent Core                   │
│  ┌─────────────────────────────────────────────┐│
│  │         Agent Loop                           ││
│  │  - Tool selection                            ││
│  │  - Execution                                 ││
│  │  - Reflection                                ││
│  │  - Learning                                  ││
│  └─────────────────────────────────────────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐│
│  │ Memory   │ │ Skills   │ │ User Model        ││
│  │ (FTS5)   │ │ (Auto)   │ │ (Honcho)          ││
│  └──────────┘ └──────────┘ └──────────────────┘│
└─────────────────────────────────────────────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐   ┌──────────────────────────┐
│  CLI / TUI       │   │  Gateway (Messaging)     │
│  - Local         │   │  - Telegram              │
│  - Docker        │   │  - Discord               │
│  - SSH           │   │  - Slack                 │
│  - Daytona       │   │  - WhatsApp              │
│  - Modal         │   │  - Signal                │
└──────────────────┘   └──────────────────────────┘
```

## Competitive Landscape

| Tool | Type | Key Difference |
|------|------|----------------|
| **OpenAI Agents** | SaaS | No self-improvement |
| **Anthropic AI** | SaaS | No skill creation |
| **CrewAI** | Framework | No built-in memory |
| **AutoGen** | Framework | No messaging gateway |
| **LangChain** | Framework | No self-improving loop |

**Unique Value**: Only agent with built-in learning loop that creates and improves skills autonomously.

## What Can We Do With This? (For Discussion)

### 1. **Build Self-Improving Agents**
- Adapt the skill creation + improvement mechanism
- Create domain-specific agents that learn from usage

### 2. **Use Messaging Gateway**
- Integrate with Narad's communication channels
- Enable Telegram/Discord control of Narad

### 3. **Memory System**
- Study FTS5 session search implementation
- Implement cross-session recall for Narad

### 4. **Serverless Deployment**
- Use Modal/Daytona for cost-effective hosting
- Implement hibernation for idle agents

### 5. **RL Training Pipeline**
- Use trajectory data for fine-tuning
- Build custom Atropos environments

## Next Steps

- [ ] Discuss integration with Narad's agent system
- [ ] Evaluate memory + skill systems for Narad
- [ ] Assess messaging gateway requirements
- [ ] Plan deployment architecture

## Resources

- [GitHub](https://github.com/nousresearch/hermes-agent)
- [Documentation](https://hermes-agent.nousresearch.com/docs)
- [Discord](https://discord.gg/NousResearch)