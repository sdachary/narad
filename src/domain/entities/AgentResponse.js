/**
 * Domain Entity: AgentResponse
 * Represents what the AGI worker returned — platform-agnostic.
 */

export const ResponseStatus = Object.freeze({
  OK:      'ok',
  ERROR:   'error',
  TIMEOUT: 'timeout',
  PARTIAL: 'partial',
});

export class AgentResponse {
  /**
   * @param {object} params
   * @param {string}        params.requestId  - Correlates back to the original Message.id
   * @param {string}        params.status     - One of ResponseStatus values
   * @param {string}        params.text       - The reply text to send back to the user
   * @param {string|null}   params.error      - Error message if status !== OK
   * @param {number}        params.latencyMs  - End-to-end latency in ms
   * @param {Date}          params.createdAt
   * @param {object|null}   params.metadata   - Optional structured data from worker
   */
  constructor({ requestId, status, text, error = null, latencyMs = 0, createdAt, metadata = null }) {
    if (!requestId) throw new Error('AgentResponse.requestId is required');
    if (!status)    throw new Error('AgentResponse.status is required');
    if (!Object.values(ResponseStatus).includes(status)) {
      throw new Error(`AgentResponse.status must be one of: ${Object.values(ResponseStatus).join(', ')}`);
    }

    this.requestId = requestId;
    this.status    = status;
    this.text      = text || '';
    this.error     = error;
    this.latencyMs = latencyMs;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date();
    this.metadata  = metadata;
  }

  isSuccess() {
    return this.status === ResponseStatus.OK;
  }

  isError() {
    return this.status === ResponseStatus.ERROR;
  }

  toUserText() {
    if (this.isError()) {
      return `⚠️ ${this.error || 'Something went wrong. Please try again.'}`;
    }
    return this.text;
  }
}
