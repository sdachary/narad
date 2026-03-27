/**
 * Domain Entity: Checkpoint
 * Represents a saved state that allows agents to resume work after token limits reset
 */
export class Checkpoint {
  /**
   * @param {object} params
   * @param {string} params.id         - Unique checkpoint ID
   * @param {string} params.taskId     - Associated task ID
   * @param {string} params.agentId    - Agent that created this checkpoint
   * @param {any}    params.stateData  - Serialized state data (subtask progress, etc.)
   * @param {Date}   params.createdAt  - When checkpoint was created
   * @param {Date}   params.expiresAt  - When checkpoint expires (optional)
   * @param {string} params.description - Human-readable description
   */
  constructor({ id, taskId, agentId, stateData, createdAt, expiresAt = null, description = '' }) {
    if (!id) throw new Error('Checkpoint.id is required');
    if (!taskId) throw new Error('Checkpoint.taskId is required');
    if (!agentId) throw new Error('Checkpoint.agentId is required');
    if (stateData === undefined) throw new Error('Checkpoint.stateData is required');

    this.id         = id;
    this.taskId     = taskId;
    this.agentId    = agentId;
    this.stateData  = stateData;
    this.createdAt  = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.expiresAt  = expiresAt instanceof Date ? expiresAt : (expiresAt ? new Date(expiresAt) : null);
    this.description = description;
  }

  /**
   * Check if checkpoint has expired
   * @returns {boolean}
   */
  isExpired() {
    if (!this.expiresAt) return false;
    return new Date() > this.expiresAt;
  }

  /**
   * Get age of checkpoint in hours
   * @returns {number} Hours since creation
   */
  getAgeHours() {
    const now = new Date();
    return (now - this.createdAt) / (1000 * 60 * 60);
  }

  toString() {
    return `Checkpoint[${this.id}] for task ${this.taskId} by agent ${this.agentId} (${this.getAgeHours().toFixed(1)}h old)`;
  }
}