import { useState } from 'react';
import { Plus, MessageSquare, Trash2, Menu } from 'lucide-react';

const styles = {
  toggle: { backgroundColor: 'var(--bg-secondary)', color: 'var(--text)', borderColor: 'var(--border)' },
  sessionDefault: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  sessionActive: { backgroundColor: 'var(--bg-message)', color: 'var(--text)', borderColor: 'var(--border)' },
  iconDefault: { opacity: 0.7 },
  iconActive: { color: 'var(--accent)' },
  textMuted: { color: 'var(--text-muted)' },
  border: { borderColor: 'var(--border)' },
  error: { color: 'var(--error)' },
};

export default function Sidebar({ sessions, currentSession, onNewSession, onSelectSession, onDeleteSession, onToggleSidebar, sidebarOpen }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  return (
    <>
      {/* Mobile toggle */}
      <button 
        onClick={onToggleSidebar}
        className="lg:hidden fixed top-3 left-4 z-50 p-2.5 rounded-xl border shadow-sm active:scale-95 transition-all"
        style={styles.toggle}
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
        <div className="text-[11px] font-bold uppercase tracking-[0.1em] px-3 mb-3" style={styles.textMuted}>
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
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
            style={session.id === currentSession ? styles.sessionActive : styles.sessionDefault}
          >
            <MessageSquare size={16} className="flex-shrink-0" style={session.id === currentSession ? styles.iconActive : styles.iconDefault} />
            <span className={`flex-1 truncate text-[13.5px] leading-tight ${session.id === currentSession ? 'font-semibold' : 'font-medium'}`}>
              {session.label}
            </span>
            {hoveredSession === session.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 transition-all"
                style={styles.error}
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
        
        {sessions.length === 0 && (
          <div className="text-center py-12 text-[13px] italic" style={styles.textMuted}>
            No history yet
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t" style={styles.border}>
        <div className="flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest opacity-60" style={styles.textMuted}>
          <span>narad</span>
        </div>
      </div>
    </>
  );
}