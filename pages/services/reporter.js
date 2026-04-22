import { pollAllServices, checkServiceDown, SERVICES } from './observer.js';

export const REPORTER_CONFIG = {
  dailySummaryTime: '09:00',
  weeklyRdTime: 'Monday 10:00',
  alertChannels: ['telegram'],
  threshold: {
    consecutiveFailures: 2,
    errorRate: 0.1,
    slowResponse: 5000
  }
};

export async function generateDailySummary(env) {
  const services = await pollAllServices(env);
  const down = await checkServiceDown(env);
  const healthy = services.filter(s => s.status === 'healthy').length;
  
  const summary = {
    date: new Date().toISOString().split('T')[0],
    total: services.length,
    healthy,
    down: down.length,
    services: services.map(s => ({
      name: s.name,
      status: s.status,
      lastCheck: s.lastCheck
    })),
    alerts: down.map(s => `${s.name} is ${s.status}`)
  };
  
  return summary;
}

export async function generateWeeklyRd(env) {
  const services = await pollAllServices(env);
  
  const suggestions = [];
  
  const unhealthy = services.filter(s => s.status !== 'healthy');
  if (unhealthy.length > 0) {
    suggestions.push({
      priority: 'high',
      item: `${unhealthy.length} service(s) require attention`,
      action: 'Check service logs and redeploy'
    });
  }
  
  if (services.length >= 6) {
    suggestions.push({
      priority: 'medium',
      item: 'Consider Phase 4: Voice + Floating Widget',
      action: 'Add voice input and quick access'
    });
  }
  
  suggestions.push({
    priority: 'low',
    item: 'Review Znext plans',
    action: 'Check narad-agentic-os/roadmap.json'
  });
  
  return {
    week: getWeekNumber(),
    period: getWeekRange(),
    servicesStatus: services.length,
    healthy: services.filter(s => s.status === 'healthy').length,
    suggestions
  };
}

export async function checkAlerts(env) {
  const services = await pollAllServices(env);
  const alerts = [];
  
  for (const service of services) {
    if (service.status !== 'healthy') {
      alerts.push({
        service: service.name,
        status: service.status,
        timestamp: service.lastCheck,
        severity: service.status === 'error' ? 'critical' : 'warning'
      });
    }
  }
  
  return alerts;
}

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

function getWeekRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  
  return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}

export default { 
  REPORTER_CONFIG, 
  generateDailySummary, 
  generateWeeklyRd, 
  checkAlerts 
};