---
source: "https://github.com/gsd-build/get-shit-done"
project: "narad"
role: "research"
type: "R&D"
status: "pending-discussion"
priority: "high"
tags: [meta-prompting, context-engineering, spec-driven, claude-code, workflow, R&D]
---

# Get Shit Done (GSD) - R&D Research

> "A light-weight and powerful meta-prompting, context engineering and spec-driven development system for Claude Code"

## Quick Summary

GSD is a meta-prompting and context engineering system that solves "context rot" - the quality degradation that happens as Claude fills its context window. Trusted by engineers at Amazon, Google, Shopify, and Webflow. 49.8k stars.

| Property | Value |
|----------|-------|
| **Stars** | 49.8k |
| **Forks** | 4.1k |
| **Commits** | 1,715 |
| **License** | MIT |
| **Language** | TypeScript |
| **URL** | https://get-shit-done.social |

## Core Features

### Context Engineering
- **PROJECT.md**: Always loaded project vision
- **research/**: Ecosystem knowledge
- **REQUIREMENTS.md**: Scoped v1/v2 requirements
- **ROADMAP.md**: Where you're going
- **STATE.md**: Cross-session memory
- **PLAN.md**: Atomic tasks with XML structure

### Six-Phase Workflow

1. **Initialize** (`/gsd-new-project`): Questions → research → requirements → roadmap
2. **Discuss Phase** (`/gsd-discuss-phase`): Capture implementation decisions
3. **Plan Phase** (`/gsd-plan-phase`): Research + plan + verify
4. **Execute Phase** (`/gsd-execute-phase`): Run plans in parallel waves
5. **Verify Work** (`/gsd-verify-work`): Manual user acceptance testing
6. **Ship** (`/gsd-ship`): Create PR from verified work

### Key Innovations

- **Multi-Agent Orchestration**: Thin orchestrator spawns specialized agents
- **Wave Execution**: Parallel execution of independent plans
- **Atomic Git Commits**: Each task gets its own commit
- **XML Prompt Formatting**: Precise instructions with verification built-in
- **Quality Gates**: Schema drift detection, security enforcement

### Model Profiles
| Profile | Planning | Execution | Verification |
|---------|----------|------------|---------------|
| Quality | Opus | Opus | Sonnet |
| Balanced | Opus | Sonnet | Sonnet |
| Budget | Sonnet | Sonnet | Haiku |

### Security Features
- Path traversal prevention
- Prompt injection detection
- Shell argument validation
- Safe JSON parsing

## What Can We Do With This? (For Discussion)

### 1. **Context Management for Narad**
- Apply GSD's context engineering approach
- Prevent context rot in Narad sessions

### 2. **Workflow Orchestration**
- Use wave execution patterns
- Implement quality gates

### 3. **Project Planning**
- Adopt spec-driven development
- Build phase-based workflows

### 4. **Git Hygiene**
- Atomic commits per task
- Clear execution history

## Next Steps

- [ ] Map GSD workflow to Narad requirements
- [ ] Evaluate quality gates for Narad
- [ ] Plan context management approach

## Resources

- [GitHub](https://github.com/gsd-build/get-shit-done)
- [Discord](https://discord.gg/mYgfVNfA2r)
- [User Guide](https://github.com/gsd-build/get-shit-done/blob/main/docs/USER-GUIDE.md)