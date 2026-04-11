import { Moon, Search, Trash2, Brain, Square, Sun } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onSearch, 
  onClear, 
  onBrainStats,
  onStop,
  isConnected 
}) {
  return (
    <header className="h-10 glass flex items-center justify-between px-3 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-terminal-success animate-pulse" />
        <span className="text-sm font-medium text-terminal-text-secondary">narad</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Toggle Theme (Cmd+T)"
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          onClick={onSearch}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Search (Cmd+F)"
        >
          <Search size={16} />
        </button>

        <button
          onClick={onClear}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Clear Chat (Cmd+K)"
        >
          <Trash2 size={16} />
        </button>

        <button
          onClick={onBrainStats}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Brain Stats"
        >
          <Brain size={16} />
        </button>

        <button
          onClick={onStop}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Stop (Ctrl+C)"
        >
          <Square size={16} />
        </button>

        {/* Status */}
        <button
          onClick={() => window.checkApiHealth?.()}
          className="flex items-center gap-1.5 ml-2"
        >
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-terminal-success' : 'bg-terminal-error'}`} />
        </button>
      </div>
    </header>
  );
}