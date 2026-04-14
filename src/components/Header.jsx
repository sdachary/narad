import { PanelLeft, PanelRight } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onSearch, 
  onClear, 
  onBrainStats,
  onStop,
  isConnected,
  sidebarCollapsed,
  onToggleSidebar
}) {
  return (
    <div className="fixed top-8 left-8 right-8 z-50 flex justify-between items-start pointer-events-none">
      {/* Top Left - Sidebar Toggle & Triad */}
      <div className="flex flex-col gap-4 pointer-events-auto">
        <div className="flex items-center gap-6 bg-surface-container-low/40 backdrop-blur-md p-3 px-4 shadow-luminous">
          <button
            onClick={onToggleSidebar}
            className="text-outline/40 hover:text-accent transition-none"
            title={sidebarCollapsed ? "Open Log History" : "Close Log History"}
          >
            {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelRight size={20} />}
          </button>
          
          <div className="flex gap-2 border-l border-outline/10 pl-6 ml-2">
            <div className="w-2.5 h-2.5 bg-error" />
            <div className="w-2.5 h-2.5 bg-secondary" />
            <div className="w-2.5 h-2.5 bg-accent" />
          </div>
        </div>
      </div>

      {/* Top Right - Status Badge */}
      <div className="flex flex-col items-end gap-3 pointer-events-auto">
        <div className="flex items-center gap-4 bg-surface-container-low/40 backdrop-blur-md p-3 px-5 shadow-luminous group relative">
          {/* Status Pulse */}
          <div className="flex items-center gap-3">
            <span className={`w-2 h-2 ${isConnected ? 'bg-accent animate-pulse' : 'bg-error'}`} />
            <span className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-accent">
              {isConnected ? 'NODE_ACTIVE' : 'OFFLINE'}
            </span>
          </div>

          <div className="w-px h-4 bg-outline/10 mx-2" />
          
          <span className="text-[0.6rem] text-outline/40 font-bold uppercase tracking-widest font-mono">
            UPLINK_8291
          </span>

          {/* Ghost Quick Actions on Hover */}
          <div className="absolute top-full right-0 mt-3 flex flex-col items-end gap-2 opacity-0 group-hover:opacity-100 transition-none pointer-events-none group-hover:pointer-events-auto">
             <GhostAction onClick={onSearch}>[ SEARCH_HISTORY ]</GhostAction>
             <GhostAction onClick={onBrainStats}>[ NEURAL_INSIGHTS ]</GhostAction>
             <GhostAction onClick={onToggleTheme}>[ {theme === 'dark' ? 'LIGHT_CORE' : 'DARK_CORE'} ]</GhostAction>
             <GhostAction onClick={onClear} className="text-error/60 hover:text-error">[ PURGE_SESSION ]</GhostAction>
          </div>
        </div>
      </div>
    </div>
  );
}

function GhostAction({ onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`
        bg-black/80 backdrop-blur-md px-4 py-2 text-[0.55rem] font-bold tracking-widest uppercase 
        text-outline/60 hover:text-accent transition-none border-none shadow-luminous
        ${className}
      `}
    >
      {children}
    </button>
  );
}