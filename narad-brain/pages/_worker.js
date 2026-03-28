import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// KV binding name: NARAD_DATA
// We'll store:
// - chat history: key `chat:${session_id}` -> JSON string of messages array
// - usage stats: key `usage:${agentType}` -> JSON string of { tokensUsed: number, lastReset: string (YYYY-MM-DD) }
// - We'll also store a global reset token? No, we'll compute today each time.

const DAILY_LIMITS = {
  coding: 200000,
  research: 200000,
  debugging: 200000,
  testing: 200000,
  deployment: 200000,
  general: 200000
};

// Helper to get today's date string
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Get usage for agent type from KV, initializing if needed
async function getUsage(env, agentType) {
  const today = getToday();
  const usageKey = `usage:${agentType}`;
  const usageData = await env.NARAD_DATA.get(usageKey);
  
  if (usageData) {
    const parsed = JSON.parse(usageData);
    if (parsed.lastReset === today) {
      return parsed;
    }
  }
  
  // Initialize or reset if new day
  const newUsage = { tokensUsed: 0, lastReset: today };
  await env.NARAD_DATA.put(usageKey, JSON.stringify(newUsage));
  return newUsage;
}

// Add tokens used for agent type
async function addUsage(env, agentType, tokens) {
  const usage = await getUsage(env, agentType);
  usage.tokensUsed += tokens;
  await env.NARAD_DATA.put(`usage:${agentType}`, JSON.stringify(usage));
}

// Get remaining tokens for agent type
async function getRemaining(env, agentType) {
  const usage = await getUsage(env, agentType);
  return Math.max(0, DAILY_LIMITS[agentType] - usage.tokensUsed);
}

// Check if agent type is within limits (with estimated tokens)
async function isWithinLimit(env, agentType, estimatedTokens = 0) {
  const usage = await getUsage(env, agentType);
  return usage.tokensUsed + estimatedTokens <= DAILY_LIMITS[agentType];
}

// Get chat history for a session_id
async function getChatHistory(env, sessionId) {
  const key = `chat:${sessionId}`;
  const historyData = await env.NARAD_DATA.get(key);
  if (historyData) {
    return JSON.parse(historyData);
  }
  return []; // empty array if no history
}

// Save chat history for a session_id
async function saveChatHistory(env, sessionId, messages) {
  const key = `chat:${sessionId}`;
  await env.NARAD_DATA.put(key, JSON.stringify(messages));
}

// Clear all usage stats (optional admin endpoint)
async function resetUsage(env) {
  const today = getToday();
  for (const agentType of Object.keys(DAILY_LIMITS)) {
    await env.NARAD_DATA.put(`usage:${agentType}`, JSON.stringify({ tokensUsed: 0, lastReset: today }));
  }
}

// Clear chat history for a session_id (optional)
async function clearChatHistory(env, sessionId) {
  await env.NARAD_DATA.delete(`chat:${sessionId}`);
}

app.use('*', cors());

// Health check
app.get('/api/health', (c) => c.json({ 
  status: 'ok', 
  service: 'narad-brain',
  timestamp: new Date().toISOString()
}));

// Get usage stats for all agent types
app.get('/api/usage', async (c) => {
  try {
    const result = {};
    for (const [agentType, limit] of Object.entries(DAILY_LIMITS)) {
      const usage = await getUsage(c.env, agentType);
      result[agentType] = {
        tokensUsed: usage.tokensUsed,
        limit: limit,
        remaining: usage.limit - usage.tokensUsed,
        percentUsed: limit > 0 ? (usage.tokensUsed / limit) * 100 : 0
      };
    }
    return c.json(result);
  } catch (error) {
    return c.json({ error: 'Failed to fetch usage stats' }, 500);
  }
});

// Reset usage stats (optional, for testing/admin)
app.post('/api/reset-usage', async (c) => {
  try {
    await resetUsage(c.env);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to reset usage' }, 500);
  }
});

// Core AGI Chat Endpoint
app.post('/api/chat', async (c) => {
  try {
    const { message, history, context, session_id, agent_type } = await c.req.json();
    const GROQ_API_KEY = c.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return c.json({ error: 'GROQ_API_KEY not configured in worker secrets' }, 500);
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json({ error: 'Message is required and must be a non-empty string' }, 400);
    }

    // Determine agent type (default to general)
    const agentType = agent_type && DAILY_LIMITS.hasOwnProperty(agent_type) ? agent_type : 'general';

    // Check if we have enough quota for this request (estimate 1000 tokens for safety)
    if (!(await isWithinLimit(c.env, agentType, 1000))) {
      return c.json({ 
        error: `Agent '${agentType}' has exceeded its daily token limit. Please try again later or use a different agent.`,
        usage: await getUsage(c.env, agentType)
      }, 429); // Too Many Requests
    }

    const systemPrompt = [
      'You are Narad, the omniscient messenger of the Nisha Platform.',
      '',
      'MISSION:',
      'Connect the right information to the right moment. Be wise, calm, and objective.',
      '',
      'CONTEXT:',
      context || 'No specific platform context provided.',
      '',
      'AGENT TYPE:',
      agentType === 'general' ? 'General purpose' : `Specialized in ${agentType} tasks`
    ].join('\n');

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message }
    ];

    const model = c.env.PRIMARY_MODEL || 'llama-3.3-70b-versatile';

    // Retry Groq API up to 2 times on transient failures
    let lastErr = null;
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.7,
            max_tokens: 2048
          })
        });

        if (res.status === 429) {
          // Rate limited — wait and retry
          lastErr = 'Groq API rate limited (429). Please wait a moment and try again.';
          await new Promise(r => setTimeout(r, 1000));
          continue;
        }

        if (res.status >= 500) {
          // Groq server error — retry
          const errText = await res.text().catch(() => 'unknown');
          lastErr = `Groq API server error (${res.status}): ${errText.slice(0, 200)}`;
          await new Promise(r => setTimeout(r, 500));
          continue;
        }

        if (!res.ok) {
          const err = await res.text();
          return c.json({ 
            error: `Groq API error: ${res.status}`, 
            details: err.slice(0, 200) 
          }, 502);
        }

        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        const usage = data.usage;

        if (!reply) {
          return c.json({
            error: 'Groq returned an empty response. The model may be overloaded.',
          }, 502);
        }

        // Track token usage
        const totalTokens = usage?.total_tokens || 0;
        await addUsage(c.env, agentType, totalTokens);

        // Save chat history
        const chatHistory = await getChatHistory(c.env, session_id);
        const newHistory = [
          ...chatHistory,
          { role: 'user', text: message, agentType: agentType },
          { role: 'assistant', text: reply, agentType: agentType }
        ];
        await saveChatHistory(c.env, session_id, newHistory);

        return c.json({ 
          reply, 
          session_id,
          metadata: {
            model,
            tokens: totalTokens,
            agentType: agentType,
            remainingTokens: await getRemaining(c.env, agentType)
          }
        });
      } catch (fetchErr) {
        lastErr = fetchErr.message;
        if (attempt < 1) {
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }

    // All retries failed
    return c.json({ 
      error: 'Failed to reach Groq API after retries', 
      details: lastErr 
    }, 502);

  } catch (err) {
    return c.json({ error: 'Internal Worker Error', message: err.message }, 500);
  }
});

// Optional: Get chat history for a session_id
app.get('/api/chat/history/:session_id', async (c) => {
  try {
    const { session_id } = c.req.param();
    const history = await getChatHistory(c.env, session_id);
    return c.json({ history });
  } catch (error) {
    return c.json({ error: 'Failed to fetch chat history' }, 500);
  }
});

// Optional: Clear chat history for a session_id
app.delete('/api/chat/history/:session_id', async (c) => {
  try {
    const { session_id } = c.req.param();
    await clearChatHistory(c.env, session_id);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: 'Failed to clear chat history' }, 500);
  }
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Serve API routes via Hono
    if (url.pathname.startsWith('/api/')) {
      return app.fetch(request, env, ctx);
    }
    
    // Serve static assets via Cloudflare Pages asset server
    return env.ASSETS.fetch(request);
  }
};