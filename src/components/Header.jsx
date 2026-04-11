import { Moon, Sun, Search, Trash2, Brain, Square, Settings, Sparkles } from 'lucide-react';

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
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-chat-border bg-chat-bg/80 backdrop-blur-sm flex-shrink-0">
      {/* Left - App name */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-chat-accent flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="text-base font-semibold text-chat-text hidden sm:block">{appName}</span>
        </div>
      </div>

      {/* Right - Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onSearch}
          className="p-2 rounded-lg hover:bg-chat-bg-tertiary text-chat-text-secondary hover:text-chat-text transition-colors"
          title="Search (Cmd+F)"
        >
          <Search size={18} />
        </button>

        <button
          onClick={onBrainStats}
          className="p-2 rounded-lg hover:bg-chat-bg-tertiary text-chat-text-secondary hover:text-chat-text transition-colors"
          title="Brain Stats"
        >
          <Brain size={18} />
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg hover:bg-chat-bg-tertiary text-chat-text-secondary hover:text-chat-text transition-colors"
          title="Toggle Theme (Cmd+T)"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={onClear}
          className="p-2 rounded-lg hover:bg-chat-bg-tertiary text-chat-text-secondary hover:text-chat-text transition-colors"
          title="Clear Chat (Cmd+K)"
        >
          <Trash2 size={18} />
        </button>

        <button
          onClick={onStop}
          className="p-2 rounded-lg hover:bg-chat-bg-tertiary text-chat-text-secondary hover:text-chat-text transition-colors"
          title="Stop (Ctrl+C)"
        >
          <Square size={18} />
        </button>

        {/* Status indicator */}
        <div className="ml-2 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-chat-success' : 'bg-chat-error'}`} />
        </div>
      </div>
    </header>
  );
}