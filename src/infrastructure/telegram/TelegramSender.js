/**
 * Infrastructure: TelegramSender
 *
 * Implements IMessageSender.
 * Sends messages back to Telegram via the Bot API.
 * Uses Markdown parse mode. Splits long messages automatically.
 */

import { IMessageSender } from '../../domain/interfaces/index.js';

const TELEGRAM_API_BASE = 'https://api.telegram.org';
const MAX_MESSAGE_LENGTH = 4096; // Telegram hard limit

export class TelegramSender extends IMessageSender {
  /**
   * @param {object} opts
   * @param {string} opts.botToken
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ botToken, logger }) {
    super();
    if (!botToken) throw new Error('TelegramSender: botToken is required');
    this.botToken = botToken;
    this.logger   = logger;
    this.baseUrl  = `${TELEGRAM_API_BASE}/bot${botToken}`;
  }

  /**
   * @param {string|number} chatId
   * @param {string} text
   * @returns {Promise<void>}
   */
  async send(chatId, text) {
    const parts = this._split(text);
    for (const part of parts) {
      await this._sendPart(chatId, part);
    }
  }

  async _sendPart(chatId, text) {
    const url  = `${this.baseUrl}/sendMessage`;
    const body = JSON.stringify({
      chat_id:    chatId,
      text,
      parse_mode: 'Markdown',
    });

    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // If Markdown parse fails, retry as plain text
        if (err.error_code === 400 && err.description?.includes('parse')) {
          this.logger.warn('TelegramSender: Markdown parse failed, retrying as plain text', { chatId });
          await this._sendPlain(chatId, text);
          return;
        }
        this.logger.error('TelegramSender: sendMessage failed', { chatId, status: res.status, error: err });
      }
    } catch (err) {
      this.logger.error('TelegramSender: fetch failed', { chatId, error: err.message });
    }
  }

  async _sendPlain(chatId, text) {
    const url  = `${this.baseUrl}/sendMessage`;
    const body = JSON.stringify({ chat_id: chatId, text });
    try {
      await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
    } catch (err) {
      this.logger.error('TelegramSender._sendPlain: failed', { chatId, error: err.message });
    }
  }

  /**
   * Split text into chunks that fit within Telegram's message size limit.
   * Tries to split on newlines to avoid breaking mid-sentence.
   * @param {string} text
   * @returns {string[]}
   */
  _split(text) {
    if (text.length <= MAX_MESSAGE_LENGTH) return [text];

    const parts  = [];
    let remaining = text;

    while (remaining.length > 0) {
      if (remaining.length <= MAX_MESSAGE_LENGTH) {
        parts.push(remaining);
        break;
      }

      // Find last newline within limit
      let cutAt = MAX_MESSAGE_LENGTH;
      const lastNewline = remaining.lastIndexOf('\n', MAX_MESSAGE_LENGTH);
      if (lastNewline > MAX_MESSAGE_LENGTH * 0.5) {
        cutAt = lastNewline;
      }

      parts.push(remaining.slice(0, cutAt));
      remaining = remaining.slice(cutAt).trimStart();
    }

    return parts;
  }
}
