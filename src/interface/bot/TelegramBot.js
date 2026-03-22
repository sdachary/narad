/**
 * Interface: TelegramBot
 *
 * Entry point for the Telegram interface.
 * Uses long-polling (getUpdates) — no webhook server required.
 *
 * Default decision: long-polling over webhooks.
 * Rationale: runs on OCI VM with no public domain — long-polling requires
 * zero network config, works behind NAT/Tailscale, simpler to run.
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org';
const POLL_TIMEOUT_SEC  = 30;  // Long-polling timeout
const MAX_RETRIES       = 5;
const RETRY_DELAY_MS    = 5000;

export class TelegramBot {
  /**
   * @param {object} opts
   * @param {string} opts.botToken
   * @param {import('../router/MessageRouter.js').MessageRouter} opts.router
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ botToken, router, logger }) {
    if (!botToken) throw new Error('TelegramBot: botToken is required');
    this.botToken = botToken;
    this.router   = router;
    this.logger   = logger;
    this.baseUrl  = `${TELEGRAM_API_BASE}/bot${botToken}`;
    this._running = false;
    this._offset  = 0;
    this._retries = 0;
  }

  /**
   * Start long-polling loop.
   */
  async start() {
    this._running = true;
    this.logger.info('TelegramBot: starting long-poll loop');

    // Delete any stale webhook so getUpdates works
    await this._deleteWebhook();

    while (this._running) {
      await this._poll();
    }

    this.logger.info('TelegramBot: stopped');
  }

  stop() {
    this._running = false;
  }

  async _deleteWebhook() {
    try {
      const res = await fetch(`${this.baseUrl}/deleteWebhook`);
      const data = await res.json();
      if (data.ok) {
        this.logger.debug('TelegramBot: webhook deleted');
      }
    } catch (_) {
      // Non-fatal — polling will work anyway
    }
  }

  async _poll() {
    try {
      const url = `${this.baseUrl}/getUpdates?timeout=${POLL_TIMEOUT_SEC}&offset=${this._offset}&allowed_updates=${encodeURIComponent(JSON.stringify(['message']))}`;

      const res  = await fetch(url, { signal: AbortSignal.timeout((POLL_TIMEOUT_SEC + 10) * 1000) });
      const data = await res.json();

      if (!data.ok) {
        this.logger.error('TelegramBot: getUpdates returned not ok', { description: data.description });
        await this._backoff();
        return;
      }

      this._retries = 0;

      for (const update of data.result) {
        this._offset = update.update_id + 1;

        if (!update.message) continue;

        const msg = update.message;
        const raw = {
          messageId: msg.message_id,
          userId:    msg.from?.id,
          chatId:    msg.chat?.id,
          text:      msg.text || '',
          date:      new Date(msg.date * 1000),
          source:    'telegram',
        };

        // Fire-and-forget per message — don't block the poll loop
        this.router.route(raw).catch(err => {
          this.logger.error('TelegramBot: router.route threw', { error: err.message, chatId: raw.chatId });
        });
      }

    } catch (err) {
      if (err.name === 'TimeoutError' || err.name === 'AbortError') {
        // Normal — long-poll timeout, just loop again
        return;
      }
      this.logger.error('TelegramBot: poll error', { error: err.message });
      await this._backoff();
    }
  }

  async _backoff() {
    this._retries++;
    if (this._retries > MAX_RETRIES) {
      this.logger.error('TelegramBot: too many consecutive errors, stopping');
      this._running = false;
      return;
    }
    const delay = RETRY_DELAY_MS * Math.pow(2, this._retries - 1); // exponential
    this.logger.warn(`TelegramBot: backing off for ${delay}ms (attempt ${this._retries})`);
    await new Promise(r => setTimeout(r, delay));
  }
}
