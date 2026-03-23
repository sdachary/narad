/**
 * main.js — Application entry point + Dependency Injection container
 *
 * This file is the only place where concrete classes are wired together.
 * Every other module only depends on interfaces (ports), not concretions.
 *
 * Boot order:
 *   1. Load config (fail fast on missing env vars)
 *   2. Instantiate infrastructure (logger, memory, AGI client, sender)
 *   3. Instantiate use cases (inject infrastructure)
 *   4. Instantiate interface (router + bot)
 *   5. Start scheduler
 *   6. Start bot (blocking poll loop)
 *   7. Handle shutdown signals
 */

import 'dotenv/config';
import { loadConfig }          from './config.js';

// Infrastructure
import { ConsoleLogger }        from './infrastructure/ConsoleLogger.js';
import { AgiWorkerClient }      from './infrastructure/agi_worker/AgiWorkerClient.js';
import { SqliteMemoryStore }    from './infrastructure/memory/SqliteMemoryStore.js';
import { FileKnowledgeLoader }  from './infrastructure/memory/FileKnowledgeLoader.js';
import { TelegramSender }       from './infrastructure/telegram/TelegramSender.js';
import { TelegramDownloader }   from './infrastructure/telegram/TelegramDownloader.js';
import { CronScheduler }        from './infrastructure/scheduler/CronScheduler.js';

// Application
import { HandleUserMessage }    from './application/use_cases/HandleUserMessage.js';
import { HandleCronJob }        from './application/use_cases/HandleCronJob.js';

// Interface
import { MessageRouter }        from './interface/router/MessageRouter.js';
import { TelegramBot }          from './interface/bot/TelegramBot.js';

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

  const messageSender = new TelegramSender({
    botToken: config.telegram.botToken,
    logger,
  });

  const downloader = new TelegramDownloader({
    botToken: config.telegram.botToken,
    logger,
  });

  // ── 3. Use Cases ──────────────────────────────────────────────────
  const handleUserMessage = new HandleUserMessage({
    agiWorker,
    memoryStore,
    messageSender,
    knowledgeLoader,
    downloader,
    logger,
  });

  const handleCronJob = new HandleCronJob({
    agiWorker,
    messageSender,
    knowledgeLoader,
    logger,
    operatorChatId: config.cron.operatorChatId,
  });

  // ── 4. Interface ──────────────────────────────────────────────────
  const router = new MessageRouter({
    handleUserMessage,
    messageSender,
    logger,
    allowedChatId: config.telegram.allowedChatId,
  });

  const bot = new TelegramBot({
    botToken: config.telegram.botToken,
    router,
    logger,
  });

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
    bot.stop();
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
  });

  // ── 7. Start Bot (blocking) ───────────────────────────────────────
  logger.info('Narad ready — starting Telegram poll loop');
  await bot.start();
}

main();
