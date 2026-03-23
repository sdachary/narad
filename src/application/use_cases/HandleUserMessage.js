/**
 * Use Case: HandleUserMessage
 *
 * This is the core application orchestrator.
 * It receives a Message entity, decides what to do with it,
 * calls the AGI worker, and sends back the reply.
 *
 * DEPENDENCIES: injected via constructor (Dependency Inversion).
 * This class NEVER imports Telegram, Groq, or any infrastructure.
 */

import { AgentResponse, ResponseStatus } from '../../domain/entities/AgentResponse.js';
import { ConversationContext } from '../../domain/entities/ConversationContext.js';

export class HandleUserMessage {
  /**
   * @param {object} deps
   * @param {import('../../domain/interfaces/index.js').IAgiWorkerClient} deps.agiWorker
   * @param {import('../../domain/interfaces/index.js').IMemoryStore}     deps.memoryStore
   * @param {import('../../domain/interfaces/index.js').IMessageSender}   deps.messageSender
   * @param {import('../../domain/interfaces/index.js').IKnowledgeLoader} deps.knowledgeLoader
   * @param {import('../../domain/interfaces/index.js').IFileDownloader}   deps.downloader
   * @param {import('../../domain/interfaces/index.js').ILogger}          deps.logger
   */
  constructor({ agiWorker, memoryStore, messageSender, knowledgeLoader, downloader, systemStats, logger }) {
    this.agiWorker      = agiWorker;
    this.memoryStore    = memoryStore;
    this.messageSender  = messageSender;
    this.knowledgeLoader = knowledgeLoader;
    this.downloader     = downloader;
    this.systemStats    = systemStats;
    this.logger         = logger;
  }

  /**
   * @param {import('../../domain/entities/Message.js').Message} message
   * @returns {Promise<void>}
   */
  async execute(message) {
    const start = Date.now();
    this.logger.info('HandleUserMessage.execute', { id: message.id, command: message.command });

    try {
      // ── Intercept built-in commands that don't need the AGI worker ──
      const handled = await this._handleBuiltIn(message);
      if (handled) return;

      // ── Load or create conversation context ──
      let ctx = await this.memoryStore.load(message.chatId);
      if (!ctx) {
        const platform = await this.knowledgeLoader.load();
        ctx = new ConversationContext({
          chatId:   message.chatId,
          userId:   message.userId,
          platform,
        });
      }

      // ── Add user turn to context ──
      ctx.addUserTurn(message.text);

      // ── Call AGI worker ──
      const response = await this.agiWorker.ask({
        requestId: message.id,
        message:   message.text,
        history:   ctx.toWorkerHistory().slice(0, -1), // exclude the turn we just added
        context:   ctx.platform,
        command:   message.command,
        args:      message.args,
      });

      // ── Update context with assistant reply ──
      if (response.isSuccess()) {
        ctx.addAssistantTurn(response.text);
        await this.memoryStore.save(ctx);
      }

      const latency = Date.now() - start;
      this.logger.info('HandleUserMessage.response', {
        requestId: message.id,
        status:    response.status,
        latencyMs: latency,
      });

      // ── Send reply ──
      await this.messageSender.send(message.chatId, response.toUserText());

    } catch (err) {
      this.logger.error('HandleUserMessage.execute failed', { error: err.message, id: message.id });
      await this.messageSender.send(
        message.chatId,
        '⚠️ Something went wrong on my end. Please try again in a moment.'
      );
    }
  }

  /**
   * Handle commands that are answered locally without calling the AGI worker.
   * @param {import('../../domain/entities/Message.js').Message} message
   * @returns {Promise<boolean>} true if handled, false if AGI worker should handle it
   */
  async _handleBuiltIn(message) {
    switch (message.command) {
      case 'start':
        await this.memoryStore.clear(message.chatId);
        await this.messageSender.send(
          message.chatId,
          [
            '🔮 *Narad is online.*',
            '',
            'I\'m your private R&D intelligence brain for the Nisha platform.',
            '',
            '*Commands:*',
            '`/ask <query>` — Ask me anything',
            '`/status` — VM health report',
            '`/idea <text>` — Log an R&D idea',
            '`/recall <query>` — Search past ideas',
            '`/research <topic>` — Web search + AI summary',
            '`/draft <request>` — Generate architecture or code',
            '`/nisha` — Platform service status',
            '`/digest` — Weekly R&D summary',
            '`/help` — Show this message',
          ].join('\n')
        );
        return true;

      case 'help':
        await this.messageSender.send(
          message.chatId,
          [
            '📖 *Narad — Command Reference*',
            '',
            '`/ask <query>` — Direct question to the AI brain',
            '`/status` — CPU, RAM, disk, uptime, running services',
            '`/idea <text>` — Capture and store an R&D idea',
            '`/recall <query>` — Search stored ideas by topic',
            '`/research <topic>` — Web search + AI summary',
            '`/draft <request>` — Generate docs, plans, or code',
            '`/nisha` — Current status of all Nisha platform services',
            '`/digest` — Summary of recent ideas and R&D progress',
            '`/experiment <n>` — Look up experiment status',
            '',
            '_You can also just type normally — I\'ll respond._',
          ].join('\n')
        );
        return true;

      case 'status':
        return await this._handleStatus(message);

      case 'nisha':
        return await this._handleNisha(message);

      case 'upload':
        return await this._handleUpload(message);

      default:
        return false;
    }
  }

  /**
   * Status handler: returns VM health metrics.
   * @param {import('../../domain/entities/Message.js').Message} message
   */
  async _handleStatus(message) {
    try {
      const stats = await this.systemStats.getStats();
      const text = [
        '📊 *VM Health Report*',
        '──────────────────',
        `⏱ *Uptime:*   ${stats.uptime}`,
        `🧠 *Memory:*   ${stats.memory}`,
        `⚡ *CPU:*      ${stats.cpu}`,
        `💾 *Disk:*     ${stats.disk}`,
        '──────────────────',
        '💬 _Send /nisha for service status_',
      ].join('\n');

      await this.messageSender.send(message.chatId, text);
    } catch (err) {
      this.logger.error('HandleUserMessage._handleStatus failed', { error: err.message });
      await this.messageSender.send(message.chatId, '❌ Failed to retrieve system stats.');
    }
    return true;
  }

  /**
   * Nisha status handler: returns status of platform services.
   * @param {import('../../domain/entities/Message.js').Message} message
   */
  async _handleNisha(message) {
    try {
      const { services } = await this.systemStats.getNishaStatus();
      const text = [
        '🌐 *Nisha Platform Status*',
        '──────────────────',
        ...services.map(s => `${s.status}  *${s.name}*`),
        '──────────────────',
      ].join('\n');

      await this.messageSender.send(message.chatId, text);
    } catch (err) {
      this.logger.error('HandleUserMessage._handleNisha failed', { error: err.message });
      await this.messageSender.send(message.chatId, '❌ Failed to retrieve platform status.');
    }
    return true;
  }

  /**
   * Process knowledge file upload.
   * @param {import('../../domain/entities/Message.js').Message} message
   */
  async _handleUpload(message) {
    if (!message.isDocument()) {
      await this.messageSender.send(message.chatId, '❌ No file detected. Please attach a Markdown file.');
      return true;
    }

    const doc = message.document;
    
    // Only allow Markdown files for knowledge base
    if (!doc.fileName.toLowerCase().endsWith('.md')) {
      await this.messageSender.send(message.chatId, `❌ Sorry, I only accept .md files for knowledge updates. (Got: ${doc.fileName})`);
      return true;
    }

    // Determine destination path
    // Default: ~/narad/knowledge/services/
    // Special: README.md -> ~/narad/knowledge/nisha-platform.md
    let destination;
    const knowledgeDir = process.env.KNOWLEDGE_DIR || '/home/ubuntu/narad/knowledge';
    
    if (doc.fileName.toLowerCase() === 'readme.md') {
      destination = `${knowledgeDir}/nisha-platform.md`;
    } else {
      destination = `${knowledgeDir}/services/${doc.fileName}`;
    }

    try {
      await this.messageSender.send(message.chatId, `⏳ Processing \`${doc.fileName}\`...`);
      
      await this.downloader.download(doc.fileId, doc.filePath, destination);
      
      this.logger.info('HandleUserMessage: knowledge updated', { file: doc.fileName, destination });
      await this.messageSender.send(message.chatId, `✅ *Knowledge updated!* \`${doc.fileName}\` is now part of my brain.`);
      
      return true;
    } catch (err) {
      this.logger.error('HandleUserMessage: upload failed', { error: err.message, file: doc.fileName });
      await this.messageSender.send(message.chatId, `❌ Failed to download \`${doc.fileName}\`. Check logs for details.`);
      return true;
    }
  }
}
