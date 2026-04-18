/**
 * Microsoft Teams Platform Adapter
 * Handles Teams adaptive cards and bot framework webhooks
 */

import { PlatformAdapter, NormalizedMessage } from './base.js';

export class TeamsAdapter extends PlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.botId = config.botId || '';
    this.botPassword = config.botPassword || '';
    this.tenantId = config.tenantId || '';
    this.enabled = !!(this.botId && this.botPassword);
  }

  async parseRequest(request, env) {
    const payload = await request.json();
    
    if (payload.type === 'message') {
      return this._parseMessage(payload);
    }
    
    if (payload.type === 'invoke') {
      return this._parseInvoke(payload);
    }
    
    if (payload.channelData?.tenant?.id) {
      return this._parseActivity(payload);
    }
    
    return null;
  }

  _parseMessage(activity) {
    const from = activity.from || {};
    const attachments = activity.attachments || [];
    const channelData = activity.channelData || {};
    
    let text = activity.text || '';
    const textFragments = activity.textFragments || [];
    if (textFragments.length > 0) {
      text = textFragments.join('');
    }
    
    let normalizedAttachments = [];
    for (const att of attachments) {
      if (att.contentType === 'application/vnd.microsoft.card.adaptive') {
        normalizedAttachments.push({
          type: 'adaptiveCard',
          content: att.content
        });
      } else if (att.content?.attachmentData) {
        normalizedAttachments.push({
          type: 'file',
          fileId: att.content.attachmentData.uri,
          name: att.name
        });
      }
    }
    
    return new NormalizedMessage({
      text: text,
      userId: from.id || '',
      userName: from.name || from.aadObjectId || 'Unknown',
      platform: 'teams',
      attachments: normalizedAttachments,
      timestamp: Date.parse(activity.timestamp) || Date.now(),
      messageId: activity.id || '',
      raw: activity
    });
  }

  _parseInvoke(payload) {
    const name = payload.name;
    const value = payload.value || {};
    
    let text = '';
    if (name === 'submit') {
      text = value.data?.text || JSON.stringify(value.data || '');
    } else if (name === 'signin/verifyState') {
      text = value.state || '';
    }
    
    return new NormalizedMessage({
      text: text,
      userId: payload.from?.id || '',
      platform: 'teams',
      timestamp: Date.now(),
      raw: payload
    });
  }

  _parseActivity(activity) {
    const from = activity.from || {};
    const channelData = activity.channelData || {};
    
    return new NormalizedMessage({
      text: activity.text || '',
      userId: from.id || from.aadObjectId || '',
      userName: from.name || 'Unknown',
      platform: 'teams',
      attachments: activity.attachments || [],
      timestamp: Date.parse(activity.timestamp) || Date.now(),
      messageId: activity.id || '',
      raw: activity
    });
  }

  async sendMessage(userId, text, options = {}) {
    if (!this.enabled) {
      return { ok: false, error: 'Teams bot not configured' };
    }
    
    const activity = {
      type: 'message',
      from: { id: this.botId },
      to: { id: userId },
      text: text,
      ...(options.threadTs && { replyToId: options.threadTs })
    };
    
    const response = await fetch(`https://smba.trafficmanager.net/v3/bots/${this.botId}/conversations/${userId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.botPassword}`
      },
      body: JSON.stringify(activity)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('[Teams] Send error:', error);
      return { ok: false, error };
    }
    
    return { ok: true };
  }

  async sendTyping(userId) {
    if (!this.enabled) return;
    
    await fetch(`https://smba.trafficmanager.net/v3/bots/${this.botId}/conversations/${userId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.botPassword}`
      },
      body: JSON.stringify({
        type: 'typing',
        from: { id: this.botId },
        to: { id: userId }
      })
    });
  }

  async sendAdaptiveCard(userId, card, options = {}) {
    if (!this.enabled) {
      return { ok: false, error: 'Teams bot not configured' };
    }
    
    const attachment = {
      contentType: 'application/vnd.microsoft.card.adaptive',
      content: card
    };
    
    const activity = {
      type: 'message',
      from: { id: this.botId },
      to: { id: userId },
      attachments: [attachment]
    };
    
    const response = await fetch(`https://smba.trafficmanager.net/v3/bots/${this.botId}/conversations/${userId}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.botPassword}`
      },
      body: JSON.stringify(activity)
    });
    
    return { ok: response.ok };
  }

  async createConversation(userId) {
    if (!this.enabled) return null;
    
    const response = await fetch(`https://smba.trafficmanager.net/v3/bots/${this.botId}/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.botPassword}`
      },
      body: JSON.stringify({
        bot: { id: this.botId },
        members: [{ id: userId }],
        tenantId: this.tenantId
      })
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.id;
  }
}

/**
 * Simple adaptive card template
 */
export function createAdaptiveCard(title, subtitle, text, buttons = []) {
  return {
    $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
    type: 'AdaptiveCard',
    version: '1.4',
    body: [
      {
        type: 'TextBlock',
        weight: 'bolder',
        size: 'medium',
        text: title
      },
      {
        type: 'TextBlock',
        text: subtitle,
        isSubtle: true,
        wrap: true
      },
      {
        type: 'TextBlock',
        text: text,
        wrap: true
      }
    ],
    actions: buttons.map(btn => ({
      type: 'Action.Execute',
      title: btn.title,
      data: btn.data || { action: btn.title }
    }))
  };
}

/**
 * Create Teams adapter from environment
 */
export function createTeamsAdapter(env) {
  return new TeamsAdapter({
    botId: env.TEAMS_BOT_ID,
    botPassword: env.TEAMS_BOT_PASSWORD,
    tenantId: env.TEAMS_TENANT_ID
  });
}