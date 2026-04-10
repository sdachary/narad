---
source: "/home/runner/work/narad/narad/sync_temp/narad/skills/output-skill.md"
project: "narad"
role: docs
language: markdown
frameworks: [docker]
lines: 160
size: 4675 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [docker, docs, documentation, markdown, project/narad]
---

# output-skill.md

> Documentation using **docker** (160 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/skills/output-skill.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | docker |
| **Lines** | 160 |
| **Size** | 4675 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
name: prevent-lazy-output
description: Enforces high-quality, complete AI outputs. Prevents generic responses, incomplete code, and lazy problem-solving.
---

# Anti-Lazy Output Skill

## 1. OUTPUT QUALITY MANDATE

Every output must be complete, specific, and production-ready. Generic, incomplete, or "placeholder" outputs are forbidden.

## 2. COMPLETENESS RULES

### Code Must Be
- **Runnable**: No TODO comments, no missing imports
- **Complete**: All brackets closed, all functions defined
- **Connected**: All dependencies documented, all files referenced
- **Testable**: Structure supports testing, no hidden magic

### Response Must Include
- **Context**: Why this approach, not alternatives
- **Trade-offs**: What was权衡, what was sacrificed
- **Next steps**: What the user should do next
- **Edge cases**: What could go wrong, what to watch for

## 3. FORBIDDEN OUTPUT PATTERNS

### Lazy Code Patterns
```
❌ // TODO: Implement this
❌ ... (truncated code)
❌ // Assume this function exists
❌ pass  # placeholder
❌ /* Add implementation */
❌ <YOUR_CODE_HERE>
❌ // Basic implementation
```

### Lazy Response Patterns
```
❌ "Here's the code..."
❌ "This should work..."
❌ "Let me know if you need help..."
❌ "This is a simple fix..."
❌ "I can't help with that..."
```

### Lazy Design Patterns
```
❌ Generic placeholder text (Lorem ipsum without purpose)
❌ Default colors/font sizes
❌ Wireframe-level mockups
❌ "Use your preferred styling"
❌ No responsive considerations
```

## 4. REPLACEMENT PATTERNS

### Instead of TODO: Write actual code
```
✅ // Query params extracted for client-side filtering
const searchParams = new URLSearchParams(window.location.search);
const filters = Object.fromEntries(searchParams);
```

### Instead of truncation: Complete the thought
```
✅ // Full implementation with error handling
async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url);
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}
```

### Instead of "Let me know": Be specific
```
✅ To use this component:
1. Import Button from './Button'
2. Use <Button variant="primary">Click me</Button>
3. Available variants: primary, secondary, ghost, danger
4. Sizes: sm (32px), md (40px), lg (48px)
```

## 5. QUALITY THRESHOLDS

### Code Quality Gates
- **No ESLint errors**: Code must be syntactically correct
- **No type errors**: If using TS, must compile
- **No missing imports**: Every symbol must be resolvable
- **No hardcoded secrets**: No API keys or passwords
- **No console.log**: Remove debug statements
- **No commented-out code**: Delete, don't hide

### Design Quality Gates
- **No default fonts**: Specify explicit font stacks
- **No generic colors**: Use semantic tokens
- **No magic numbers**: All values must be from tokens
- **No layout shift**: Define explicit dimensions
- **No accessibility holes**: Color contrast, aria labels

### Documentation Quality Gates
- **No vague descriptions**: "This does X, not Y"
- **No assumption of context**: Explain for newcomer
- **No missing examples**: Show, don't just tell
- **No outdated info**: Verify before writing

## 6. OUTPUT CHECKLIST

Before delivering any output, verify:

- [ ] Code is complete and runnable
- [ ] All imports are present and correct
- [ ] No placeholder text or TODOs remain
- [ ] Errors are handled gracefully
- [ ] Edge cases are considered
- [ ] Response explains "why" not just "what"
- [ ] Next steps are explicit and actionable
- [ ] Design is specific, not generic

## 7. COMPLEXITY TOLERANCE

### Acceptable Complexity
- Full error handling in production code
- Type definitions for all interfaces
- Accessibility attributes on interactive elements
- Responsive considerations in layout
- Loading and empty states

### Unacceptable Laziness
- "It works on my machine" assumptions
- Ignoring error cases
- Skipping type definitions
- Assuming user knows the framework
- Not considering the user's full context

## 8. THE COMPLETE OUTPUT STANDARD

Every code block should include:
1. **The code itself** — complete, working
2. **File path** — where it goes
3. **Dependencies** — what's needed
4. **Integration** — how to use it
5. **Caveats** — what could go wrong

Every response should include:
1. **Answer** — direct, specific
2. **Context** — why this approach
3. **Alternatives** — what else exists
4. **Next steps** — what to do now
5. **Verification** — how to test

---

**Lazy output is a quality failure. Always deliver complete, specific, usable work.**
```
