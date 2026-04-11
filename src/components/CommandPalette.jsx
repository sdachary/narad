import { useState, useEffect, useRef } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass rounded-lg overflow-hidden">
        <div className="p-2 border-b border-terminal-border">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="w-full bg-transparent border-none text-terminal-text font-mono text-sm outline-none"
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {filtered.map((cmd, idx) => (
            <div
              key={cmd.cmd}
              onClick={() => onSelect(cmd.cmd)}
              className={`px-3 py-2 rounded cursor-pointer flex justify-between items-center ${
                idx === selected 
                  ? 'bg-terminal-accent text-terminal-bg' 
                  : 'text-terminal-text hover:bg-terminal-bg-tertiary'
              }`}
            >
              <span className="font-mono text-sm">{cmd.cmd}</span>
              <span className="text-xs text-terminal-text-muted">{cmd.desc}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-3 text-center text-terminal-text-muted text-sm">
              No commands found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}