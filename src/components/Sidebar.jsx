import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function Sidebar({ sessions, currentSession, onNewSession, onSelectSession, onDeleteSession }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  return (
    <aside className="w-60 h-full glass flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-terminal-border">
        <span className="text-xs font-semibold text-terminal-text-secondary uppercase tracking-wide">
          Sessions
        </span>
        <button
          onClick={onNewSession}
          className="p-1 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-accent transition-colors"
          title="New Session"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            onMouseEnter={() => setHoveredSession(session.id)}
            onMouseLeave={() => setHoveredSession(null)}
            className={`group flex items-center justify-between p-2 rounded cursor-pointer text-xs transition-all ${
              session.id === currentSession 
                ? 'bg-terminal-accent text-terminal-bg border-l-2 border-terminal-accent' 
                : 'hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text'
            }`}
          >
            <span className="truncate max-w-[140px]">{session.label}</span>
            {hoveredSession === session.id && session.id !== currentSession && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="p-1 opacity-60 hover:opacity-100 hover:text-terminal-error"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}