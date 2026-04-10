---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/ai.js"
project: "narad"
role: auth
language: javascript
frameworks: [docker]
lines: 164
size: 4994 bytes
last_modified: "2026-04-10 16:04"
scanned: "2026-04-10 16:04"
tags: [auth, code, docker, javascript, project/narad]
---

# ai.js

> Authentication / authorization module using **docker** (164 lines).

**Key exports:** `getAvailableProviders`, `getProviderConfig`, `classifyTask`, `selectOptimalProvider`, `selectProviderAndModel`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/ai.js` |
| **Role** | auth |
| **Language** | javascript |
| **Frameworks** | docker |
| **Lines** | 164 |
| **Size** | 4994 bytes |
| **Modified** | 2026-04-10 16:04 |

## 🔗 Related Files

[[characters-js]], [[providers-js]]

## 📄 Content

```javascript
import { AI_PROVIDERS, PROVIDER_FALLBACK_ORDER, PROVIDER_ROUTING } from '../config/providers.js';
import { getCharacter, getCharacterSystemPrompt } from '../config/characters.js';

export function getAvailableProviders(env) {
  return PROVIDER_FALLBACK_ORDER.filter(p => {
    const provider = AI_PROVIDERS[p];
    return env[provider.apiKey];
  });
}

export function getProviderConfig(env, providerName) {
  const provider = AI_PROVIDERS[providerName];
  if (!provider) return null;
  
  const apiKey = env[provider.apiKey];
  if (!apiKey) return null;
  
  return { ...provider, apiKey };
}

// Classify a message into a task type based on keywords
export function classifyTask(message) {
  const lower = message.toLowerCase();
  
  for (const [taskType, keywords] of Object.entries(PROVIDER_ROUTING.keywords)) {
    if (keywords.some(k => lower.includes(k))) {
      return taskType;
    }
  }
  return 'simple';
}

// Select optimal provider based on task type and available providers
export function selectOptimalProvider(taskType, availableProviders) {
  // 1. Try task-specific routing
  const taskProvider = PROVIDER_ROUTING.taskRouting[taskType];
  if (taskProvider && availableProviders.includes(taskProvider)) {
    return taskProvider;
  }
  
  // 2. Fallback to default
  const defaultProvider = PROVIDER_ROUTING.taskRouting.default;
  if (availableProviders.includes(defaultProvider)) {
    return defaultProvider;
  }
  
  // 3. Return first available
  return availableProviders[0];
}

export function selectProviderAndModel(agentType, message, availableProviders, character = null) {
  // Use agentType if provided, otherwise classify from message
  const taskType = agentType || classifyTask(message);
  const available = availableProviders || PROVIDER_FALLBACK_ORDER;
  
  const provider = selectOptimalProvider(taskType, available);
  const providerConfig = AI_PROVIDERS[provider];
  
  // Select model based on task type
  const modelType = taskType === 'debugging' ? 'strong' : 
                    taskType === 'simple' ? 'fast' : 'balanced';
  
  const characterInfo = character ? getCharacter(character) : null;
  
  return { 
    provider, 
    model: providerConfig.models[modelType],
    character: characterInfo
  };
}

export async function callAI(messages, providerConfig, options = {}) {
  const { model, max_tokens = 2048, temperature = 0.7, character = null } = options;
  const isAnthropic = providerConfig.name === 'Anthropic';
  const isGemini = providerConfig.name === 'Gemini';
  const isOpenRouter = providerConfig.name === 'OpenRouter';
  
  let processedMessages = [...messages];
  if (character) {
    const characterSystemPrompt = getCharacterSystemPrompt(character);
    processedMessages = [
      { role: 'system', content: characterSystemPrompt },
      ...messages
    ];
  }
  
  let res;
  
  if (isAnthropic) {
    res = await fetch(providerConfig.endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': providerConfig.apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model || providerConfig.defaultModel,
        messages: processedMessages,
        max_tokens
      })
    });
  } else if (isGemini) {
    const geminiEndpoint = `${providerConfig.endpoint}/${model || providerConfig.defaultModel}:generateContent?key=${providerConfig.apiKey}`;
    res = await fetch(geminiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: processedMessages.map(m => ({ role: m.role === 'system' ? 'user' : m.role, parts: [{ text: m.content }] })),
        generationConfig: { temperature, maxOutputTokens: max_tokens }
      })
    });
  } else {
    const body = {
      model: model || providerConfig.defaultModel,
      messages: processedMessages,
      temperature,
      max_tokens
    };
    
    const headers = {
      'Authorization': `Bearer ${providerConfig.apiKey}`,
      'Content-Type': 'application/json'
    };
    
    if (isOpenRouter) {
      headers['HTTP-Referer'] = 'https://narad-7hc.pages.dev';
      headers['X-Title'] = 'Narad AI';
    }
    
    res = await fetch(providerConfig.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
  }
  
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`AI API error: ${res.status} - ${err.slice(0, 100)}`);
  }
  
  const data = await res.json();
  
  let reply;
  let usage;
  
  if (isGemini) {
    reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    usage = { total_tokens: data.usageMetadata?.totalTokenCount || 0 };
  } else if (isAnthropic) {
    reply = data.content?.[0]?.text;
    usage = data.usage;
  } else {
    reply = data.choices?.[0]?.message?.content;
    usage = data.usage;
  }
  
  if (!reply) {
    throw new Error(`${providerConfig.name} returned empty response`);
  }
  
  return { reply, usage };
}

```
