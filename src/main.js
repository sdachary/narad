/**
 * main.js — Application entry point + Dependency Injection container
 *
 * This file is the only place where concrete classes are wired together.
 * Every other module only depends on interfaces (ports), not concretions.
 *
 * Boot order:
 *   1. Load config (fail fast on missing env vars)
 *   2. Instantiate infrastructure (logger, memory, AGI client)
 *   3. Instantiate use cases (inject infrastructure)
 *   4. Start scheduler
 *   5. Handle shutdown signals
 */

import 'dotenv/config';
import { loadConfig }          from './config.js';

// Infrastructure
import { ConsoleLogger }        from './infrastructure/ConsoleLogger.js';
import { AgiWorkerClient }      from './infrastructure/agi_worker/AgiWorkerClient.js';
import { SqliteMemoryStore }    from './infrastructure/memory/SqliteMemoryStore.js';
import { FileKnowledgeLoader }  from './infrastructure/memory/FileKnowledgeLoader.js';
import { CronScheduler }        from './infrastructure/scheduler/CronScheduler.js';
import { SystemStats }          from './infrastructure/system/SystemStats.js';

// MAS Infrastructure
import { TaskManager }          from './infrastructure/mas/TaskManager.js';
import { SubtaskManager }       from './infrastructure/mas/SubtaskManager.js';
import { AgentManager }         from './infrastructure/mas/AgentManager.js';
import { GitWorkflowManager }   from './infrastructure/mas/GitWorkflowManager.js';

// Application
import { HandleUserMessage }    from './application/use_cases/HandleUserMessage.js';
import { HandleCronJob }        from './application/use_cases/HandleCronJob.js';
import { HandleMASRequest }     from './application/use_cases/HandleMASRequest.js';

async function main() {
  // ── 1. Config ─────────────────────────────────────────────────────
  let config;
  try {
    config = loadConfig();
  } catch (err) {
    // Logger not yet available — write directly
    process.stderr.write(`FATAL: ${err.message}\n`);
    process.exit(1);
  }

  // ── 2. Infrastructure ─────────────────────────────────────────────
  const logger = new ConsoleLogger({
    level:   config.log.level,
    service: 'narad',
  });

  logger.info('Narad starting up', {
    agiWorkerUrl:   config.agi.workerUrl,
    knowledgeDir:   config.memory.knowledgeDir,
    dbPath:         config.memory.dbPath,
    cronJobs:       config.cron.jobs.length,
  });

  const memoryStore = new SqliteMemoryStore({
    dbPath: config.memory.dbPath,
    logger,
  });

  const knowledgeLoader = new FileKnowledgeLoader({
    knowledgeDir: config.memory.knowledgeDir,
    logger,
  });

    const agiWorker = new AgiWorkerClient({
      workerUrl: config.agi.workerUrl,
      timeoutMs: config.agi.timeoutMs,
      logger,
    });

  const systemStats = new SystemStats({ logger });

   // ── 3. Infrastructure for MAS ───────────────────────────────────────
   const taskManager = new TaskManager({
     logger,
     memoryStore, // Reusing existing memory store
   });

   const agentManager = new AgentManager({
     logger,
   });

   const gitWorkflowManager = new GitWorkflowManager({
     logger,
     workDir: process.cwd(),
   });

   const subtaskManager = new SubtaskManager({
     logger,
     agiWorker,
     agentManager,
     gitManager: gitWorkflowManager,
   });

    // ── 4. Use Cases ──────────────────────────────────────────────────
    const handleUserMessage = new HandleUserMessage({
      agiWorker,
      memoryStore,
      knowledgeLoader,
      systemStats,
      logger,
    });

    const handleMASRequest = new HandleMASRequest({
      taskManager,
      subtaskManager,
      agentManager,
      gitManager: gitWorkflowManager,
      logger,
    });

    const handleCronJob = new HandleCronJob({
      agiWorker,
      knowledgeLoader,
      logger,
      operatorChatId: config.cron.operatorChatId,
    });

   // ── 4. Interface ──────────────────────────────────────────────────
   // No longer needed as we are removing Telegram integration and using web interface only.
   // The web interface (narad-brain) handles requests directly via Cloudflare Worker.

  // ── 5. Scheduler ──────────────────────────────────────────────────
  const scheduler = new CronScheduler({
    handleCronJob,
    logger,
    jobs: config.cron.jobs.map(j => ({
      id:       j.id,
      schedule: j.schedule,
      message:  j.message,
      // vm-health-check is silent: only sends if there is an alert
      silent:   j.id === 'vm-health-check',
    })),
  });
  scheduler.start();

   // ── 6. Graceful shutdown ──────────────────────────────────────────
   const shutdown = async (signal) => {
     logger.info(`Received ${signal} — shutting down gracefully`);
     scheduler.stop();
     memoryStore.close();
     logger.info('Narad stopped cleanly');
     process.exit(0);
   };

   process.on('SIGTERM', () => shutdown('SIGTERM'));
   process.on('SIGINT',  () => shutdown('SIGINT'));

   process.on('uncaughtException', (err) => {
     logger.error('uncaughtException', { error: err.message, stack: err.stack });
     process.exit(1);
   });

   process.on('unhandledRejection', (reason) => {
     logger.error('unhandledRejection', { reason: String(reason) });
     // Don't exit — log and continue
   };

   // Since we are using a web interface (Cloudflare Worker), the main.js is not used for long-running processes.
   // The actual logic is in the Cloudflare Worker (narad-brain/_worker.js) and the web frontend.
   // This Node.js backend is kept for potential local development or other uses, but the primary deployment is serverless.
   // We do not start a bot or long-running process here in the serverless context.
   // For local testing, one could start a server, but that is out of scope for this serverless deployment.
   // Therefore, we do not call bot.start() or any equivalent.

   // If you wish to run this as a local server for development, you would need to implement a web server
   // and remove the Cloudflare Worker specific code. However, the current architecture is designed for
   // serverless deployment via Cloudflare Workers.

   // For now, we just indicate that the configuration is loaded and the system is ready.
   logger.info('Narad configured — ready for deployment as a Cloudflare Worker');
}

main();
