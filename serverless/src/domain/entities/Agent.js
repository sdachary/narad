/**
 * Domain Entity: Agent
 * Represents a specialized AI agent capable of executing specific types of subtasks
 */
export class Agent {
  /**
   * @param {object} params
   * @param {string} params.id         - Unique agent ID
   * @param {string} params.type       - Agent specialization (coding, testing, architecture, etc.)
   * @param {string} params.provider   - AI provider (groq, openrouter, huggingface, etc.)
   * @param {string} params.model      - Model identifier
   * @param {number} params.dailyLimit - Daily token/request limit
   * @param {number} params.usedToday  - Tokens/requests used today
   * @param {Date}   params.lastReset  - Last time the counter was reset
   * @param {boolean} params.isAvailable - Whether agent can accept new work
   */
  constructor({ id, type, provider = 'groq', model = 'llama3-8b-8192', 
                dailyLimit = 10000, usedToday = 0, lastReset, isAvailable = true }) {
    if (!id) throw new Error('Agent.id is required');
    if (!type) throw new Error('Agent.type is required');

    this.id         = id;
    this.type       = type;
    this.provider   = provider;
    this.model      = model;
    this.dailyLimit = dailyLimit;
    this.usedToday  = usedToday;
    this.lastReset  = lastReset instanceof Date ? lastReset : new Date(lastReset || Date.now());
    this.isAvailable = isAvailable;
  }

  /**
   * Check if agent can handle a subtask of given type
   * @param {string} subtaskType
   * @returns {boolean}
   */
  canHandle(subtaskType) {
    return this.type === subtaskType || this.type === 'general';
  }

  /**
   * Check if agent has available capacity
   * @returns {boolean}
   */
  hasCapacity() {
    return this.isAvailable && this.usedToday < this.dailyLimit;
  }

  /**
   * Get remaining capacity
   * @returns {number} Remaining tokens/requests
   */
  getRemainingCapacity() {
    return Math.max(0, this.dailyLimit - this.usedToday);
  }

  /**
   * Increment usage counter
   * @param {number} amount - Amount to increment (default 1)
   * @returns {number} New usage count
   */
  useCapacity(amount = 1) {
    this.usedToday += amount;
    return this.usedToday;
  }

  /**
   * Reset daily counter (call at midnight or when limit resets)
   */
  resetDailyCounter() {
    this.usedToday = 0;
    this.lastReset = new Date();
  }

  /**
   * Temporarily make agent unavailable (e.g., hitting rate limit)
   */
  setUnavailable() {
    this.isAvailable = false;
  }

  /**
   * Make agent available again
   */
  setAvailable() {
    this.isAvailable = true;
  }

  toString() {
    return `Agent[${this.id}:${this.type}] ${this.provider}/${this.model} (${this.usedToday}/${this.dailyLimit})`;
  }
}