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
  });

  // GET /api/dashboard/quick-actions - Common actions
  app.get('/api/dashboard/quick-actions', async (c) => {
    return c.json({
      actions: [
        { id: 'flush-cache', name: 'Flush Semantic Cache', icon: 'zap', endpoint: '/api/memory/clear', method: 'DELETE' },
        { id: 'sync-sessions', name: 'Sync Cloud Sessions', icon: 'refresh', endpoint: '/api/sessions/sync', method: 'POST' },
        { id: 'run-observer', name: 'Trigger Health Check', icon: 'activity', endpoint: '/api/cron/observer', method: 'GET' },
        { id: 'daily-summary', name: 'Generate Daily Summary', icon: 'file-text', endpoint: '/api/reporter/daily-summary', method: 'GET' }
      ],
      timestamp: new Date().toISOString()
    });
  });
}
