import { useState, useEffect, useRef } from 'react';
import { Search, Command, CornerDownLeft } from 'lucide-react';

const COMMANDS = [
  { cmd: '/mode', desc: 'Switch plan/build mode' },
  { cmd: '/session', desc: 'Manage sessions' },
  { cmd: '/dev', desc: 'Developer agent' },
  { cmd: '/reviewer', desc: 'Code reviewer agent' },
  { cmd: '/debugger', desc: 'Debugger agent' },
  { cmd: '/spec', desc: 'Create specification' },
  { cmd: '/plan', desc: 'Create plan' },
  { cmd: '/build', desc: 'Build code' },
  { cmd: '/test', desc: 'Run tests' },
  { cmd: '/review', desc: 'Review code' },
  { cmd: '/ship', desc: 'Ship to production' },
];

export default function CommandPalette({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(c => 
    c.cmd.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      onSelect(filtered[selected].cmd);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-lg bg-chat-bg rounded-2xl shadow-soft-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 p-4 border-b border-chat-border">
          <Search size={20} className="text-chat-text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent border-none text-chat-text placeholder-chat-text-muted text-[15px] outline-none"
          />
          <kbd className="px-2 py-1 rounded-lg bg-chat-bg-tertiary text-chat-text-muted text-xs font-medium">esc</kbd>
        </div>

        {/* Commands list */}
        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.map((cmd, idx) => (
            <div
              key={cmd.cmd}
              onClick={() => onSelect(cmd.cmd)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors ${
                idx === selected 
                  ? 'bg-chat-accent text-white' 
                  : 'text-chat-text hover:bg-chat-bg-tertiary'
              }`}
            >
              <div className="flex items-center gap-3">
                <Command size={16} className={idx === selected ? 'text-white/80' : 'text-chat-text-muted'} />
                <span className="font-medium">{cmd.cmd}</span>
              </div>
              <span className={`text-sm ${idx === selected ? 'text-white/80' : 'text-chat-text-muted'}`}>
                {cmd.desc}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-4 text-center text-chat-text-muted">
              No commands found
            </div>
          )}
        </div>

        {/* Footer tips */}
        <div className="px-4 pb-3 flex items-center gap-4 text-xs text-chat-text-muted">
          <span className="flex items-center gap-1">
            <CornerDownLeft size={12} /> Select
          </span>
          <span className="flex items-center gap-1">
            ↑↓ Navigate
          </span>
        </div>
      </div>
    </div>
  );
}