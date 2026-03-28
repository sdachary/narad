import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

// In-memory usage tracking (resets on worker restart)
// In production, use KV for persistence across restarts
const usageMap = new Map();
// Structure: { agentType: { tokensUsed: number, lastReset: string (date) } }
const DAILY_LIMITS = {
  coding: 200000,   // example: 200k tokens per day
  research: 200000,
  debugging: 200000,
  testing: 200000,
  deployment: 200000,
  general: 200000
};

// Get today's date string in YYYY-MM-DD
function getToday() {
  return new Date().toISOString().split('T')[0];
}

// Get usage for agent type, initializing if needed
function getUsage(agentType) {
  const today = getToday();
  const entry = usageMap.get(agentType);
  if (!entry || entry.lastReset !== today) {
    const newEntry = { tokensUsed: 0, lastReset: today };
    usageMap.set(agentType, newEntry);
    return newEntry;
  }
  return entry;
}

// Add tokens used for agent type
function addUsage(agentType, tokens) {
  const usage = getUsage(agentType);
  usage.tokensUsed += tokens;
  usageMap.set(agentType, usage);
}

// Get remaining tokens for agent type
function getRemaining(agentType) {
  const usage = getUsage(agentType);
  return Math.max(0, DAILY_LIMITS[agentType] - usage.tokensUsed);
}

// Check if agent type is within limits
function isWithinLimit(agentType, estimatedTokens = 0) {
  const usage = getUsage(agentType);
  return usage.tokensUsed + estimatedTokens <= DAILY_LIMITS[agentType];
}

app.use('*', cors());

// Health check
app.get('/api/health', (c) => c.json({ 
  status: 'ok', 
  service: 'narad-brain',
  timestamp: new Date().toISOString()
}));

// Get usage stats for all agent types
app.get('/api/usage', (c) => {
  const result = {};
  for (const [agentType, limit] of Object.entries(DAILY_LIMITS)) {
    const usage = getUsage(agentType);
    result[agentType] = {
      tokensUsed: usage.tokensUsed,
      limit: limit,
      remaining: usage.limit - usage.tokensUsed,
      percentUsed: limit > 0 ? (usage.tokensUsed / limit) * 100 : 0
    };
  }
  return c.json(result);
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
    if (!isWithinLimit(agentType, 1000)) {
      return c.json({ 
        error: `Agent '${agentType}' has exceeded its daily token limit. Please try again later or use a different agent.`,
        usage: getUsage(agentType)
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
        addUsage(agentType, totalTokens);

        return c.json({ 
          reply, 
          session_id,
          metadata: {
            model,
            tokens: totalTokens,
            agentType: agentType,
            remainingTokens: getRemaining(agentType)
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