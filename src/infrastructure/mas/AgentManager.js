/**
 * Infrastructure: AgentManager
 * Implements IAgentManager for managing AI agents and their capacities
 */
import { IAgentManager } from '../../../domain/interfaces/index.js';
import { Agent } from '../../../domain/entities/Agent.js';

export class AgentManager extends IAgentManager {
  /**
   * @param {object} opts
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ logger }) {
    super();
    this.logger = logger;
    // In-memory store for agents - in production this would be a database
    this.agents = new Map();
    
    // Initialize with some default free agents
    this._initializeDefaultAgents();
  }

  /**
   * Initialize default free agents from various providers
   * @private
   */
  _initializeDefaultAgents() {
    // Groq free tier agents
    this.registerAgent(new Agent({
      id: 'groq-coding-1',
      type: 'coding',
      provider: 'groq',
      model: 'llama3-8b-8192',
      dailyLimit: 14400, // Groq's approximate free limit
      usedToday: 0
    }));
    
    this.registerAgent(new Agent({
      id: 'groq-testing-1',
      type: 'testing',
      provider: 'groq',
      model: 'llama3-8b-8192',
      dailyLimit: 14400,
      usedToday: 0
    }));
    
    this.registerAgent(new Agent({
      id: 'groq-architecture-1',
      type: 'architecture',
      provider: 'groq',
      model: 'llama3-8b-8192',
      dailyLimit: 14400,
      usedToday: 0
    }));
    
    // OpenRouter free agents (examples)
    this.registerAgent(new Agent({
      id: 'openrouter-security-1',
      type: 'security',
      provider: 'openrouter',
      model: 'google/gemma-7b-it:free',
      dailyLimit: 1000, // Approximate free limit
      usedToday: 0
    }));
    
    this.registerAgent(new Agent({
      id: 'openrouter-deployment-1',
      type: 'deployment',
      provider: 'openrouter',
      model: 'google/gemma-7b-it:free',
      dailyLimit: 1000,
      usedToday: 0
    }));
    
    // General purpose agents
    this.registerAgent(new Agent({
      id: 'groq-general-1',
      type: 'general',
      provider: 'groq',
      model: 'llama3-8b-8192',
      dailyLimit: 14400,
      usedToday: 0
    }));
    
    this.logger.info('AgentManager: initialized default agents', { 
      agentCount: this.agents.size 
    });
  }

  /**
   * Register a new agent
   * @param {Agent} agent
   * @returns {Promise<void>}
   */
  async registerAgent(agent) {
    this.logger.info('AgentManager: registering agent', { 
      agentId: agent.id,
      agentType: agent.type,
      provider: agent.provider
    });
    
    this.agents.set(agent.id, agent);
  }

  /**
   * Get agent by ID
   * @param {string} agentId
   * @returns {Promise<Agent|null>}
   */
  async getAgent(agentId) {
    const agent = this.agents.get(agentId) || null;
    this.logger.debug('AgentManager: got agent', { 
      agentId, 
      found: !!agent 
    });
    return agent;
  }

  /**
   * Get available agents by type
   * @param {string} agentType
   * @returns {Promise<Array<Agent>>}
   */
  async getAvailableAgents(agentType) {
    const available = Array.from(this.agents.values())
      .filter(agent => 
        agent.canHandle(agentType) && 
        agent.hasCapacity() && 
        agent.isAvailable
      );
    
    this.logger.info('AgentManager: got available agents', { 
      agentType,
      count: available.length
    });
    
    return available;
  }

  /**
   * Update agent usage and availability
   * @param {Agent} agent
   * @returns {Promise<void>}
   */
  async updateAgent(agent) {
    this.logger.info('AgentManager: updating agent', { 
      agentId: agent.id,
      usedToday: agent.usedToday,
      dailyLimit: agent.dailyLimit,
      isAvailable: agent.isAvailable
    });
    
    // Update in-memory store
    this.agents.set(agent.id, agent);
    
    // Auto-mark as unavailable if over limit
    if (!agent.hasCapacity()) {
      agent.setUnavailable();
      this.logger.warn('AgentManager: agent exceeded capacity', { 
        agentId: agent.id,
        usedToday: agent.usedToday,
        dailyLimit: agent.dailyLimit
      });
    }
  }

  /**
   * Reset agent daily counters (called at midnight)
   * @returns {Promise<void>}
   */
  async resetDailyCounters() {
    this.logger.info('AgentManager: resetting daily counters');
    
    let resetCount = 0;
    for (const agent of this.agents.values()) {
      agent.resetDailyCounter();
      if (!agent.isAvailable) {
        agent.setAvailable(); // Make available again after reset
      }
      resetCount++;
    }
    
    this.logger.info('AgentManager: daily counters reset', { 
      agentCount: resetCount 
    });
  }
}