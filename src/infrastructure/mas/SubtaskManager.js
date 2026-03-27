/**
 * Infrastructure: SubtaskManager
 * Implements ISubtaskManager for managing subtasks execution and agent assignment
 */
import { ISubtaskManager } from '../../domain/interfaces/index.js';
import { Subtask } from '../../domain/entities/Subtask.js';
import { Agent } from '../../domain/entities/Agent.js';
import { Checkpoint } from '../../domain/entities/Checkpoint.js';

export class SubtaskManager extends ISubtaskManager {
  /**
   * @param {object} opts
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   * @param {import('../../domain/interfaces/index.js').IAgiWorkerClient} opts.agiWorker
   * @param {import('../../domain/interfaces/index.js').IAgentManager} opts.agentManager
   * @param {import('../../domain/interfaces/index.js').IGitWorkflowManager} opts.gitManager
   */
  constructor({ logger, agiWorker, agentManager, gitManager }) {
    super();
    this.logger = logger;
    this.agiWorker = agiWorker;
    this.agentManager = agentManager;
    this.gitManager = gitManager;
  }

  /**
   * Decompose task into subtasks
   * @param {Task} task
   * @returns {Promise<Array<Subtask>>}
   */
  async decomposeTask(task) {
    this.logger.info('SubtaskManager: decomposing task', { taskId: task.id });
    
    // In a real implementation, this would use AI to break down the task
    // For now, we'll return a basic set of subtasks
    const subtasks = [
      new Subtask({
        id: `subtask_${task.id}_1`,
        taskId: task.id,
        description: `Analyze requirements and create architecture plan for: ${task.description}`,
        agentType: 'architecture',
        status: 'pending'
      }),
      new Subtask({
        id: `subtask_${task.id}_2`,
        taskId: task.id,
        description: `Implement core functionality for: ${task.description}`,
        agentType: 'coding',
        status: 'pending'
      }),
      new Subtask({
        id: `subtask_${task.id}_3`,
        taskId: task.id,
        description: `Create tests for: ${task.description}`,
        agentType: 'testing',
        status: 'pending'
      }),
      new Subtask({
        id: `subtask_${task.id}_4`,
        taskId: task.id,
        description: `Review security and performance for: ${task.description}`,
        agentType: 'security',
        status: 'pending'
      }),
      new Subtask({
        id: `subtask_${task.id}_5`,
        taskId: task.id,
        description: `Prepare deployment and documentation for: ${task.description}`,
        agentType: 'deployment',
        status: 'pending'
      })
    ];

    this.logger.info('SubtaskManager: decomposed task into subtasks', { 
      taskId: task.id,
      subtaskCount: subtasks.length
    });
    
    return subtasks;
  }

  /**
   * Assign subtask to best available agent
   * @param {Subtask} subtask
   * @param {Array<Agent>} availableAgents
   * @returns {Promise<{subtask: Subtask, agent: Agent}|null>}
   */
  async assignSubtask(subtask, availableAgents) {
    this.logger.info('SubtaskManager: assigning subtask', { 
      subtaskId: subtask.id,
      agentType: subtask.agentType,
      availableCount: availableAgents.length
    });

    // Find agents that can handle this subtask type
    const capableAgents = availableAgents.filter(agent => 
      agent.canHandle(subtask.agentType) && agent.hasCapacity()
    );

    if (capableAgents.length === 0) {
      this.logger.warn('SubtaskManager: no capable agents available', { 
        subtaskId: subtask.id,
        agentType: subtask.agentType
      });
      return null;
    }

    // Sort by remaining capacity (descending) to use agents with most capacity first
    const sortedAgents = capableAgents.sort((a, b) => 
      b.getRemainingCapacity() - a.getRemainingCapacity()
    );

    const selectedAgent = sortedAgents[0];
    this.logger.info('SubtaskManager: assigned subtask to agent', { 
      subtaskId: subtask.id,
      agentId: selectedAgent.id,
      agentType: selectedAgent.type
    });

    return { subtask, agent: selectedAgent };
  }

  /**
   * Execute subtask with assigned agent
   * @param {Subtask} subtask
   * @param {Agent} agent
   * @returns {Promise<Subtask>}
   */
  async executeSubtask(subtask, agent) {
    this.logger.info('SubtaskManager: executing subtask', { 
      subtaskId: subtask.id,
      agentId: agent.id
    });

    // Update subtask status
    subtask.status = 'executing';
    subtask.updatedAt = new Date();

    try {
      // Check if we have a checkpoint to resume from
      let checkpointData = null;
      // In a real implementation, we would load checkpoint here
      
      // Prepare prompt for the agent based on subtask type and description
      let prompt = `You are a ${subtask.agentType} specialist agent. `;
      prompt += `Task: ${subtask.description}\n`;
      
      if (checkpointData) {
        prompt += `Resuming from checkpoint: ${JSON.stringify(checkpointData)}\n`;
      }

      // Call the AGI worker (in a real implementation, this would be routed to specific agents)
      const response = await this.agiWorker.ask({
        requestId: `${subtask.id}_${Date.now()}`,
        message: prompt,
        history: [],
        context: 'Multi-Agent System',
        command: null,
        args: ''
      });

      if (response.isSuccess()) {
        // Update subtask with results
        subtask.complete({
          result: response.text,
          agentUsed: agent.id,
          completedAt: new Date().toISOString()
        });
        
        // Update agent usage
        agent.useCapacity(1); // Simplified - in reality would count tokens
        await this.agentManager.updateAgent(agent);
        
        this.logger.info('SubtaskManager: subtask completed successfully', { 
          subtaskId: subtask.id,
          agentId: agent.id
        });
      } else {
        // Handle failure
        subtask.fail(response.error || 'Unknown error');
        this.logger.error('SubtaskManager: subtask failed', { 
          subtaskId: subtask.id,
          agentId: agent.id,
          error: response.error
        });
      }
    } catch (err) {
      subtask.fail(err.message);
      this.logger.error('SubtaskManager: subtask execution error', { 
        subtaskId: subtask.id,
        agentId: agent.id,
        error: err.message
      });
    }

    return subtask;
  }

  /**
   * Save subtask checkpoint for recovery
   * @param {Subtask} subtask
   * @param {Checkpoint} checkpoint
   * @returns {Promise<void>}
   */
  async saveCheckpoint(subtask, checkpoint) {
    this.logger.info('SubtaskManager: saving checkpoint', { 
      subtaskId: subtask.id,
      checkpointId: checkpoint.id
    });
    
    // In a real implementation, this would persist the checkpoint
    // For now, we'll just log it
    subtask.checkpointId = checkpoint.id;
    subtask.status = 'waiting_for_checkpoint';
    subtask.updatedAt = new Date();
  }

  /**
   * Load latest checkpoint for subtask
   * @param {Subtask} subtask
   * @returns {Promise<Checkpoint|null>}
   */
  async loadCheckpoint(subtask) {
    this.logger.info('SubtaskManager: loading checkpoint', { 
      subtaskId: subtask.id
    });
    
    // In a real implementation, this would load from persistent storage
    // For now, return null as we don't have persistence yet
    return null;
  }
}