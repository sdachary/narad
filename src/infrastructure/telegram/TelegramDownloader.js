/**
 * Infrastructure: TelegramDownloader
 *
 * Implements IFileDownloader.
 * Downloads binary files from Telegram's file storage API.
 */

import { writeFileSync }    from 'fs';
import { dirname }         from 'path';
import { mkdirSync }        from 'fs';
import { IFileDownloader }  from '../../domain/interfaces/index.js';

export class TelegramDownloader extends IFileDownloader {
  /**
   * @param {object} opts
   * @param {string} opts.botToken
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ botToken, logger }) {
    super();
    this.botToken = botToken;
    this.logger   = logger;
    this.fileBaseUrl = `https://api.telegram.org/file/bot${botToken}`;
  }

  /**
   * @param {string} fileId
   * @param {string} filePath    - Relative path returned by getFile (e.g. 'documents/file_0.md')
   * @param {string} destination - Local absolute path
   */
  async download(fileId, filePath, destination) {
    if (!filePath) {
      throw new Error('TelegramDownloader: filePath is required (call getFile first)');
    }

    const url = `${this.fileBaseUrl}/${filePath}`;
    this.logger.debug('TelegramDownloader: downloading', { fileId, url, destination });

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Telegram download failed: HTTP ${res.status}`);
      }

      const buffer = await res.arrayBuffer();
      
      // Ensure directory exists
      mkdirSync(dirname(destination), { recursive: true });
      
      writeFileSync(destination, Buffer.from(buffer));
      this.logger.info('TelegramDownloader: file saved', { destination });
    } catch (err) {
      this.logger.error('TelegramDownloader: download failed', { error: err.message, fileId });
      throw err;
    }
  }
}
