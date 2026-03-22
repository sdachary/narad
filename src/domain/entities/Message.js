/**
 * Domain Entity: Message
 * Represents an inbound user message — platform-agnostic.
 * NO Telegram types here. NO infrastructure concerns here.
 */

export class Message {
  /**
   * @param {object} params
   * @param {string} params.id         - Unique message ID
   * @param {string} params.userId     - Sender's user ID (platform-specific string)
   * @param {string} params.chatId     - Chat/conversation ID
   * @param {string} params.text       - Raw message text
   * @param {string} params.command    - Parsed command (e.g. 'ask', 'status') or null
   * @param {string} params.args       - Everything after the command, or full text if no command
   * @param {Date}   params.receivedAt - When the message arrived
   * @param {string} params.source     - 'telegram' | 'web' | 'cron'
   */
  constructor({ id, userId, chatId, text, command, args, receivedAt, source }) {
    if (!id)       throw new Error('Message.id is required');
    if (!userId)   throw new Error('Message.userId is required');
    if (!chatId)   throw new Error('Message.chatId is required');
    if (!text && text !== '') throw new Error('Message.text is required');

    this.id         = id;
    this.userId     = userId;
    this.chatId     = chatId;
    this.text       = text;
    this.command    = command || null;
    this.args       = args || '';
    this.receivedAt = receivedAt instanceof Date ? receivedAt : new Date(receivedAt);
    this.source     = source || 'telegram';
  }

  isCommand() {
    return this.command !== null;
  }

  hasArgs() {
    return this.args.trim().length > 0;
  }

  toString() {
    return `Message[${this.source}:${this.command || 'text'}] from ${this.userId}: "${this.text.slice(0, 60)}"`;
  }
}
