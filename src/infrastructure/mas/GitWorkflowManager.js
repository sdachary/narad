/**
 * Infrastructure: GitWorkflowManager
 * Implements IGitWorkflowManager for git operations and PR management
 */
import { IGitWorkflowManager } from '../../domain/interfaces/index.js';
import { Task } from '../../domain/entities/Task.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class GitWorkflowManager extends IGitWorkflowManager {
  /**
   * @param {object} opts
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   * @param {string} opts.workDir - Working directory for git operations
   */
  constructor({ logger, workDir = process.cwd() }) {
    super();
    this.logger = logger;
    this.workDir = workDir;
  }

  /**
   * Create feature branch for task
   * @param {Task} task
   * @returns {Promise<string>} Branch name
   */
  async createFeatureBranch(task) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const safeDesc = task.description
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .substring(0, 30);
    const branchName = `feature/${timestamp}-${safeDesc}`;

    this.logger.info('GitWorkflowManager: creating feature branch', { 
      taskId: task.id,
      branchName
    });

    try {
      // Ensure we're on the dev branch
      await execAsync('git checkout dev', { cwd: this.workDir });
      await execAsync('git pull origin dev', { cwd: this.workDir });
      
      // Create and checkout new feature branch
      await execAsync(`git checkout -b ${branchName}`, { cwd: this.workDir });
      
      this.logger.info('GitWorkflowManager: feature branch created', { 
        taskId: task.id,
        branchName
      });
      
      return branchName;
    } catch (err) {
      this.logger.error('GitWorkflowManager: failed to create feature branch', { 
        taskId: task.id,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Commit changes to feature branch
   * @param {string} branchName
   * @param {string} commitMessage
   * @param {Array<string>} files
   * @returns {Promise<void>}
   */
  async commitChanges(branchName, commitMessage, files = []) {
    this.logger.info('GitWorkflowManager: committing changes', { 
      branchName,
      fileCount: files.length
    });

    try {
      // Ensure we're on the correct branch
      await execAsync(`git checkout ${branchName}`, { cwd: this.workDir });
      
      // Add files (if specified) or all changes
      if (files.length > 0) {
        for (const file of files) {
          await execAsync(`git add ${file}`, { cwd: this.workDir });
        }
      } else {
        await execAsync('git add .', { cwd: this.workDir });
      }
      
      // Commit changes
      await execAsync(`git commit -m "${commitMessage}"`, { cwd: this.workDir });
      
      this.logger.info('GitWorkflowManager: changes committed', { 
        branchName,
        commitMessage
      });
    } catch (err) {
      this.logger.error('GitWorkflowManager: failed to commit changes', { 
        branchName,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Create pull request from feature branch
   * @param {Task} task
   * @param {string} sourceBranch
   * @param {string} targetBranch
   * @returns {Promise<string>} PR URL
   */
  async createPullRequest(task, sourceBranch, targetBranch = 'dev') {
    this.logger.info('GitWorkflowManager: creating pull request', { 
      taskId: task.id,
      sourceBranch,
      targetBranch
    });

    try {
      // Push the feature branch
      await execAsync(`git push origin ${sourceBranch}`, { cwd: this.workDir });
      
      // Create PR using GitHub CLI (assuming it's available)
      const prResult = await execAsync(
        `gh pr create --title "${task.description}" --body "Task ID: ${task.id}\n\nAuto-generated PR from Multi-Agent System" --head ${sourceBranch} --base ${targetBranch}`,
        { cwd: this.workDir }
      );
      
      // Extract PR URL from output
      const prUrl = prResult.stdout.trim();
      
      this.logger.info('GitWorkflowManager: pull request created', { 
        taskId: task.id,
        prUrl
      });
      
      return prUrl;
    } catch (err) {
      this.logger.error('GitWorkflowManager: failed to create pull request', { 
        taskId: task.id,
        error: err.message
      });
      throw err;
    }
  }

  /**
   * Merge pull request
   * @param {string} prUrl
   * @returns {Promise<boolean>}
   */
  async mergePullRequest(prUrl) {
    this.logger.info('GitWorkflowManager: merging pull request', { prUrl });
    
    try {
      // Extract PR number from URL
      const prNumber = prUrl.split('/').pop();
      
      // Merge the PR
      await execAsync(`gh pr merge ${prNumber} --merge --delete-branch`, { cwd: this.workDir });
      
      this.logger.info('GitWorkflowManager: pull request merged', { prUrl });
      return true;
    } catch (err) {
      this.logger.error('GitWorkflowManager: failed to merge pull request', { 
        prUrl,
        error: err.message
      });
      return false;
    }
  }
}