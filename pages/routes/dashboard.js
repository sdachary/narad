import { pollAllServices, checkServiceDown } from '../services/observer.js';
import { getAppShell } from './app-shell.js';

export function setupDashboardRoutes(app) {
  app.get('/dashboard', async (c) => {
    return c.html(getAppShell('Narad — Dashboard'));
  });
  
  app.get('/api/dashboard/services', async (c) => {
    const results = await pollAllServices(c.env);
    const down = await checkServiceDown(c.env);
    
    return c.json({
      services: results,
      alertCount: down.length,
      lastUpdate: new Date().toISOString()
    });
  });
  
  app.get('/api/dashboard/alerts', async (c) => {
    const down = await checkServiceDown(c.env);
    return c.json({ alerts: down });
  });
}
