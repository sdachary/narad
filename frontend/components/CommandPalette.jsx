import { useState, useEffect, useRef } from 'react';
import { Search, Command, CornerDownLeft } from 'lucide-react';

const COMMANDS = [
  { cmd: '/mode', desc: 'Switch plan/build mode' },
  { cmd: '/session', desc: 'Manage sessions' },
  { cmd: '/dev', desc: 'Developer agent' },
  { cmd: '/reviewer', desc: 'Code reviewer agent' },
  { cmd: '/debugger', desc: 'Debugger agent' },
  { cmd: '/spec', desc: 'Create specification (Spec Driven Development)' },
  { cmd: '/plan', desc: 'Create plan (Task Breakdown)' },
  { cmd: '/build', desc: 'Build code (Incremental Implementation)' },
  { cmd: '/test', desc: 'Run tests (Test Driven Development)' },
  { cmd: '/review', desc: 'Review code (Code Review & Quality)' },
  { cmd: '/code-simplify', desc: 'Simplify code (Reduce Complexity)' },
  { cmd: '/ship', desc: 'Ship to production (Shipping & Launch)' },
  { cmd: '/cerebras', desc: 'Switch to Cerebras provider' },
  { cmd: '/cloudflare', desc: 'Switch to Cloudflare Workers AI' },
  { cmd: '/groq', desc: 'Switch to Groq provider' },
  { cmd: '/openrouter', desc: 'Switch to OpenRouter provider' },
  { cmd: '/github', desc: 'Switch to GitHub Models provider' },
  { cmd: '/models', desc: 'List available models' },
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
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32 p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div 
        className="relative w-full max-w-xl bg-surface-container-high shadow-luminous overflow-hidden border-none animate-in zoom-in-95 duration-150 steps-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="scanline" />
        
        {/* Search bar */}
        <div className="flex items-center gap-4 p-5 bg-surface-container-highest">
          <Search size={20} className="text-secondary" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ENTER COMMAND..."
            className="flex-1 bg-transparent border-none text-[#eaffde] placeholder-outline/20 text-lg font-bold uppercase tracking-wider outline-none"
          />
          <kbd className="px-2 py-1 bg-black text-outline/40 text-[0.6rem] font-bold uppercase tracking-widest">ESC</kbd>
        </div>

        {/* Commands list */}
        <div className="max-h-96 overflow-y-auto no-scrollbar p-2 bg-black">
          {filtered.map((cmd, idx) => (
            <div
              key={cmd.cmd}
              onClick={() => onSelect(cmd.cmd)}
              className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-none ${
                idx === selected 
                  ? 'bg-accent text-black font-bold' 
                  : 'text-outline hover:bg-surface-container-low hover:text-[#eaffde]'
              }`}
            >
              <div className="flex items-center gap-4">
                <Command size={16} className={idx === selected ? 'text-black' : 'text-outline/40'} />
                <span className="text-sm tracking-widest uppercase">{cmd.cmd}</span>
              </div>
              <span className={`text-[0.6rem] font-bold tracking-widest uppercase ${idx === selected ? 'text-black/60' : 'text-outline/30'}`}>
                {cmd.desc}
              </span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-12 text-center text-outline/20 text-[0.7rem] font-bold uppercase tracking-[0.3em]">
              NO_MATCHES_FOUND
            </div>
          )}
        </div>

        {/* Footer tips */}
        <div className="px-6 py-4 bg-surface-container-highest flex items-center gap-6 text-[0.55rem] font-bold uppercase tracking-widest text-outline/40">
          <span className="flex items-center gap-2">
            <CornerDownLeft size={10} /> SELECT
          </span>
          <span className="flex items-center gap-2">
            ↑↓ NAVIGATE
          </span>
          <span className="ml-auto text-accent/40 font-mono">
            COMMAND_PALETTE_v2.0
          </span>
        </div>
      </div>
    </div>
  );
}