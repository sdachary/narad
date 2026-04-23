# Narad Agentic OS — Multi-Agent Implementation Plan

> **Architecture Overview:**
> - **Opencode**: Orchestrator/Planner - plans, decides, reviews
> - **MCP Hub**: Central hub with reusable skills, plugins, tools
> - **Connected AIs**: Gemini CLI (current), Claude Code (future), etc.

---

## Phase 1: MCP Hub Setup (Foundation)

### 1.1 Create MCP Hub Server

**Location:** `narad/mcp-hub/`

**Purpose:** Central hub providing:
- Reusable skills and plugins
- Sub-agents for different task types
- Common tools (file operations, code execution)
- Connection to multiple AI providers

**Files to Create:**
```
narad/mcp-hub/
├── server.js           # Main MCP server
├── package.json       # Dependencies
├── skills/            # Reusable skill modules
│   ├── code-review.js
│   ├── debug.js
│   ├── researcher.js
│   └── implement.js
├── agents/             # Sub-agent definitions
│   ├── dev-agent.js
│   ├── researcher-agent.js
│   └── analyst-agent.js
├── tools/              # Common tools
│   ├── file-operations.js
│   ├── code-executor.js
│   └── docker-commands.js
└── config/
    ├── providers.json   # AI provider configs
    └── skills.json    # Available skills
```

### 1.2 Define Skills (MCP Tools)

**Skills to Implement:**

| Skill | Purpose | Can Execute |
|-------|---------|--------------|
| `code-review` | Review PRs/code | git diff, read files |
| `implement` | Write code | write files, run commands |
| `debug` | Debug issues | read files, search patterns |
| `research` | Research topics | web search, read docs |
| `test` | Run tests | npm/pip commands |
| `deploy` | Deploy services | wrangler/docker |
| `analyze` | Analyze code | grep, read files |

### 1.3 Define Sub-Agents

**Sub-Agents:**

| Agent | Skills Used | For Tasks |
|-------|-------------|-----------|
| `dev-agent` | implement, test, code-review | Code implementation |
| `debug-agent` | debug, analyze | Bug fixing |
| `research-agent` | research, analyze | R&D tasks |
| `deploy-agent` | deploy | Deployment tasks |

---

## Phase 2: Opencode → Gemini Integration

### 2.1 Setup Communication Bridge

**Purpose:** Opencode dispatches tasks to Gemini CLI, gets progress/blockers back

**Communication Flow:**
```
1. Opencode writes task to: .agents/queue/inbox/<task-id>.md
2. Gemini CLI picks up task, executes, writes to: .agents/queue/done/<task-id>.md
3. Opencode reads result, decides next steps
```

**Files:**
- `.agents/queue/inbox/` - Tasks to execute
- `.agents/queue/done/` - Completed tasks
- `.agents/queue/active/` - Currently running

### 2.2 Task Format

```markdown
# Task: IMPLEMENT-FINANCE-DASHBOARD

## Status: PENDING
## Priority: HIGH

## Context:
- Project: narad
- Files to modify: See below
- Tests to run: See below

## Files to Modify:
- src/components/FinanceDashboard.jsx
- pages/services/finance.js

## Tests to Run:
- npm run build
- curl /api/finance/insights

## Success Criteria:
- [ ] Finance dashboard loads
- [ ] Net worth displays
- [ ] Loans list displays
```

---

## Phase 3: Implementation Planning (For Opencode to Execute)

When you ask Opencode to implement something, it will:

### Step 1: Analyze Requirements
- Read the feature spec
- Review existing code structure
- Decide on implementation approach

### Step 2: Plan the Work

**Example Plan for Finance Dashboard:**

```
## Implementation Plan: Finance Dashboard

### Files to Create:
1. narad/supabase/migrations/005_finance_tables.sql
2. narad/src/components/FinanceTile.jsx (exists - verify)
3. narad/src/components/FinanceDashboard.jsx (new)

### Files to Modify:
1. narad/src/App.jsx - Add route
2. narad/pages/services/finance.js - Add API endpoints
3. narad/pages/_worker.js - Register routes

### Implementation Order:
1. Create Supabase migration (SQL)
2. Create Finance API service
3. Create Finance Dashboard UI
4. Test with curl commands
5. Deploy

### Tests:
- GET /api/finance/insights returns net worth
- POST /api/finance/loans creates loan
- Dashboard shows net worth
```

### Step 3: Execute via Gemini CLI

Opencode writes the task and Gemini CLI executes:
- Creates files
- Runs tests
- Reports back with success/blockers

### Step 4: Verify & Next Steps

Opencode reviews results and either:
- Continues to next task
- Asks user for clarification

---

## Phase 4: Production-Ready Practices

### Security
- Never commit secrets to git
- Use `.env` files (gitignored)
- API keys via environment variables
- MFA for all services

### Code Quality
- Lint before commits: `npm run lint`
- Typecheck: `npm run typecheck` (if available)
- Test before deploy: `npm run build`

### Error Handling
- Graceful failures with clear messages
- Logging to appropriate service (Loki)
- Health checks for all endpoints

### Monitoring
- Prometheus metrics at `/api/metrics`
- Uptime monitoring
- Error tracking

---

## Future-Ready: Adding More AI Agents

### For Claude Code:

```bash
# In .mcp.json
{
  "mcpServers": {
    "llm": {
      "type": "http", 
      "url": "http://localhost:3010"
    },
    "claude": {
      "type": "command",
      "command": "claude"
    }
  }
}
```

### For Other Agents:
- Add to `.mcp.json` with their connection method
- Define their skills in `skills.json`
- Document in AGENTS.md

---

## Summary: How to Use

1. **Start MCP Hub:**
```bash
cd narad/mcp-hub
npm install
node server.js
```

2. **Start Opencode:**
```bash
opencode .
```

3. **Request Implementation:**
```
Use the llm MCP to implement the Finance Dashboard with these requirements:
- Show net worth on dashboard tile
- Click to open finance page
- Show loans, credit cards, expenses
- Use Supabase for data
```

4. **Opencode will:**
- Analyze the request
- Write task for Gemini CLI (via MCP)
- Gemini CLI executes
- Report back with results/blockers
- Continue or ask for clarification

---

**End of Architecture Document**