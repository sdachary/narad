---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai/workers-ai.ts"
project: "unnati"
role: auth
language: typescript
frameworks: [docker, typescript]
lines: 153
size: 3847 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, code, docker, project/unnati, typescript]
---

# workers-ai.ts

> Authentication / authorization module using **docker, typescript** (153 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai/workers-ai.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | docker, typescript |
| **Lines** | 153 |
| **Size** | 3847 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[env-ts]]

## 📄 Content

```typescript
import type { EnvConfig } from '../env';

interface WorkersAIResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

interface WorkersAIOptions {
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

const DEFAULT_MODEL = '@cf/meta/llama-3.1-8b-instruct';
const FALLBACK_MODEL = '@cf/meta/llama-3-8b-instruct';
const TIMEOUT_MS = 30000;

function getWorkersAICredentials(env?: EnvConfig): { accountId: string; apiToken: string } | null {
  if (!env?.ai?.workersAi) {
    try {
      const { getEnv } = require('../env');
      const config = getEnv();
      return config.ai.workersAi;
    } catch {
      return null;
    }
  }
  return env.ai.workersAi;
}

async function fetchWithTimeout(url: string, options: RequestInit, timeout: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

export async function runWorkersAI(
  prompt: string,
  model: string = DEFAULT_MODEL,
  options: WorkersAIOptions = {},
  env?: EnvConfig
): Promise<WorkersAIResponse> {
  const credentials = getWorkersAICredentials(env);
  if (!credentials) {
    return {
      success: false,
      error: 'Workers AI credentials not configured',
    };
  }

  const { accountId, apiToken } = credentials;
  const url = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;

  const messages: Array<{ role: string; content: string }> = [];
  if (options.systemPrompt) {
    messages.push({ role: 'system', content: options.systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  const body: Record<string, unknown> = {
    messages,
  };

  if (options.temperature !== undefined) {
    body.temperature = options.temperature;
  }
  if (options.maxTokens !== undefined) {
    body.max_tokens = options.maxTokens;
  }

  try {
    const response = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
      TIMEOUT_MS
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.errors?.[0]?.message || `HTTP ${response.status}`;
      return {
        success: false,
        error: errorMsg,
      };
    }

    const result = data.result;
    if (!result?.response) {
      return {
        success: false,
        error: 'Invalid response from Workers AI',
      };
    }

    return {
      success: true,
      content: result.response,
      usage: {
        promptTokens: result.prompt_tokens || 0,
        completionTokens: result.completion_tokens || 0,
        totalTokens: (result.prompt_tokens || 0) + (result.completion_tokens || 0),
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function runWorkersAIWithFallback(
  prompt: string,
  options: WorkersAIOptions = {},
  env?: EnvConfig
): Promise<WorkersAIResponse> {
  let result = await runWorkersAI(prompt, DEFAULT_MODEL, options, env);

  if (!result.success && result.error?.includes('model')) {
    result = await runWorkersAI(prompt, FALLBACK_MODEL, options, env);
  }

  return result;
}
```
