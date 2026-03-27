import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { telegramWebhookHandler } from './infrastructure/telegram/TelegramWebhookHandler.js';
import { cronJobHandler } from './infrastructure/scheduler/CloudflareCronAdapter.js';

const app = new Hono();

// Apply CORS middleware
app.use('*', cors());

// Health check endpoint
app.get('/health', (c) => c.json({ 
  status: 'ok', 
  service: 'narad-serverless',
  timestamp: new Date().toISOString()
}));

// Telegram webhook endpoint
app.post('/telegram/webhook/:botToken', telegramWebhookHandler);

// Cron job handler endpoint (for Cloudflare Cron Triggers)
app.post('/scheduled/:jobName', cronJobHandler);

// Catch-all for static assets (if you have any)
app.get('*', async (c) => {
  // You can serve static assets here if needed
  return c.text('Not Found', 404);
});

export default {
  /**
   * Main fetch handler for HTTP requests
   */
  async fetch(request, env, ctx) {
    // Add environment variables to the request context for handlers
    request.env = env;
    return app.fetch(request, env, ctx);
  },

  /**
   * Handler for Cloudflare Cron Triggers
   */
  async scheduled(event, env, ctx) {
    // Pass environment to cron job handler
    return cronJobHandler(null, env, ctx);
  }
};