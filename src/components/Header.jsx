import { Moon, Sun, Search, Trash2, Brain, Square, Sparkles, PanelLeft, PanelRight, LayoutDashboard, MessageSquare } from 'lucide-react';

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
  onToggleSidebar,
  onViewDashboard,
  onViewChat,
  currentView
}) {
  return (
    <div className="h-14 flex items-center justify-between px-4 lg:px-8 border-b flex-shrink-0 sticky top-0 z-20 w-full backdrop-blur-md" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
      {/* Left - App name */}
      <div className="flex items-center gap-3">
        {sidebarCollapsed !== undefined && (
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-all"
            style={{ color: 'var(--text-secondary)' }}
            title={sidebarCollapsed ? "Show sidebar" : "Hide sidebar"}
          >
            {sidebarCollapsed ? <PanelLeft size={20} /> : <PanelRight size={20} />}
          </button>
        )}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--accent)' }}>
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight hidden sm:block" style={{ color: 'var(--text-primary)' }}>
            {appName}
          </span>
        </div>

        <div className="h-8 w-px mx-2 hidden md:block" style={{ backgroundColor: 'var(--border-subtle)' }} />

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-1 bg-[var(--bg-elevated)] p-1 rounded-xl border border-[var(--border-subtle)]">
          <button
            onClick={onViewDashboard}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currentView === 'dashboard' ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </button>
          <button
            onClick={onViewChat}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${currentView === 'chat' ? 'bg-[var(--bg-surface)] text-[var(--accent)] shadow-sm' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
          >
            <MessageSquare size={16} />
            Chat
          </button>
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
        <div className="w-px h-6 mx-1 hidden sm:block" style={{ backgroundColor: 'var(--border-subtle)' }} />
        {currentView === 'chat' && (
          <>
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
          </>
        )}

        {/* Status indicator */}
        <div className="ml-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)' }}>
          <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: isConnected ? 'var(--status-online)' : 'var(--status-error)' }} />
          <span className="text-[10px] font-bold uppercase tracking-wider hidden md:block" style={{ color: 'var(--text-secondary)' }}>
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
      className="p-2 rounded-xl hover:bg-[var(--bg-elevated)] transition-all active:scale-95"
      style={{ color: 'var(--text-secondary)' }}
      title={title}
    >
      {icon}
    </button>
  );
}