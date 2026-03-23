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

    if (!res.ok) {
      const err = await res.text();
      return c.json({ 
        error: `Groq API error: ${res.status}`, 
        details: err.slice(0, 200) 
      }, 502);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;

    return c.json({ 
      reply, 
      session_id,
      metadata: {
        model,
        tokens: data.usage?.total_tokens
      }
    });

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
