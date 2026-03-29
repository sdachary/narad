# Agent Warehouse

Optimized agents for daily use. Load on-demand when needed.

## Structure

```
warehouse/
├── index.json        # Registry
└── agents/           # Agent configs
    ├── dev.json
    ├── reviewer.json
    ├── debugger.json
    ├── api.json
    ├── database.json
    ├── infrastructure.json
    ├── security.json
    └── writer.json
```

## Agents

| Agent | Description | Skills |
|-------|-------------|--------|
| dev | Daily development | git, testing, npm |
| check | Git operations & cleanup | git, markdown, cleanup |
| reviewer | Code review | security, quality |
| debugger | Debugging | logging, diagnostics |
| api | API development | REST, GraphQL |
| database | Database expert | PostgreSQL, migrations |
| infrastructure | DevOps | Docker, K8s, CI/CD |
| security | Security | Auth, JWT, OAuth |
| writer | Documentation | Markdown |

## Usage

1. Select agent from dropdown or use prefix syntax
2. Agent loads on-demand
3. Skills injected into context automatically
