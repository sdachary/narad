import { useState } from 'react';
import { Terminal, Trash2, Database, History, Settings, Plus } from 'lucide-react';

export default function Sidebar({ sessions, currentSession, onNewSession, onSelectSession, onDeleteSession }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  return (
    <div className="flex flex-col h-full bg-[var(--bauhaus-bg)] border-r-4 border-black select-none">
      {/* Drawer Header */}
      <div className="bg-bauhaus-yellow p-8 border-b-4 border-black">
        <h2 className="text-xl font-black tracking-tighter text-black">
          SESSION_LOGS
        </h2>
        <div className="text-[0.6rem] font-bold text-black/60 tracking-[0.3em] uppercase mt-2">
          ARCHIVE.V2
        </div>
      </div>

      {/* Navigation Icons (Geometric Grid) */}
      <div className="grid grid-cols-4 border-b-4 border-black">
        <SidebarMiniBtn icon={<Terminal size={20} />} active={true} color="red" />
        <SidebarMiniBtn icon={<Database size={20} />} color="blue" />
        <SidebarMiniBtn icon={<History size={20} />} color="yellow" />
        <SidebarMiniBtn icon={<Settings size={20} />} color="black" />
      </div>

      {/* Session History List */}
      <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        <div className="p-8 pb-4 text-[0.55rem] font-black uppercase tracking-[0.4em] text-black/20">
          HISTORY_QUERY [ {sessions.length} ]
        </div>
        
        <div className="divide-y-4 divide-black border-collapse">
          {sessions.map((session) => (
            <div
              key={session.id}
              onClick={() => onSelectSession(session.id)}
              onMouseEnter={() => setHoveredSession(session.id)}
              onMouseLeave={() => setHoveredSession(null)}
              className={`
                group relative flex items-center gap-6 p-6 cursor-pointer transition-none
                ${session.id === currentSession 
                  ? 'bg-bauhaus-red text-white' 
                  : 'bg-white text-black hover:bg-bauhaus-yellow'}
              `}
            >
              {/* Geometric Index Circle */}
              <div className={`
                w-4 h-4 rounded-full border-2 border-black shrink-0 transition-all
                ${session.id === currentSession ? 'bg-white rotate-45' : 'bg-black opacity-20 group-hover:bg-black'}
              `} />

              <span className={`flex-1 truncate text-xs font-black uppercase tracking-widest ${session.id === currentSession ? 'font-black' : 'font-bold'}`}>
                {session.label}
              </span>
              
              {(hoveredSession === session.id || session.id === currentSession) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className={`
                    p-2 border-2 border-black transition-all
                    ${session.id === currentSession ? 'bg-white text-black' : 'bg-bauhaus-red text-white'}
                    hover:scale-110
                  `}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-8 border-t-4 border-black bg-bauhaus-blue">
        <button 
          onClick={onNewSession}
          className="w-full h-16 bg-white border-4 border-black text-black text-sm font-black uppercase tracking-widest hover:bg-bauhaus-yellow transition-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none shadow-bauhaus-sm"
        >
          <div className="flex items-center justify-center gap-4">
            <Plus size={20} strokeWidth={3} />
            GENERATE_NEW
          </div>
        </button>
      </div>
    </div>
  );
}

function SidebarMiniBtn({ icon, active = false, color }) {
  const activeColorMap = {
    red: 'bg-bauhaus-red text-white',
    blue: 'bg-bauhaus-blue text-white',
    yellow: 'bg-bauhaus-yellow text-black',
    black: 'bg-black text-white',
  };

  return (
    <button className={`
      flex items-center justify-center h-16 border-r-4 last:border-r-0 border-black transition-colors
      ${active ? activeColorMap[color] : 'bg-white text-black/20 hover:text-black hover:bg-bauhaus-yellow'}
    `}>
      {icon}
    </button>
  );
}