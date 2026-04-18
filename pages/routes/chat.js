import { checkRateLimit, validateCSRF, ValidationSchemas } from '../services/security.js';
import { getStore, getUsage, addUsage, getRemaining, isWithinLimit, getChatHistory, saveChatHistory, getLastAssistantMessage } from '../services/memory.js';
import { getAvailableProviders, getProviderConfig, selectProviderAndModel } from '../services/ai.js';
import { getProjectContext, queryBrain, getBrainStats, getBrainSystemPrompt, formatBrainStatus, searchVaultFiles, getAllInsights, learnFromConversation } from '../services/vault-brain.js';
import { AI_PROVIDERS } from '../config/providers.js';
import { DAILY_LIMITS } from '../config/index.js';
import { ALL_AGENTS, WAREHOUSE_INDEX, WAREHOUSE_AGENTS, SUBAGENTS } from '../config/agents.js';
import { fetchWebSearch, fetchStockData } from '../services/external.js';
import { ErrorTracker } from './errors.js';

function simpleHash(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) + hash) + char;
    hash = hash & 0xFFFFFFFF;
  }
  return Math.abs(hash);
}

function cleanQueryHash(text) {
  if (!text) return '';
  let cleaned = text.toLowerCase();
  cleaned = cleaned.replace(/[^a-z0-9\s]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  return cleaned;
}

function getPattern(env, queryHash) {
  return getStore(env).get(`pattern:${queryHash}`).then(d => d ? JSON.parse(d) : null);
}

function updatePattern(env, queryHash, score) {
  return getPattern(env, queryHash).then(async existing => {
    let count = (existing && existing.count) || 0;
    let totalScore = (existing && existing.totalScore) || 0;
    count += 1;
    totalScore += score;
    const avgScore = totalScore / count;
    const patternData = {
      count,
      totalScore,
      avgScore,
      lastUpdated: new Date().toISOString()
    };
    await getStore(env).put(`pattern:${queryHash}`, JSON.stringify(patternData));
    return patternData;
  });
}

function getPatternHint(patternData) {
  if (!patternData) return '';
  const { avgScore, count } = patternData;
  if (count >= 3) {
    if (avgScore >= 0.8) {
      return 'Note: Similar queries have received highly positive feedback.';
    } else if (avgScore <= -0.5) {
      return 'Caution: Similar queries have received negative feedback; consider clarifying or adjusting approach.';
    }
  }
  return '';
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

function detectAgentType(message) {
  const lowerMessage = message.toLowerCase();
  
  const allAgentIds = [...Object.keys(WAREHOUSE_INDEX), ...Object.keys(SUBAGENTS)].join('|');
  const prefixMatch = lowerMessage.match(new RegExp(`^\/(${allAgentIds})\s+`));
  if (prefixMatch) {
    return prefixMatch[1];
  }
  
  let bestAgent = 'general';
  let bestScore = 0;
  
  for (const [agentType, config] of Object.entries(ALL_AGENTS)) {
    let score = 0;
    for (const keyword of config.keywords) {
      if (lowerMessage.includes(keyword)) {
        score++;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAgent = agentType;
    }
  }
  
  return bestScore >= 2 ? bestAgent : 'general';
}

function getSystemPrompt(agentType) {
  if (WAREHOUSE_AGENTS[agentType]) {
    return WAREHOUSE_AGENTS[agentType].systemPrompt;
  }
  if (SUBAGENTS[agentType]) {
    return SUBAGENTS[agentType].systemPrompt;
  }
  return null;
}

export function setupChatRoutes(app, metrics) {
   app.post('/api/chat', async (c) => {
     try {
       const startTime = Date.now();
       const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown';
       const rateLimitResult = await checkRateLimit(c.env, clientIP);
       
       if (!rateLimitResult.allowed) {
         c.res.headers.set('Retry-After', rateLimitResult.retryAfter.toString());
         return c.json({ 
           error: 'Too many requests. Please try again later.',
           retryAfter: rateLimitResult.retryAfter
         }, 429);
       }
       
       c.res.headers.set('X-RateLimit-Limit', '60');
       c.res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
       
       const csrfResult = validateCSRF(c.req);
       if (!csrfResult.valid) {
         return c.json({ error: 'CSRF validation failed' }, 403);
       }
       
       const body = await c.req.json();
       const { message, history, context, session_id, agent_type, force_provider, skill_context, project } = body;
      
      let projectContext = '';
      if (session_id && session_id.startsWith('new_')) {
        const loaded = await getProjectContext(c.env, project || 'narad');
        if (loaded.context) {
          projectContext = loaded.context;
        }
      }
      
      const messageValidation = ValidationSchemas.message.validate(message);
      if (!messageValidation.valid) {
        return c.json({ error: messageValidation.error }, 400);
      }
      
      const sessionValidation = session_id 
        ? ValidationSchemas.sessionId.validate(session_id)
        : { valid: true, value: 'session_' + Date.now() };
      if (!sessionValidation.valid) {
        return c.json({ error: sessionValidation.error }, 400);
      }
      
      if (history) {
        const historyValidation = ValidationSchemas.history.validate(history);
        if (!historyValidation.valid) {
          return c.json({ error: historyValidation.error }, 400);
        }
      }
      
      let agentType = agent_type && DAILY_LIMITS.hasOwnProperty(agent_type) ? agent_type : 'general';
      
      if (agentType === 'general' && message) {
        const detectedType = detectAgentType(message);
        if (detectedType !== 'general') {
          agentType = detectedType;
        }
      }
      
      if (!(await isWithinLimit(c.env, agentType, 1000))) {
        return c.json({ 
          error: `Agent '${agentType}' has exceeded its daily token limit.`,
          usage: await getUsage(c.env, agentType)
        }, 429);
      }
      
      const availableProviders = getAvailableProviders(c.env);
      
      if (availableProviders.length === 0) {
        return c.json({ error: 'No AI provider configured.' }, 500);
      }
      
      let providerConfig;
      let selectedProvider;
      if (force_provider && AI_PROVIDERS[force_provider]) {
        providerConfig = getProviderConfig(c.env, force_provider);
        if (!providerConfig) {
          return c.json({ error: `Provider '${force_provider}' not configured` }, 400);
        }
        selectedProvider = force_provider;
      } else {
        const selection = selectProviderAndModel(agentType, message, availableProviders);
        selectedProvider = selection.provider;
        providerConfig = getProviderConfig(c.env, selection.provider);
        if (!providerConfig) {
          selectedProvider = availableProviders[0];
          providerConfig = getProviderConfig(c.env, selectedProvider);
        }
      }
      
      const cleaned = cleanQueryHash(message);
      const queryHash = simpleHash(cleaned).toString();
      
      const patternData = await getPattern(c.env, queryHash);
      const patternHint = getPatternHint(patternData);
      
      const brainPrompt = await getBrainSystemPrompt(c.env);
      
      const systemPromptParts = [
        brainPrompt,
        '',
        'MISSION:',
        'Assist the user with coding, analysis, and general tasks. Be precise and helpful.',
        '',
        'CONTEXT:',
        context || 'No specific context provided.',
        '',
        'AGENT TYPE:',
        agentType === 'general' ? 'General purpose' : `Specialized in ${agentType} tasks`
      ];

      // Inject Brain (Global Knowledge Base) Context dynamically
      try {
        const { searchSemanticMemory } = await import('../services/memory.js');
        const memoryResults = await searchSemanticMemory(c.env, cleaned || message, 3, 0.65);
        if (memoryResults && memoryResults.length > 0) {
          systemPromptParts.push(
            '',
            'GLOBAL BRAIN MEMORY (RELEVANT CONTEXT):',
            'Use the following related facts from the global knowledge base. Use these facts seamlessly without explicitly referring to a "database" or "brain".',
             memoryResults.map(r => `* ${r.content}`).join('\n')
          );
        }
      } catch (e) {
        console.warn('Brain sync injection failed:', e.message);
      }

      // Add real-time context
      const now = new Date();
      const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'full',
        timeStyle: 'long'
      }).format(now);
      
      systemPromptParts.push(
        '',
        'REAL-TIME CONTEXT (CRITICAL):',
        `- Current UTC Time: ${now.toISOString()}`,
        `- Current IST Time: ${istTime}`,
        `- Location Focus: India. If the user asks for the time, answer with the IST time provided above.`,
        `- Weather & Reality: NEVER say you don't have real-time access. If asked for weather/time in India (or generally without specifying), provide a typical, sensible summary for top cities like Delhi, Mumbai, and Bangalore based on current season/time.`
      );
      
      const agentPrompt = getSystemPrompt(agentType);
      if (agentPrompt) {
        systemPromptParts.push('');
        systemPromptParts.push('AGENT GUIDANCE:');
        systemPromptParts.push(agentPrompt);
      }
      
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('price') || lowerMessage.includes('share') || lowerMessage.includes('stock') || lowerMessage.includes('nifty')) {
        const stockData = await fetchStockData(message);
        if (stockData) {
          systemPromptParts.push('');
          systemPromptParts.push('REAL-TIME STOCK DATA (CRITICAL):');
          systemPromptParts.push(`- Symbol: ${stockData.symbol}`);
          systemPromptParts.push(`- Current Price: ${stockData.currency} ${stockData.price}`);
          systemPromptParts.push(`- Change: ${stockData.change > 0 ? '+' : ''}${stockData.change.toFixed(2)} (${stockData.changePercent}%)`);
          systemPromptParts.push(`- Exchange: ${stockData.exchange}`);
          systemPromptParts.push(`- Last Updated: ${stockData.time}`);
          systemPromptParts.push('NOTE: Answer ONLY with the price and change. Use the exact date/time format provided.');
        }
      }
      
      const searchTriggers = ['news', 'who is', 'latest', 'what is', 'current', 'event', 'result', 'where'];
      const shouldSearch = lowerMessage.startsWith('/search') || 
                         (searchTriggers.some(t => lowerMessage.includes(t)) && !lowerMessage.includes('price') && !lowerMessage.includes('share'));
      
      if (lowerMessage.startsWith('/brain')) {
        const brainArgs = lowerMessage.replace(/^\/brain\s*/, '').split(' ');
        if (brainArgs[0] === '' || brainArgs[0] === 'status') {
          const stats = await getBrainStats(c.env);
          return c.json({ reply: await formatBrainStatus(stats), session_id, metadata: { command: 'brain' } });
        } else if (brainArgs[0] === 'search' || brainArgs[0] === 'find') {
          const query = brainArgs.slice(1).join(' ');
          const results = await searchVaultFiles(c.env, query);
          const reply = results.results.length === 0 
            ? `No results for "${query}"`
            : results.results.map(r => `• ${r.title}\n  ${r.excerpt}\n  Score: ${r.score.toFixed(2)}`).join('\n\n');
          return c.json({ reply, session_id, metadata: { command: 'brain-search', query } });
        } else if (brainArgs[0] === 'insights') {
          const insights = await getAllInsights(c.env, { limit: 10 });
          const reply = insights.insights.length === 0
            ? 'No insights learned yet.'
            : insights.insights.map(i => `• ${i.title}\n  Category: ${i.category}`).join('\n\n');
          return c.json({ reply, session_id, metadata: { command: 'brain-insights' } });
        }
      }
      
      if (shouldSearch) {
        const searchQuery = lowerMessage.replace(/^\/search\s*/, '');
        const searchResults = await fetchWebSearch(searchQuery, c.env);
        if (searchResults && searchResults.length > 0) {
          systemPromptParts.push('\nWEB SEARCH RESULTS (CRITICAL - USE THESE TO ANSWER):');
          searchResults.forEach((r, i) => {
            systemPromptParts.push(`${i+1}. ${r.title}\n   Snippet: ${r.snippet}\n   URL: ${r.url}`);
          });
          systemPromptParts.push('\nBe extremely brief. Use facts from search results only.');
        }
      }
      
      if (skill_context) {
        systemPromptParts.push('');
        systemPromptParts.push('BEHAVIORAL PROTOCOL (CRITICAL):');
        systemPromptParts.push(skill_context);
      }
      
      const brainContext = await queryBrain(c.env, message, { topK: 2 });
      if (brainContext.results && brainContext.results.length > 0) {
        systemPromptParts.push('\nRELEVANT KNOWLEDGE FROM BRAIN:');
        brainContext.results.forEach(r => {
          systemPromptParts.push(`- ${r.title}: ${r.content.slice(0, 300)}...`);
        });
      }
      
      if (projectContext) {
        systemPromptParts.push('\nPROJECT STARTUP CONTEXT:');
        systemPromptParts.push(projectContext.slice(0, 500));
      }
      
      const systemPrompt = systemPromptParts.join('\n');
      
      const messages = [
        { role: 'system', content: systemPrompt },
        ...(history || []).map(msg => ({ role: msg.role, content: msg.text || msg.content })),
        { role: 'user', content: message }
      ];
      
      const model = providerConfig.defaultModel;
      const isAnthropic = providerConfig.name === 'Anthropic';
      const isGemini = providerConfig.name === 'Gemini';
      const isOpenRouter = providerConfig.name === 'OpenRouter';
      
      let lastErr = null;
      for (let i = 0; i < availableProviders.length; i++) {
        const currentProvider = availableProviders[i];
        const currentConfig = getProviderConfig(c.env, currentProvider);
        if (!currentConfig) continue;
        
        const currentModel = currentConfig.defaultModel;
        
        try {
          let res;
          if (currentConfig.name === 'Anthropic') {
            res = await fetch(currentConfig.endpoint, {
              method: 'POST',
              headers: {
                'x-api-key': currentConfig.apiKey,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                model: currentModel,
                messages,
                max_tokens: 2048
              })
            });
          } else if (currentConfig.name === 'Gemini') {
            const geminiEndpoint = `${currentConfig.endpoint}/${currentModel}:generateContent?key=${currentConfig.apiKey}`;
            res = await fetch(geminiEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                contents: messages.map(m => ({ role: m.role === 'system' ? 'user' : m.role, parts: [{ text: m.content }] })),
                generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
              })
            });
          } else {
            const body = {
              model: currentModel,
              messages,
              temperature: 0.7,
              max_tokens: 2048
            };
            
            const headers = {
              'Authorization': `Bearer ${currentConfig.apiKey}`,
              'Content-Type': 'application/json'
            };
            
            if (isOpenRouter || currentConfig.name === 'OpenRouter') {
              headers['HTTP-Referer'] = 'https://narad-7hc.pages.dev';
              headers['X-Title'] = 'Narad AI';
            }
            
            res = await fetch(currentConfig.endpoint, {
              method: 'POST',
              headers,
              body: JSON.stringify(body)
            });
          }
          
          if (res.status === 429 || res.status >= 500) {
            lastErr = `${currentConfig.name} API rate limited (${res.status}). Trying next provider...`;
            await new Promise(r => setTimeout(r, 500));
            continue;
          }
          
          if (!res.ok) {
            const err = await res.text();
            lastErr = `${currentConfig.name} API error: ${res.status} - ${err.slice(0, 100)}`;
            continue;
          }
          
          const data = await res.json();
          
          let reply;
          let usage;
          
          if (currentConfig.name === 'Gemini') {
            reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
            usage = { total_tokens: data.usageMetadata?.totalTokenCount || 0 };
          } else if (currentConfig.name === 'Anthropic') {
            reply = data.content?.[0]?.text;
            usage = data.usage;
          } else {
            reply = data.choices?.[0]?.message?.content;
            usage = data.usage;
          }
          
          if (!reply) {
            lastErr = `${currentConfig.name} returned empty response.`;
            continue;
          }
          
          providerConfig = currentConfig;
          selectedProvider = currentProvider;
          
          const totalTokens = usage?.total_tokens || 0;
          await addUsage(c.env, agentType, totalTokens);
          
           const chatHistory = await getChatHistory(c.env, session_id);
           const newHistory = [
             ...chatHistory,
             { role: 'user', text: message, agentType: agentType, queryHash: queryHash },
             { role: 'assistant', text: reply, agentType: agentType, queryHash: queryHash }
           ];
           await saveChatHistory(c.env, session_id, newHistory);
           
           await learnFromConversation(c.env, message, reply, { agentType, sessionId: session_id });
           
           // Update metrics
           metrics.chatRequestsTotal += 1;
           metrics.providerLatency.push(Date.now() - startTime);
           metrics.tokenUsageTotal += totalTokens;
           metrics.activeSessions.add(session_id);
           
           return c.json({ 
             reply, 
             session_id,
             metadata: {
               provider: selectedProvider,
               model: providerConfig.defaultModel,
               tokens: totalTokens,
               agentType: agentType,
               remainingTokens: await getRemaining(c.env, agentType)
             }
           });
        } catch (fetchErr) {
          lastErr = fetchErr.message;
        }
      }
      
      return c.json({ 
        error: 'All AI providers failed', 
        details: lastErr 
      }, 502);
    } catch (err) {
      await ErrorTracker.trackError(c.env, err, {
        path: '/api/chat',
        method: 'POST',
        userAgent: c.req.header('User-Agent'),
        ip: c.req.header('CF-Connecting-IP')
      });
      return c.json({ error: 'Internal Worker Error', message: err.message }, 500);
    }
  });
  
  app.get('/api/chat/history/:session_id', async (c) => {
    try {
      const { session_id } = c.req.param();
      
      const validation = ValidationSchemas.sessionId.validate(session_id);
      if (!validation.valid) {
        return c.json({ error: validation.error }, 400);
      }
      
      const history = await getChatHistory(c.env, session_id);
      return c.json({ history });
    } catch (error) {
      return c.json({ error: 'Failed to fetch chat history' }, 500);
    }
  });
  
  app.delete('/api/chat/history/:session_id', async (c) => {
    const csrfResult = validateCSRF(c.req);
    if (!csrfResult.valid) {
      return c.json({ error: 'CSRF validation failed' }, 403);
    }
    
    const { session_id } = c.req.param();
    
    const validation = ValidationSchemas.sessionId.validate(session_id);
    if (!validation.valid) {
      return c.json({ error: validation.error }, 400);
    }
    
    await getStore(c.env).delete(`chat:${session_id}`);
    return c.json({ success: true });
  });
  
  app.get('/api/usage', async (c) => {
    try {
      const result = {};
      for (const [agentType, limit] of Object.entries(DAILY_LIMITS)) {
        const usage = await getUsage(c.env, agentType);
        result[agentType] = {
          tokensUsed: usage.tokensUsed,
          limit: limit,
          remaining: limit - usage.tokensUsed,
          percentUsed: limit > 0 ? (usage.tokensUsed / limit) * 100 : 0
        };
      }
      return c.json(result);
    } catch (error) {
      return c.json({ error: 'Failed to fetch usage stats' }, 500);
    }
  });
}
