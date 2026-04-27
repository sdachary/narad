/**
 * Telegram Platform Adapter
 * Handles Telegram Bot API webhooks
 */

import { PlatformAdapter, NormalizedMessage, createNormalizedMessage } from './base.js';

const COOLDOWN_MS = 1000;

export class TelegramAdapter extends PlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.botToken = config.botToken || '';
    this.enabled = !!this.botToken;
    this.rateLimitStore = new Map();
  }

  async parseRequest(request, env) {
    const payload = await request.json();
    
    if (payload.message) {
      const msg = payload.message;
      return new NormalizedMessage({
        text: msg.text || '',
        userId: msg.from?.id?.toString() || '',
        userName: msg.from?.first_name || msg.from?.username || 'Unknown',
        platform: 'telegram',
        attachments: this._parseAttachments(msg),
        timestamp: (msg.date || Date.now() / 1000) * 1000,
        messageId: msg.message_id?.toString() || '',
        raw: msg
      });
    }
    
    if (payload.callback_query) {
      const cb = payload.callback_query;
      return new NormalizedMessage({
        text: cb.data || '',
        userId: cb.from?.id?.toString() || '',
        userName: cb.from?.first_name || 'Unknown',
        platform: 'telegram',
        timestamp: (cb.date || Date.now() / 1000) * 1000,
        messageId: cb.id?.toString() || '',
        raw: cb
      });
    }
    
    return null;
  }

  _parseAttachments(message) {
    const attachments = [];
    
    if (message.photo) {
      const photo = message.photo[message.photo.length - 1];
      attachments.push({
        type: 'photo',
        fileId: photo.file_id,
        width: photo.width,
        height: photo.height
      });
    }
    
    if (message.document) {
      attachments.push({
        type: 'document',
        fileId: message.document.file_id,
        fileName: message.document.file_name,
        mimeType: message.document.mime_type
      });
    }
    
    if (message.voice) {
      attachments.push({
        type: 'voice',
        fileId: message.voice.file_id,
        duration: message.voice.duration
      });
    }
    
    if (message.audio) {
      attachments.push({
        type: 'audio',
        fileId: message.audio.file_id,
        duration: message.audio.duration
      });
    }
    
    if (message.video) {
      attachments.push({
        type: 'video',
        fileId: message.video.file_id,
        duration: message.video.duration
      });
    }
    
    return attachments;
  }

  async sendMessage(userId, text, options = {}) {
    if (!this.enabled) {
      return { ok: false, error: 'Bot token not configured' };
    }
    
    const parseMode = options.parseMode === 'markdown' ? 'Markdown' : 'Markdown';
    const body = {
      chat_id: userId,
      text: text,
      parse_mode: text.includes('```') ? undefined : parseMode
    };
    
    if (options.replyTo) {
      body.reply_to_message_id = options.replyTo;
    }
    
    const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('[Telegram] Send error:', error);
      return { ok: false, error };
    }
    
    return { ok: true };
  }

  async sendTyping(userId) {
    if (!this.enabled) return;
    
    await fetch(`https://api.telegram.org/bot${this.botToken}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: userId,
        action: 'typing'
      })
    });
  }

  async sendChatAction(userId, action) {
    if (!this.enabled) return;
    
    await fetch(`https://api.telegram.org/bot${this.botToken}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: userId,
        action: action
      })
    });
  }

  async checkRateLimit(userId) {
    const now = Date.now();
    const key = `telegram:${userId}`;
    const last = this.rateLimitStore.get(key) || 0;
    
    if (now - last < COOLDOWN_MS) {
      return false;
    }
    
    this.rateLimitStore.set(key, now);
    return true;
  }
}

/**
 * Create Telegram adapter from environment
 */
export function createTelegramAdapter(env) {
  return new TelegramAdapter({
    botToken: env.TELEGRAM_BOT_TOKEN
  });
}