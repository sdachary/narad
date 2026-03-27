/**
 * Domain Interfaces (Ports)
 *
 * These are abstract contracts. Infrastructure layer MUST implement all of these.
 * The application layer depends ONLY on these interfaces — never on concrete classes.
 *
 * Pattern: Dependency Inversion Principle.
 *   High-level policy (use cases) ← depends on → these interfaces
 *   Low-level detail (Telegram, Groq HTTP) → implements these interfaces
 */

// ---------------------------------------------------------------------------
// IMessageSender
// Sends a reply back to the user, regardless of transport (Telegram, HTTP, etc.)
// ---------------------------------------------------------------------------
export class IMessageSender {
  /**
   * @param {string} chatId   - Where to send the message
   * @param {string} text     - The message text (may contain Markdown)
   * @returns {Promise<void>}
   */
  async send(chatId, text) { // eslint-disable-line no-unused-vars
    throw new Error('IMessageSender.send() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// IAgiWorkerClient
// Sends a request to the AGI worker and gets a response.
// ---------------------------------------------------------------------------
export class IAgiWorkerClient {
  /**
   * @param {object} payload
   * @param {string}        payload.requestId
   * @param {string}        payload.message    - The user's input text
   * @param {Array}         payload.history    - [{role, content}]
   * @param {string}        payload.context    - Platform knowledge injected as system context
   * @param {string}        payload.command    - Parsed command name or null
   * @returns {Promise<import('../entities/AgentResponse.js').AgentResponse>}
   */
  async ask(payload) { // eslint-disable-line no-unused-vars
    throw new Error('IAgiWorkerClient.ask() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// IMemoryStore
// Persists and retrieves conversation contexts.
// ---------------------------------------------------------------------------
export class IMemoryStore {
  /**
   * @param {string} chatId
   * @returns {Promise<import('../entities/ConversationContext.js').ConversationContext|null>}
   */
  async load(chatId) { // eslint-disable-line no-unused-vars
    throw new Error('IMemoryStore.load() must be implemented');
  }

  /**
   * @param {import('../entities/ConversationContext.js').ConversationContext} context
   * @returns {Promise<void>}
   */
  async save(context) { // eslint-disable-line no-unused-vars
    throw new Error('IMemoryStore.save() must be implemented');
  }

  /**
   * Clear context for a given chatId (used by /start command).
   * @param {string} chatId
   * @returns {Promise<void>}
   */
  async clear(chatId) { // eslint-disable-line no-unused-vars
    throw new Error('IMemoryStore.clear() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// IKnowledgeLoader
// Loads platform knowledge files to inject as agent context.
// ---------------------------------------------------------------------------
export class IKnowledgeLoader {
  /**
   * Returns a combined string of relevant platform context.
   * @returns {Promise<string>}
   */
  async load() {
    throw new Error('IKnowledgeLoader.load() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// ILogger
// Structured logging interface. Keeps use cases free of console.log calls.
// ---------------------------------------------------------------------------
export class ILogger {
  info(msg, meta = {})  { throw new Error('ILogger.info() must be implemented');  } // eslint-disable-line no-unused-vars
  warn(msg, meta = {})  { throw new Error('ILogger.warn() must be implemented');  } // eslint-disable-line no-unused-vars
  error(msg, meta = {}) { throw new Error('ILogger.error() must be implemented'); } // eslint-disable-line no-unused-vars
  debug(msg, meta = {}) { throw new Error('ILogger.debug() must be implemented'); } // eslint-disable-line no-unused-vars
}

// ---------------------------------------------------------------------------
// IFileDownloader
// Downloads a file from a remote source (e.g. Telegram) to a local path.
// ---------------------------------------------------------------------------
export class IFileDownloader {
  /**
   * @param {string} fileId      - ID of the file to download (platform-specific)
   * @param {string} filePath    - Platform-specific relative path to the file (if available)
   * @param {string} destination - Local file path where to save the content
   * @returns {Promise<void>}
   */
  async download(fileId, filePath, destination) { // eslint-disable-line no-unused-vars
    throw new Error('IFileDownloader.download() must be implemented');
  }
}
// ---------------------------------------------------------------------------
// ISystemStats
// Retrieves host system metrics (CPU, RAM, Disk, Uptime).
// ---------------------------------------------------------------------------
export class ISystemStats {
  /**
   * @returns {Promise<object>} - { cpu, ram, disk, uptime, services }
   */
  async getStats() {
    throw new Error('ISystemStats.getStats() must be implemented');
  }

  /**
   * @returns {Promise<object>} - Status of related platform services
   */
  async getNishaStatus() {
    throw new Error('ISystemStats.getNishaStatus() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// ITaskManager
// Manages tasks and subtasks for the Multi-Agent System
// ---------------------------------------------------------------------------
export class ITaskManager {
  /**
   * Create a new task from user request
   * @param {object} params
   * @param {string} params.userId
   * @param {string} params.chatId
   * @param {string} params.description
   * @returns {Promise<import('../entities/Task.js').Task>}
   */
  async createTask(params) { // eslint-disable-line no-unused-vars
    throw new Error('ITaskManager.createTask() must be implemented');
  }

  /**
   * Get task by ID
   * @param {string} taskId
   * @returns {Promise<import('../entities/Task.js').Task|null>}
   */
  async getTask(taskId) { // eslint-disable-line no-unused-vars
    throw new Error('ITaskManager.getTask() must be implemented');
  }

  /**
   * Update task status
   * @param {import('../entities/Task.js').Task} task
   * @returns {Promise<void>}
   */
  async updateTask(task) { // eslint-disable-line no-unused-vars
    throw new Error('ITaskManager.updateTask() must be implemented');
  }

  /**
   * Get pending tasks
   * @returns {Promise<Array<import('../entities/Task.js').Task>>}
   */
  async getPendingTasks() { // eslint-disable-line no-unused-vars
    throw new Error('ITaskManager.getPendingTasks() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// ISubtaskManager
// Manages subtasks execution and assignment to agents
// ---------------------------------------------------------------------------
export class ISubtaskManager {
  /**
   * Decompose task into subtasks
   * @param {import('../entities/Task.js').Task} task
   * @returns {Promise<Array<import('../entities/Subtask.js').Subtask>>}
   */
  async decomposeTask(task) { // eslint-disable-line no-unused-vars
    throw new Error('ISubtaskManager.decomposeTask() must be implemented');
  }

  /**
   * Assign subtask to best available agent
   * @param {import('../entities/Subtask.js').Subtask} subtask
   * @param {Array<import('../entities/Agent.js').Agent>} availableAgents
   * @returns {Promise<{subtask: import('../entities/Subtask.js').Subtask, agent: import('../entities/Agent.js').Agent}|null>}
   */
  async assignSubtask(subtask, availableAgents) { // eslint-disable-line no-unused-vars
    throw new Error('ISubtaskManager.assignSubtask() must be implemented');
  }

  /**
   * Execute subtask with assigned agent
   * @param {import('../entities/Subtask.js').Subtask} subtask
   * @param {import('../entities/Agent.js').Agent} agent
   * @returns {Promise<import('../entities/Subtask.js').Subtask>}
   */
  async executeSubtask(subtask, agent) { // eslint-disable-line no-unused-vars
    throw new Error('ISubtaskManager.executeSubtask() must be implemented');
  }

  /**
   * Save subtask checkpoint for recovery
   * @param {import('../entities/Subtask.js').Subtask} subtask
   * @param {import('../entities/Checkpoint.js').Checkpoint} checkpoint
   * @returns {Promise<void>}
   */
  async saveCheckpoint(subtask, checkpoint) { // eslint-disable-line no-unused-vars
    throw new Error('ISubtaskManager.saveCheckpoint() must be implemented');
  }

  /**
   * Load latest checkpoint for subtask
   * @param {import('../entities/Subtask.js').Subtask} subtask
   * @returns {Promise<import('../entities/Checkpoint.js').Checkpoint|null>}
   */
  async loadCheckpoint(subtask) { // eslint-disable-line no-unused-vars
    throw new Error('ISubtaskManager.loadCheckpoint() must be implemented');
  }
}

// -------------------------------------------------------------------------//
export class IAgentManager {
  /**
   * Register a new agent
   * @param {import('../entities/Agent.js').Agent} agent
   * @returns {Promise<void>}
   */
  async registerAgent(agent) { // eslint-disable-line no-unused-vars
    throw new Error('IAgentManager.registerAgent() must be implemented');
  }

  /**
   * Get agent by ID
   * @param {string} agentId
   * @returns {Promise<import('../entities/Agent.js').Agent|null>}
   */
  async getAgent(agentId) { // eslint-disable-line no-unused-vars
    throw new Error('IAgentManager.getAgent() must be implemented');
  }

  /**
   * Get available agents by type
   * @param {string} agentType
   * @returns {Promise<Array<import('../entities/Agent.js').Agent>>}
   */
  async getAvailableAgents(agentType) { // eslint-disable-line no-unused-vars
    throw new Error('IAgentManager.getAvailableAgents() must be implemented');
  }

  /**
   * Update agent usage and availability
   * @param {import('../entities/Agent.js').Agent} agent
   * @returns {Promise<void>}
   */
  async updateAgent(agent) { // eslint-disable-line no-unused-vars
    throw new Error('IAgentManager.updateAgent() must be implemented');
  }

  /**
   * Reset agent daily counters (called at midnight)
   * @returns {Promise<void>}
   */
  async resetDailyCounters() { // eslint-disable-line no-unused-vars
    throw new Error('IAgentManager.resetDailyCounters() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// IGitWorkflowManager
// Manages git operations for feature branches and PRs
// ---------------------------------------------------------------------------
export class IGitWorkflowManager {
  /**
   * Create feature branch for task
   * @param {import('../entities/Task.js').Task} task
   * @returns {Promise<string>} Branch name
   */
  async createFeatureBranch(task) { // eslint-disable-line no-unused-vars
    throw new Error('IGitWorkflowManager.createFeatureBranch() must be implemented');
  }

  /**
   * Commit changes to feature branch
   * @param {string} branchName
   * @param {string} commitMessage
   * @param {Array<string>} files
   * @returns {Promise<void>}
   */
  async commitChanges(branchName, commitMessage, files) { // eslint-disable-line no-unused-vars
    throw new Error('IGitWorkflowManager.commitChanges() must be implemented');
  }

  /**
   * Create pull request from feature branch
   * @param {import('../entities/Task.js').Task} task
   * @param {string} sourceBranch
   * @param {string} targetBranch
   * @returns {Promise<string>} PR URL
   */
  async createPullRequest(task, sourceBranch, targetBranch) { // eslint-disable-line no-unused-vars
    throw new Error('IGitWorkflowManager.createPullRequest() must be implemented');
  }

  /**
   * Merge pull request
   * @param {string} prUrl
   * @returns {Promise<boolean>}
   */
  async mergePullRequest(prUrl) { // eslint-disable-line no-unused-vars
    throw new Error('IGitWorkflowManager.mergePullRequest() must be implemented');
  }
}
