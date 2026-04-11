import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Menu } from 'lucide-react';

export default function Sidebar({ sessions, currentSession, onNewSession, onSelectSession, onDeleteSession, onToggleSidebar, sidebarOpen }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  return (
    <>
      {/* Mobile toggle */}
      <button 
        onClick={onToggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-chat-bg-secondary border border-chat-border"
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 z-30"
          onClick={onToggleSidebar}
        />
      )}

      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-72 bg-chat-bg-secondary border-r border-chat-border
        flex flex-col transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-4 border-b border-chat-border">
          <button
            onClick={onNewSession}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-chat-accent text-white font-medium hover:bg-chat-accent-hover transition-colors"
          >
            <Plus size={18} />
            New Chat
          </button>
        </div>

        {/* Session List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          <div className="text-xs font-medium text-chat-text-muted uppercase tracking-wider px-3 mb-2">
            Recent
          </div>
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => {
                onSelectSession(session.id);
                if (window.innerWidth < 1024) onToggleSidebar();
              }}
              onMouseEnter={() => setHoveredSession(session.id)}
              onMouseLeave={() => setHoveredSession(null)}
              className={`group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer transition-all ${
                session.id === currentSession 
                  ? 'bg-chat-bg-message text-chat-text' 
                  : 'text-chat-text-secondary hover:bg-chat-bg-tertiary hover:text-chat-text'
              }`}
            >
              <MessageSquare size={16} className="flex-shrink-0" />
              <span className="flex-1 truncate text-sm">{session.label}</span>
              {hoveredSession === session.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-chat-error/10 hover:text-chat-error transition-all"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
          
          {sessions.length === 0 && (
            <div className="text-center py-8 text-chat-text-muted text-sm">
              No conversations yet
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-chat-border">
          <div className="text-xs text-chat-text-muted text-center">
            narad
          </div>
        </div>
      </aside>
    </>
  );
}