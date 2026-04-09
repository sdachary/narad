---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/services/security.js"
project: "narad"
role: auth
language: javascript
frameworks: []
lines: 150
size: 4665 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [auth, code, javascript, project/narad]
---

# security.js

> Authentication / authorization module (150 lines).

**Key exports:** `CSRFTokenManager`, `csrfManager`, `validateCSRF`, `checkRateLimit`, `ValidationSchemas`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/services/security.js` |
| **Role** | auth |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 150 |
| **Size** | 4665 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

[[index-js]]

## 📄 Content

```javascript
import { RATE_LIMIT, CSRF_TRUSTED_ORIGINS } from '../config/index.js';

export class CSRFTokenManager {
  constructor() {
    this.tokens = new Map();
    this.TOKEN_LIFETIME = 3600000;
  }
  
  generate() {
    const token = 'csrf_' + Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    const expiresAt = Date.now() + this.TOKEN_LIFETIME;
    this.tokens.set(token, expiresAt);
    return { token, expiresAt };
  }
  
  validate(token) {
    if (!this.tokens.has(token)) return false;
    const expiresAt = this.tokens.get(token);
    if (Date.now() > expiresAt) {
      this.tokens.delete(token);
      return false;
    }
    return true;
  }
  
  cleanup() {
    const now = Date.now();
    for (const [token, expiresAt] of this.tokens.entries()) {
      if (now > expiresAt) this.tokens.delete(token);
    }
  }
}

export const csrfManager = new CSRFTokenManager();

export function validateCSRF(request) {
  if (!request || !request.headers) {
    return { valid: true };
  }
  const origin = request.headers.get('Origin') || request.headers.get('Referer');
  const token = request.headers.get('X-CSRF-Token');
  
  if (origin) {
    const cleanOrigin = origin.replace(/\/$/, '');
    const isTrustedOrigin = CSRF_TRUSTED_ORIGINS.some(trusted => {
      const cleanTrusted = trusted.replace(/\/$/, '');
      return cleanOrigin === cleanTrusted || cleanOrigin.startsWith(cleanTrusted + '/');
    });
    if (!isTrustedOrigin) {
      return { valid: false, error: `Untrusted origin: ${origin}` };
    }
  }
  
  return { valid: true };
}

const rateLimitStore = new Map();

export function checkRateLimit(identifier) {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  let record = rateLimitStore.get(key);
  if (!record || now - record.windowStart > RATE_LIMIT.windowMs) {
    record = { windowStart: now, count: 0, burstCount: 0 };
  }
  
  if (record.burstCount >= RATE_LIMIT.burstLimit) {
    const retryAfter = Math.ceil((record.windowStart + RATE_LIMIT.windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  if (record.count >= RATE_LIMIT.maxRequests) {
    const retryAfter = Math.ceil((record.windowStart + RATE_LIMIT.windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  record.count++;
  record.burstCount++;
  rateLimitStore.set(key, record);
  
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
}

export const ValidationSchemas = {
  message: {
    validate: (value) => {
      if (!value || typeof value !== 'string') {
        return { valid: false, error: 'Message is required and must be a string' };
      }
      if (value.trim().length === 0) {
        return { valid: false, error: 'Message cannot be empty' };
      }
      if (value.length > 5000) {
        return { valid: false, error: 'Message exceeds 5000 characters' };
      }
      if (/<script|javascript:|onerror=|onclick=/i.test(value)) {
        return { valid: false, error: 'Invalid content detected' };
      }
      return { valid: true, value: value.trim() };
    }
  },
  sessionId: {
    pattern: /^[a-zA-Z0-9_-]{1,100}$/,
    validate: (value) => {
      if (!value || typeof value !== 'string') {
        return { valid: false, error: 'Valid session_id is required' };
      }
      if (!ValidationSchemas.sessionId.pattern.test(value)) {
        return { valid: false, error: 'Invalid session_id format' };
      }
      return { valid: true };
    }
  },
  history: {
    maxItems: 100,
    maxMessageLength: 10000,
    validate: (value) => {
      if (!Array.isArray(value)) {
        return { valid: false, error: 'History must be an array' };
      }
      if (value.length > ValidationSchemas.history.maxItems) {
        return { valid: false, error: `History exceeds ${ValidationSchemas.history.maxItems} items` };
      }
      for (const msg of value) {
        if (!msg.role || typeof msg.text !== 'string') {
          return { valid: false, error: 'Invalid history message format' };
        }
        if (msg.text.length > ValidationSchemas.history.maxMessageLength) {
          return { valid: false, error: 'History message too long' };
        }
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
          return { valid: false, error: 'Invalid message role in history' };
        }
      }
      return { valid: true };
    }
  },
  score: {
    validate: (value) => {
      if (typeof value !== 'number' || ![-1, 0, 1].includes(value)) {
        return { valid: false, error: 'Score must be -1, 0, or 1' };
      }
      return { valid: true };
    }
  }
};

```
