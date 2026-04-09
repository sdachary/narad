---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ai-js-md-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 306
size: 8405 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# ai-js-md-md-md.md

> Documentation (306 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ai-js-md-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 306 |
| **Size** | 8405 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ai-js-md-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 268
size: 7720 bytes
last_modified: "2026-04-09 14:45"
scanned: "2026-04-09 14:45"
tags: [docs, documentation, markdown, project/narad]
---

# ai-js-md-md.md

> Documentation (268 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ai-js-md-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 268 |
| **Size** | 7720 bytes |
| **Modified** | 2026-04-09 14:45 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ai-js-md.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 230
size: 7044 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad]
---

# ai-js-md.md

> Documentation (230 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ai-js-md.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 230 |
| **Size** | 7044 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/ai-js.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 192
size: 6377 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [docs, documentation, markdown, project/narad]
---

# ai-js.md

> Documentation (192 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/ai-js.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 192 |
| **Size** | 6377 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/ai.js"
project: "narad"
role: auth
language: javascript
frameworks: []
lines: 152
size: 5581 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [auth, code, javascript, project/narad]
---

# ai.js

> Authentication / authorization module (152 lines).

**Key exports:** `getAvailableProviders`, `getProviderConfig`, `selectProviderAndModel`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/ai.js` |
| **Role** | auth |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 152 |
| **Size** | 5581 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

[[characters-js]], [[providers-js]]

## 📄 Content

```javascript
import { AI_PROVIDERS, PROVIDER_FALLBACK_ORDER } from '../config/providers.js';
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

export function selectProviderAndModel(agentType, message, availableProviders, character = null) {
  const lowerMessage = message.toLowerCase();
  const available = availableProviders || PROVIDER_FALLBACK_ORDER;
  
  const characterInfo = character ? getCharacter(character) : null;
  
  if (agentType === 'coding' || lowerMessage.includes('code') || lowerMessage.includes('function') || lowerMessage.includes('implement')) {
    const provider = available.find(p => ['groq', 'mistral', 'openrouter'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.balanced, character: characterInfo };
  }
  
  if (agentType === 'debugging' || lowerMessage.includes('debug') || lowerMessage.includes('error') || lowerMessage.includes('fix')) {
    const provider = available.find(p => ['openai', 'anthropic', 'gemini'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.balanced, character: characterInfo };
  }
  
  if (agentType === 'research' || lowerMessage.includes('research') || lowerMessage.includes('explain') || lowerMessage.includes('analysis')) {
    const provider = available.find(p => ['anthropic', 'gemini', 'openai'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.balanced, character: characterInfo };
  }
  
  if (agentType === 'testing' || lowerMessage.includes('test') || lowerMessage.includes('spec')) {
    const provider = available.find(p => ['anthropic', 'openai', 'mistral'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.strong, character: characterInfo };
  }
  
  if (agentType === 'deployment' || lowerMessage.includes('deploy') || lowerMessage.includes('docker') || lowerMessage.includes('kubernetes')) {
    const provider = available.find(p => ['groq', 'mistral', 'openrouter', 'gemini'].includes(p));
    if (provider) return { provider, model: AI_PROVIDERS[provider].models.fast, character: characterInfo };
  }
  
  if (available.length > 0) {
    const provider = available[0];
    return { provider, model: AI_PROVIDERS[provider].defaultModel, character: characterInfo };
  }
  
  return { provider: 'groq', model: AI_PROVIDERS.groq.defaultModel, character: characterInfo };
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

```

```

```

```
