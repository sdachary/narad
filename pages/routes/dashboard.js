import { pollAllServices, checkServiceDown } from '../services/observer.js';
import { getAppShell } from './app-shell.js';

/**
 * Setup Dashboard API routes for Narad
 * @param {Hono} app - Hono app instance
 */
export function setupDashboardRoutes(app) {
  // Main dashboard view (HTML)
  app.get('/dashboard', async (c) => {
    return c.html(getAppShell('Narad — Dashboard'));
  });
  
  // GET /api/dashboard/services - List all services with status
  app.get('/api/dashboard/services', async (c) => {
    const results = await pollAllServices(c.env);
    const down = await checkServiceDown(c.env);
    
    // Map internal status to requested status (ok/error/offline)
    const services = results.map(s => ({
      id: s.service,
      name: s.name,
      status: s.status === 'healthy' ? 'ok' : (s.status === 'error' ? 'error' : 'offline'),
      lastCheck: s.lastCheck,
      details: s.details || {}
    }));

    return c.json({
      services,
      summary: {
        total: services.length,
        ok: services.filter(s => s.status === 'ok').length,
        error: services.filter(s => s.status === 'error').length,
        offline: services.filter(s => s.status === 'offline').length
      },
      lastUpdate: new Date().toISOString()
    });
  });
  
  // GET /api/dashboard/mcp - MCP Hub health check
  app.get('/api/dashboard/mcp', async (c) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);
      
      const start = Date.now();
      const response = await fetch('http://localhost:3000', {
        signal: controller.signal
      });
      clearTimeout(timeout);
      
      const duration = Date.now() - start;
      
      return c.json({
        service: 'mcp-hub',
        status: response.ok ? 'ok' : 'error',
        statusCode: response.status,
        responseTimeMs: duration,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return c.json({
        service: 'mcp-hub',
        status: 'offline',
        error: error.message,
        timestamp: new Date().toISOString()
      }, 503);
    }
  });
  
  // GET /api/dashboard/quick-actions - Common actions
  app.get('/api/dashboard/quick-actions', async (c) => {
    return c.json({
      actions: [
        { id: 'flush-cache', name: 'Flush Semantic Cache', icon: 'zap', endpoint: '/api/memory/clear', method: 'DELETE' },
        { id: 'sync-sessions', name: 'Sync Cloud Sessions', icon: 'refresh', endpoint: '/api/sessions/sync', method: 'POST' },
        { id: 'run-observer', name: 'Trigger Health Check', icon: 'activity', endpoint: '/api/cron/observer', method: 'GET' },
        { id: 'daily-summary', name: 'Generate Daily Summary', icon: 'file-text', endpoint: '/api/reporter/daily-summary', method: 'GET' },
        { id: 'mcp-connect', name: 'Reconnect MCP Hub', icon: 'link', endpoint: '/api/mcp/connect', method: 'POST' }
      ],
      timestamp: new Date().toISOString()
    });
  });
}
