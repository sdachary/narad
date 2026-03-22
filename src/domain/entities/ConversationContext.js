/**
 * Domain Entity: ConversationContext
 * Carries the accumulated context for a given chat session.
 * Used by use cases to enrich prompts before sending to the AGI worker.
 */

export class ConversationContext {
  /**
   * @param {object} params
   * @param {string}   params.chatId
   * @param {string}   params.userId
   * @param {Array}    params.history  - [{role:'user'|'assistant', content:string}]
   * @param {string}   params.platform - 'nisha' platform context injected from knowledge files
   * @param {number}   params.maxHistory - Max turns to keep (default: 10)
   */
  constructor({ chatId, userId, history = [], platform = '', maxHistory = 10 }) {
    this.chatId     = chatId;
    this.userId     = userId;
    this.history    = history;
    this.platform   = platform;
    this.maxHistory = maxHistory;
  }

  addUserTurn(text) {
    this.history.push({ role: 'user', content: text });
    this._trim();
  }

  addAssistantTurn(text) {
    this.history.push({ role: 'assistant', content: text });
    this._trim();
  }

  _trim() {
    // Keep last N turns (each turn = 1 user + 1 assistant = 2 entries)
    const maxEntries = this.maxHistory * 2;
    if (this.history.length > maxEntries) {
      this.history = this.history.slice(this.history.length - maxEntries);
    }
  }

  /**
   * Returns history formatted for the AGI worker payload.
   * @returns {Array<{role: string, content: string}>}
   */
  toWorkerHistory() {
    return [...this.history];
  }

  hasHistory() {
    return this.history.length > 0;
  }
}
