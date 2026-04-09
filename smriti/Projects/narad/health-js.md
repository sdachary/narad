---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/routes/health.js"
project: "narad"
role: service
language: javascript
frameworks: []
lines: 104
size: 3495 bytes
last_modified: "2026-04-09 16:48"
scanned: "2026-04-09 16:48"
tags: [code, javascript, project/narad, service]
---

# health.js

> Service / API client module (104 lines).

**Key exports:** `metricsStore`, `setupHealthRoutes`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/routes/health.js` |
| **Role** | service |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 104 |
| **Size** | 3495 bytes |
| **Modified** | 2026-04-09 16:48 |

## 🔗 Related Files

[[memory-js]], [[providers-js]], [[security-js]]

## 📄 Content

```javascript
import { checkRateLimit, ValidationSchemas } from '../services/security.js';
import { AI_PROVIDERS } from '../config/providers.js';
import { getStore } from '../services/memory.js';

export const metricsStore = {
  requests: { total: 0, success: 0, errors: 0 },
  responseTimes: [],
  startTime: Date.now()
};

export function setupHealthRoutes(app) {
  app.get('/api/health', async (c) => {
    const checks = {
      kv: { status: 'unknown', latency: 0 },
      providers: { status: 'unknown', count: 0 },
      rateLimit: { status: 'unknown', available: 0 }
    };
    
    let overallStatus = 'ok';
    
    const kvStart = Date.now();
    try {
      await getStore(c.env).get('health-check');
      checks.kv = { status: 'ok', latency: Date.now() - kvStart };
    } catch (error) {
      checks.kv = { status: 'error', error: error.message };
      overallStatus = 'degraded';
    }
    
    const availableProviders = Object.keys(AI_PROVIDERS).filter(p => c.env[AI_PROVIDERS[p].apiKey]);
    checks.providers = { 
      status: availableProviders.length > 0 ? 'ok' : 'error',
      count: availableProviders.length,
      configured: availableProviders
    };
    if (availableProviders.length === 0) {
      overallStatus = 'degraded';
    }
    
    const clientIP = c.req.header('CF-Connecting-IP') || 'unknown';
    const rateLimitResult = checkRateLimit(clientIP);
    checks.rateLimit = {
      status: rateLimitResult.allowed ? 'ok' : 'limited',
      remaining: rateLimitResult.remaining || 0
    };
    
    const uptimeSeconds = Math.floor((Date.now() - metricsStore.startTime) / 1000);
    const uptime = uptimeSeconds < 60 ? `${uptimeSeconds}s` 
      : uptimeSeconds < 3600 ? `${Math.floor(uptimeSeconds/60)}m` 
      : `${Math.floor(uptimeSeconds/3600)}h ${Math.floor((uptimeSeconds%3600)/60)}m`;
    
    return c.json({
      status: overallStatus,
      service: 'narad-brain',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      uptime,
      checks,
      metrics: {
        requests: metricsStore.requests.total,
        successRate: metricsStore.requests.total > 0 
          ? ((metricsStore.requests.success / metricsStore.requests.total) * 100).toFixed(1) + '%'
          : 'N/A'
      }
    });
  });
  
  app.get('/api/metrics', (c) => {
    const avgResponseTime = metricsStore.responseTimes.length > 0
      ? (metricsStore.responseTimes.reduce((a, b) => a + b, 0) / metricsStore.responseTimes.length).toFixed(0) + 'ms'
      : 'N/A';
    
    const p95ResponseTime = metricsStore.responseTimes.length > 0
      ? [...metricsStore.responseTimes].sort((a, b) => a - b)[Math.floor(metricsStore.responseTimes.length * 0.95)] + 'ms'
      : 'N/A';
    
    return c.json({
      requests: metricsStore.requests,
      responseTime: {
        average: avgResponseTime,
        p95: p95ResponseTime,
        samples: metricsStore.responseTimes.length
      },
      uptime: Math.floor((Date.now() - metricsStore.startTime) / 1000)
    });
  });
  
  app.get('/api/csrf-token', (c) => {
    const { csrfManager } = c.env._services || {};
    if (!csrfManager) {
      return c.json({ error: 'CSRF manager not initialized' }, 500);
    }
    const { token, expiresAt } = csrfManager.generate();
    return c.json(
      { token, expiresAt, message: 'CSRF token generated successfully' },
      200,
      {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    );
  });
}

```
