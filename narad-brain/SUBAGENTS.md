# Narad Multi-Agent System

## Overview

The multi-agent system enables specialized AI agents for delegated tasks with parallel processing and chained execution.

## Agent Warehouse

Optimized agents stored in `warehouse/` directory. Load on-demand when needed.

### Daily Use Agents (High Priority)

| Agent | Keywords | Description |
|-------|----------|-------------|
| dev | git, test, build, npm, code | Daily development |
| check | git, check, status, push, commit, md | Git operations & pre-push cleanup |
| reviewer | review, security, audit, bug | Code review |
| debugger | debug, error, crash, fix | Troubleshooting |

### Specialized Agents

| Agent | Keywords | Description |
|-------|----------|-------------|
| api | rest, graphql, endpoint, http | API development |
| database | sql, query, postgres, migration | Database expert |
| infrastructure | docker, k8s, ci/cd, deploy | DevOps |
| security | auth, jwt, oauth, owasp | Security |
| writer | docs, readme, markdown | Documentation |
| dividend | dividend, income, yield, investment | Dividend portfolio strategy |

## Multi-Agent Coordination

### Parallel Execution

Run multiple agents simultaneously:
```
/dev+reviewer: implement feature X with code review
```

### Sequential Chain

Pass output of one agent to another:
```
/chain:dev->writer->reviewer: build feature X with docs
```

### Intent Detection

System auto-detects task type from keywords:

```javascript
const AGENT_KEYWORDS = {
  dev: ['git', 'test', 'build', 'npm', 'code', 'commit', 'merge'],
  reviewer: ['review', 'security', 'audit', 'bug', 'quality'],
  debugger: ['debug', 'error', 'crash', 'fix', 'trace'],
  api: ['rest', 'graphql', 'endpoint', 'http', 'api'],
  database: ['sql', 'query', 'postgres', 'migration', 'db'],
  infrastructure: ['docker', 'k8s', 'ci', 'deploy', 'kubernetes'],
  security: ['auth', 'jwt', 'oauth', 'owasp', 'token'],
  writer: ['docs', 'readme', 'markdown', 'document']
};
```

## Warehouse Structure

```
warehouse/
├── index.json          # Agent registry (always loaded)
└── agents/
    ├── dev.json
    ├── reviewer.json
    ├── debugger.json
    ├── api.json
    ├── database.json
    ├── infrastructure.json
    ├── security.json
    └── writer.json
```

## Budget Controls

Each agent has daily token limits:

| Agent | Daily Limit | Priority |
|-------|-------------|----------|
| general | 200,000 | Default |
| dev | 250,000 | High |
| reviewer | 200,000 | High |
| debugger | 200,000 | High |
| api | 180,000 | Medium |
| database | 180,000 | Medium |
| infrastructure | 200,000 | Medium |
| security | 180,000 | Medium |
| writer | 150,000 | Medium |

## Migration Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Done | Budget controls per agent type |
| 2 | ✅ Done | Agent selection UI |
| 3 | ✅ Done | Subagent routing logic |
| 4 | ✅ Done | Multi-agent coordination (parallel + chain) |
| 5 | 🔄 Todo | Custom agents (user-defined prompts) |

## Future Enhancements

- Memory per agent (each agent maintains its own context)
- Skill packs (modular skill bundles for frameworks)
- Agent learning (from feedback and corrections)
