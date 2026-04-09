# Free LLM Providers & Agent Skills Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add free LLM providers (Cerebras, Cloudflare, HuggingFace, GitHub Models, NVIDIA NIM) and integrate all 20 agent-skills from addyosmani/agent-skills into Narad's command system

**Architecture:** Extend providers.js with new free providers (OpenAI-compatible), add skill commands to app.js that trigger the appropriate workflows

**Tech Stack:** Cloudflare Workers, JavaScript, OpenAI-compatible API format

---

## Task 1: Add Free LLM Providers

**Files:**
- Modify: `/home/deepak/Work/narad/pages/config/providers.js`

- [ ] **Step 1: Add Cerebras provider**

```javascript
cerebras: {
  name: 'Cerebras',
  apiKey: 'CEREBRAS_API_KEY',
  endpoint: 'https://api.cerebras.ai/v1/chat/completions',
  models: {
    fast: 'llama-3.1-8b',
    balanced: 'llama-3.3-70b',
    strong: 'qwen3-235b'
  },
  defaultModel: 'llama-3.3-70b',
  features: {
    streaming: true,
    vision: false,
    functionCalls: true,
    json: true,
    maxContext: 128000,
    speed: 'fastest'
  }
},
```

- [ ] **Step 2: Add Cloudflare Workers AI provider**

```javascript
cloudflare: {
  name: 'Cloudflare Workers AI',
  apiKey: 'CF_API_TOKEN',
  endpoint: 'https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run',
  models: {
    fast: '@cf/meta/llama-3.1-8b-instruct',
    balanced: '@cf/meta/llama-3.3-70b-instruct',
    strong: '@cf/qwen/qwen2.5-72b-instruct'
  },
  defaultModel: '@cf/meta/llama-3.3-70b-instruct',
  isCloudflare: true,
  features: {
    streaming: true,
    vision: false,
    functionCalls: false,
    json: false,
    maxContext: 128000,
    speed: 'fast'
  }
},
```

- [ ] **Step 3: Add HuggingFace provider**

```javascript
huggingface: {
  name: 'HuggingFace',
  apiKey: 'HF_API_KEY',
  endpoint: 'https://api-inference.huggingface.co/v1/chat/completions',
  models: {
    fast: 'meta-llama/Llama-3.2-8B-Instruct',
    balanced: 'meta-llama/Llama-3.3-70B-Instruct',
    strong: 'Qwen/Qwen2.5-72B-Instruct'
  },
  defaultModel: 'meta-llama/Llama-3.3-70B-Instruct',
  features: {
    streaming: true,
    vision: false,
    functionCalls: false,
    json: true,
    maxContext: 128000,
    speed: 'medium'
  }
},
```

- [ ] **Step 4: Add GitHub Models provider**

```javascript
github: {
  name: 'GitHub Models',
  apiKey: 'GITHUB_TOKEN',
  endpoint: 'https://models.inference.ai.azure.com/v1/chat/completions',
  models: {
    fast: 'Llama-3.3-70B-Instruct',
    balanced: 'GPT-4o',
    strong: 'DeepSeek-R1'
  },
  defaultModel: 'Llama-3.3-70B-Instruct',
  features: {
    streaming: true,
    vision: true,
    functionCalls: true,
    json: true,
    maxContext: 128000,
    speed: 'fast'
  }
},
```

- [ ] **Step 5: Add NVIDIA NIM provider**

```javascript
nvidia: {
  name: 'NVIDIA NIM',
  apiKey: 'NVIDIA_API_KEY',
  endpoint: 'https://integrate.api.nvidia.com/v1/chat/completions',
  models: {
    fast: 'meta/llama-3.1-8b-instruct',
    balanced: 'meta/llama-3.3-70b-instruct',
    strong: 'deepseek-ai/deepseek-r1'
  },
  defaultModel: 'meta/llama-3.3-70b-instruct',
  features: {
    streaming: true,
    vision: false,
    functionCalls: true,
    json: true,
    maxContext: 128000,
    speed: 'fast'
  }
},
```

- [ ] **Step 6: Update PROVIDER_FALLBACK_ORDER**

```javascript
export const PROVIDER_FALLBACK_ORDER = ['groq', 'cerebras', 'cloudflare', 'openrouter', 'mistral', 'gemini', 'github', 'nvidia', 'huggingface', 'openai', 'anthropic'];
```

- [ ] **Step 7: Update PROVIDER_FEATURES for free tier**

```javascript
free: { requiredFor: 'no_cost', preferred: ['cerebras', 'groq', 'cloudflare', 'openrouter', 'github', 'nvidia', 'huggingface'] }
```

---

## Task 2: Integrate Agent Skills into app.js

**Files:**
- Modify: `/home/deepak/Work/narad/pages/app.js`

- [ ] **Step 1: Add skill command handlers for the 7 main commands**

Add to COMMAND_REGISTRY:

```javascript
// Agent Skills - Development Lifecycle Commands
'/spec': {
  name: 'Spec Driven Development',
  icon: '📝',
  description: 'Write a PRD covering objectives, commands, structure, code style, testing, and boundaries before any code',
  syntax: '/spec <project description>',
  examples: ['/spec a chat app with file upload']
},
'/plan': {
  name: 'Planning & Task Breakdown',
  icon: '📋',
  description: 'Decompose specs into small, verifiable tasks with acceptance criteria and dependency ordering',
  syntax: '/plan <from spec>',
  examples: ['/plan based on current spec']
},
'/build': {
  name: 'Incremental Implementation',
  icon: '🔨',
  description: 'Thin vertical slices - implement, test, verify, commit. Feature flags, safe defaults, rollback-friendly',
  syntax: '/build <feature>',
  examples: ['/build user authentication']
},
'/test': {
  name: 'Test Driven Development',
  icon: '🧪',
  description: 'Red-Green-Refactor, test pyramid (80/15/5), test sizes, DAMP over DRY, Beyonce Rule',
  syntax: '/test <feature>',
  examples: ['/test login flow']
},
'/review': {
  name: 'Code Review & Quality',
  icon: '🔍',
  description: 'Five-axis review, change sizing (~100 lines), severity labels (Nit/Optional/FYI), review speed norms',
  syntax: '/review <code or PR>',
  examples: ['/review recent changes']
},
'/code-simplify': {
  name: 'Code Simplification',
  icon: '✨',
  description: "Chesterton's Fence, Rule of 500, reduce complexity while preserving exact behavior",
  syntax: '/code-simplify',
  examples: ['/code-simplify']
},
'/ship': {
  name: 'Shipping & Launch',
  icon: '🚀',
  description: 'Pre-launch checklists, feature flag lifecycle, staged rollouts, rollback procedures, monitoring',
  syntax: '/ship',
  examples: ['/ship to production']
},
```

- [ ] **Step 2: Add skill context generators for each command**

Create a function that generates skill context based on the command:

```javascript
// Skill context generators for agent-skills integration
const SKILL_CONTEXTS = {
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
  - Clean up feature flags`
};
```

- [ ] **Step 3: Update command parser to extract skill_context**

Modify parseCommand to return skill_context:

```javascript
// Add to parseCommand for skill commands
if (/^\/(spec|plan|build|test|review|code-simplify|ship)\s*(.*)$/i.test(trimmed)) {
  const match = trimmed.match(/^\/(spec|plan|build|test|review|code-simplify|ship)\s*(.*)$/i);
  const skill = match[1].toLowerCase();
  return {
    type: 'skill_command',
    skill: skill,
    message: match[2] || '',
    skill_context: SKILL_CONTEXTS['/' + skill]
  };
}
```

- [ ] **Step 4: Update handleSubmit to send skill_context to API**

In the message handling code, pass skill_context:

```javascript
const parsed = parseCommand(userInput.value);
if (parsed.type === 'skill_command') {
  // Send with skill context
  const response = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: parsed.message,
      history: chatHistory,
      session_id: sessionId,
      skill_context: parsed.skill_context,
      context: `Operating in ${currentMode} mode with ${parsed.skill} skill`
    })
  });
}
```

---

## Task 3: Update Backend Chat Route

**Files:**
- Modify: `/home/deepak/Work/narad/pages/routes/chat.js`

- [ ] **Step 1: Accept skill_context in request body**

The existing code already supports skill_context (line 278), so no changes needed.

- [ ] **Step 2: Ensure skill_context is injected into system prompt**

Already implemented at lines 278-282 - verified.

---

## Task 4: Add Command Palette Entries

**Files:**
- Modify: `/home/deepak/Work/narad/pages/app.js`

- [ ] **Step 1: Add skill commands to COMMANDS array**

```javascript
const COMMANDS = [
  // ... existing commands ...
  { name: 'spec', desc: 'Write PRD before code (Spec Driven Development)' },
  { name: 'plan', desc: 'Break down into atomic tasks (Planning)' },
  { name: 'build', desc: 'Implement in vertical slices (Incremental)' },
  { name: 'test', desc: 'Red-Green-Refactor (Test Driven)' },
  { name: 'review', desc: 'Five-axis code review (Quality Gate)' },
  { name: 'code-simplify', desc: 'Reduce complexity, preserve behavior' },
  { name: 'ship', desc: 'Pre-launch checklist, staged rollout' },
  { name: 'cerebras', desc: 'Switch to Cerebras free provider' },
  { name: 'cloudflare', desc: 'Switch to Cloudflare Workers AI' },
  { name: 'github-models', desc: 'Switch to GitHub Models' },
];
```

---

## Verification

- [ ] Test parsing of all new commands (/spec, /plan, /build, /test, /review, /code-simplify, /ship)
- [ ] Verify skill_context is sent to API
- [ ] Verify providers appear in /models command
- [ ] Test provider switching commands