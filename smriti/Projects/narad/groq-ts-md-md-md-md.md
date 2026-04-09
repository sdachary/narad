---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/groq-ts-md-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 332
size: 7425 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# groq-ts-md-md-md.md

> Authentication / authorization module using **typescript** (332 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/groq-ts-md-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 332 |
| **Size** | 7425 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/groq-ts-md-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 294
size: 6660 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# groq-ts-md-md.md

> Authentication / authorization module using **typescript** (294 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/groq-ts-md-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 294 |
| **Size** | 6660 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/groq-ts-md.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 256
size: 5904 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# groq-ts-md.md

> Authentication / authorization module using **typescript** (256 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/groq-ts-md.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 256 |
| **Size** | 5904 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/unnati/groq-ts.md"
project: "narad"
role: auth
language: markdown
frameworks: [typescript]
lines: 218
size: 5155 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [auth, documentation, markdown, project/narad, typescript]
---

# groq-ts.md

> Authentication / authorization module using **typescript** (218 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/unnati/groq-ts.md` |
| **Role** | auth |
| **Language** | markdown |
| **Frameworks** | typescript |
| **Lines** | 218 |
| **Size** | 5155 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai/groq.ts"
project: "unnati"
role: auth
language: typescript
frameworks: [typescript]
lines: 180
size: 4433 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [auth, code, project/unnati, typescript]
---

# groq.ts

> Authentication / authorization module using **typescript** (180 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai/groq.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 180 |
| **Size** | 4433 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[env-ts]]

## 📄 Content

```typescript
import { getEnv } from '../env';

interface GroqResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const TIMEOUT_MS = 30000;
const MAX_REQUESTS = 200;
const WINDOW_MS = 60000;

class RateLimiter {
  private requests: number = 0;
  private resetTime: number;
  private maxRequests: number;
  private queue: Array<() => void> = [];
  private processing: boolean = false;

  constructor(maxRequests: number = MAX_REQUESTS, windowMs: number = WINDOW_MS) {
    this.maxRequests = maxRequests;
    this.resetTime = Date.now() + windowMs;
  }

  canMakeRequest(): boolean {
    this.resetIfNeeded();
    return this.requests < this.maxRequests;
  }

  private resetIfNeeded(): void {
    if (Date.now() >= this.resetTime) {
      this.requests = 0;
      this.resetTime = Date.now() + WINDOW_MS;
    }
  }

  async waitForSlot(): Promise<void> {
    while (!this.canMakeRequest()) {
      const waitTime = this.resetTime - Date.now();
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 1000)));
      }
      this.resetIfNeeded();
    }
    this.requests++;
  }

  async processQueue(): Promise<void> {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      await this.waitForSlot();
      const next = this.queue.shift();
      if (next) next();
    }

    this.processing = false;
  }
}

const globalLimiter = new RateLimiter();

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeout: number = TIMEOUT_MS
): Promise<Response> {
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
    throw error;
  }
}

function getApiKey(): string | null {
  try {
    const env = getEnv();
    return env.ai.groq.apiKey || null;
  } catch {
    return null;
  }
}

export async function runGroq(
  prompt: string,
  model: string = 'llama-3.3-70b-versatile',
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<GroqResponse> {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      success: false,
      error: 'GROQ_API_KEY not configured',
    };
  }

  const validModels = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
  if (!validModels.includes(model)) {
    return {
      success: false,
      error: `Invalid model: ${model}. Supported: ${validModels.join(', ')}`,
    };
  }

  await globalLimiter.waitForSlot();

  try {
    const messages: Array<{ role: string; content: string }> = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetchWithTimeout(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4096,
        }),
      }
    );

    if (response.status === 429) {
      console.warn('[Groq] Rate limited, waiting for slot...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return runGroq(prompt, model, options);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.choices[0]?.message?.content || '',
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Groq error';
    console.error('[AI] Groq error:', message);
    return {
      success: false,
      error: message,
    };
  }
}

```

```

```

```

```
