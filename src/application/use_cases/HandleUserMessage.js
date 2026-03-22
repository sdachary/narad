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
   * @param {import('../../domain/interfaces/index.js').ILogger}          deps.logger
   */
  constructor({ agiWorker, memoryStore, messageSender, knowledgeLoader, logger }) {
    this.agiWorker      = agiWorker;
    this.memoryStore    = memoryStore;
    this.messageSender  = messageSender;
    this.knowledgeLoader = knowledgeLoader;
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

      default:
        return false;
    }
  }
}
