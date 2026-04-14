import { useState } from 'react';
import { Terminal, Trash2, Database, History, Settings, X } from 'lucide-react';

export default function Sidebar({ sessions, currentSession, onNewSession, onSelectSession, onDeleteSession }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  return (
    <div className="flex flex-col h-full bg-black border-none select-none">
      {/* Drawer Header */}
      <div className="flex items-center justify-between p-8 pb-4">
        <div className="text-[0.6rem] font-bold uppercase tracking-[0.4em] text-accent">
          LOG_ARCHIVE
        </div>
      </div>

      <div className="w-full h-px bg-surface-container-high opacity-10 mb-6" />

      {/* Navigation Icons (Minimal) */}
      <div className="flex gap-4 px-8 mb-8 overflow-x-auto no-scrollbar">
        <SidebarMiniBtn icon={<Terminal size={14} />} active={true} />
        <SidebarMiniBtn icon={<Database size={14} />} />
        <SidebarMiniBtn icon={<History size={14} />} />
        <SidebarMiniBtn icon={<Settings size={14} />} />
      </div>

      {/* Session History List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-1">
        <div className="text-[0.5rem] font-bold uppercase tracking-[0.2em] mb-6 text-outline/20">
          HISTORY.LOG [ {sessions.length} ]
        </div>
        
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            onMouseEnter={() => setHoveredSession(session.id)}
            onMouseLeave={() => setHoveredSession(null)}
            className={`
              group relative flex items-center gap-4 px-4 py-4 cursor-pointer transition-none
              ${session.id === currentSession 
                ? 'bg-surface-container-low text-accent border-l border-accent' 
                : 'text-outline/40 hover:text-[#eaffde] hover:bg-surface-container-lowest/20'}
            `}
          >
            <span className={`flex-1 truncate text-[0.65rem] font-bold uppercase tracking-widest ${session.id === currentSession ? 'font-bold' : 'font-medium'}`}>
              {session.label}
            </span>
            
            {(hoveredSession === session.id || session.id === currentSession) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className={`transition-none ${session.id === currentSession ? 'text-error/60' : 'text-error/20'} hover:text-error`}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="p-8 mt-auto">
        <button 
          onClick={onNewSession}
          className="w-full py-4 bg-accent text-black text-[0.65rem] font-bold uppercase tracking-[0.2em] hover:bg-white transition-none active:scale-95 shadow-luminous"
        >
          GENERATE_NEW_SESSION
        </button>
      </div>
    </div>
  );
}

function SidebarMiniBtn({ icon, active = false }) {
  return (
    <button className={`
      p-2 transition-none
      ${active ? 'text-accent bg-surface-container-low/20' : 'text-outline/20 hover:text-accent'}
    `}>
      {icon}
    </button>
  );
}