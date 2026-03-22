/**
 * Infrastructure: CronScheduler
 *
 * Parses cron job definitions from config and fires them on schedule.
 * Uses 'node-cron' package — pure Node, zero external services.
 *
 * Default decision: node-cron (not system crontab, not external scheduler).
 * Rationale: lives inside the process, restarts with systemd, testable.
 */

import cron from 'node-cron';

export class CronScheduler {
  /**
   * @param {object} opts
   * @param {import('../use_cases/HandleCronJob.js').HandleCronJob} opts.handleCronJob
   * @param {import('../../domain/interfaces/index.js').ILogger}    opts.logger
   * @param {Array}  opts.jobs - Array of job definitions from config.cron[]
   */
  constructor({ handleCronJob, logger, jobs = [] }) {
    this.handleCronJob = handleCronJob;
    this.logger        = logger;
    this.jobs          = jobs;
    this._tasks        = [];
  }

  /**
   * Register all jobs and start the scheduler.
   */
  start() {
    if (this.jobs.length === 0) {
      this.logger.warn('CronScheduler: no jobs defined');
      return;
    }

    for (const job of this.jobs) {
      if (!job.id || !job.schedule || !job.message) {
        this.logger.warn('CronScheduler: skipping malformed job', { job });
        continue;
      }

      if (!cron.validate(job.schedule)) {
        this.logger.error('CronScheduler: invalid cron expression', { id: job.id, schedule: job.schedule });
        continue;
      }

      const task = cron.schedule(job.schedule, async () => {
        await this.handleCronJob.execute({
          id:     job.id,
          prompt: job.message,
          silent: job.silent === true,
        });
      }, {
        scheduled: true,
        timezone:  'Asia/Kolkata',
      });

      this._tasks.push(task);
      this.logger.info('CronScheduler: job registered', { id: job.id, schedule: job.schedule });
    }

    this.logger.info('CronScheduler: started', { jobCount: this._tasks.length });
  }

  stop() {
    for (const task of this._tasks) {
      task.stop();
    }
    this._tasks = [];
    this.logger.info('CronScheduler: stopped');
  }
}
