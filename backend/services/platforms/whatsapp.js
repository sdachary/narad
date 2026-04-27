/**
 * WhatsApp Platform Adapter
 * Handles WhatsApp Business Cloud API webhooks
 */

import { PlatformAdapter, NormalizedMessage } from './base.js';

export class WhatsAppAdapter extends PlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.phoneNumberId = config.phoneNumberId || '';
    this.accessToken = config.accessToken || '';
    thisenabled = !!(this.phoneNumberId && this.accessToken);
  }

  async parseRequest(request, env) {
    const payload = await request.json();
    
    if (payload.entry) {
      for (const entry of payload.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.value?.messages) {
              for (const msg of change.value.messages) {
                return this._parseMessage(msg, change.value.metadata);
              }
            }
          }
        }
      }
    }
    
    return null;
  }

  _parseMessage(message, metadata) {
    const from = message.from;
    const msgType = message.type;
    
    const data = {
      text: '',
      userId: from,
      userName: from,  // WhatsApp doesn't provide names
      platform: 'whatsapp',
      timestamp: message.timestamp ? message.timestamp * 1000 : Date.now(),
      messageId: message.id,
      attachments: []
    };
    
    if (msgType === 'text') {
      data.text = message.text?.body || '';
    } else if (msgType === 'image') {
      data.attachments.push({
        type: 'image',
        mimeType: message.image?.mime_type,
        fileId: message.image?.id
      });
    } else if (msgType === 'audio') {
      data.attachments.push({
        type: 'audio',
        fileId: message.audio?.id
      });
    } else if (msgType === 'video') {
      data.attachments.push({
        type: 'video',
        fileId: message.video?.id
      });
    } else if (msgType === 'document') {
      data.attachments.push({
        type: 'document',
        fileId: message.document?.id,
        fileName: message.document?.filename
      });
    } else if (msgType === 'location') {
      data.text = `Location: ${message.location?.latitude}, ${message.location?.longitude}`;
    }
    
    return new NormalizedMessage(data);
  }

  async sendMessage(userId, text, options = {}) {
    if (!this.enabled) {
      return { ok: false, error: 'WhatsApp not configured' };
    }
    
    const body = {
      messaging_product: 'whatsapp',
      to: userId,
      type: 'text',
      text: { body: text }
    };
    
    const response = await fetch(`https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('[WhatsApp] Send error:', error);
      return { ok: false, error };
    }
    
    return { ok: true };
  }

  async sendTyping(userId) {
    if (!this.enabled) return;
    
    await fetch(`https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: userId,
        type: 'typing',
        typing: { type: 'typing' }
      })
    });
  }

  async sendTemplate(userId, templateName, components = []) {
    if (!this.enabled) {
      return { ok: false, error: 'WhatsApp not configured' };
    }
    
    const body = {
      messaging_product: 'whatsapp',
      to: userId,
      type: 'template',
      template: {
        name: templateName,
        components: components
      }
    };
    
    const response = await fetch(`https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify(body)
    });
    
    return { ok: response.ok };
  }

  async downloadMedia(mediaId) {
    if (!this.enabled) return null;
    
    const resp = await fetch(`https://graph.facebook.com/v18.0/${mediaId}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });
    
    if (!resp.ok) return null;
    
    const data = await resp.json();
    return data.url;
  }
}

/**
 * Create WhatsApp adapter from environment
 */
export function createWhatsAppAdapter(env) {
  return new WhatsAppAdapter({
    phoneNumberId: env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: env.WHATSAPP_ACCESS_TOKEN
  });
}