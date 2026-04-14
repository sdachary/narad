import { Moon, Sun, Search, Trash2, Brain, Square, Sparkles, PanelLeft, PanelRight } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onSearch, 
  onClear, 
  onBrainStats,
  onStop,
  isConnected,
  appName = 'narad',
  sidebarCollapsed,
  onToggleSidebar
}) {
  return (
    <div className="h-14 flex items-center justify-between px-4 lg:px-8 border-b flex-shrink-0 sticky top-0 z-20 w-full backdrop-blur-md" style={{ backgroundColor: 'var(--bg)', borderColor: 'var(--border)' }}>
      {/* Left - App name */}
      <div className="flex items-center gap-3">
        {sidebarCollapsed !== undefined && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all"
            style={{ color: 'var(--text-secondary)' }}
            title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelRight size={20} />}
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--accent)', boxShadow: 'var(--accent) 0 0 20%' }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block" style={{ color: 'var(--text)' }}>
            {appName}
          </span>
        </div>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-1.5">
        <HeaderButton 
          onClick={onSearch} 
          icon={<Search size={18} />} 
          title="Search (Cmd+F)" 
        />
        <HeaderButton 
          onClick={onBrainStats} 
          icon={<Brain size={18} />} 
          title="Brain Stats" 
        />
        <HeaderButton 
          onClick={onToggleTheme} 
          icon={theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />} 
          title="Toggle Theme (Cmd+T)" 
        />
        <div className="w-px h-6 mx-1 hidden sm:block" style={{ backgroundColor: 'var(--border)' }} />
        <HeaderButton 
          onClick={onClear} 
          icon={<Trash2 size={18} />} 
          title="Clear Chat (Cmd+K)" 
        />
        <HeaderButton 
          onClick={onStop} 
          icon={<Square size={18} />} 
          title="Stop (Ctrl+C)" 
        />

        {/* Status indicator */}
        <div className="ml-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full border" style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} style={{ backgroundColor: isConnected ? 'var(--success)' : 'var(--error)' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block" style={{ color: 'var(--text-muted)' }}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
}

function HeaderButton({ onClick, icon, title }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-xl hover:opacity-80 transition-all active:scale-95"
      style={{ color: 'var(--text-secondary)' }}
      title={title}
    >
      {icon}
    </button>
  );
}