---
source: "/home/runner/work/narad/narad/sync_temp/unnati/src/lib/ai/orchestrator.ts"
project: "unnati"
role: auth
language: typescript
frameworks: [typescript]
lines: 426
size: 12142 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [auth, code, project/unnati, typescript]
---

# orchestrator.ts

> Authentication / authorization module using **typescript** (426 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `unnati/src/lib/ai/orchestrator.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | typescript |
| **Lines** | 426 |
| **Size** | 12142 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

[[env-ts]]

## 📄 Content

```typescript
import { getEnv } from '../env';
import {
  RESUME_PARSE_PROMPT,
  JOB_MATCH_PROMPT,
  COVER_LETTER_PROMPT,
  COMPANY_RESEARCH_PROMPT,
} from './prompts';

export type TaskType = 'resume_parse' | 'job_match' | 'cover_letter' | 'company_research';

export interface AIRequest {
  task: TaskType;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  success: boolean;
  content?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
  provider: string;
  cached?: boolean;
}

const TIMEOUT_MS = 30000;

const TASK_PROVIDER_CHAIN: Record<TaskType, string[]> = {
  resume_parse: ['workers-ai', 'groq', 'openrouter'],
  job_match: ['groq', 'openrouter', 'workers-ai'],
  cover_letter: ['groq', 'openrouter', 'workers-ai'],
  company_research: ['openrouter', 'groq', 'workers-ai'],
};

const DEFAULT_MODEL_PARAMS = {
  temperature: 0.7,
  maxTokens: 4096,
};

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

export async function runWorkersAI(
  prompt: string,
  model: string = '@cf/meta/llama-3.1-8b-instruct',
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<AIResponse> {
  try {
    const env = getEnv();
    const { apiToken, accountId } = env.ai.workersAi;

    const messages: Array<{ role: string; content: string }> = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetchWithTimeout(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1/run/${model}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          temperature: options.temperature ?? DEFAULT_MODEL_PARAMS.temperature,
          max_tokens: options.maxTokens ?? DEFAULT_MODEL_PARAMS.maxTokens,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.errors?.[0]?.message || `Workers AI error: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      content: data.result.response,
      usage: {
        promptTokens: data.result.meta?.tokens_prompt || 0,
        completionTokens: data.result.meta?.tokens_completion || 0,
        totalTokens: (data.result.meta?.tokens_prompt || 0) + (data.result.meta?.tokens_completion || 0),
      },
      provider: 'workers-ai',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Workers AI error';
    console.error('[AI] Workers AI error:', message);
    return {
      success: false,
      error: message,
      provider: 'workers-ai',
    };
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
): Promise<AIResponse> {
  try {
    const env = getEnv();
    const { apiKey } = env.ai.groq;

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
          temperature: options.temperature ?? DEFAULT_MODEL_PARAMS.temperature,
          max_tokens: options.maxTokens ?? DEFAULT_MODEL_PARAMS.maxTokens,
        }),
      }
    );

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
      provider: 'groq',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown Groq error';
    console.error('[AI] Groq error:', message);
    return {
      success: false,
      error: message,
      provider: 'groq',
    };
  }
}

export async function runOpenRouter(
  prompt: string,
  model: string = 'google/gemini-2.0-flash-lite:free',
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<AIResponse> {
  try {
    const env = getEnv();
    const { apiKey } = env.ai.openrouter;

    const messages: Array<{ role: string; content: string }> = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const response = await fetchWithTimeout(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://unnati.app',
          'X-Title': 'UNNATI',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? DEFAULT_MODEL_PARAMS.temperature,
          max_tokens: options.maxTokens ?? DEFAULT_MODEL_PARAMS.maxTokens,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenRouter error: ${response.status}`);
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
      provider: 'openrouter',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown OpenRouter error';
    console.error('[AI] OpenRouter error:', message);
    return {
      success: false,
      error: message,
      provider: 'openrouter',
    };
  }
}

async function runProvider(
  provider: string,
  prompt: string,
  options: {
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<AIResponse> {
  switch (provider) {
    case 'workers-ai':
      return runWorkersAI(prompt, undefined, options);
    case 'groq':
      return runGroq(prompt, undefined, options);
    case 'openrouter':
      return runOpenRouter(prompt, undefined, options);
    default:
      return {
        success: false,
        error: `Unknown provider: ${provider}`,
        provider,
      };
  }
}

export async function runAI(request: AIRequest, userId?: string): Promise<AIResponse> {
  const { task, prompt, systemPrompt, temperature, maxTokens } = request;
  const providers = TASK_PROVIDER_CHAIN[task] || ['workers-ai', 'groq', 'openrouter'];

  console.log(`[AI] Running task: ${task} with providers: ${providers.join(', ')}`);

  for (const provider of providers) {
    const result = await runProvider(provider, prompt, {
      systemPrompt,
      temperature,
      maxTokens,
    });

    if (result.success) {
      console.log(`[AI] Success with provider: ${provider}`);
      return result;
    }

    console.warn(`[AI] Provider ${provider} failed: ${result.error}, trying next...`);
  }

  return {
    success: false,
    error: 'All AI providers failed',
    provider: 'none',
  };
}

export async function parseResume(resumeText: string): Promise<any> {
  const prompt = RESUME_PARSE_PROMPT.replace('{resumeText}', resumeText);

  const response = await runAI({
    task: 'resume_parse',
    prompt,
    systemPrompt: 'You are a JSON-only output assistant. Return only valid JSON, no explanations.',
    temperature: 0.3,
    maxTokens: 2048,
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to parse resume');
  }

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response.content);
  } catch (parseError) {
    console.error('[AI] Resume parse JSON error:', parseError);
    throw new Error('Failed to parse resume JSON response');
  }
}

export async function matchJob(resume: any, jobDescription: string): Promise<any> {
  const resumeJson = JSON.stringify(resume, null, 2);
  const prompt = JOB_MATCH_PROMPT
    .replace('{resumeJson}', resumeJson)
    .replace('{jobDescription}', jobDescription);

  const response = await runAI({
    task: 'job_match',
    prompt,
    systemPrompt: 'You are a JSON-only output assistant. Return only valid JSON, no explanations.',
    temperature: 0.5,
    maxTokens: 2048,
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to match job');
  }

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response.content);
  } catch (parseError) {
    console.error('[AI] Job match JSON error:', parseError);
    throw new Error('Failed to parse job match JSON response');
  }
}

export async function generateCoverLetter(
  resume: any,
  job: { title: string; company: string; description: string },
  company: { name: string; description?: string }
): Promise<string> {
  const resumeJson = JSON.stringify(resume, null, 2);
  const prompt = COVER_LETTER_PROMPT
    .replace('{resumeJson}', resumeJson)
    .replace('{jobTitle}', job.title)
    .replace('{jobCompany}', job.company)
    .replace('{jobDescription}', job.description)
    .replace('{companyName}', company.name)
    .replace('{companyDescription}', company.description || 'N/A');

  const response = await runAI({
    task: 'cover_letter',
    prompt,
    systemPrompt: 'You are a professional cover letter writer. Generate only the cover letter content.',
    temperature: 0.8,
    maxTokens: 2048,
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to generate cover letter');
  }

  return response.content;
}

export async function researchCompany(
  companyName: string,
  companyInfo: string
): Promise<any> {
  const prompt = COMPANY_RESEARCH_PROMPT
    .replace('{companyName}', companyName)
    .replace('{companyInfo}', companyInfo);

  const response = await runAI({
    task: 'company_research',
    prompt,
    systemPrompt: 'You are a JSON-only output assistant. Return only valid JSON, no explanations.',
    temperature: 0.5,
    maxTokens: 2048,
  });

  if (!response.success || !response.content) {
    throw new Error(response.error || 'Failed to research company');
  }

  try {
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(response.content);
  } catch (parseError) {
    console.error('[AI] Company research JSON error:', parseError);
    throw new Error('Failed to parse company research JSON response');
  }
}
```
