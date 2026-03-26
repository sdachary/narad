import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();

app.use('*', cors());

// Health check
app.get('/api/health', (c) => c.json({ 
  status: 'ok', 
  service: 'narad-brain',
  timestamp: new Date().toISOString()
}));

// Core AGI Chat Endpoint
app.post('/api/chat', async (c) => {
  try {
    const { message, history, context, session_id } = await c.req.json();
    const GROQ_API_KEY = c.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      return c.json({ error: 'GROQ_API_KEY not configured in worker secrets' }, 500);
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return c.json({ error: 'Message is required and must be a non-empty string' }, 400);
    }

    const systemPrompt = [
      'You are Narad, the omniscient messenger of the Nisha Platform.',
      '',
      'MISSION:',
      'Connect the right information to the right moment. Be wise, calm, and objective.',
      '',
      'CONTEXT:',
      context || 'No specific platform context provided.',
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

        if (!reply) {
          return c.json({
            error: 'Groq returned an empty response. The model may be overloaded.',
          }, 502);
        }

        return c.json({ 
          reply, 
          session_id,
          metadata: {
            model,
            tokens: data.usage?.total_tokens
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
