/**
 * Infrastructure: FileKnowledgeLoader
 *
 * Implements IKnowledgeLoader.
 * Reads Markdown knowledge files from ~/narad/knowledge/ and concatenates them
 * into a single context string to inject into the AGI worker system prompt.
 *
 * Cache TTL: 5 minutes — reloads from disk if files have been updated by sync-knowledge.sh.
 */

import fs from 'fs';
import path from 'path';
import { IKnowledgeLoader } from '../../domain/interfaces/index.js';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class FileKnowledgeLoader extends IKnowledgeLoader {
  /**
   * @param {object} opts
   * @param {string} opts.knowledgeDir - Path to ~/narad/knowledge/
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ knowledgeDir, logger }) {
    super();
    if (!knowledgeDir) throw new Error('FileKnowledgeLoader: knowledgeDir is required');
    this.knowledgeDir = knowledgeDir;
    this.logger       = logger;
    this._cache       = null;
    this._cacheAt     = 0;
  }

  /**
   * @returns {Promise<string>}
   */
  async load() {
    const now = Date.now();
    if (this._cache && (now - this._cacheAt) < CACHE_TTL_MS) {
      return this._cache;
    }

    const sections = [];

    // Priority files first
    const priority = [
      path.join(this.knowledgeDir, 'nisha-platform.md'),
      path.join(this.knowledgeDir, 'rnd-context.md'),
    ];

    for (const filePath of priority) {
      const content = this._readSafe(filePath);
      if (content) sections.push(content);
    }

    // Service files
    const servicesDir = path.join(this.knowledgeDir, 'services');
    if (fs.existsSync(servicesDir)) {
      const serviceFiles = fs.readdirSync(servicesDir)
        .filter(f => f.endsWith('.md'))
        .sort();

      for (const filename of serviceFiles) {
        const content = this._readSafe(path.join(servicesDir, filename));
        if (content) sections.push(content);
      }
    }

    if (sections.length === 0) {
      this.logger.warn('FileKnowledgeLoader: no knowledge files found', { knowledgeDir: this.knowledgeDir });
      this._cache  = '';
      this._cacheAt = now;
      return '';
    }

    this._cache   = sections.join('\n\n---\n\n');
    this._cacheAt = now;
    this.logger.debug('FileKnowledgeLoader: reloaded', { sections: sections.length, chars: this._cache.length });
    return this._cache;
  }

  /**
   * Invalidate cache — call when sync-knowledge.sh has run.
   */
  invalidate() {
    this._cache  = null;
    this._cacheAt = 0;
    this.logger.debug('FileKnowledgeLoader: cache invalidated');
  }

  _readSafe(filePath) {
    try {
      if (!fs.existsSync(filePath)) return null;
      const content = fs.readFileSync(filePath, 'utf-8').trim();
      return content.length > 0 ? content : null;
    } catch (err) {
      this.logger.warn('FileKnowledgeLoader: could not read file', { filePath, error: err.message });
      return null;
    }
  }
}
