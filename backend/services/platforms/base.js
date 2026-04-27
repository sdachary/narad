/**
 * Base Platform Adapter
 * Abstract interface for all messaging platform integrations.
 * 
 * Each platform implements:
 * - parseRequest: Extract text, attachments, user from platform webhook
 * - sendMessage: Send response back to user
 * - sendTyping: Optional typing indicator
 */

export class PlatformAdapter {
  constructor(config = {}) {
    this.config = config;
    this.enabled = false;
  }

  /**
   * Parse incoming request from platform
   * @param {Request} request - Platform webhook request
   * @param {Object} env - Environment variables
   * @returns {Promise<NormalizedMessage>}
   */
  async parseRequest(request, env) {
    throw new Error('Not implemented');
  }

  /**
   * Send message to user
   * @param {string} userId - Platform user ID
   * @param {string} text - Message text
   * @param {Object} options - Optional send options
   * @returns {Promise<Object>}
   */
  async sendMessage(userId, text, options = {}) {
    throw new Error('Not implemented');
  }

  /**
   * Send typing indicator
   * @param {string} userId - Platform user ID
   * @returns {Promise<void>}
   */
  async sendTyping(userId) {
    // Optional - no-op by default
  }

  /**
   * Check if adapter is configured
   * @returns {boolean}
   */
  isConfigured() {
    return this.enabled;
  }

  /**
   * Get platform name
   * @returns {string}
   */
  getPlatformName() {
    return this.constructor.name.replace('Adapter', '').toLowerCase();
  }
}

/**
 * Normalized message format
 * All adapters convert to this format before passing to chat logic
 */
export class NormalizedMessage {
  constructor({
    text = '',
    userId = '',
    userName = '',
    platform = '',
    attachments = [],
    timestamp = Date.now(),
    messageId = '',
    raw = {}
  }) {
    this.text = text;
    this.userId = userId;
    this.userName = userName;
    this.platform = platform;
    this.attachments = attachments;
    this.timestamp = timestamp;
    this.messageId = messageId;
    this.raw = raw;
  }

  toChatFormat() {
    return {
      message: this.text,
      platform: this.platform,
      platform_user_id: this.userId,
      platform_user_name: this.userName,
      attachments: this.attachments,
      timestamp: this.timestamp,
      message_id: this.messageId,
      session_id: `${this.platform}_${this.userId}_${this.timestamp}`
    };
  }
}

/**
 * Platform message options
 */
export class MessageOptions {
  constructor({
    parseMode = 'plain',  // markdown, html, plain
    replyTo = null,
    attachments = [],
    keyboard = null,
    inlineKeyboard = null
  } = {}) {
    this.parseMode = parseMode;
    this.replyTo = replyTo;
    this.attachments = attachments;
    this.keyboard = keyboard;
    this.inlineKeyboard = inlineKeyboard;
  }
}

/**
 * Create a normalized message from any platform
 * @param {Object} data - Raw message data
 * @param {string} platform - Platform name
 * @returns {NormalizedMessage}
 */
export function createNormalizedMessage(data, platform) {
  return new NormalizedMessage({
    text: data.text || data.message || '',
    userId: data.userId || data.from?.id || data.sender || '',
    userName: data.userName || data.from?.first_name || data.sender_name || 'Unknown',
    platform: platform,
    attachments: data.attachments || [],
    timestamp: data.timestamp || Date.now(),
    messageId: data.messageId || data.message_id || '',
    raw: data
  });
}