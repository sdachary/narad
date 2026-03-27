/**
 * Infrastructure: AgiWorkerClient
 *
 * Implements IAgiWorkerClient.
 * Sends HTTP POST requests to the AGI worker at nisha-agi.pages.dev/api/chat.
 *
 * Default decision: HTTP event system (not Redis).
 * Rationale: Redis requires an always-on broker. The AGI worker is already
 * a Cloudflare Worker that accepts HTTP — adding Redis would be a pointless
 * extra dependency. HTTP is synchronous but the worker responds in <3s on Groq.
 */

import { IAgiWorkerClient } from '../../domain/interfaces/index.js';
import { AgentResponse, ResponseStatus } from '../../domain/entities/AgentResponse.js';

const DEFAULT_TIMEOUT_MS = 45_000; // 45s — Groq is fast but allow for retries

export class AgiWorkerClient extends IAgiWorkerClient {
  /**
   * @param {object} opts
   * @param {string} opts.workerUrl      - e.g. 'https://nisha-agi.pages.dev'
   * @param {number} [opts.timeoutMs]    - Request timeout in ms
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ workerUrl, timeoutMs = DEFAULT_TIMEOUT_MS, logger }) {
    super();
    if (!workerUrl) throw new Error('AgiWorkerClient: workerUrl is required');
    this.workerUrl = workerUrl.replace(/\/$/, ''); // strip trailing slash
    this.timeoutMs = timeoutMs;
    this.logger    = logger;
  }

  /**
   * @param {object} payload
   * @param {string} payload.requestId
   * @param {string} payload.message
   * @param {Array}  payload.history
   * @param {string} payload.context
   * @param {string} payload.command
   * @param {string} payload.args
   * @returns {Promise<AgentResponse>}
   */
  async ask(payload) {
    const endpoint = `${this.workerUrl}/api/chat`;
    const start    = Date.now();

    this.logger.debug('AgiWorkerClient.ask', { endpoint, requestId: payload.requestId });

    const body = JSON.stringify({
      message:    payload.message,
      session_id: payload.requestId,
      history:    payload.history || [],
      context:    payload.context || '',
      command:    payload.command || null,
      persona:    'Narad',
    });

    const controller = new AbortController();
    const timer      = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const res = await fetch(endpoint, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        signal: controller.signal,
      });

      clearTimeout(timer);
      const latencyMs = Date.now() - start;

      if (!res.ok) {
        const errText = await res.text().catch(() => 'unknown');
        this.logger.warn('AgiWorkerClient: worker returned non-200', {
          status:    res.status,
          requestId: payload.requestId,
          body:      errText.slice(0, 200),
        });
        return new AgentResponse({
          requestId: payload.requestId,
          status:    ResponseStatus.ERROR,
          text:      '',
          error:     `Worker returned HTTP ${res.status}`,
          latencyMs,
        });
      }

      const data = await res.json();

      if (!data.reply && !data.text) {
        return new AgentResponse({
          requestId: payload.requestId,
          status:    ResponseStatus.ERROR,
          text:      '',
          error:     'Worker returned empty reply',
          latencyMs,
        });
      }

      return new AgentResponse({
        requestId: payload.requestId,
        status:    ResponseStatus.OK,
        text:      data.reply || data.text,
        latencyMs,
        metadata:  data.metadata || null,
      });

    } catch (err) {
      clearTimeout(timer);
      const latencyMs = Date.now() - start;

      if (err.name === 'AbortError') {
        this.logger.error('AgiWorkerClient: request timed out', { requestId: payload.requestId, timeoutMs: this.timeoutMs });
        return new AgentResponse({
          requestId: payload.requestId,
          status:    ResponseStatus.TIMEOUT,
          text:      '',
          error:     `Request timed out after ${this.timeoutMs}ms`,
          latencyMs,
        });
      }

      this.logger.error('AgiWorkerClient: fetch failed', { error: err.message, requestId: payload.requestId });
      return new AgentResponse({
        requestId: payload.requestId,
        status:    ResponseStatus.ERROR,
        text:      '',
        error:     err.message,
        latencyMs,
      });
    }
  }
}
