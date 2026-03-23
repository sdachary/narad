/**
 * Domain Interfaces (Ports)
 *
 * These are abstract contracts. Infrastructure layer MUST implement all of these.
 * The application layer depends ONLY on these interfaces — never on concrete classes.
 *
 * Pattern: Dependency Inversion Principle.
 *   High-level policy (use cases) ← depends on → these interfaces
 *   Low-level detail (Telegram, Groq HTTP) → implements these interfaces
 */

// ---------------------------------------------------------------------------
// IMessageSender
// Sends a reply back to the user, regardless of transport (Telegram, HTTP, etc.)
// ---------------------------------------------------------------------------
export class IMessageSender {
  /**
   * @param {string} chatId   - Where to send the message
   * @param {string} text     - The message text (may contain Markdown)
   * @returns {Promise<void>}
   */
  async send(chatId, text) { // eslint-disable-line no-unused-vars
    throw new Error('IMessageSender.send() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// IAgiWorkerClient
// Sends a request to the AGI worker and gets a response.
// ---------------------------------------------------------------------------
export class IAgiWorkerClient {
  /**
   * @param {object} payload
   * @param {string}        payload.requestId
   * @param {string}        payload.message    - The user's input text
   * @param {Array}         payload.history    - [{role, content}]
   * @param {string}        payload.context    - Platform knowledge injected as system context
   * @param {string}        payload.command    - Parsed command name or null
   * @returns {Promise<import('../entities/AgentResponse.js').AgentResponse>}
   */
  async ask(payload) { // eslint-disable-line no-unused-vars
    throw new Error('IAgiWorkerClient.ask() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// IMemoryStore
// Persists and retrieves conversation contexts.
// ---------------------------------------------------------------------------
export class IMemoryStore {
  /**
   * @param {string} chatId
   * @returns {Promise<import('../entities/ConversationContext.js').ConversationContext|null>}
   */
  async load(chatId) { // eslint-disable-line no-unused-vars
    throw new Error('IMemoryStore.load() must be implemented');
  }

  /**
   * @param {import('../entities/ConversationContext.js').ConversationContext} context
   * @returns {Promise<void>}
   */
  async save(context) { // eslint-disable-line no-unused-vars
    throw new Error('IMemoryStore.save() must be implemented');
  }

  /**
   * Clear context for a given chatId (used by /start command).
   * @param {string} chatId
   * @returns {Promise<void>}
   */
  async clear(chatId) { // eslint-disable-line no-unused-vars
    throw new Error('IMemoryStore.clear() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// IKnowledgeLoader
// Loads platform knowledge files to inject as agent context.
// ---------------------------------------------------------------------------
export class IKnowledgeLoader {
  /**
   * Returns a combined string of relevant platform context.
   * @returns {Promise<string>}
   */
  async load() {
    throw new Error('IKnowledgeLoader.load() must be implemented');
  }
}

// ---------------------------------------------------------------------------
// ILogger
// Structured logging interface. Keeps use cases free of console.log calls.
// ---------------------------------------------------------------------------
export class ILogger {
  info(msg, meta = {})  { throw new Error('ILogger.info() must be implemented');  } // eslint-disable-line no-unused-vars
  warn(msg, meta = {})  { throw new Error('ILogger.warn() must be implemented');  } // eslint-disable-line no-unused-vars
  error(msg, meta = {}) { throw new Error('ILogger.error() must be implemented'); } // eslint-disable-line no-unused-vars
  debug(msg, meta = {}) { throw new Error('ILogger.debug() must be implemented'); } // eslint-disable-line no-unused-vars
}

// ---------------------------------------------------------------------------
// IFileDownloader
// Downloads a file from a remote source (e.g. Telegram) to a local path.
// ---------------------------------------------------------------------------
export class IFileDownloader {
  /**
   * @param {string} fileId      - ID of the file to download (platform-specific)
   * @param {string} filePath    - Platform-specific relative path to the file (if available)
   * @param {string} destination - Local file path where to save the content
   * @returns {Promise<void>}
   */
  async download(fileId, filePath, destination) { // eslint-disable-line no-unused-vars
    throw new Error('IFileDownloader.download() must be implemented');
  }
}
// ---------------------------------------------------------------------------
// ISystemStats
// Retrieves host system metrics (CPU, RAM, Disk, Uptime).
// ---------------------------------------------------------------------------
export class ISystemStats {
  /**
   * @returns {Promise<object>} - { cpu, ram, disk, uptime, services }
   */
  async getStats() {
    throw new Error('ISystemStats.getStats() must be implemented');
  }

  /**
   * @returns {Promise<object>} - Status of related platform services
   */
  async getNishaStatus() {
    throw new Error('ISystemStats.getNishaStatus() must be implemented');
  }
}
