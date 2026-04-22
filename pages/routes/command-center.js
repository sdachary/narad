import { getAppShell } from './app-shell.js';

export function setupCommandCenterRoutes(app) {
  app.get('/', async (c) => {
    return c.html(getAppShell('Narad — Command Center'));
  });

  app.get('/command-center', async (c) => {
    return c.html(getAppShell('Narad — Command Center'));
  });
}
