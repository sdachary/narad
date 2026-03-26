/**
 * Use Case: HandleMASRequest
 *
 * This is the Multi-Agent System orchestrator.
 * It receives a user request, decomposes it into subtasks,
 * assigns them to specialized agents, executes them,
 * manages checkpoints, and handles git workflow.
 *
 * DEPENDENCIES: injected via constructor (Dependency Inversion).
 * This class NEVER imports Telegram, Groq, or any infrastructure directly.
 */

import { Task } from '../../domain/entities/Task.js';
import { Subtask } from '../../domain/entities/Subtask.js';
import { AgentResponse, ResponseStatus } from '../../domain/entities/AgentResponse.js';

export class HandleMASRequest {
  /**
   * @param {object} deps
   * @param {import('../../domain/interfaces/index.js').ITaskManager} deps.taskManager
   * @param {import('../../domain/interfaces/index.js').ISubtaskManager} deps.subtaskManager
   * @param {import('../../domain/interfaces/index.js').IAgentManager} deps.agentManager
   * @param {import('../../domain/interfaces/index.js').IGitWorkflowManager} deps.gitManager
   * @param {import('../../domain/interfaces/index.js').IMessageSender}   deps.messageSender
   * @param {import('../../domain/interfaces/index.js').ILogger}          deps.logger
   */
  constructor({ taskManager, subtaskManager, agentManager, gitManager, messageSender, logger }) {
    this.taskManager    = taskManager;
    this.subtaskManager = subtaskManager;
    this.agentManager   = agentManager;
    this.gitManager     = gitManager;
    this.messageSender  = messageSender;
    this.logger         = logger;
  }

  /**
   * @param {object} params
   * @param {string} params.userId     - User who made the request
   * @param {string} params.chatId     - Chat/conversation ID
   * @param {string} params.description - Original user request description
   * @returns {Promise<void>}
   */
  async execute({ userId, chatId, description }) {
    const start = Date.now();
    this.logger.info('HandleMASRequest.execute', { userId, chatId, description });

    try {
      // 1. Create task from user request
      const task = await this.taskManager.createTask({
        userId,
        chatId,
        description
      });

      // Notify user that we've started processing
      await this.messageSender.send(
        chatId,
        `🔮 *Narad MAS Activated*\n\n` +
        `📝 *Task:* ${description}\n` +
        `🆔 *Task ID:* \`${task.id}\`\n\n` +
        `⏳ Breaking down task into subtasks...`
      );

      // 2. Decompose task into subtasks
      const subtasks = await this.subtaskManager.decomposeTask(task);
      
      // Add subtasks to task
      for (const subtask of subtasks) {
        task.addSubtask(subtask);
      }
      
      // Update task status
      task.updateStatusFromSubtasks();
      await this.taskManager.updateTask(task);

      // 3. Execute subtasks
      await this._executeSubtasks(task);

      // 4. Handle completion
      await this._handleTaskCompletion(task, chatId);

    } catch (err) {
      this.logger.error('HandleMASRequest.execute failed', { error: err.message, userId, chatId });
      await this.messageSender.send(
        chatId,
        '⚠️ Something went wrong in the Multi-Agent System. Please try again later.'
      );
    }
  }

  /**
   * Execute all subtasks for a task
   * @param {Task} task
   * @returns {Promise<void>}
   */
  async _executeSubtasks(task) {
    this.logger.info('HandleMASRequest: executing subtasks', { taskId: task.id });

    // Continue executing until all subtasks are done or we hit a blocking condition
    while (!task.isCompleted() && !task.isFailed()) {
      // Get pending subtasks
      const pendingSubtasks = task.getSubtasksByStatus('pending');
      
      if (pendingSubtasks.length === 0) {
        // Check if we have subtasks waiting for checkpoints
        const waitingSubtasks = task.getSubtasksByStatus('waiting_for_checkpoint');
        
        if (waitingSubtasks.length > 0) {
          this.logger.info('HandleMASRequest: subtasks waiting for checkpoint reset');
          await this.messageSender.send(
            task.chatId,
            `⏳ *MAS Update*\n\nSome subtasks are waiting for AI agent token limits to reset.\n` +
            `Checkpoint saved. Will resume when agents are available again.`
          );
          break; // Exit loop - we'll resume later when agents are available
        } else {
          // No pending subtasks and none waiting - might be stuck
          this.logger.warn('HandleMASRequest: no pending subtasks but task not complete');
          break;
        }
      }

      // Process each pending subtask
      for (const subtask of pendingSubtasks) {
        // Get available agents for this subtask type
        const availableAgents = await this.agentManager.getAvailableAgents(subtask.agentType);
        
        if (availableAgents.length === 0) {
          this.logger.warn('HandleMASRequest: no available agents for subtask', { 
            subtaskId: subtask.id,
            agentType: subtask.agentType
          });
          
          // Mark subtask as waiting - will retry later
          subtask.waitForCheckpoint();
          subtask.updatedAt = new Date();
          continue;
        }

        // Assign subtask to best available agent
        const assignment = await this.subtaskManager.assignSubtask(subtask, availableAgents);
        
        if (!assignment) {
          // No agent available - will retry later
          subtask.waitForCheckpoint();
          subtask.updatedAt = new Date();
          continue;
        }

        const { agent } = assignment;
        
        // Execute the subtask
        const updatedSubtask = await this.subtaskManager.executeSubtask(subtask, agent);
        
        // Update task with the updated subtask
        // Find and replace the subtask in task.subtasks
        const index = task.subtasks.findIndex(st => st.id === updatedSubtask.id);
        if (index !== -1) {
          task.subtasks[index] = updatedSubtask;
        }
        
        // Update agent status
        await this.agentManager.updateAgent(agent);
        
        // Update task status based on subtask progress
        task.updateStatusFromSubtasks();
        await this.taskManager.updateTask(task);
        
        // Brief delay to prevent overwhelming the system
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  /**
   * Handle task completion - create git branch, commit, PR, etc.
   * @param {Task} task
   * @param {string} chatId
   * @returns {Promise<void>}
   */
  async _handleTaskCompletion(task, chatId) {
    this.logger.info('HandleMASRequest: handling task completion', { 
      taskId: task.id,
      status: task.status
    });

    if (task.isCompleted()) {
      await this.messageSender.send(
        chatId,
        `✅ *MAS Task Completed*\n\n` +
        `📝 *Task:* ${task.description}\n` +
        `🆔 *Task ID:* \`${task.id}\`\n\n` +
        `🚀 Creating feature branch and preparing deployment...`
      );

      try {
        // Create feature branch
        const branchName = await this.gitManager.createFeatureBranch(task);
        
        // Commit changes (in a real implementation, we'd collect actual files changed)
        await this.gitManager.commitChanges(
          branchName,
          `feat: ${task.description}\n\nTask ID: ${task.id}\n\nCompleted by Narad MAS`,
          [] // Would be populated with actual changed files
        );
        
        // Create pull request
        const prUrl = await this.gitManager.createPullRequest(task, branchName, 'dev');
        
        await this.messageSender.send(
          chatId,
          `✅ *MAS Task Completed Successfully*\n\n` +
          `📝 *Task:* ${task.description}\n` +
          `🆔 *Task ID:* \`${task.id}\`\n` +
          `🌿 *Branch:* \`${branchName}\`\n` +
          `🔗 *Pull Request:* ${prUrl}\n\n` +
          `👉 Please review the PR and test in the dev environment.\n` +
          `Once approved, it will be merged to dev → test → main via the standard workflow.`
        );
      } catch (err) {
        this.logger.error('HandleMASRequest: git workflow failed', { 
          taskId: task.id,
          error: err.message
        });
        
        await this.messageSender.send(
          chatId,
            `⚠️ *MAS Task Completed but Git Workflow Failed*\n\n` +
            `📝 *Task:* ${task.description}\n` +
            `🆔 *Task ID:* \`${task.id}\`\n\n` +
            `The subtasks were completed successfully, but there was an issue with the git workflow:\n` +
            `\`\`\n${err.message}\n\`\`\n\n` +
            `Please manually create a PR from the feature branch if needed.`
        );
      }
    } else if (task.isFailed()) {
      await this.messageSender.send(
        chatId,
        `❌ *MAS Task Failed*\n\n` +
        `📝 *Task:* ${task.description}\n` +
        `🆔 *Task ID:* \`${task.id}\`\n\n` +
        `Please check the logs for details and try again or provide more specific requirements.`
      );
    } else {
      // Task is still in progress (waiting for checkpoints)
      await this.messageSender.send(
        chatId,
        `⏳ *MAS Task In Progress*\n\n` +
        `📝 *Task:* ${task.description}\n` +
        `🆔 *Task ID:* \`${task.id}\`\n\n` +
        `Some subtasks are waiting for AI agent token limits to reset.\n` +
        `The system will automatically resume when agents are available again.\n` +
        `You'll be notified when the task completes.`
      );
    }
  }
}