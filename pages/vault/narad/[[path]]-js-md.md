---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/kanak/[[path]]-js.md"
project: "narad"
role: service
language: markdown
frameworks: []
lines: 215
size: 7404 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [documentation, markdown, project/narad, service]
---

# [[path]]-js.md

> Service / API client module (215 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/kanak/[[path]]-js.md` |
| **Role** | service |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 215 |
| **Size** | 7404 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/kanak/functions/[[path]].js"
project: "kanak"
role: service
language: javascript
frameworks: []
lines: 177
size: 6722 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, javascript, project/kanak, service]
---

# [[path]].js

> Service / API client module (177 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `kanak/functions/[[path]].js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 177 |
| **Size** | 6722 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/**
 * 🛡️ Gold Vault Shield - Pages Functions Edition
 * Universal CORS proxy for Supabase and Kanak Chat.
 */

export async function onRequest(context) {
  const { request, env } = context;
  const SUPABASE_URL = env.SUPABASE_URL;
  const SUPABASE_KEY = env.SUPABASE_KEY;
  const ENV = env.ENV || "production";

  // 🔐 CORS Configuration
  const ALLOWED_ORIGINS = [
    "https://kanak-dj5.pages.dev", // Current Landing Page
    "http://localhost:8788", // For local development
  ];

  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };

  const requestOrigin = request.headers.get("Origin") || "";
  const allowOrigin = ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : ALLOWED_ORIGINS[0];

  const url = new URL(request.url);
  const reqPath = url.pathname;

  // 1. Health check
  if (reqPath === '/health') {
    return new Response(JSON.stringify({ status: 'ok', service: 'gold-saas-functions' }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': allowOrigin, ...securityHeaders }
    });
  }

  // 2. Rate limiting (Login attempts)
  const isLoginRequest = reqPath.includes("/auth/v1/token");
  if (isLoginRequest && env.RATE_LIMIT_KV) {
    const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
    const kvKey = `ratelimit:${clientIP}`;
    const kvEntry = await env.RATE_LIMIT_KV.get(kvKey);
    const hitCount = kvEntry ? parseInt(kvEntry) : 0;

    if (hitCount >= 10) {
      return new Response(JSON.stringify({ error: "Too many login attempts." }), {
        status: 429,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": allowOrigin, "Retry-After": "60" }
      });
    }
    await env.RATE_LIMIT_KV.put(kvKey, String(hitCount + 1), { expirationTtl: 60 });
  }

  // 3. Kanak Chat API
  const chatCors = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (request.method === "OPTIONS" && reqPath.startsWith("/api/chat")) {
    return new Response(null, { status: 204, headers: chatCors });
  }

  if (request.method === "POST" && (reqPath === "/api/chat" || reqPath === "/api/chat/notify")) {
    try {
      const body = await request.json();

      if (reqPath === "/api/chat/notify") {
        await notifyTelegramKanak(env, body.message || "", null).catch(() => { });
        return new Response(JSON.stringify({ ok: true }), { headers: chatCors });
      }

      const userMsg = (body.message || "").slice(0, 500);
      const KANAK_SYSTEM = `You are Kanak, a warm assistant for Gold Vault. 2-3 sentences max.
Sign up: gold-saas.pages.dev`;

      if (!userMsg) return new Response(JSON.stringify({ reply: "Please ask a question!" }), { headers: chatCors });

      let reply = null;
      // Groq first
      if (env.GROQ_API_KEY) {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${env.GROQ_API_KEY}` },
          body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [{ role: "system", content: KANAK_SYSTEM }, { role: "user", content: userMsg }]
          })
        });
        if (groqRes.ok) {
          const data = await groqRes.json();
          reply = data.choices?.[0]?.message?.content;
        }
      }

      reply = reply || "I am processing your request...";
      await notifyTelegramKanak(env, userMsg, reply).catch(() => { });
      return new Response(JSON.stringify({ reply }), { headers: chatCors });

    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: chatCors });
    }
  }

  // 4. Supabase Proxy (Fallback for other /api/* or unrecognized routes)
  if (reqPath.startsWith("/api/supabase/") || !reqPath.includes(".")) {
    // If it's not a file request (doesn't contain a dot), or specifically /api/supabase/
    // Let's assume we want to proxy if it's explicitly /rest/v1/ or /auth/v1/
    const isProxyable = reqPath.startsWith("/rest/v1/") || reqPath.startsWith("/auth/v1/");

    if (isProxyable) {
      try {
        if (!SUPABASE_URL || !SUPABASE_KEY) {
          return new Response("Supabase not configured", { status: 500 });
        }

        const cleanBaseUrl = SUPABASE_URL.replace(/\/$/, "");
        const proxyUrl = `${cleanBaseUrl}${url.pathname}${url.search}`;

        const modifiedHeaders = new Headers(request.headers);
        const userAuth = request.headers.get("Authorization");
        if (!userAuth || userAuth.includes("undefined") || userAuth.includes("null")) {
          modifiedHeaders.set("Authorization", `Bearer ${SUPABASE_KEY}`);
        }
        modifiedHeaders.set("apikey", SUPABASE_KEY);

        const isAuthRequest = url.pathname.startsWith("/auth/v1/");
        if (!isAuthRequest) {
          modifiedHeaders.set("Accept-Profile", "app_data");
          modifiedHeaders.set("Content-Profile", "app_data");
        }
        modifiedHeaders.delete("host");

        const response = await fetch(proxyUrl, {
          method: request.method,
          headers: modifiedHeaders,
          body: request.method === "GET" || request.method === "HEAD" ? null : await request.arrayBuffer(),
          redirect: "follow"
        });

        const newHeaders = new Headers(response.headers);
        newHeaders.set("Access-Control-Allow-Origin", allowOrigin);
        newHeaders.set("Vary", "Origin");
        newHeaders.set("X-Shield-Env", ENV);

        return new Response(response.body, { status: response.status, headers: newHeaders });
      } catch (err) {
        return new Response(err.message, { status: 500 });
      }
    }
  }

  // Fallback to static assets if no function matches
  return context.next();
}

async function notifyTelegramKanak(env, userMsg, botReply) {
  const token = env.TELEGRAM_BOT_TOKEN;
  const chatId = env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  const text = botReply
    ? `🟡 *Gold Vault Chat*\n\n👤 *Visitor:* ${userMsg}\n\n🤖 *Kanak:* ${botReply}`
    : `🔔 *Gold Vault Lead*\n\n👤 *Message:* ${userMsg}`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" })
  });
}

```

```
