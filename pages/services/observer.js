export const SERVICES = {
  narad: { 
    url: 'https://narad-7hc.pages.dev/api/health', 
    name: 'Narad AI',
    expectedStatus: 'ok'
  },
  vishwakarma: { 
    url: 'https://vishwakarma.pages.dev/health', 
    name: 'Vishwakarma',
    expectedStatus: 'ok'
  },
  chitragupta: { 
    url: 'https://chitragupta.pages.dev/api/health', 
    name: 'Chitragupta',
    expectedStatus: 'ok'
  },
  karma: { 
    url: 'https://karma.compute/health', 
    name: 'Karma',
    expectedStatus: 'healthy'
  },
  kanak: { 
    url: 'https://kanak.pages.dev/health', 
    name: 'Kanak',
    expectedStatus: 'ok'
  },
  unnati: { 
    url: 'https://unnati.pages.dev/api/health', 
    name: 'Unnati',
    expectedStatus: 'ok'
  }
};

export async function pollAllServices(env) {
  const results = [];
  const timestamp = new Date().toISOString();

  for (const [key, svc] of Object.entries(SERVICES)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(svc.url, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeout);

      const data = response.ok ? await response.json().catch(() => ({})) : {};
      const isHealthy = response.ok && (
        data.status === svc.expectedStatus || 
        data.status === 'ok' || 
        data.status === 'healthy'
      );

      results.push({
        service: key,
        name: svc.name,
        status: isHealthy ? 'healthy' : 'unhealthy',
        statusCode: response.status,
        responseTime: Date.now(),
        lastCheck: timestamp,
        details: data
      });
    } catch (error) {
      results.push({
        service: key,
        name: svc.name,
        status: 'error',
        statusCode: 0,
        responseTime: Date.now(),
        lastCheck: timestamp,
        error: error.message
      });
    }
  }

  return results;
}

export async function getServiceStatus(env, serviceKey) {
  const services = await pollAllServices(env);
  return services.find(s => s.service === serviceKey);
}

export async function checkServiceDown(env) {
  const services = await pollAllServices(env);
  return services.filter(s => s.status !== 'healthy');
}

export async function getHealthHistory(env, hours = 24) {
  const HISTORY_KEY = `observer_history_${Date.now()}`;
  const history = await env.OBSERVER_KV.get(HISTORY_KEY).then(JSON.parse).catch(() => []);
  return history.slice(-(hours * 12));
}

export async function saveHealthCheck(env, results) {
  const timestamp = Date.now();
  const today = new Date().toISOString().split('T')[0];
  const historyKey = `health_history_${today}`;
  
  try {
    const existing = await env.OBSERVER_KV.get(historyKey).then(JSON.parse).catch(() => []);
    existing.push({ timestamp, results });
    
    const last24h = existing.slice(-288);
    await env.OBSERVER_KV.put(historyKey, JSON.stringify(last24h));
  } catch (e) {
    console.error('[Observer] Failed to save health:', e);
  }
}

export default { SERVICES, pollAllServices, getServiceStatus, checkServiceDown };