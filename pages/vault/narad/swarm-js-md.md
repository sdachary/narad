---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/vishwakarma/swarm-js.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 317
size: 8371 bytes
last_modified: "2026-04-09 14:38"
scanned: "2026-04-09 14:39"
tags: [docs, documentation, markdown, project/narad]
---

# swarm-js.md

> Documentation (317 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/vishwakarma/swarm-js.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 317 |
| **Size** | 8371 bytes |
| **Modified** | 2026-04-09 14:38 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/vishwakarma/pages/services/swarm.js"
project: "vishwakarma"
role: config
language: javascript
frameworks: []
lines: 277
size: 7584 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, config, javascript, project/vishwakarma]
---

# swarm.js

> Configuration file for the project (277 lines).

**Key exports:** `initializeSwarm`, `getSwarmStatus`, `registerSwarmAgent`

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `vishwakarma/pages/services/swarm.js` |
| **Role** | config |
| **Language** | javascript |
| **Frameworks** | — |
| **Lines** | 277 |
| **Size** | 7584 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```javascript
const SWARM_CONFIG = {
  topologies: ['mesh', 'hierarchical', 'ring', 'star'],
  maxAgents: 16,
  defaultTimeout: 300000,
  consensusProtocols: ['raft', 'bft', 'gossip', 'crdt']
};

class DeploymentAgent {
  constructor(config) {
    this.id = config.id;
    this.name = config.name;
    this.role = config.role;
    this.capabilities = config.capabilities || [];
    this.status = 'idle';
    this.currentTask = null;
    this.lastOutput = null;
    this.metrics = { tasksCompleted: 0, failures: 0 };
  }
  
  async execute(task, env) {
    this.status = 'executing';
    this.currentTask = task;
    
    try {
      const result = await this.runTask(task, env);
      this.status = 'completed';
      this.lastOutput = result;
      this.metrics.tasksCompleted++;
      return { success: true, result };
    } catch (e) {
      this.status = 'failed';
      this.metrics.failures++;
      return { success: false, error: e.message };
    }
  }
  
  async runTask(task, env) {
    throw new Error('Not implemented');
  }
}

class TerraformAgent extends DeploymentAgent {
  constructor() {
    super({ id: 'terraform', name: 'Terraform Agent', role: 'infrastructure', capabilities: ['terraform', 'oci', 'aws', 'gcp'] });
  }
  
  async runTask(task, env) {
    const { action, workspace, vars } = task;
    return { action: 'terraform', workspace, status: 'queued', taskId: task.id };
  }
}

class GitHubAgent extends DeploymentAgent {
  constructor() {
    super({ id: 'github', name: 'GitHub Agent', role: 'repository', capabilities: ['pr', 'commit', 'release', 'workflow'] });
  }
  
  async runTask(task, env) {
    const { operation, repo, data } = task;
    return { operation, repo, status: 'queued', taskId: task.id };
  }
}

class SecurityAgent extends DeploymentAgent {
  constructor() {
    super({ id: 'security', name: 'Security Agent', role: 'security', capabilities: ['scan', 'audit', 'compliance'] });
  }
  
  async runTask(task, env) {
    const { scanType, targets } = task;
    return { scanType, targets, status: 'queued', taskId: task.id };
  }
}

class CI_CDAgent extends DeploymentAgent {
  constructor() {
    super({ id: 'cicd', name: 'CI/CD Agent', role: 'automation', capabilities: ['build', 'test', 'deploy'] });
  }
  
  async runTask(task, env) {
    const { pipeline, stage } = task;
    return { pipeline, stage, status: 'queued', taskId: task.id };
  }
}

class DatabaseAgent extends DeploymentAgent {
  constructor() {
    super({ id: 'database', name: 'Database Agent', role: 'data', capabilities: ['migration', 'backup', 'restore'] });
  }
  
  async runTask(task, env) {
    const { operation, dbType } = task;
    return { operation, dbType, status: 'queued', taskId: task.id };
  }
}

class MonitoringAgent extends DeploymentAgent {
  constructor() {
    super({ id: 'monitoring', name: 'Monitoring Agent', role: 'observability', capabilities: ['metrics', 'alerts', 'dashboard'] });
  }
  
  async runTask(task, env) {
    const { metric, threshold } = task;
    return { metric, threshold, status: 'configured', taskId: task.id };
  }
}

class SwarmCoordinator {
  constructor(config = {}) {
    this.topology = config.topology || 'hierarchical';
    this.agents = new Map();
    this.taskQueue = [];
    this.results = new Map();
    this.registerDefaultAgents();
  }
  
  registerDefaultAgents() {
    const defaultAgents = [
      new TerraformAgent(),
      new GitHubAgent(),
      new SecurityAgent(),
      new CI_CDAgent(),
      new DatabaseAgent(),
      new MonitoringAgent()
    ];
    
    for (const agent of defaultAgents) {
      this.agents.set(agent.id, agent);
    }
  }
  
  registerAgent(agent) {
    this.agents.set(agent.id, agent);
    return { success: true, agentId: agent.id };
  }
  
  async executeSwarm(task, options = {}) {
    const { parallel = false, topology = this.topology } = options;
    const swarmId = `swarm:${Date.now()}`;
    
    const selectedAgents = this.selectAgentsForTask(task, options.agents);
    
    if (parallel) {
      const results = await Promise.allSettled(
        selectedAgents.map(agent => agent.execute(task, options.env))
      );
      
      return this.compileResults(swarmId, selectedAgents, results, 'parallel');
    }
    
    return this.executeSequential(swarmId, selectedAgents, task, options.env);
  }
  
  selectAgentsForTask(task, preferredAgents) {
    if (preferredAgents && preferredAgents.length > 0) {
      return preferredAgents
        .map(id => this.agents.get(id))
        .filter(Boolean);
    }
    
    const taskType = task.type || 'general';
    const roleMap = {
      infrastructure: ['terraform'],
      repository: ['github'],
      security: ['security'],
      automation: ['cicd'],
      data: ['database'],
      observability: ['monitoring']
    };
    
    const roleAgents = roleMap[taskType] || [];
    return roleAgents.map(id => this.agents.get(id)).filter(Boolean);
  }
  
  async executeSequential(swarmId, agents, task, env) {
    const results = [];
    
    for (const agent of agents) {
      const result = await agent.execute(task, env);
      results.push({ agentId: agent.id, ...result });
      
      if (!result.success && options.failFast) {
        break;
      }
    }
    
    return {
      swarmId,
      topology: 'sequential',
      agents: agents.map(a => a.id),
      results,
      status: results.every(r => r.success) ? 'completed' : 'partial'
    };
  }
  
  compileResults(swarmId, agents, results, mode) {
    const compiled = results.map((r, i) => ({
      agentId: agents[i].id,
      status: r.status === 'fulfilled' ? 'completed' : 'failed',
      result: r.status === 'fulfilled' ? r.value : r.reason?.message
    }));
    
    return {
      swarmId,
      topology: mode,
      agents: agents.map(a => a.id),
      results: compiled,
      status: compiled.every(r => r.status === 'completed') ? 'completed' : 'partial'
    };
  }
  
  getSwarmStatus() {
    const agentStatus = [];
    for (const [id, agent] of this.agents) {
      agentStatus.push({
        id,
        name: agent.name,
        role: agent.role,
        status: agent.status,
        metrics: agent.metrics
      });
    }
    
    return {
      topology: this.topology,
      agentCount: this.agents.size,
      queueLength: this.taskQueue.length,
      agents: agentStatus
    };
  }
}

const globalSwarm = new SwarmCoordinator();

export function initializeSwarm(env, config = {}) {
  const swarm = new SwarmCoordinator(config);
  return { success: true, topology: swarm.topology };
}

export async function executeSwarmTask(env, task, options = {}) {
  const result = await globalSwarm.executeSwarm(task, { ...options, env });
  return result;
}

export function getSwarmStatus() {
  return globalSwarm.getSwarmStatus();
}

export function registerSwarmAgent(agentConfig) {
  const agent = new DeploymentAgent(agentConfig);
  return globalSwarm.registerAgent(agent);
}

export async function executeMultiAgentWorkflow(env, workflow) {
  const { steps, parallel = false } = workflow;
  const workflowId = `workflow:${Date.now()}`;
  const results = [];
  
  for (const step of steps) {
    const stepResult = await executeSwarmTask(env, step.task, { 
      agents: step.agents,
      parallel: parallel && step.parallel
    });
    
    results.push({ step: step.name, ...stepResult });
    
    if (!stepResult.status === 'completed' && workflow.failFast) {
      break;
    }
  }
  
  return {
    workflowId,
    steps: results,
    status: results.every(r => r.status === 'completed') ? 'completed' : 'partial'
  };
}

```

```
