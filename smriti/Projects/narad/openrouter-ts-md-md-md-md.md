---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/openrouter-ts-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker, typescript]
lines: 247
size: 5556 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, docker, documentation, markdown, project/narad, typescript]
---

# openrouter-ts-md-md-md.md

> Authentication / authorization module using **docker, typescript** (247 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/openrouter-ts-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 247 |
| **Size** | 5556 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/openrouter-ts-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker, typescript]
lines: 209
size: 4741 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, docker, documentation, markdown, project/narad, typescript]
---

# openrouter-ts-md-md.md

> Authentication / authorization module using **docker, typescript** (209 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/openrouter-ts-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 209 |
| **Size** | 4741 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/openrouter-ts-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker, typescript]
lines: 171
size: 3935 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, docker, documentation, markdown, project/narad, typescript]
---

# openrouter-ts-md.md

> Authentication / authorization module using **docker, typescript** (171 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/openrouter-ts-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 171 |
| **Size** | 3935 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/openrouter-ts.md"
project: "narad"
role: auth
language: markdown
frameworks: [docker, typescript]
lines: 133
size: 3136 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, docker, documentation, markdown, project/narad, typescript]
---

# openrouter-ts.md

> Authentication / authorization module using **docker, typescript** (133 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/openrouter-ts.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | docker, typescript |
| **Lines** | 133 |
| **Size** | 3136 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai/openrouter.ts"
project: "unnati"
role: auth
language: typescript
frameworks: [docker, typescript]
lines: 95
size: 2367 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, code, docker, project/unnati, typescript]
---

# openrouter.ts

> Authentication / authorization module using **docker, typescript** (95 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai/openrouter.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | docker, typescript |
| **Lines** | 95 |
| **Size** | 2367 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

[[env-ts]]

## 📄 Content

```typescript
import { getEnv } from '../env';

interface OpenRouterResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export async function runOpenRouter(
  prompt: string,
  model: string = 'google/gemini-2.0-flash-lite:free',
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<OpenRouterResponse> {
  const { systemPrompt, temperature = 0.7, maxTokens = 2048 } = options;

  try {
    const env = getEnv();
    const apiKey = env.ai.openrouter.apiKey;

    if (!apiKey || apiKey.trim() === '') {
      return {
        success: false,
        error: 'OpenRouter API key not configured',
      };
    }

    const messages: Array<{ role: string; content: string }> = [];

    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }

    messages.push({ role: 'user', content: prompt });

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://unnati.ai',
        'X-Title': 'UNNATI',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      return {
        success: false,
        error: 'No response from model',
      };
    }

    const content = data.choices[0]?.message?.content || '';

    return {
      success: true,
      content,
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

```

```

```

```

```
