---
source: "https://github.com/HKUDS/OpenSpace"
project: "narad"
role: "research"
type: "R&D"
status: "pending-discussion"
priority: "high"
tags: [self-evolving-agents, skill-evolution, token-optimization, mcp, competitive-analysis, R&D]
---

# OpenSpace - R&D Research

> "Make Your Agents: Smarter, Low-Cost, Self-Evolving"

## Quick Summary

OpenSpace is a self-evolving agent engine that plugs into any AI agent (OpenClaw, Claude Code, Codex, Cursor, nanobot) and makes them learn from experience. Achieved 4.2× higher income and 46% fewer tokens on real-world tasks.

| Property | Value |
|----------|-------|
| **Stars** | 4.8k |
| **Forks** | 567 |
| **Commits** | 57 |
| **License** | MIT |
| **Language** | Python (75.3%), TypeScript (19.7%) |
| **URL** | https://open-space.cloud |

## Core Features

### Self-Evolution Engine
- **FIX**: Repair broken/outdated skills in-place
- **DERIVED**: Create enhanced versions from parent skills
- **CAPTURED**: Extract novel patterns from successful executions
- **Three Triggers**: Post-execution analysis, tool degradation detection, metric monitoring

### Quality Monitoring
- Multi-layer tracking: Skills (applied/completion/effective rate), Tool calls (success/latency), Code execution
- Cascade evolution: When any component degrades, all upstream skills evolve

### Token Efficiency
- 46% fewer tokens on Phase 2 (warm) vs Phase 1 (cold start)
- Skill reuse prevents repeated reasoning from scratch
- GDPVal benchmark: 4.2× higher income vs baseline

### Cloud Skill Community
- Share evolved skills across agents
- Public/private/team access control
- Smart search with auto-import
- Lineage tracking with full diffs

### Benchmark Results (GDPVal)
- 4.2× higher income vs ClawWork baseline
- 72.8% value capture ($11,484 earned out of $15,764)
- 70.8% average quality (+30pp above baseline)
- 165 skills evolved across 50 tasks

## Architecture

```
┌─────────────────────────────────────────────────┐
│            OpenSpace Engine                     │
├─────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────┐│
│  │ Skill       │  │ Quality     │  │ Cloud   ││
│  │ Engine      │  │ Monitor     │  │ Registry││
│  │ - FIX       │  │ - Skills    │  │ - Upload││
│  │ - DERIVED   │  │ - Tools     │  │ - Search││
│  │ - CAPTURED  │  │ - Code      │  │ - Share ││
│  └─────────────┘  └─────────────┘  └─────────┘│
├─────────────────────────────────────────────────┤
│         Grounding Layer (Tool Execution)        │
│  - Shell, GUI, MCP, Web Search                   │
├─────────────────────────────────────────────────┤
│      MCP Server (4 tools for host agent)         │
└─────────────────────────────────────────────────┘
```

## What Can We Do With This? (For Discussion)

### 1. **Self-Evolving Narad**
- Implement skill creation + improvement for Narad agents
- Learn from task execution patterns

### 2. **Token Optimization**
- Apply the 46% token reduction approach to Narad
- Skill reuse for repeated task types

### 3. **Cloud Skill Sharing**
- Build internal skill marketplace
- Team-wide skill distribution

### 4. **Quality Monitoring**
- Implement cascade evolution for Narad skills
- Detect and auto-fix degraded capabilities

## Next Steps

- [ ] Discuss integration with Narad's agent system
- [ ] Evaluate skill evolution patterns for Narad
- [ ] Plan cloud registry requirements

## Resources

- [GitHub](https://github.com/HKUDS/OpenSpace)
- [Website](https://open-space.cloud)
- [Benchmark](https://github.com/HKUDS/OpenSpace/tree/main/gdpval_bench)