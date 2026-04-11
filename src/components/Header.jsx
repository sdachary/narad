import { Moon, Sun, Search, Trash2, Brain, Square, Sparkles } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onSearch, 
  onClear, 
  onBrainStats,
  onStop,
  isConnected,
  appName = 'narad'
}) {
  return (
    <div className="h-14 flex items-center justify-between px-4 lg:px-8 border-b border-chat-border bg-chat-bg/80 backdrop-blur-md flex-shrink-0 sticky top-0 z-20 w-full">
      {/* Left - App name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-chat-accent flex items-center justify-center shadow-lg shadow-chat-accent/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-chat-text hidden sm:block">
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
        <div className="w-px h-6 bg-chat-border mx-1 hidden sm:block" />
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
        <div className="ml-3 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-chat-bg-secondary border border-chat-border/50">
          <span className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-chat-success' : 'bg-chat-error'}`} />
          <span className="text-[10px] font-bold uppercase tracking-wider text-chat-text-muted hidden md:block">
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
      className="p-2 rounded-xl hover:bg-chat-bg-secondary text-chat-text-secondary hover:text-chat-text transition-all active:scale-95"
      title={title}
    >
      {icon}
    </button>
  );
}