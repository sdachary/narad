import { pollAllServices, checkServiceDown } from '../services/observer.js';

export function setupDashboardRoutes(app) {
  app.get('/dashboard', async (c) => {
    const results = await pollAllServices(c.env);
    const down = await checkServiceDown(c.env);
    
    return c.html(getDashboardHTML(results, down));
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

function getDashboardHTML(services, alerts) {
  const healthy = services.filter(s => s.status === 'healthy').length;
  const total = services.length;
  const statusColor = alerts.length > 0 ? 'var(--red)' : 'var(--green)';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Services Dashboard — Narad</title>
  <style>
    :root {
      --bg: #f7f6f2;
      --surface: #ffffff;
      --surface-alt: #f0ede6;
      --border: #e5e0d8;
      --text-primary: #1a1814;
      --text-secondary: #6b6457;
      --text-muted: #a09890;
      --accent: #c8763a;
      --accent-light: #f5ede3;
      --accent-deep: #9e5a26;
      --green: #3a7c5c;
      --green-light: #e3f0eb;
      --blue: #3a5c8c;
      --blue-light: #e3eaf5;
      --red: #8c3a3a;
      --red-light: #f5e3e3;
      --amber: #8c6e1a;
      --amber-light: #f5f0e0;
      --shadow-sm: 0 1px 4px rgba(0,0,0,0.06);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.08);
      --radius: 10px;
      --radius-lg: 16px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: var(--bg);
      color: var(--text-primary);
      font-size: 15px;
      line-height: 1.65;
    }

    nav {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(247,246,242,0.95);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
      padding: 0 32px;
    }

    .nav-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 52px;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 600;
      font-size: 16px;
    }

    .nav-brand span {
      color: var(--accent);
    }

    .nav-links {
      display: flex;
      gap: 24px;
    }

    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 14px;
      transition: color 0.2s;
    }

    .nav-links a:hover {
      color: var(--text-primary);
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 32px;
    }

    .header {
      margin-bottom: 32px;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .header p {
      color: var(--text-secondary);
      font-size: 14px;
    }

    .status-summary {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
    }

    .status-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px 24px;
      flex: 1;
    }

    .status-card h3 {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 8px;
    }

    .status-card .value {
      font-size: 32px;
      font-weight: 600;
    }

    .status-card.good .value { color: var(--green); }
    .status-card.warning .value { color: var(--amber); }
    .status-card.error .value { color: var(--red); }

    .section h2 {
      font-size: 18px;
      margin-bottom: 16px;
    }

    .services-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 16px;
    }

    .service-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 20px;
      transition: box-shadow 0.2s;
    }

    .service-card:hover {
      box-shadow: var(--shadow-md);
    }

    .service-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .service-name {
      font-weight: 600;
      font-size: 16px;
    }

    .service-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-dot.healthy { background: var(--green); }
    .status-dot.unhealthy { background: var(--red); }
    .status-dot.error { background: var(--red); }

    .service-card.healthy {
      border-left: 3px solid var(--green);
    }

    .service-card.unhealthy,
    .service-card.error {
      border-left: 3px solid var(--red);
      background: var(--surface-alt);
    }

    .service-details {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .service-details dt {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }

    .service-details dt:not(:last-child) {
      border-bottom: 1px solid var(--border);
    }

    .alerts-section {
      margin-top: 32px;
    }

    .alert-card {
      background: var(--red-light);
      border: 1px solid var(--red);
      border-radius: var(--radius);
      padding: 16px 20px;
      margin-bottom: 12px;
    }

    .alert-card h4 {
      color: var(--red);
      font-size: 14px;
      margin-bottom: 6px;
    }

    .alert-card p {
      font-size: 13px;
      color: var(--text-secondary);
    }

    .footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 13px;
      color: var(--text-muted);
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    .updating {
      animation: pulse 1.5s ease-in-out infinite;
    }
  </style>
</head>
<body>
  <nav>
    <div class="nav-inner">
      <div class="nav-brand">
        <span>◆</span> Narad <strong>Agentic OS</strong>
      </div>
      <div class="nav-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/chat">Chat</a>
        <a href="/api/observer/services">API</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="header">
      <h1>Services Dashboard</h1>
      <p>Real-time monitoring of all platform services</p>
    </div>

    <div class="status-summary">
      <div class="status-card ${healthy === total ? 'good' : 'warning'}">
        <h3>Healthy</h3>
        <div class="value">${healthy}/${total}</div>
      </div>
      <div class="status-card ${alerts.length === 0 ? 'good' : 'error'}">
        <h3>Alerts</h3>
        <div class="value">${alerts.length}</div>
      </div>
      <div class="status-card">
        <h3>Last Update</h3>
        <div class="value" style="font-size: 20px;">Just now</div>
      </div>
    </div>

    <div class="section">
      <h2>All Services</h2>
      <div class="services-grid">
        ${services.map(s => getServiceCardHTML(s)).join('')}
      </div>
    </div>

    ${alerts.length > 0 ? `
    <div class="section alerts-section">
      <h2>Active Alerts</h2>
      ${alerts.map(a => getAlertCardHTML(a)).join('')}
    </div>
    ` : ''}

    <div class="footer">
      <p class="updating">● Auto-updates every 5 minutes</p>
    </div>
  </div>

  <script>
    // Auto-refresh every 5 minutes
    setInterval(() => window.location.reload(), 300000);
  </script>
</body>
</html>`;
}

function getServiceCardHTML(service) {
  return `
  <div class="service-card ${service.status}">
    <div class="service-header">
      <div class="service-name">${service.name}</div>
      <div class="service-status">
        <div class="status-dot ${service.status}"></div>
        ${service.status}
      </div>
    </div>
    <dl class="service-details">
      <dt><span>Status Code</span><span>${service.statusCode}</span></dt>
      <dt><span>Last Check</span><span>${new Date(service.lastCheck).toLocaleTimeString()}</span></dt>
      ${service.details?.version ? `<dt><span>Version</span><span>${service.details.version}</span></dt>` : ''}
      ${service.error ? `<dt><span>Error</span><span>${service.error}</span></dt>` : ''}
    </dl>
  </div>`;
}

function getAlertCardHTML(alert) {
  return `
  <div class="alert-card">
    <h4>⚠ ${alert.name} — ${alert.status}</h4>
    <p>Service is ${alert.status}. Last check: ${new Date(alert.lastCheck).toLocaleTimeString()}</p>
  </div>`;
}