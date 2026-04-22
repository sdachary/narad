// narad/src/components/ServiceTile.jsx
import React from 'react';

const statusColors = {
  online: 'var(--status-online)',
  degraded: 'var(--status-warning)',
  offline: 'var(--status-error)',
};

export default function ServiceTile({ service, status = 'online', metric, lastChecked, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="p-5 rounded-[var(--radius-lg)] cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{ 
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-tile)',
        border: '1px solid var(--border-subtle)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-[var(--text-primary)]">{service.name}</span>
        <div 
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: statusColors[status] || statusColors.online }}
        />
      </div>
      <div className="text-sm text-[var(--text-secondary)]">
        {metric || 'Active'}
      </div>
      <div className="text-xs text-[var(--text-secondary)] mt-2 opacity-60">
        {lastChecked || 'Just now'}
      </div>
    </div>
  );
}
