export const SERVICES_REGISTRY = {
  narad: {
    name: 'Narad AI',
    url: 'https://narad.pages.dev',
    healthEndpoint: '/api/health',
    metricsEndpoint: '/api/metrics',
    type: 'cloudflare-pages',
    owner: 'sdachary',
    description: 'AI workspace + knowledge graph'
  },
  vishwakarma: {
    name: 'Vishwakarma',
    url: 'https://vishwakarma.pages.dev',
    healthEndpoint: '/health',
    metricsEndpoint: '/metrics',
    type: 'cloudflare-pages',
    owner: 'sdachary',
    description: 'Cloud provisioning portal'
  },
  chitragupta: {
    name: 'Chitragupta',
    url: 'https://chitragupta.pages.dev',
    healthEndpoint: '/api/health',
    metricsEndpoint: '/api/metrics',
    type: 'cloudflare-pages',
    owner: 'sdachary',
    description: 'Financial ledger + tax'
  },
  karma: {
    name: 'Karma',
    url: 'https://karma.compute',
    healthEndpoint: '/health',
    metricsEndpoint: '/metrics',
    type: 'python-fastapi',
    owner: 'sdachary',
    description: 'Compute marketplace'
  },
  kanak: {
    name: 'Kanak',
    url: 'https://kanak.pages.dev',
    healthEndpoint: '/health',
    metricsEndpoint: '/metrics',
    type: 'cloudflare-pages',
    owner: 'sdachary',
    description: 'Business intelligence dashboard'
  },
  unnati: {
    name: 'Unnati',
    url: 'https://unnati.pages.dev',
    healthEndpoint: '/api/health',
    metricsEndpoint: '/api/metrics',
    type: 'nextjs-cloudflare',
    owner: 'sdachary',
    description: 'Job search assistant'
  },
  indra: {
    name: 'Indra',
    url: 'https://indra.onrender.com',
    healthEndpoint: '/health',
    metricsEndpoint: '/metrics',
    type: 'render-service',
    owner: 'sdachary',
    description: 'Workflow orchestration'
  },
  'social-blueprint-ai': {
    name: 'Social Blueprint AI',
    url: 'https://social-blueprint-ai.pages.dev',
    healthEndpoint: '/api/health',
    metricsEndpoint: '/api/metrics',
    type: 'cloudflare-worker',
    owner: 'sdachary',
    description: 'Social media strategy AI'
  }
};

export const SERVICE_GROUPS = {
  production: ['narad', 'vishwakarma', 'chitragupta', 'karma', 'kanak', 'unnati', 'indra', 'social-blueprint-ai'],
  frontend: ['narad', 'vishwakarma', 'chitragupta', 'kanak', 'unnati', 'social-blueprint-ai'],
  backend: ['karma', 'chitragupta', 'indra']
};

export const ALERT_RULES = {
  down: { threshold: 1, window: 5, severity: 'critical' },
  slow: { threshold: 5000, window: 10, severity: 'warning' },
  errorRate: { threshold: 0.1, window: 60, severity: 'warning' }
};

export default { SERVICES_REGISTRY, SERVICE_GROUPS, ALERT_RULES };