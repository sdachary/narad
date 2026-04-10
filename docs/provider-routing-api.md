# Provider Routing API Guide

## Overview

Narad now includes intelligent provider routing that automatically selects the optimal AI provider based on task type, cost, and quality requirements.

---

## How It Works

1. **Task Classification** - Message is analyzed to detect task type
2. **Provider Selection** - Optimal provider selected from available providers
3. **Model Selection** - Model chosen based on task (fast/balanced/strong)

---

## Task Types

| Task Type | Keywords | Recommended Provider | Model |
|-----------|----------|---------------------|-------|
| `coding` | code, function, implement, class, export, import, write | anthropic | balanced |
| `debugging` | debug, error, bug, fix, crash, exception, trace | anthropic | strong |
| `research` | research, explain, analyze, compare, document, architecture | gemini | balanced |
| `deployment` | deploy, docker, kubernetes, build, release, publish | groq | balanced |
| `simple` | what, how, when, where, who, list, show | openrouter | fast |
| `default` | (fallback) | groq | balanced |

---

## Provider Weights

### Cost per 1M tokens

| Provider | Cost |
|----------|------|
| cloudflare | $0.00 |
| cerebras | $0.00 |
| github | $0.00 |
| nvidia | $0.00 |
| huggingface | $0.00 |
| groq | $0.10 |
| openrouter | $0.20 |
| deepseek | $0.15 |
| mistral | $0.40 |
| gemini | $0.50 |
| openai | $3.00 |
| anthropic | $3.00 |

### Quality Score (0-1)

| Provider | Quality |
|----------|---------|
| cloudflare | 0.45 |
| cerebras | 0.55 |
| huggingface | 0.65 |
| deepseek | 0.60 |
| mistral | 0.65 |
| groq | 0.50 |
| openrouter | 0.70 |
| gemini | 0.80 |
| github | 0.75 |
| nvidia | 0.75 |
| openai | 0.90 |
| anthropic | 0.95 |

---

## API Usage

### Automatic Routing (Default)

Simply send a message - routing happens automatically:

```javascript
// messages endpoint - automatically classifies and routes
POST /api/chat
{
  "message": "Fix this bug in my code"
}
// → routed to anthropic (debugging task)
```

### Force Specific Task Type

Override automatic classification:

```javascript
POST /api/chat
{
  "message": "Explain this code",
  "agentType": "research"  // Force research routing
}
// → routed to gemini (research provider)
```

### Available agentType values

- `coding` - Code generation
- `debugging` - Debug/error fixing
- `research` - Analysis/explanation
- `deployment` - DevOps/deployment
- `testing` - Testing tasks
- `general` - Simple Q&A (uses default routing)

---

## Configuration

### Environment Variables

Required API keys for providers:

```bash
# At least one required
GROQ_API_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GEMINI_API_KEY=...
DEEPSEEK_API_KEY=...       # Via OpenRouter
MISTRAL_API_KEY=...
OPENROUTER_API_KEY=...
CEREBRAS_API_KEY=...
CF_API_TOKEN=...
GITHUB_TOKEN=...
NVIDIA_API_KEY=...
HF_TOKEN=...
```

### Fallback Order

If preferred provider fails, Narad tries in this order:

```
groq → cerebras → cloudflare → openrouter → mistral → gemini → github → nvidia → huggingface → openai → anthropic
```

---

## Cost Tracking (Future)

Planned feature to track costs per session:

```javascript
// Coming soon
POST /api/costs
// Returns: { total: "$0.50", providers: { anthropic: "$0.40", groq: "$0.10" } }
```

---

## Migration Notes

- **Backward compatible** - existing code works unchanged
- **Default behavior unchanged** - same providers used for general tasks
- **agentType takes precedence** - explicitly set agentType overrides classification
- **Fallback preserved** - if preferred provider unavailable, falls back to next available