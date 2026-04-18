/**
 * Message Router
 * Routes incoming messages from all platforms to the normalized handler
 */

import { createTelegramAdapter } from './telegram.js';
import { createWhatsAppAdapter } from './whatsapp.js';
import { createSlackAdapter } from './slack.js';
import { createTeamsAdapter } from './teams.js';
import { NormalizedMessage } from './base.js';

const PLATFORM_ROUTES = {
  '/webhooks/telegram': 'telegram',
  '/webhooks/whatsapp': 'whatsapp',
  '/webhooks/slack': 'slack',
  '/webhooks/teams': 'teams'
};

let adapters = {};
let platformCache = null;

/**
 * Initialize all platform adapters
 */
export function initPlatforms(env) {
  if (platformCache) return platformCache;
  
  adapters = {
    telegram: createTelegramAdapter(env),
    whatsapp: createWhatsAppAdapter(env),
    slack: createSlackAdapter(env),
    teams: createTeamsAdapter(env)
  };
  
  platformCache = adapters;
  return adapters;
}

/**
 * Get adapter for platform
 */
export function getAdapter(platform) {
  return adapters[platform?.toLowerCase()] || null;
}

/**
 * Get adapter based on request path
 */
export function getAdapterForPath(pathname) {
  if (pathname === '/telegram' || pathname === '/webhooks/telegram') {
    return { adapter: adapters.telegram, platform: 'telegram' };
  }
  if (pathname === '/whatsapp' || pathname === '/webhooks/whatsapp') {
    return { adapter: adapters.whatsapp, platform: 'whatsapp' };
  }
  if (pathname === '/slack' || pathname === '/webhooks/slack') {
    return { adapter: adapters.slack, platform: 'slack' };
  }
  if (pathname === '/teams' || pathname === '/webhooks/teams') {
    return { adapter: adapters.teams, platform: 'teams' };
  }
  return null;
}

/**
 * Get all enabled platforms
 */
export function getEnabledPlatforms() {
  if (!adapters) return [];
  
  return Object.entries(adapters)
    .filter(([_, adapter]) => adapter?.isConfigured())
    .map(([platform]) => platform);
}

/**
 * Handle incoming webhook request
 */
export async function handlePlatformWebhook(request, env) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  const { adapter, platform } = getAdapterForPath(pathname) || {};
  
  if (!adapter) {
    return new Response('Platform not found', { status: 404 });
  }
  
  if (!adapter.isConfigured()) {
    console.log(`[Platforms] ${platform} not configured, skipping`);
    return new Response('OK', { status: 200 });
  }
  
  const normalized = await adapter.parseRequest(request, env);
  
  if (!normalized) {
    return new Response('OK', { status: 200 });
  }
  
  const chatData = normalized.toChatFormat();
  
  try {
    const response = await sendToChatService(chatData, env);
    
    if (response) {
      await adapter.sendMessage(normalized.userId, response);
    }
  } catch (err) {
    console.error('[Platforms] Error handling message:', err);
  }
  
  return new Response('OK', { status: 200 });
}

/**
 * Send normalized message to chat service
 */
async function sendToChatService(chatData, env) {
  const naradUrl = env.NARAD_API_URL || 'https://narad-7hc.pages.dev';
  const apiToken = env.NARAD_API_TOKEN;
  
  const headers = {
    'Content-Type': 'application/json',
    'Origin': naradUrl
  };
  
  if (apiToken) {
    headers['Authorization'] = `Bearer ${apiToken}`;
  }
  
  headers['x-csrf-bypass'] = 'platform-adapter';
  
  const response = await fetch(`${naradUrl}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify(chatData)
  });
  
  if (!response.ok) {
    console.error('[Platforms] Chat API error:', response.status);
    return null;
  }
  
  const data = await response.json();
  return data.reply || data.message || null;
}

/**
 * Send message to a specific platform user
 */
export async function sendToPlatformUser(platform, userId, message, env) {
  const adapter = adapters[platform?.toLowerCase()];
  
  if (!adapter || !adapter.isConfigured()) {
    return { ok: false, error: 'Platform not configured' };
  }
  
  return await adapter.sendMessage(userId, message);
}

/**
 * Get platform status summary
 */
export function getPlatformStatus() {
  const status = {};
  
  for (const [platform, adapter] of Object.entries(adapters)) {
    status[platform] = {
      enabled: adapter?.isConfigured() || false,
      platform: platform
    };
  }
  
  return status;
}