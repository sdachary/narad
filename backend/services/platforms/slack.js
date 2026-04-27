/**
 * Slack Platform Adapter
 * Handles Slack events and slash commands
 */

import { PlatformAdapter, NormalizedMessage } from './base.js';

export class SlackAdapter extends PlatformAdapter {
  constructor(config = {}) {
    super(config);
    this.botToken = config.botToken || '';
    this.signingSecret = config.signingSecret || '';
    this.appId = config.appId || '';
    this.enabled = !!(this.botToken && this.signingSecret);
  }

  async parseRequest(request, env) {
    const payload = await request.formData();
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      return this._parseFormPayload(payload);
    }
    
    if (contentType.includes('application/json')) {
      const body = await request.json();
      return this._parseJsonPayload(body);
    }
    
    return null;
  }

  _parseFormPayload(formData) {
    const payload = formData.get('payload');
    if (payload) {
      try {
        const parsed = JSON.parse(payload);
        return this._parseInteractivePayload(parsed);
      } catch (e) {}
    }
    
    const command = formData.get('command');
    const text = formData.get('text');
    const userId = formData.get('user_id');
    const channelId = formData.get('channel_id');
    
    if (command) {
      return new NormalizedMessage({
        text: text || '',
        userId: userId,
        platform: 'slack',
        attachments: [],
        timestamp: Date.now(),
        messageId: `${channelId}:${Date.now()}`,
        raw: { command, text, userId, channelId }
      });
    }
    
    return null;
  }

  _parseJsonPayload(body) {
    if (body.type === 'url_verify') {
      return new NormalizedMessage({
        text: body.challenge || '',
        userId: '',
        platform: 'slack',
        raw: body
      });
    }
    
    if (body.event) {
      const event = body.event;
      return new NormalizedMessage({
        text: event.text || '',
        userId: event.user,
        userName: event.username || '',
        platform: 'slack',
        attachments: event.files || [],
        timestamp: (event.ts || Date.now() / 1000) * 1000,
        messageId: event.ts,
        raw: event
      });
    }
    
    if (body.command) {
      return new NormalizedMessage({
        text: body.text || '',
        userId: body.user_id,
        platform: 'slack',
        timestamp: Date.now(),
        raw: body
      });
    }
    
    return null;
  }

  _parseInteractivePayload(payload) {
    if (payload.type === 'block_actions') {
      return new NormalizedMessage({
        text: payload.actions?.[0]?.value || payload.actions?.[0]?.text?.text || '',
        userId: payload.user?.id || '',
        platform: 'slack',
        timestamp: (payload.message?.ts || Date.now() / 1000) * 1000,
        raw: payload
      });
    }
    
    return null;
  }

  async sendMessage(userId, text, options = {}) {
    if (!this.enabled) {
      return { ok: false, error: 'Slack not configured' };
    }
    
    const body = {
      channel: userId,
      text: text,
      ...(options.threadTs && { thread_ts: options.threadTs })
    };
    
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.botToken}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('[Slack] Send error:', error);
      return { ok: false, error };
    }
    
    return { ok: true };
  }

  async sendTyping(userId) {
    // Slack doesn't have a direct typing indicator API
    // Could use chat.postEphemeral with "is_typing" 
  }

  async respondToInteraction(responseUrl, message) {
    if (!responseUrl) return;
    
    await fetch(responseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }

  async listChannels() {
    if (!this.enabled) return [];
    
    const response = await fetch('https://slack.com/api/conversations.list', {
      headers: {
        'Authorization': `Bearer ${this.botToken}`
      }
    });
    
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.channels || [];
  }
}

/**
 * Create Slack adapter from environment
 */
export function createSlackAdapter(env) {
  return new SlackAdapter({
    botToken: env.SLACK_BOT_TOKEN,
    signingSecret: env.SLACK_SIGNING_SECRET,
    appId: env.SLACK_APP_ID
  });
}