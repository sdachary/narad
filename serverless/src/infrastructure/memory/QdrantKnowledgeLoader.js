/**
 * Infrastructure: QdrantKnowledgeLoader
 *
 * Implements IKnowledgeLoader using Qdrant vector database.
 * Stores and retrieves knowledge documents as vectors for semantic search.
 */

import { IKnowledgeLoader } from '../../../domain/interfaces/index.js';

export class QdrantKnowledgeLoader extends IKnowledgeLoader {
  /**
   * @param {object} opts
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ logger }) {
    super();
    this.logger = logger;
    // Qdrant client will be initialized via environment variables in the Worker
    this._env = null;
  }

  /**
   * Initialize the Qdrant client (called from Worker with env)
   * @param {object} env - Cloudflare Worker environment bindings
   */
  initQdrant(env) {
    this._env = env;
    this.logger.debug('QdrantKnowledgeLoader: initialized with Qdrant endpoint', { url: env.QDRANT_URL });
  }

  /**
   * @returns {Promise<string>} - Combined knowledge context
   */
  async load() {
    try {
      if (!this._env) {
        this.logger.warn('QdrantKnowledgeLoader: not initialized with environment');
        return '';
      }

      // Query Qdrant for all points in the collection (or use a scroll/search for efficiency)
      // For simplicity, we'll retrieve all points and concatenate their payload text.
      // In production, you might want to filter or limit based on relevance.
      const response = await fetch(`${this._env.QDRANT_URL}/collections/${this._env.QDRANT_COLLECTION_NAME}/points/scroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': this._env.QDRANT_API_KEY
        },
        body: JSON.stringify({
          limit: 1000, // Adjust as needed
          with_payload: true,
          with_vector: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error('QdrantKnowledgeLoader: failed to scroll points', { status: response.status, error: errorText });
        return '';
      }

      const result = await response.json();
      const points = result.result?.points || [];

      if (points.length === 0) {
        this.logger.warn('QdrantKnowledgeLoader: no knowledge points found in collection', { collection: this._env.QDRANT_COLLECTION_NAME });
        return '';
      }

      // Extract text content from payloads
      const sections = points
        .map(point => point.payload?.text)
        .filter(text => text && text.trim().length > 0)
        .map(text => text.trim());

      if (sections.length === 0) {
        this.logger.warn('QdrantKnowledgeLoader: no text content found in knowledge points');
        return '';
      }

      const combined = sections.join('\n\n---\n\n');
      this.logger.debug('QdrantKnowledgeLoader: loaded knowledge', { points: points.length, sections: sections.length, chars: combined.length });
      return combined;
    } catch (err) {
      this.logger.error('QdrantKnowledgeLoader: load error', { error: err.message });
      return '';
    }
  }
}