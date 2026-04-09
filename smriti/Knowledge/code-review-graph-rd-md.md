---
source: "https://github.com/tirth8205/code-review-graph"
project: "narad"
role: "research"
type: "R&D"
status: "pending-discussion"
priority: "high"
tags: [knowledge-graph, tree-sitter, token-optimization, mcp, code-analysis, R&D]
---

# code-review-graph - R&D Research

> "Local knowledge graph for Claude Code - 8.2× fewer tokens on reviews and up to 49× on daily coding tasks"

## Quick Summary

A local knowledge graph that builds a structural map of your codebase using Tree-sitter, tracks changes incrementally, and gives your AI assistant precise context via MCP so it reads only what matters.

| Property | Value |
|----------|-------|
| **Stars** | 7k |
| **Forks** | 830 |
| **Commits** | 193 |
| **License** | MIT |
| **Language** | Python (84.7%), TypeScript (15.1%) |
| **URL** | https://code-review-graph.com |

## Core Features

### Token Reduction (Benchmark)
- **Average**: 8.2× fewer tokens (naive vs graph)
- **Code review**: 6.8× fewer tokens
- **Daily tasks**: Up to 49× fewer tokens
- **Monorepo (Next.js)**: 27,732 files → ~15 files

### Blast-Radius Analysis
- Traces every caller, dependent, and test affected by a change
- AI reads only impacted files instead of scanning whole project

### Incremental Updates
- < 2 seconds for 2,900-file project
- Re-parses only changed files
- Hook triggers on git commit or file save

### 19 Languages + Jupyter
- Web: Python, TypeScript/TSX, JavaScript, Vue
- Backend: Go, Rust, Java, Scala, C#, Ruby, Kotlin, Swift, PHP
- Systems: Solidity, C/C++, Dart, R, Perl, Lua
- Plus: Jupyter/Databricks notebooks

### MCP Tools (22 tools)
- `get_impact_radius_tool`: Blast radius analysis
- `get_review_context_tool`: Token-optimized context
- `query_graph_tool`: Callers, callees, tests, imports
- `semantic_search_nodes_tool`: Vector search
- `detect_changes_tool`: Risk-scored impact analysis
- And more...

### Additional Features
- **Interactive Visualization**: D3.js force-directed graph
- **Community Detection**: Leiden algorithm clustering
- **Architecture Overview**: Auto-generated map with coupling warnings
- **Refactoring Tools**: Rename preview, dead code detection
- **Wiki Generation**: Auto-generate markdown wiki

## Architecture

```
Repository → Tree-sitter Parser → SQLite Graph → Blast Radius → Minimal Review Set
```

## What Can We Do With This? (For Discussion)

### 1. **Token Optimization for Narad**
- Apply knowledge graph approach
- Reduce context window usage

### 2. **Code Analysis**
- Use blast-radius for impact analysis
- Implement incremental indexing

### 3. **Architecture Understanding**
- Community detection for code organization
- Architecture overview generation

### 4. **MCP Integration**
- Use their MCP tools for code understanding
- Build on their parser foundation

## Next Steps

- [ ] Evaluate graph approach for Narad
- [ ] Plan MCP integration
- [ ] Assess performance requirements

## Resources

- [GitHub](https://github.com/tirth8205/code-review-graph)
- [Website](https://code-review-graph.com)
- [Discord](https://discord.gg/3p58KXqGFN)