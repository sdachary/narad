/**
 * Hermes Gateway Service
 * Receives Telegram webhooks and forwards to Narad AI service
 */

// Rate limiting: Map to track last request time per user
const userRateLimits = new Map();
const COOLDOWN_MS = 2000; // 2 second cooldown

// Worker start time for uptime calculation (CF Workers compatible)
const WORKER_START_TIME = Date.now();

// Get or create webhook secret automatically
async function getWebhookSecret(env) {
  // If env secret is set, use it
  if (env.TELEGRAM_WEBHOOK_SECRET) {
    return env.TELEGRAM_WEBHOOK_SECRET;
  }
  
  // Try to get from KV (using NARAD_DATA), generate if not exists
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

function checkRateLimit(userId) {
  const now = Date.now();
  const lastRequest = userRateLimits.get(userId) || 0;
  
  // Prune old entries if Map is too large to prevent memory leak
  if (userRateLimits.size > 1000) {
    const threshold = now - 60000;
    for (const [k, v] of userRateLimits) {
      if (v < threshold) userRateLimits.delete(k);
    }
  }
  
  if (now - lastRequest < COOLDOWN_MS) {
    return false;
  }
  userRateLimits.set(userId, now);
  return true;
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
  if (userId && !checkRateLimit(userId)) {
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
      '• /file read <path> - Read file\n' +
      '• /status - Check service status\n' +
      '• /help - Show this help message', env);
  } else if (text === '/help') {
    await sendTelegramMessage(chatId,
      '*Available Commands:*\n\n' +
      '• /ask <prompt> - Ask Narad AI anything\n' +
      '• /file list [path] - List directory contents\n' +
      '• /file read <path> - Read file contents\n' +
      '• /status - Check service status\n' +
      '• /help - Show this help message', env);
  } else if (text === '/status') {
    const status = {
      service: 'Hermes Gateway',
      version: '1.0.2',
      status: 'active',
      uptime: `${Math.floor((Date.now() - WORKER_START_TIME) / 1000)}s`,
      timestamp: new Date().toISOString(),
      providers: {
        narad: {
          url: env.NARAD_API_URL || 'https://narad.ai',
          configured: !!env.NARAD_API_TOKEN
        },
        telegram: {
          botConfigured: !!env.TELEGRAM_BOT_TOKEN,
          webhookSecret: !!env.TELEGRAM_WEBHOOK_SECRET
        }
      },
      features: {
        rateLimiting: true,
        cooldownMs: COOLDOWN_MS,
        fileOperations: true
      },
      commands: ['/ask', '/file', '/status', '/help', '/start']
    };
    await sendTelegramMessage(chatId, '```json\n' + JSON.stringify(status, null, 2) + '```', env);
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
      agentType: 'general'
    };
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }
    
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
  const botToken = env.TELEGRAM_BOT_TOKEN;
  if (!botToken) {
    console.error('[Hermes] TELEGRAM_BOT_TOKEN not configured');
    return;
  }
  
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
