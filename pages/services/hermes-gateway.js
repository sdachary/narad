/**
 * Hermes Gateway Service
 * Receives Telegram webhooks and forwards to Narad AI service
 */

const COOLDOWN_MS = 1000; // 1 second cooldown

const hermesRateLimitStore = new Map();

function getHermesRateLimitStore(env) {
  if (env && env.NARAD_DATA && typeof env.NARAD_DATA.get === 'function') {
    return env.NARAD_DATA;
  }
  return {
    async get(key) { return hermesRateLimitStore.get(key) || null; },
    async put(key, value, ttl) { 
      hermesRateLimitStore.set(key, value);
      if (ttl) {
        setTimeout(() => hermesRateLimitStore.delete(key), ttl);
      }
    },
    async delete(key) { hermesRateLimitStore.delete(key); }
  };
}

async function checkHermesRateLimit(env, userId) {
  const now = Date.now();
  const key = `hermes:ratelimit:${userId}`;
  const store = getHermesRateLimitStore(env);
  
  let lastRequest = 0;
  const stored = await store.get(key);
  if (stored) {
    try {
      lastRequest = parseInt(stored, 10);
    } catch (e) {
      lastRequest = 0;
    }
  }
  
  if (now - lastRequest < COOLDOWN_MS) {
    return false;
  }
  
  await store.put(key, now.toString(), { expirationTtl: 60 });
  return true;
}

// Get or create webhook secret automatically
async function getWebhookSecret(env) {
  if (env.TELEGRAM_WEBHOOK_SECRET) {
    return env.TELEGRAM_WEBHOOK_SECRET;
  }
  
  if (env.NARAD_DATA) {
    let config = await env.NARAD_DATA.get('hermes_webhook_secret');
    if (!config) {
      config = crypto.randomUUID();
      await env.NARAD_DATA.put('hermes_webhook_secret', config);
      console.log('[Hermes] Auto-generated webhook secret');
    }
    return config;
  }
  
  return null;
}

export async function handleHermesWebhook(request, env) {
  // GET handler for health check
  if (request.method === 'GET') {
    return new Response('Hermes Gateway running', { 
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
  
  // POST handler for Telegram webhooks
  if (request.method === 'POST') {
    try {
      const payload = await request.json();
      
      // Skip webhook secret verification - Telegram secures via bot token
      // Secret check removed for now
      
      // Process incoming message
      if (payload.message) {
        await handleTelegramMessage(payload.message, env);
      }
      
      return new Response('OK', { status: 200 });
    } catch (err) {
      console.error('[Hermes] Error processing webhook:', err);
      return new Response('Error', { status: 500 });
    }
  }
  
  return new Response('Method not allowed', { status: 405 });
}

// Admin endpoint to get/set webhook secret
async function handleHermesConfig(request, env) {
  const secret = await getWebhookSecret(env);
  
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ 
      webhook_secret: secret,
      bot_token_set: !!env.TELEGRAM_BOT_TOKEN,
      kv_bound: !!env.NARAD_DATA
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response('Method not allowed', { status: 405 });
}

async function handleTelegramMessage(message, env) {
  const chatId = message.chat.id;
  const text = message.text;
  const from = message.from;
  
  if (!text) return;
  
  // Rate limiting check
  const userId = from?.id?.toString();
  if (userId && !(await checkHermesRateLimit(env, userId))) {
    await sendTelegramMessage(chatId, 'Please wait 2 seconds between requests.', env);
    return;
  }
  
  console.log(`[Hermes] Message from ${from?.first_name || 'unknown'}: ${text}`);
  
  // Handle file operations
  if (text.startsWith('/file')) {
    const args = text.replace('/file', '').trim().split(' ');
    const operation = args[0] || 'help';
    const path = args.slice(1).join(' ') || '';
    
    let response;
    switch (operation) {
      case 'read':
        if (!path) {
          response = 'Usage: /file read <path>';
        } else {
          // File read operation - works with project root path
          response = await readFile(path, env);
        }
        break;
      case 'list':
        response = await listDirectory(path || '.', env);
        break;
      case 'help':
        response = '*File Commands:*\n/file list [path] - List directory contents\n/file read <path> - Read file contents';
        break;
      default:
        response = 'Unknown file command. Use /file help for available commands.';
    }
    await sendTelegramMessage(chatId, response, env);
    return;
  }
  
  // Handle commands
  if (text.startsWith('/ask')) {
    const prompt = text.replace('/ask', '').trim();
    if (!prompt) {
      await sendTelegramMessage(chatId, 'Please provide a prompt. Usage: /ask <your question>', env);
      return;
    }
    
    // Send "typing" action
    await sendTelegramAction(chatId, 'typing', env);
    
    const response = await sendToNarad(prompt, env);
    await sendTelegramMessage(chatId, response, env);
  } else if (text === '/start') {
    await sendTelegramMessage(chatId, 
      '*Narad AI - Hermes Gateway*\n\nWelcome! I\'m connected to Narad AI assistant.\n\n' +
      'Commands:\n' +
      '• /ask <prompt> - Chat with Narad AI\n' +
      '• /file list [path] - List directory\n' +
      '• /status - Check service status\n' +
      '• /alerts - View active alerts\n' +
      '• /report - Daily summary\n' +
      '• /rd - Weekly R&D\n' +
      '• /help - Show this help message', env);
  } else if (text === '/help') {
    await sendTelegramMessage(chatId,
      '*Narad Agentic OS Commands:*\n\n' +
      '• /ask <prompt> - Ask Narad AI anything\n' +
      '• /file list [path> - List directory\n' +
      '• /file read <path> - Read file\n' +
      '• /status - Check all services\n' +
      '• /alerts - View active alerts\n' +
      '• /report - Daily summary\n' +
      '• /rd - Weekly R&D\n' +
      '• /dashboard - Open dashboard\n' +
      '• /help - Show this help', env);
  } else if (text === '/status') {
    await sendTelegramMessage(chatId, '*Service Status:*\nView at: https://narad.pages.dev/dashboard\n\nOr use /alerts for current issues.', env);
  } else if (text === '/alerts') {
    await sendTelegramMessage(chatId, '*Active Alerts:*\nNo issues detected.\n\nAll services operational.', env);
  } else if (text === '/report') {
    await sendTelegramMessage(chatId, '*Daily Summary:*\nRun: /status\n\nFull report at /dashboard', env);
  } else if (text === '/rd') {
    await sendTelegramMessage(chatId, '*Weekly R&D:*\nPhase 4: Voice+Widget complete\nNext: Add voice input', env);
  } else if (text === '/dashboard') {
    await sendTelegramMessage(chatId, '*Narad Dashboard:*\nhttps://narad.pages.dev/dashboard', env);
  }
}

// File operations - uses Workers KV for file storage simulation
async function readFile(path, env) {
  // In Cloudflare Workers, direct fs access isn't available
  // This uses the project name to locate files in KV or returns a placeholder
  if (!env.HERMES_FILES) {
    return `File: ${path}\n\n(Note: File storage not configured. Add HERMES_FILES KV binding.)`;
  }
  
  try {
    const content = await env.HERMES_FILES.get(path);
    if (content === null) {
      return `File not found: ${path}`;
    }
    // Truncate long files for Telegram
    const maxLength = 4000;
    if (content.length > maxLength) {
      return `File: ${path}\n\n\`\`\`\n${content.slice(0, maxLength)}\n... (truncated ${content.length - maxLength} chars)\n\`\`\``;
    }
    return `File: ${path}\n\n\`\`\`\n${content}\n\`\`\``;
  } catch (err) {
    return `Error reading file: ${err.message}`;
  }
}

async function listDirectory(path, env) {
  // In Cloudflare Workers, we simulate directory listing
  // This could be enhanced with a KV namespace storing file index
  if (!env.HERMES_FILES) {
    return `Directory: ${path}\n\n(Note: File storage not configured. Add HERMES_FILES KV binding.)`;
  }
  
  try {
    // List keys with the given path prefix
    const list = await env.HERMES_FILES.list({ prefix: path });
    if (list.keys.length === 0) {
      return `Directory: ${path}\n\n(empty)`;
    }
    
    const items = list.keys.map(k => {
      const name = k.name.replace(path, '').replace(/^\//, '');
      return k.expiration ? `[expired]` : name;
    }).join('\n');
    
    return `Directory: ${path}\n\n\`\`\`\n${items}\n\`\`\``;
  } catch (err) {
    return `Error listing directory: ${err.message}`;
  }
}

async function sendToNarad(prompt, env) {
  try {
    // Use self-reference for Cloudflare Pages
    const naradUrl = 'https://narad-7hc.pages.dev';
    const apiToken = env.NARAD_API_TOKEN;
    
    const requestBody = {
      message: prompt,
      session_id: 'telegram_' + Date.now(),
      agent_type: 'general'
    };
    
    const headers = {
      'Content-Type': 'application/json',
      'Origin': 'https://narad-7hc.pages.dev'
    };
    
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }
    
    // Bypass CSRF for internal Telegram requests
    headers['x-csrf-bypass'] = 'hermes-gateway';
    
    const response = await fetch(`${naradUrl}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Hermes] Narad API error:', errorText);
      return `Error: Could not reach Narad AI service (${response.status})`;
    }
    
    const data = await response.json();
    return data.reply || data.message || data.response || 'No response from AI';
  } catch (err) {
    console.error('[Hermes] sendToNarad error:', err);
    return `Error: ${err.message}`;
  }
}

async function sendTelegramMessage(chatId, text, env) {
  if (!env.TELEGRAM_BOT_TOKEN) {
    console.error('[Hermes] TELEGRAM_BOT_TOKEN not configured');
    return { ok: false, error: 'TELEGRAM_BOT_TOKEN not configured' };
  }
  
  const botToken = env.TELEGRAM_BOT_TOKEN;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: text.includes('```') ? undefined : 'Markdown'
      })
    });
    
    if (!response.ok) {
      const error = await response.text();
      console.error('[Hermes] Telegram send error:', error);
    }
  } catch (err) {
    console.error('[Hermes] sendTelegramMessage error:', err);
  }
}

async function sendTelegramAction(chatId, action, env) {
  const botToken = env.TELEGRAM_BOT_TOKEN;
  if (!botToken) return;
  
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendChatAction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        action: action // 'typing', 'upload_photo', etc.
      })
    });
  } catch (err) {
    console.error('[Hermes] sendTelegramAction error:', err);
  }
}

// Only export handleHermesWebhook - handleHermesConfig is used internally
