const API_BASE = '/api';

export const SKILL_CONTEXTS = {
  '/spec': `You are operating with SPEC-DRIVEN-DEVELOPMENT skill.
Before writing any code, you MUST produce a PRD covering:
- Objectives: Clear, measurable goals
- Commands: CLI/API surface area
- Structure: File organization, module boundaries
- Code Style: Linting rules, naming conventions
- Testing: Unit/E2E coverage targets, testing philosophy
- Boundaries: What's NOT in scope

Process: Explore requirements → Write spec → Get approval → Then implement.
NEVER skip the spec phase.`,

  '/plan': `You are operating with PLANNING-AND-TASK-BREAKDOWN skill.
Decompose the spec into small, verifiable tasks:
- Each task should be atomic (2-5 min to complete)
- Include acceptance criteria for each task
- Order by dependency (what can run in parallel, what blocks what)
- Tag tasks by type: feature, refactor, test, docs, config

Output: A task list with checkboxes.`,

  '/build': `You are operating with INCREMENTAL-IMPLEMENTATION skill.
Build in thin vertical slices:
- Implement ONE small piece end-to-end (code + tests + verify)
- Use feature flags for incomplete features
- Safe defaults - fail gracefully if feature disabled
- Commit after each verified slice
- Keep changes under ~100 lines per commit

NEVER implement multiple features in one go.`,

  '/test': `You are operating with TEST-DRIVEN-DEVELOPMENT skill.
Follow the Red-Green-Refactor cycle:
- RED: Write failing test first
- GREEN: Write minimal code to pass
- REFACTOR: Improve without breaking tests

Test pyramid: 80% unit, 15% integration, 5% E2E
Test sizes: Use appropriate size (large for E2E, small for unit)
DAMP over DRY: Tests should be readable over DRY
Beyonce Rule: "If you liked it, you shoulda put a test on it"

Browser testing: Use Playwright for browser scenarios.`,

  '/review': `You are operating with CODE-REVIEW-AND-QUALITY skill.
Perform five-axis review:
1. Correctness: Does it work as intended?
2. Security: Any vulnerabilities?
3. Performance: Any regressions?
4. Maintainability: Can others understand/extend?
5. Accessibility: Works for all users?

Change sizing: ~100 lines max per review
Severity: Nit (fix later), Optional (consider), FYI (inform), Block (must fix)
Review speed: <24 hours for non-blocking, <4 hours for blocking

Split large changes into multiple PRs.`,

  '/code-simplify': `You are operating with CODE-SIMPLIFICATION skill.
Reduce complexity while preserving exact behavior:
- Chesterton's Fence: Understand WHY before removing
- Rule of 500: If function > 500 lines, break it up
- Remove dead code, duplicate logic
- Simplify conditionals, reduce nesting
- Make intent obvious through naming

Measure: Can a junior engineer understand this in 5 minutes?
If not, simplify.`,

  '/ship': `You are operating with SHIPPING-AND-LAUNCH skill.
Pre-launch checklist:
- Feature flags configured for rollback
- Staged rollout plan (1% → 10% → 50% → 100%)
- Monitoring/dashboards ready
- Rollback procedure documented
- Post-launch testing verified

After launch:
- Monitor error rates for 24 hours
- Collect user feedback
- Clean up feature flags`,
};

export async function sendChat(message, sessionId, options = {}) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      sessionId,
      ...options,
    }),
  });
  return res.json();
}

export async function getBrainStats() {
  const res = await fetch(`${API_BASE}/brain/stats`);
  return res.json();
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
