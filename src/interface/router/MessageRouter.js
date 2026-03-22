/**
 * Interface: MessageRouter
 *
 * Routes an incoming Message to the correct use case.
 * This is the only class in the interface layer that knows about use cases.
 * Handlers (command-specific logic) live in HandleUserMessage.
 *
 * This layer's single responsibility: receive → parse → dispatch → done.
 * It does NOT handle business logic.
 */

import { MessageParser } from '../../domain/services/MessageParser.js';

export class MessageRouter {
  /**
   * @param {object} deps
   * @param {import('../../application/use_cases/HandleUserMessage.js').HandleUserMessage} deps.handleUserMessage
   * @param {import('../../domain/interfaces/index.js').IMessageSender}  deps.messageSender
   * @param {import('../../domain/interfaces/index.js').ILogger}         deps.logger
   * @param {string|number} deps.allowedChatId - Only process messages from this chat ID (security)
   */
  constructor({ handleUserMessage, messageSender, logger, allowedChatId }) {
    this.handleUserMessage = handleUserMessage;
    this.messageSender     = messageSender;
    this.logger            = logger;
    this.allowedChatId     = String(allowedChatId);
    this.parser            = new MessageParser();
  }

  /**
   * Process a raw incoming update from Telegram.
   * @param {object} raw - Raw update object from telegram-bot-api
   * @returns {Promise<void>}
   */
  async route(raw) {
    let message;
    try {
      message = this.parser.parse(raw);
    } catch (err) {
      this.logger.warn('MessageRouter.route: parse error', { error: err.message, raw });
      return;
    }

    // Security: only respond to the configured operator chat
    if (this.allowedChatId && message.chatId !== this.allowedChatId) {
      this.logger.warn('MessageRouter: blocked message from unknown chatId', {
        chatId:    message.chatId,
        allowedId: this.allowedChatId,
      });
      await this.messageSender.send(
        message.chatId,
        '⛔ Unauthorized. This bot is private.'
      );
      return;
    }

    this.logger.debug('MessageRouter.route', { id: message.id, command: message.command, source: message.source });
    await this.handleUserMessage.execute(message);
  }
}
