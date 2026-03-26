/**
 * Domain Entity: Task
 * Represents a high-level user request that needs to be decomposed into subtasks
 * and executed by specialized agents.
 */
export class Task {
  /**
   * @param {object} params
   * @param {string} params.id         - Unique task ID
   * @param {string} params.userId     - User who requested the task
   * @param {string} params.chatId     - Chat/conversation ID
   * @param {string} params.description - Original user request description
   * @param {string} params.status     - Current status: pending, planning, executing, completed, failed
   * @param {Date}   params.createdAt  - When the task was created
   * @param {Date}   params.updatedAt  - Last update timestamp
   * @param {Array}  params.subtasks   - Array of Subtask objects
   * @param {string} params.branchName - Git feature branch name for this task
   */
  constructor({ id, userId, chatId, description, status = 'pending', createdAt, updatedAt, subtasks = [], branchName = null }) {
    if (!id)       throw new Error('Task.id is required');
    if (!userId)   throw new Error('Task.userId is required');
    if (!chatId)   throw new Error('Task.chatId is required');
    if (!description) throw new Error('Task.description is required');

    this.id         = id;
    this.userId     = userId;
    this.chatId     = chatId;
    this.description = description;
    this.status     = status;
    this.createdAt  = createdAt instanceof Date ? createdAt : new Date(createdAt);
    this.updatedAt  = updatedAt instanceof Date ? updatedAt : new Date(updatedAt);
    this.subtasks   = subtasks;
    this.branchName = branchName;
  }

  /**
   * Add a subtask to this task
   * @param {Subtask} subtask
   */
  addSubtask(subtask) {
    this.subtasks.push(subtask);
    this.updatedAt = new Date();
  }

  /**
   * Get subtasks by status
   * @param {string} status - Subtask status to filter by
   * @returns {Array<Subtask>}
   */
  getSubtasksByStatus(status) {
    return this.subtasks.filter(subtask => subtask.status === status);
  }

  /**
   * Check if all subtasks are completed
   * @returns {boolean}
   */
  areAllSubtasksCompleted() {
    return this.subtasks.length > 0 && 
           this.subtasks.every(subtask => subtask.isCompleted());
  }

  /**
   * Check if any subtask has failed
   * @returns {boolean}
   */
  hasFailedSubtasks() {
    return this.subtasks.some(subtask => subtask.status === 'failed');
  }

  /**
   * Update task status based on subtask progress
   * @returns {string} New status
   */
  updateStatusFromSubtasks() {
    if (this.subtasks.length === 0) {
      this.status = 'planning';
    } else if (this.hasFailedSubtasks()) {
      this.status = 'failed';
    } else if (this.areAllSubtasksCompleted()) {
      this.status = 'completed';
    } else {
      this.status = 'executing';
    }
    this.updatedAt = new Date();
    return this.status;
  }

  isCompleted() {
    return this.status === 'completed';
  }

  isFailed() {
    return this.status === 'failed';
  }

  toString() {
    return `Task[${this.id}:${this.status}] "${this.description.slice(0, 50)}..."`;
  }
}