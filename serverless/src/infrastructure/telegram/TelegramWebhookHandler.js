/**
 * Infrastructure: TelegramWebhookHandler
 *
 * Handles incoming Telegram webhook requests, verifies them, and processes updates
 * by interacting with the AGI worker and sending responses back to Telegram.
 */

import { ConsoleLogger } from '../../infrastructure/ConsoleLogger.js';
import { AgiWorkerClient } from '../../infrastructure/agi_worker/AgiWorkerClient.js';

export async function telegramWebhookHandler(request, env) {
  const logger = new ConsoleLogger({ level: env.LOG_LEVEL || 'info' });

  try {
    // 1. Extract botToken from route parameter
    const { botToken } = request.param();
    if (botToken !== env.TELEGRAM_BOT_TOKEN) {
      logger.warn('TelegramWebhookHandler: invalid bot token in request', { provided: botToken.substring(0, 5) + '...' });
      return new Response('Unauthorized', { status: 401 });
    }

    // 2. Verify webhook secret if configured
    const webhookSecret = env.TELEGRAM_WEBHOOK_SECRET;
    if (webhookSecret) {
      const providedSecret = request.header('X-Telegram-Bot-Api-Secret-Token');
      if (providedSecret !== webhookSecret) {
        logger.warn('TelegramWebhookHandler: invalid webhook secret');
        return new Response('Unauthorized', { status: 401 });
      }
    }

    // 3. Parse the update
    const update = await request.json();
    if (!update) {
      logger.warn('TelegramWebhookHandler: empty update received');
      return new Response('Bad Request', { status: 400 });
    }

    // 4. Extract message if present
    if (!update.message) {
      // We only handle message updates for now; ignore others (like edited_message, channel_post, etc.)
      logger.debug('TelegramWebhookHandler: non-message update received', { updateId: update.update_id });
      return new Response('OK', { status: 200 });
    }

    const msg = update.message;
    const chatId = msg.chat?.id;
    const text = msg.text || msg.caption || '';

    if (!chatId) {
      logger.warn('TelegramWebhookHandler: message without chatId', { messageId: msg.message_id });
      return new Response('Bad Request', { status: 400 });
    }

    // 5. Prepare logger for this request
    const requestLogger = new ConsoleLogger({
      level: env.LOG_LEVEL || 'info',
      meta: { chatId, updateId: update.update_id }
    });

    // 6. Call the AGI worker (narad-brain)
    const agiWorker = new AgiWorkerClient({
      workerUrl: env.AGI_WORKER_URL,
      logger: requestLogger
    });

    const agiResponse = await agiWorker.ask({
      requestId: `webhook_${update.update_id}`,
      message: text,
      history: [], // We could load history from Convex here if we wanted context
      context: 'Telegram Webhook',
      command: null,
      args: ''
    });

    // 7. Send response back to Telegram
    if (agiResponse.isSuccess()) {
      const sendResponse = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: agiResponse.text,
          parse_mode: 'Markdown' // Optional: enable Markdown formatting
        })
      });

      if (!sendResponse.ok) {
        const errorText = await sendResponse.text();
        requestLogger.error('TelegramWebhookHandler: failed to send message to Telegram', { 
          status: sendResponse.status, 
          error: errorText 
        });
        return new Response('Internal Server Error', { status: 502 });
      }

      requestLogger.info('TelegramWebhookHandler: message processed and sent successfully', { 
        messageLength: agiResponse.text.length 
      });
      return new Response('OK', { status: 200 });
    } else {
      // AGI worker failed
      requestLogger.error('TelegramWebhookHandler: AGI worker returned error', { 
        error: agiResponse.error 
      });
      // We can optionally send an error message to the user
      await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: 'Sorry, I encountered an error processing your request. Please try again later.',
          parse_mode: 'Markdown'
        })
      });
      return new Response('OK', { status: 200 }); // Still return 200 to Telegram to avoid retries
    }
  } catch (err) {
    logger.error('TelegramWebhookHandler: unhandled error', { error: err.message });
    return new Response('Internal Server Error', { status: 500 });
  }
}