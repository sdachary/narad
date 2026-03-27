/**
 * Infrastructure: CloudflareCronAdapter
 *
 * Adapter for Cloudflare Cron Triggers. The actual job logic should be implemented
 * in the specific job handlers, but we provide a basic structure.
 */

import { ConsoleLogger } from '../../../src/infrastructure/ConsoleLogger.js';

export async function cronJobHandler(request, env, ctx) {
  const logger = new ConsoleLogger({ level: env.LOG_LEVEL || 'info' });

  // Extract job name from route parameter if available
  const jobName = request ? request.param().jobName : 'unknown';

  logger.info('CloudflareCronAdapter: cron job triggered', { jobName });

  try {
    // TODO: Implement actual job logic here or dispatch to specific handlers
    // For example, you could have a map of job names to functions.
    // Since we are migrating from node-cron, you can move your existing cron job
    // logic into this function or into separate modules that are called here.

    // Placeholder: just log that the job ran
    logger.debug('CloudflareCronAdapter: cron job completed', { jobName });

    // If you want to wait for async work to complete, you can pass it to ctx.waitUntil()
    // Example: ctx.waitUntil(someAsyncOperation());

    return new Response('OK', { status: 200 });
  } catch (err) {
    logger.error('CloudflareCronAdapter: cron job failed', { jobName, error: err.message });
    return new Response('Internal Server Error', { status: 500 });
  }
}