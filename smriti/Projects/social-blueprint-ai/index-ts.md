---
source: "/home/runner/work/narad/narad/sync_temp/social-blueprint-ai/worker/src/index.ts"
project: "social-blueprint-ai"
role: auth
language: typescript
frameworks: [docker, hono, typescript]
lines: 441
size: 14978 bytes
last_modified: "2026-04-09 16:07"
scanned: "2026-04-09 16:07"
tags: [auth, code, docker, hono, project/social-blueprint-ai, typescript]
---

# index.ts

> Authentication / authorization module using **docker, hono, typescript** (441 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `social-blueprint-ai/worker/src/index.ts` |
| **Role** | auth |
| **Language** | typescript |
| **Frameworks** | docker, hono, typescript |
| **Lines** | 441 |
| **Size** | 14978 bytes |
| **Modified** | 2026-04-09 16:07 |

## 🔗 Related Files

[[auth-ts]]

## 📄 Content

```typescript
import { Hono } from 'hono';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from 'zod';
import { generateToken, verifyToken, hashPassword, verifyPassword } from './auth';

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  GEMINI_API_KEY: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  STRIPE_SECRET_KEY: string;
  APP_URL: string;
  JWT_SECRET: string;
  ENVIRONMENT: string;
}

type Variables = {
  user: { userId: number; email: string };
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Logger
app.use('*', logger());

// CORS middleware
app.use('*', async (c, next) => {
  const appUrl = c.env.APP_URL;
  if (!appUrl) {
    console.error('APP_URL not configured. Rejecting request for security.');
    return c.json({ error: 'Server not configured properly' }, 500);
  }
  return cors({
    origin: appUrl,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })(c, next);
});

// Remove X-Powered-By header
app.use('*', async (c, next) => {
  await next();
  c.header('X-Powered-By', '');
});

// Rate limit middleware
const rateLimitAuth = async (c: any, next: any) => {
  const ip = c.req.raw.headers.get('cf-connecting-ip') || 'unknown';
  const key = `ratelimit:auth:${ip}`;
  const count = await c.env.KV.get(key);
  
  if (count && parseInt(count) > 5) {
    return c.json({ error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many auth attempts. Try again in 15 minutes.' } }, 429);
  }
  
  await c.env.KV.put(key, (parseInt(count || '0') + 1).toString(), {
    expirationTtl: 900, // 15 minutes
  });
  
  await next();
};

// Auth middleware (v1)
const authMiddleware = async (c: any, next: any) => {
  const publicPaths = ['/api/v1/auth/login', '/api/v1/auth/register', '/api/v1/health', '/api/v1/auth/google/url', '/api/v1/auth/google/callback'];
  if (publicPaths.includes(c.req.path)) {
    await next();
    return;
  }

  const authHeader = c.req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Missing token' } }, 401);
  }

  try {
    const user = await verifyToken(token, c.env);
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } }, 401);
  }
};

const v1 = new Hono<{ Bindings: Env; Variables: Variables }>();
v1.use('*', authMiddleware);

app.route('/api/v1', v1);
// Keep legacy /api routes temporarily as aliases
app.route('/api', v1);

// Error handling
app.onError((err, c) => {
  const isDev = c.env.ENVIRONMENT === 'development';
  console.error(`[${c.req.method}] ${c.req.url} - Error:`, err);
  
  if (err instanceof z.ZodError) {
    return c.json({ error: { code: 'VALIDATION_ERROR', message: 'Input validation failed', details: err.issues } }, 400);
  }
  
  // Only show detailed error in dev
  const message = isDev ? err.message : 'Internal server error';
  return c.json({ error: { code: 'INTERNAL_ERROR', message } }, 500);
});

// Swagger UI
app.get('/api/docs', swaggerUI({ url: '/api/v1/openapi.json' }));
v1.get('/openapi.json', (c) => {
  return c.json({
    openapi: '3.0.0',
    info: { title: 'Social Blueprint AI API', version: '1.0.0', description: 'Production API for SaaS Dashboard' },
    servers: [{ url: '/api/v1' }],
    paths: {
      '/health': { get: { summary: 'Health check', responses: { '200': { description: 'OK' } } } },
      '/auth/login': { post: { summary: 'Login', responses: { '200': { description: 'Success' } } } },
      '/auth/register': { post: { summary: 'Register', responses: { '201': { description: 'Created' } } } },
      '/profiles': { 
        get: { summary: 'Get profiles (paginated)', responses: { '200': { description: 'Success' } } },
        post: { summary: 'Create profile', responses: { '201': { description: 'Created' } } }
      },
      '/audits/{profileId}': { get: { summary: 'Get latest audit', parameters: [{name: 'profileId', in: 'path', required: true}], responses: { '200': { description: 'Success' } } } },
      '/audits': { post: { summary: 'Create audit', responses: { '201': { description: 'Created' } } } },
      '/ai/analyze': { post: { summary: 'AI Analysis', responses: { '200': { description: 'Success' } } } },
      '/create-checkout-session': { post: { summary: 'Stripe Checkout', responses: { '200': { description: 'Success' } } } }
    }
  });
});

// Health Check
v1.get('/health', (c) => c.json({ data: { status: 'ok' } }));

// Auth Endpoints
const passwordSchema = z.string()
  .min(12, 'Password must be at least 12 characters')
  .regex(/[A-Z]/, 'Must contain uppercase letter')
  .regex(/[a-z]/, 'Must contain lowercase letter')
  .regex(/[0-9]/, 'Must contain number')
  .regex(/[!@#$%^&*]/, 'Must contain special character (!@#$%^&*)');

const authSchema = z.object({
  email: z.string().email().max(255),
  password: passwordSchema,
});

v1.get('/auth/google/url', async (c) => {
  const clientId = c.env.GOOGLE_CLIENT_ID;
  if (!clientId) return c.json({ error: { code: 'CONFIG_ERROR', message: 'Google OAuth not configured' } }, 500);

  // Use explicit URL from config if possible
  const baseUrl = c.env.APP_URL || c.req.url;
  const redirectUri = new URL('/api/v1/auth/google/callback', baseUrl).toString();
  
  // Basic validation to avoid open redirects
  if (c.env.APP_URL && !redirectUri.startsWith(c.env.APP_URL)) {
    return c.json({ error: { code: 'FORBIDDEN', message: 'Invalid origin' } }, 403);
  }

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'email profile');
  authUrl.searchParams.set('access_type', 'online');
  authUrl.searchParams.set('prompt', 'consent');
  
  return c.json({ data: { url: authUrl.toString() } });
});

v1.get('/auth/google/callback', async (c) => {
  const code = c.req.query('code');
  if (!code) return c.json({ error: { code: 'BAD_REQUEST', message: 'No code provided' } }, 400);

  const clientId = c.env.GOOGLE_CLIENT_ID;
  const clientSecret = c.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return c.json({ error: { code: 'CONFIG_ERROR', message: 'Google OAuth not configured' } }, 500);
  }

  const baseUrl = c.env.APP_URL || c.req.url;
  const redirectUri = new URL('/api/v1/auth/google/callback', baseUrl).toString();

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!tokenRes.ok) return c.json({ error: { code: 'AUTH_ERROR', message: 'Failed to exchange token' } }, 400);
  const tokenData = await tokenRes.json<{ access_token: string }>();

  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) return c.json({ error: { code: 'AUTH_ERROR', message: 'Failed to fetch user profile' } }, 400);
  const userData = await userRes.json<{ id: string; email: string }>();

  let user = await c.env.DB.prepare(
    'SELECT id, email FROM users WHERE email = ? OR google_id = ?'
  ).bind(userData.email, userData.id).first<{ id: number; email: string }>();

  if (!user) {
    const result = await c.env.DB.prepare(
      'INSERT INTO users (email, google_id) VALUES (?, ?)'
    ).bind(userData.email, userData.id).run();
    user = { id: result.meta.last_row_id, email: userData.email };
  } else {
    await c.env.DB.prepare(
      'UPDATE users SET google_id = ? WHERE id = ? AND google_id IS NULL'
    ).bind(userData.id, user.id).run();
  }

  const token = await generateToken(user.id, user.email, c.env);
  const appUrl = (c.env.APP_URL || 'http://localhost:5173').replace(/\/$/, '');
  
  return c.redirect(`${appUrl}/login?token=${token}`);
});

v1.post('/auth/login', rateLimitAuth, async (c) => {
  const body = await c.req.json();
  const { email, password } = authSchema.parse(body);

  const user = await c.env.DB.prepare(
    'SELECT id, email, password FROM users WHERE email = ?'
  ).bind(email).first<{ id: number; email: string; password: string | null }>();

  if (!user || !user.password || !(await verifyPassword(password, user.password))) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } }, 401);
  }

  const token = await generateToken(user.id, user.email, c.env);
  return c.json({ data: { token, user: { id: user.id, email: user.email } } });
});

v1.post('/auth/register', rateLimitAuth, async (c) => {
  const body = await c.req.json();
  const { email, password } = authSchema.parse(body);

  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email).first();

  if (existing) {
    return c.json({ error: { code: 'CONFLICT', message: 'Email already registered' } }, 409);
  }

  const hashedPassword = await hashPassword(password);
  const result = await c.env.DB.prepare(
    'INSERT INTO users (email, password) VALUES (?, ?)'
  ).bind(email, hashedPassword).run();

  const userId = result.meta.last_row_id;
  const token = await generateToken(userId, email, c.env);
  return c.json({ data: { token, user: { id: userId, email } } }, 201);
});

// Profiles
const profileSchema = z.object({
  platform: z.string(),
  handle: z.string(),
  profile_url: z.string().optional(),
  followers: z.number().optional(),
  following: z.number().optional(),
  total_posts: z.number().optional(),
  engagement_rate: z.number().optional(),
});

v1.get('/profiles', async (c) => {
  const user = c.get('user');
  const page = parseInt(c.req.query('page') || '1');
  const limit = Math.min(parseInt(c.req.query('limit') || '20'), 100);
  const offset = (page - 1) * limit;

  const { results } = await c.env.DB.prepare(
    'SELECT * FROM profiles WHERE user_id = ? LIMIT ? OFFSET ?'
  ).bind(user.userId, limit, offset).all();

  const countResult = await c.env.DB.prepare(
    'SELECT COUNT(*) as count FROM profiles WHERE user_id = ?'
  ).bind(user.userId).first<{ count: number }>();
  const count = countResult?.count ?? 0;

  return c.json({
    data: results,
    pagination: { page, limit, total: count, hasMore: (offset + limit) < count }
  });
});

v1.post('/profiles', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const data = profileSchema.parse(body);

  const result = await c.env.DB.prepare(
    `INSERT INTO profiles (user_id, platform, handle, profile_url, followers, following, total_posts, engagement_rate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    user.userId,
    data.platform,
    data.handle,
    data.profile_url || '',
    data.followers || 0,
    data.following || 0,
    data.total_posts || 0,
    data.engagement_rate || 0
  ).run();

  return c.json({ data: { id: result.meta.last_row_id } }, 201);
});

// Audits
v1.get('/audits/:profileId', async (c) => {
  const { profileId } = c.req.param();
  const user = c.get('user');
  
  const audit = await c.env.DB.prepare(
    'SELECT * FROM audits WHERE profile_id = ? AND user_id = ? ORDER BY created_at DESC LIMIT 1'
  ).bind(profileId, user.userId).first();
  
  return c.json({ data: audit });
});

const auditSchema = z.object({
  profileId: z.coerce.number(),
  data: z.any(),
});

v1.post('/audits', async (c) => {
  const user = c.get('user');
  const body = await c.req.json();
  const { profileId, data } = auditSchema.parse(body);

  const result = await c.env.DB.prepare(
    'INSERT INTO audits (profile_id, user_id, data) VALUES (?, ?, ?)'
  ).bind(profileId, user.userId, JSON.stringify(data)).run();

  const auditId = result.meta.last_row_id;
  await c.env.DB.prepare(
    'UPDATE profiles SET last_analysis_id = ? WHERE id = ? AND user_id = ?'
  ).bind(auditId, profileId, user.userId).run();

  return c.json({ data: { id: auditId } }, 201);
});

// AI Analysis
const analyzeSchema = z.object({
  prompt: z.string(),
  systemInstruction: z.string(),
});

v1.post('/ai/analyze', async (c) => {
  const body = await c.req.json();
  const { prompt, systemInstruction } = analyzeSchema.parse(body);
  const apiKey = c.env.GEMINI_API_KEY;

  if (!apiKey) {
    return c.json({ error: { code: 'CONFIG_ERROR', message: 'Gemini API Key not configured' } }, 500);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
    {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey 
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    return c.json({ error: { code: 'AI_SERVICE_ERROR', message: errText } }, 502);
  }

  const data = await response.json<{
    candidates: { content: { parts: { text: string }[] } }[];
  }>();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}';
  return c.json({ data: JSON.parse(text) });
});

// Stripe Checkout
const checkoutSchema = z.object({
  priceId: z.string(),
});

v1.post('/create-checkout-session', async (c) => {
  if (!c.env.STRIPE_SECRET_KEY) {
    return c.json({ error: { code: 'CONFIG_ERROR', message: 'Stripe not configured' } }, 500);
  }

  const body = await c.req.json();
  const { priceId } = checkoutSchema.parse(body);
  const appUrl = c.env.APP_URL || 'http://localhost:5173';

  const params = new URLSearchParams({
    'payment_method_types[]': 'card',
    'line_items[0][price]': priceId,
    'line_items[0][quantity]': '1',
    mode: 'subscription',
    success_url: `${appUrl}/?success=true`,
    cancel_url: `${appUrl}/pricing?canceled=true`,
  });

  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${c.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const err = await response.json<{ error: { message: string } }>();
    return c.json({ error: { code: 'PAYMENT_ERROR', message: err.error.message } }, 500);
  }

  const session = await response.json<{ url: string }>();
  return c.json({ data: { url: session.url } });
});

export default app;

```
