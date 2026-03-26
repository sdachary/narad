/**
 * Domain Entity: Subtask
 * Represents a specific piece of work that can be executed by a specialized agent
 */
export class Subtask {
  /**
   * @param {object} params
   * @param {string} params.id         - Unique subtask ID
   * @param {string} params.taskId     - Parent task ID
   * @param {string} params.description - Description of what needs to be done
   * @param {string} params.agentType  - Type of agent that should execute this (coding, testing, architecture, etc.)
   * @param {string} params.status     - Current status: pending, assigned, executing, completed, failed, waiting_for_checkpoint
   * @param {any}    params.inputData  - Input data needed for execution
   * @param {any}    params.outputData - Output data from execution
   * @param {Date}   params.createdAt  - When the subtask was created
   * @param {Date}   params.updatedAt  - Last update timestamp
   * @param {string} params.checkpointId - Reference to checkpoint if waiting for token reset
   * @param {number} params.retryCount - Number of times this subtask has been retried
   */
  constructor({ id, taskId, description, agentType = 'general', status = 'pending', 
                inputData = null, outputData = null, createdAt, updatedAt, 
                checkpointId = null, retryCount = 0 }) {
    if (!id)       throw new Error('Subtask.id is required');
    if (!taskId)   throw new Error('Subtask.taskId is required');
    if (!description) throw new Error('Subtask.description is required');
    if (!agentType) throw new Error('Subtask.agentType is required');

    this.id         = id;
    this.taskId     = taskId;
    this.description = description;
    this.agentType  = agentType;
    this.status     = status;
    this.inputData  = inputData;
    this.outputData = outputData;
    this.createdAt  = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt  = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    this.checkpointId = checkpointId;
    this.retryCount = retryCount;
  }

  /**
   * Mark subtask as completed
   * @param {any} outputData - Result of execution
   */
  complete(outputData) {
    this.status = 'completed';
    this.outputData = outputData;
    this.updatedAt = new Date();
  }

  /**
   * Mark subtask as failed
   * @param {string} errorMessage - Reason for failure
   */
  fail(errorMessage) {
    this.status = 'failed';
    this.inputData = { ...this.inputData, error: errorMessage };
    this.updatedAt = new Date();
  }

  /**
   * Mark subtask as waiting for checkpoint (token limit reset)
   */
  waitForCheckpoint() {
    this.status = 'waiting_for_checkpoint';
    this.updatedAt = new Date();
  }

  /**
   * Check if subtask is completed
   * @returns {boolean}
   */
  isCompleted() {
    return this.status === 'completed';
  }

  /**
   * Check if subtask has failed
   * @returns {boolean}
   */
  isFailed() {
    return this.status === 'failed';
  }

  /**
   * Check if subtask is waiting for checkpoint
   * @returns {boolean}
   */
  isWaitingForCheckpoint() {
    return this.status === 'waiting_for_checkpoint';
  }

  /**
   * Increment retry count
   * @returns {number} New retry count
   */
  incrementRetry() {
    this.retryCount++;
    this.updatedAt = new Date();
    return this.retryCount;
  }

  toString() {
    return `Subtask[${this.id}:${this.status}] "${this.description.slice(0, 30)}..." (${this.agentType})`;
  }
}