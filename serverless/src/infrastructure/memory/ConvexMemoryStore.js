/**
 * Infrastructure: ConvexMemoryStore
 *
 * Implements IMemoryStore using Convex as a reactive backend.
 * Stores conversation contexts as JSON documents keyed by chatId.
 */

import { IMemoryStore } from '../../../domain/interfaces/index.js';
import { ConversationContext } from '../../../domain/entities/ConversationContext.js';

export class ConvexMemoryStore extends IMemoryStore {
  /**
   * @param {object} opts
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ logger }) {
    super();
    this.logger = logger;
    // Note: Convex client is initialized via environment variables in the Worker
    // The actual Convex instance will be passed via env in the Worker context
    // For now we store a placeholder; the Worker will replace the methods
    // with bound functions from the Convex instance.
    this._convex = null;
  }

  /**
   * Initialize the Convex client (called from Worker with env)
   * @param {object} env - Cloudflare Worker environment bindings
   */
  initConvex(env) {
    // In a real implementation, we would import convex and create a client
    // However, to avoid build-time dependencies, we expect the Worker to
    // provide the convex instance via env.CONVEX (if using convex http client)
    // or we use fetch to the Convex HTTP endpoint.
    // For simplicity, we'll store the env and use fetch to Convex endpoints.
    this._env = env;
    this.logger.debug('ConvexMemoryStore: initialized with Convex endpoint', { url: env.CONVEX_DEPLOYMENT_URL });
  }

  /**
   * @param {string} chatId
   * @returns {Promise<ConversationContext|null>}
   */
  async load(chatId) {
    try {
      // Query Convex for the chatId
      const response = await fetch(`${this._env.CONVEX_DEPLOYMENT_URL}/api/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._env.CONVEX_ACCESS_KEY}`
        },
        body: JSON.stringify({
          path: ['memory', 'load'],
          args: { chatId }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.warn('ConvexMemoryStore: failed to load context', { chatId, status: response.status, error: errorText });
        return null;
      }

      const result = await response.json();
      if (!result || !result.data) {
        return null;
      }

      const data = result.data;
      return new ConversationContext({
        chatId: data.chatId,
        userId: data.userId,
        history: data.history || [],
        platform: data.platform || '',
        maxHistory: data.maxHistory || 10,
      });
    } catch (err) {
      this.logger.error('ConvexMemoryStore: load error', { chatId, error: err.message });
      return null;
    }
  }

  /**
   * @param {ConversationContext} context
   * @returns {Promise<void>}
   */
  async save(context) {
    try {
      const data = {
        chatId: context.chatId,
        userId: context.userId,
        history: context.history,
        platform: context.platform,
        maxHistory: context.maxHistory,
      };

      const response = await fetch(`${this._env.CONVEX_DEPLOYMENT_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._env.CONVEX_ACCESS_KEY}`
        },
        body: JSON.stringify({
          path: ['memory', 'save'],
          args: { data }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('ConvexMemoryStore: failed to save context', { chatId: context.chatId, status: response.status, error: errorText });
        throw new Error(`Failed to save context: ${response.status}`);
      }

      this.logger.debug('ConvexMemoryStore: context saved', { chatId: context.chatId });
    } catch (err) {
      this.logger.error('ConvexMemoryStore: save error', { chatId: context.chatId, error: err.message });
      throw err;
    }
  }

  /**
   * @param {string} chatId
   * @returns {Promise<void>}
   */
  async clear(chatId) {
    try {
      const response = await fetch(`${this._env.CONVEX_DEPLOYMENT_URL}/api/mutation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this._env.CONVEX_ACCESS_KEY}`
        },
        body: JSON.stringify({
          path: ['memory', 'clear'],
          args: { chatId }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('ConvexMemoryStore: failed to clear context', { chatId, status: response.status, error: errorText });
        throw new Error(`Failed to clear context: ${response.status}`);
      }

      this.logger.debug('ConvexMemoryStore: context cleared', { chatId });
    } catch (err) {
      this.logger.error('ConvexMemoryStore: clear error', { chatId, error: err.message });
      throw err;
    }
  }
}