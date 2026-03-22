/**
 * Infrastructure: SqliteMemoryStore
 *
 * Implements IMemoryStore using SQLite via the 'better-sqlite3' package.
 * Stores conversation contexts as JSON blobs keyed by chatId.
 *
 * Default decision: SQLite over Redis or external DB.
 * Rationale: NullClaw already uses SQLite (~1MB RAM), it's already on the VM,
 * zero infra cost, zero network latency, survives reboots via persistent file.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { IMemoryStore } from '../../domain/interfaces/index.js';
import { ConversationContext } from '../../domain/entities/ConversationContext.js';

export class SqliteMemoryStore extends IMemoryStore {
  /**
   * @param {object} opts
   * @param {string} opts.dbPath  - Path to the SQLite file, e.g. ~/.narad/memory.db
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ dbPath, logger }) {
    super();
    if (!dbPath) throw new Error('SqliteMemoryStore: dbPath is required');
    this.logger = logger;

    // Ensure directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    this.db = new Database(dbPath);
    this._migrate();

    logger.info('SqliteMemoryStore initialised', { dbPath });
  }

  _migrate() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS conversation_contexts (
        chat_id    TEXT PRIMARY KEY,
        data       TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);
  }

  /**
   * @param {string} chatId
   * @returns {Promise<ConversationContext|null>}
   */
  async load(chatId) {
    const row = this.db
      .prepare('SELECT data FROM conversation_contexts WHERE chat_id = ?')
      .get(chatId);

    if (!row) return null;

    try {
      const parsed = JSON.parse(row.data);
      return new ConversationContext({
        chatId:     parsed.chatId,
        userId:     parsed.userId,
        history:    parsed.history || [],
        platform:   parsed.platform || '',
        maxHistory: parsed.maxHistory || 10,
      });
    } catch (err) {
      this.logger.warn('SqliteMemoryStore.load: failed to parse context', { chatId, error: err.message });
      return null;
    }
  }

  /**
   * @param {ConversationContext} context
   * @returns {Promise<void>}
   */
  async save(context) {
    const data = JSON.stringify({
      chatId:     context.chatId,
      userId:     context.userId,
      history:    context.history,
      platform:   context.platform,
      maxHistory: context.maxHistory,
    });

    this.db
      .prepare(`
        INSERT INTO conversation_contexts (chat_id, data, updated_at)
        VALUES (?, ?, ?)
        ON CONFLICT(chat_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at
      `)
      .run(context.chatId, data, Date.now());
  }

  /**
   * @param {string} chatId
   * @returns {Promise<void>}
   */
  async clear(chatId) {
    this.db
      .prepare('DELETE FROM conversation_contexts WHERE chat_id = ?')
      .run(chatId);
    this.logger.debug('SqliteMemoryStore.clear', { chatId });
  }

  close() {
    this.db.close();
  }
}
