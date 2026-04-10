/**
 * Hermes Gateway Service
 * Receives Telegram webhooks and forwards to Narad AI service
 */

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
      
      // Verify webhook secret
      const secret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
      if (secret !== env.TELEGRAM_WEBHOOK_SECRET) {
        console.warn('[Hermes] Unauthorized webhook attempt');
        return new Response('Unauthorized', { status: 401 });
      }
      
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

async function handleTelegramMessage(message, env) {
  const chatId = message.chat.id;
  const text = message.text;
  const from = message.from;
  
  if (!text) return;
  
  console.log(`[Hermes] Message from ${from?.first_name || 'unknown'}: ${text}`);
  
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
      '*Narad AI - Hermes Gateway*\n\nWelcome! I\'m connected toNarad AI assistant.\n\n' +
      'Commands:\n' +
      '• /ask <prompt> - Chat with Narad AI\n' +
      '• /status - Check service status\n' +
      '• /help - Show this help message', env);
  } else if (text === '/help') {
    await sendTelegramMessage(chatId,
      '*Available Commands:*\n\n' +
      '• /ask <prompt> - Ask Narad AI anything\n' +
      '• /status - Check service status\n' +
      '• /help - Show this help message', env);
  } else if (text === '/status') {
    const status = {
      service: 'Hermes Gateway',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString()
    };
    await sendTelegramMessage(chatId, '```json\n' + JSON.stringify(status, null, 2) + '```', env);
  }
}

async function sendToNarad(prompt, env) {
  try {
    // Call existing Narad AI service using the AI binding or URL
    const naradUrl = env.NARAD_API_URL || 'https://narad.ai';
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

export default { handleHermesWebhook };
