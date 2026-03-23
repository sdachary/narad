/**
 * Infrastructure: ConsoleLogger
 *
 * Implements ILogger. Structured JSON output for systemd journal.
 * Level controlled by LOG_LEVEL env var (default: 'info').
 */

import { ILogger } from '../domain/interfaces/index.js';

const LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };

export class ConsoleLogger extends ILogger {
  /**
   * @param {object} opts
   * @param {string} [opts.level]   - Minimum log level: 'debug'|'info'|'warn'|'error'
   * @param {string} [opts.service] - Service name to tag all log entries
   */
  constructor({ level = 'info', service = 'narad' } = {}) {
    super();
    this.minLevel = LEVELS[level] ?? LEVELS.info;
    this.service  = service;
  }

  info(msg, meta = {})  { this._log('info',  msg, meta); }
  warn(msg, meta = {})  { this._log('warn',  msg, meta); }
  error(msg, meta = {}) { this._log('error', msg, meta); }
  debug(msg, meta = {}) { this._log('debug', msg, meta); }

  _log(level, msg, meta) {
    if ((LEVELS[level] ?? 0) < this.minLevel) return;

    const entry = {
      ts:      new Date().toISOString(),
      level,
      service: this.service,
      msg,
      ...meta,
    };

    const line = JSON.stringify(entry);

    if (level === 'error' || level === 'warn') {
      process.stderr.write(line + '\n');
    } else {
      process.stdout.write(line + '\n');
    }
  }
}
