/**
 * Infrastructure: SystemStats
 *
 * Implements ISystemStats.
 * Uses native Node.js 'os' module and 'child_process' to gather VM metrics.
 */

import os from 'os';
import { execSync } from 'child_process';
import { ISystemStats } from '../../domain/interfaces/index.js';

export class SystemStats extends ISystemStats {
  /**
   * @param {object} opts
   * @param {import('../../domain/interfaces/index.js').ILogger} opts.logger
   */
  constructor({ logger }) {
    super();
    this.logger = logger;
  }

  /**
   * Get VM health metrics (CPU, RAM, Disk, Uptime).
   * @returns {Promise<object>}
   */
  async getStats() {
    try {
      const uptime = this._formatUptime(os.uptime());
      const totalMem = Math.round(os.totalmem() / (1024 * 1024));
      const freeMem  = Math.round(os.freemem() / (1024 * 1024));
      const usedMem  = totalMem - freeMem;
      const memPerc  = Math.round((usedMem / totalMem) * 100);

      const cpuLoad = os.loadavg()[0].toFixed(2);
      const cpuCount = os.cpus().length;

      let diskUsage = 'Unknown';
      try {
        // Get disk usage of the home directory
        const df = execSync('df -h ~ | awk \'NR==2 {print $5}\'').toString().trim();
        diskUsage = df;
      } catch (e) {
        this.logger.warn('SystemStats: failed to get disk usage', { error: e.message });
      }

      return {
        uptime,
        memory: `${usedMem}MB / ${totalMem}MB (${memPerc}%)`,
        cpu: `${cpuLoad} (1m avg) on ${cpuCount} cores`,
        disk: diskUsage,
      };
    } catch (err) {
      this.logger.error('SystemStats.getStats failed', { error: err.message });
      throw err;
    }
  }

  /**
   * Get status of related Nisha services.
   * Since this runs on the VM, we check systemd service status.
   * @returns {Promise<object>}
   */
  async getNishaStatus() {
    const services = [
      { id: 'narad',      name: 'Narad (Brain)' },
      { id: 'nisha-sync', name: 'Knowledge Sync' },
    ];

    const results = [];
    for (const svc of services) {
      let status = '🔴 Down';
      try {
        if (svc.id === 'nisha-sync') {
          // Check if cron job exists
          const cron = execSync('crontab -l 2>/dev/null | grep sync-knowledge || true').toString().trim();
          status = cron ? '🟢 Active (Cron)' : '⚪ Not configured';
        } else {
          const active = execSync(`systemctl is-active ${svc.id} || true`).toString().trim();
          status = active === 'active' ? '🟢 Running' : '🔴 Stopped';
        }
      } catch (e) {
        status = '❓ Unknown';
      }
      results.push({ name: svc.name, status });
    }

    return { services: results };
  }

  _formatUptime(seconds) {
    const days = Math.floor(seconds / (3600 * 24));
    const hrs  = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hrs > 0)  parts.push(`${hrs}h`);
    if (mins >= 0) parts.push(`${mins}m`);
    
    return parts.join(' ');
  }
}
