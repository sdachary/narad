# MCP Skills Inventory

> Last updated: 2026-04-26

## Summary

| Status | Count |
|--------|-------|
| **Total Skills** | 67 |
| **Active** | TBD |
| **Pending** | TBD |
| **Remove** | TBD |

---

## Skills List

| # | Skill Name | Status | Notes |
|---|-----------|--------|-------|
| 1 | advanced-evaluation | ⏳ Pending | |
| 2 | algorithmic-art | ❌ Remove | One‑off experimental |
| 3 | bdi-mental-states | ❌ Remove | Niche use case |
| 4 | brainstorming | ⏳ Pending | |
| 5 | brand-guidelines | ❌ Remove | One‑off |
| 6 | canvas-design | ⏳ Pending | |
| 7 | claude-api | ⏳ Pending | |
| 8 | claude-nvidia | ⏳ Pending | |
| 9 | composition-patterns | ⏳ Pending | |
| 10 | context-compression | ⏳ Pending | |
| 11 | context-degradation | ⏳ Pending | |
| 12 | context-fundamentals | ⏳ Pending | |
| 13 | context-optimization | ⏳ Pending | |
| 14 | defuddle | ❌ Remove | Rarely used |
| 15 | dispatching-parallel-agents | ⏳ Pending | |
| 16 | doc-coauthoring | ⏳ Pending | |
| 17 | docx | ⏳ Pending | |
| 18 | evaluation | ⏳ Pending | |
| 19 | executing-plans | ⏳ Pending | |
| 20 | filesystem-context | ⏳ Pending | |
| 21 | finishing-a-development-branch | ⏳ Pending | |
| 22 | frontend-design | ✅ Active | Used in `/build` command |
| 23 | hosted-agents | ⏳ Pending | |
| 24 | internal-comms | ⏳ Pending | |
| 25 | json-canvas | ⏳ Pending | |
| 26 | mcp-builder | ✅ Active | Building MCP services |
| 27 | memory-systems | ⏳ Pending | |
| 28 | minimalist-skill | ⏳ Pending | |
| 29 | multi-agent-patterns | ⏳ Pending | |
| 30 | notebooklm | ❌ Remove | One‑off |
| 31 | obsidian-bases | ⏳ Pending | |
| 32 | obsidian-cli | ⏳ Pending | |
| 33 | obsidian-markdown | ⏳ Pending | |
| 34 | orchestrator | ✅ Active | Core agent routing |
| 35 | output-skill | ⏳ Pending | |
| 36 | pdf | ⏳ Pending | |
| 37 | plan-generator | ✅ Active | Used in `/plan` command |
| 38 | planning-with-files | ✅ Active | Used in `/plan` command |
| 39 | pptx | ⏳ Pending | |
| 40 | project-development | ⏳ Pending | |
| 41 | react-best-practices | ⏳ Pending | |
| 42 | react-native-skills | ⏳ Pending | |
| 43 | receiving-code-review | ⏳ Pending | |
| 44 | remotion | ❌ Remove | Rarely used |
| 45 | requesting-code-review | ⏳ Pending | |
| 46 | seal-maker | ✅ Active | VAYU skill |
| 47 | skill-creator | ⏳ Pending | |
| 48 | slack-gif-creator | ❌ Remove | One‑off |
| 49 | soft-skill | ⏳ Pending | |
| 50 | subagent-driven-development | ⏳ Pending | |
| 51 | supabase-postgres-best-practices | ⏳ Pending | |
| 52 | systematic-debugging | ✅ Active | Used implicitly |
| 53 | taste-skill | ⏳ Pending | |
| 54 | test-driven-development | ✅ Active | Used in `/test` command |
| 55 | theme-factory | ⏳ Pending | |
| 56 | tool-design | ⏳ Pending | |
| 57 | ui-ux-pro-max | ⏳ Pending | |
| 58 | using-git-worktrees | ⏳ Pending | |
| 59 | using-superpowers | ⏳ Pending | |
| 60 | vayu | ✅ Active | File upload/download |
| 61 | verification-before-completion | ⏳ Pending | |
| 62 | web-artifacts-builder | ⏳ Pending | |
| 63 | web-design-guidelines | ⏳ Pending | |
| 64 | webapp-testing | ⏳ Pending | |
| 65 | writing-plans | ⏳ Pending | |
| 66 | writing-skills | ⏳ Pending | |
| 67 | xlsx | ⏳ Pending | |

---

## Quick Actions

### Mark a skill as Active ✅
```bash
# Edit this file and change ⏳ Pending to ✅ Active
```

### Mark a skill for Removal ❌
```bash
# Edit this file and change ⏳ Pending to ❌ Remove
# Then delete the skill folder:
rm -rf skills/<skill-name>
```

---

## Notes

- Skills marked **Active** are currently used in Narad commands (`/spec`, `/plan`, `/build`, `/test`, `/review`, `/ship`) or referenced in code.
- **Pending** skills need review to determine if they're still relevant.
- **Remove** candidates are one‑off experiments or rarely used.