import { pollAllServices, checkServiceDown } from '../../services/observer.js';
import { getAppShell } from './app-shell.js';

export function setupDashboardRoutes(app) {
  app.get('/dashboard', async (c) => {
    return c.html(getAppShell('Narad — Dashboard'));
  });
  
  app.get('/api/dashboard/services', async (c) => {
    const results = await pollAllServices(c.env);
    const down = await checkServiceDown(c.env);
    
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
}