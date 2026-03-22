/**
 * Domain Service: MessageParser
 *
 * Parses raw Telegram update text into structured Message entities.
 * Pure domain logic — no Telegram SDK types, no side effects.
 */

import { Message } from '../entities/Message.js';
import { randomUUID } from 'crypto';

// All commands Narad understands
export const KNOWN_COMMANDS = new Set([
  'start',
  'help',
  'ask',
  'status',
  'idea',
  'recall',
  'research',
  'draft',
  'nisha',
  'digest',
  'experiment',
]);

export class MessageParser {
  /**
   * Parse a raw incoming message object (from any transport) into a Message entity.
   *
   * @param {object} raw
   * @param {string|number} raw.messageId  - Transport-level message ID
   * @param {string|number} raw.userId     - Sender ID
   * @param {string|number} raw.chatId     - Chat/channel ID
   * @param {string}        raw.text       - Full message text
   * @param {Date|string}   raw.date       - Message timestamp
   * @param {string}        raw.source     - 'telegram'|'web'|'cron'
   * @returns {Message}
   */
  parse(raw) {
    const text    = (raw.text || '').trim();
    const source  = raw.source || 'telegram';
    const id      = String(raw.messageId || randomUUID());
    const userId  = String(raw.userId);
    const chatId  = String(raw.chatId);
    const date    = raw.date ? new Date(raw.date) : new Date();

    const { command, args } = this._extractCommand(text, source);

    return new Message({
      id,
      userId,
      chatId,
      text,
      command,
      args,
      receivedAt: date,
      source,
    });
  }

  /**
   * Extract command and args from text.
   * Handles: /command args, /command@botname args
   *
   * @param {string} text
   * @param {string} source
   * @returns {{ command: string|null, args: string }}
   */
  _extractCommand(text, source) {
    // Cron messages always have a synthetic command
    if (source === 'cron') {
      return { command: 'cron', args: text };
    }

    if (!text.startsWith('/')) {
      return { command: null, args: text };
    }

    // Strip leading slash, handle @botname suffix
    const withoutSlash   = text.slice(1);
    const [rawCmd, ...rest] = withoutSlash.split(/\s+/);
    const cmdPart        = rawCmd.split('@')[0].toLowerCase();
    const args           = rest.join(' ');

    if (KNOWN_COMMANDS.has(cmdPart)) {
      return { command: cmdPart, args };
    }

    // Unknown command — treat as plain text so user gets a helpful reply
    return { command: null, args: text };
  }
}
