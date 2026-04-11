import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Menu } from 'lucide-react';

export default function Sidebar({ sessions, currentSession, onNewSession, onSelectSession, onDeleteSession, onToggleSidebar, sidebarOpen }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  return (
    <>
      {/* Mobile toggle - now managed in App header usually, but keeping as fallback */}
      <button 
        onClick={onToggleSidebar}
        className="lg:hidden fixed top-3 left-4 z-50 p-2.5 rounded-xl bg-chat-bg-secondary border border-chat-border shadow-sm active:scale-95 transition-all text-chat-text"
      >
        <Menu size={20} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-[2px] z-30 transition-all"
          onClick={onToggleSidebar}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
        <div className="text-[11px] font-bold text-chat-text-muted uppercase tracking-[0.1em] px-3 mb-3">
          History
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
            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
              session.id === currentSession 
                ? 'bg-chat-bg-message text-chat-text shadow-sm ring-1 ring-chat-border' 
                : 'text-chat-text-secondary hover:bg-chat-bg-tertiary hover:text-chat-text'
            }`}
          >
            <MessageSquare size={16} className={`flex-shrink-0 ${session.id === currentSession ? 'text-chat-accent' : 'opacity-70'}`} />
            <span className={`flex-1 truncate text-[13.5px] leading-tight ${session.id === currentSession ? 'font-semibold' : 'font-medium'}`}>
              {session.label}
            </span>
            {hoveredSession === session.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-chat-error/10 hover:text-chat-error transition-all"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        
        {sessions.length === 0 && (
          <div className="text-center py-12 text-chat-text-muted text-[13px] italic">
            No history yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-chat-border/50">
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold text-chat-text-muted uppercase tracking-widest opacity-60">
          <span>narad</span>
        </div>
      </div>
    </>
  );
}