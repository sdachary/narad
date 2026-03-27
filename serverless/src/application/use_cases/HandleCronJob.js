/**
 * Use Case: HandleCronJob
 *
 * Executed by the scheduler on a defined cron schedule.
 * Sends a synthetic prompt to the AGI worker and delivers the reply to the operator.
 */

export class HandleCronJob {
  /**
   * @param {object} deps
   * @param {import('../../domain/interfaces/index.js').IAgiWorkerClient} deps.agiWorker
   * @param {import('../../domain/interfaces/index.js').IMessageSender}   deps.messageSender
   * @param {import('../../domain/interfaces/index.js').IKnowledgeLoader} deps.knowledgeLoader
   * @param {import('../../domain/interfaces/index.js').ILogger}          deps.logger
   * @param {string} deps.operatorChatId - The chat ID to deliver scheduled messages to
   */
  constructor({ agiWorker, messageSender, knowledgeLoader, logger, operatorChatId }) {
    this.agiWorker       = agiWorker;
    this.messageSender   = messageSender;
    this.knowledgeLoader = knowledgeLoader;
    this.logger          = logger;
    this.operatorChatId  = operatorChatId;
  }

  /**
   * @param {object} job
   * @param {string} job.id      - Cron job ID (e.g. 'morning-digest')
   * @param {string} job.prompt  - The instruction to send to the AGI worker
   * @param {boolean} job.silent - If true, only send if there's something to report (for health checks)
   * @returns {Promise<void>}
   */
  async execute(job) {
    this.logger.info('HandleCronJob.execute', { id: job.id });

    try {
      const platform = await this.knowledgeLoader.load();

      const response = await this.agiWorker.ask({
        requestId: `cron-${job.id}-${Date.now()}`,
        message:   job.prompt,
        history:   [],
        context:   platform,
        command:   'cron',
        args:      job.prompt,
      });

      if (!response.isSuccess()) {
        this.logger.warn('HandleCronJob: worker returned non-OK', { id: job.id, status: response.status });
        if (!job.silent) {
          await this.messageSender.send(this.operatorChatId, `⚠️ Cron job \`${job.id}\` failed: ${response.error}`);
        }
        return;
      }

      // Silent jobs (like health checks) only send if the response contains an alert signal
      if (job.silent) {
        const text = response.text.trim();
        const isAlert = text.length > 0 && !text.toLowerCase().includes('all clear') && !text.toLowerCase().includes('nothing to report');
        if (!isAlert) {
          this.logger.debug('HandleCronJob: silent job — no alert needed', { id: job.id });
          return;
        }
      }

      await this.messageSender.send(this.operatorChatId, response.toUserText());

    } catch (err) {
      this.logger.error('HandleCronJob.execute failed', { id: job.id, error: err.message });
    }
  }
}
