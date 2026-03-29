# Narad Subagent Architecture Plan

## Overview

The subagent system enables specialized AI agents that can be delegated specific tasks, improving response quality and allowing parallel processing of complex requests.

## Agent Types

### 1. Research Agent (`research`)
**Purpose**: Web search, fact-checking, and information synthesis

**Capabilities**:
- Search the web for current information
- Synthesize findings from multiple sources
- Fact-check claims
- Generate research summaries

**Best for**:
- "What's the latest on X?"
- "Summarize the recent developments in Y"
- "Is this claim accurate?"

### 2. Coder Agent (`coder`)
**Purpose**: Code generation, review, and debugging

**Capabilities**:
- Write code in multiple languages
- Debug and fix issues
- Code review and optimization
- Explain code patterns
- Generate tests

**Best for**:
- "Write a function to do X"
- "Debug this code"
- "Review my implementation"
- "Explain this code pattern"

### 3. Writer Agent (`writer`)
**Purpose**: Documentation, content creation, and editing

**Capabilities**:
- Write documentation
- Create technical content
- Edit and proofread
- Generate marketing copy
- Write emails and messages

**Best for**:
- "Write docs for this API"
- "Help me draft an email"
- "Improve this documentation"

### 4. Analyst Agent (`analyst`)
**Purpose**: Data analysis, insights, and reasoning

**Capabilities**:
- Analyze data patterns
- Generate insights
- Complex reasoning
- Problem decomposition
- Decision support

**Best for**:
- "Analyze this dataset"
- "What does this data show?"
- "Help me reason through this problem"

### 5. Architect Agent (`architect`)
**Purpose**: System design and technical decisions

**Capabilities**:
- System architecture design
- Technology recommendations
- Design pattern suggestions
- Scalability planning
- Security review

**Best for**:
- "Design a system for X"
- "What's the best way to architect Y?"
- "Compare these technologies"

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Narad Router                            │
│  (Intent detection, agent selection, task routing)        │
└─────────────────┬───────────────────────────────────────────┘
                  │
      ┌───────────┼───────────┬───────────┬───────────┐
      ▼           ▼           ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Research │ │  Coder   │ │  Writer  │ │ Analyst  │ │Architect │
│  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │ │  Agent   │
└────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘
     │            │            │            │            │
     └────────────┴────────────┼────────────┴────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  Response Synth   │
                    │  (Combine results)│
                    └───────────────────┘
```

## Routing Logic

### Intent Detection Rules

```javascript
const AGENT_KEYWORDS = {
  research: ['search', 'find', 'latest', 'recent', 'current', 'news', 'information', 'look up', 'google', 'web'],
  coder: ['code', 'function', 'write', 'debug', 'fix', 'implement', 'programming', 'script', 'algorithm', 'api'],
  writer: ['write', 'document', 'draft', 'email', 'copy', 'content', 'edit', 'proofread', 'blog', 'article'],
  analyst: ['analyze', 'data', 'insights', 'pattern', 'trend', 'report', 'metrics', 'statistics', 'numbers'],
  architect: ['design', 'architecture', 'system', 'scalability', 'infrastructure', 'technology', 'stack', 'framework']
};
```

### Fallback Logic
1. Match keywords to agent type
2. Use general agent if no match
3. Support multi-agent requests via `/agent:type` prefix

## Implementation

### Agent Configuration

```javascript
const SUBAGENT_CONFIG = {
  research: {
    model: 'mixtral-8x7b',
    temperature: 0.3,
    maxTokens: 2000,
    systemPrompt: 'You are a research assistant. Search for information and provide accurate, well-sourced answers.'
  },
  coder: {
    model: 'mixtral-8x7b', 
    temperature: 0.2,
    maxTokens: 3000,
    systemPrompt: 'You are an expert programmer. Write clean, efficient, well-documented code.'
  },
  writer: {
    model: 'mixtral-8x7b',
    temperature: 0.7,
    maxTokens: 2500,
    systemPrompt: 'You are a professional writer. Create clear, engaging content.'
  },
  analyst: {
    model: 'mixtral-8x7b',
    temperature: 0.4,
    maxTokens: 2500,
    systemPrompt: 'You are a data analyst. Provide deep insights and logical analysis.'
  },
  architect: {
    model: 'mixtral-8x7b',
    temperature: 0.3,
    maxTokens: 3000,
    systemPrompt: 'You are a software architect. Design robust, scalable systems.'
  }
};
```

### API Changes

**New endpoint**: `POST /api/agent`
```json
{
  "message": "Write a function to sort an array",
  "agentType": "coder",
  "session_id": "session_xxx"
}
```

**Response**:
```json
{
  "reply": "Here's a quicksort implementation...",
  "metadata": {
    "agentType": "coder",
    "tokens": 450,
    "model": "mixtral-8x7b"
  }
}
```

### Usage in UI

Users can select agents from a dropdown or use prefixes:
- `/research search for X`
- `/code write a function to X`
- `/write draft an email`
- `/analyze look at this data`
- `/architect design a system for X`

## Budget Controls

Each agent type has its own budget allocation:

```javascript
const DAILY_LIMITS = {
  general: 200000,     // Default for undefined types
  research: 150000,    // Token budget
  coder: 250000,       // Higher - common use case
  writer: 150000,
  analyst: 150000,
  architect: 200000    // Detailed responses
};
```

## Future Enhancements

1. **Parallel Execution**: Run multiple agents simultaneously for complex tasks
2. **Agent Chaining**: Pass output of one agent to another
3. **Memory Per Agent**: Each agent maintains its own context
4. **Custom Agents**: User-defined agents with custom prompts
5. **Learning**: Agents learn from user feedback and corrections

## Completed Enhancements

- ✅ **AFFiNe/LogSeq Export**: Export ideas in LogSeq and AFFiNe compatible Markdown formats with proper properties (title::, tags::, created_at::)

## Migration Path

1. ✅ Phase 1: Budget controls per agent type (DONE)
2. 🔄 Phase 2: Agent selection UI (TODO)
3. 🔄 Phase 3: Subagent routing logic (TODO)
4. 🔄 Phase 4: Multi-agent coordination (TODO)
5. 🔄 Phase 5: Learning hooks (TODO)
