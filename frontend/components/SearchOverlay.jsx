import { useEffect, useRef, useState } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, onNavigate, messages = [] }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      const found = messages
        .map((msg, idx) => ({ msg, idx }))
        .filter(item => 
          item.msg.content && item.msg.content.toLowerCase().includes(searchTerm)
        );
      setResults(found);
    } else {
      setResults([]);
    }
  }, [query, messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-32 p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <div 
        className="relative w-full max-w-xl bg-surface-container-high shadow-luminous overflow-hidden animate-in fade-in zoom-in-95 duration-200 steps-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="scanline" />
        
        {/* Search input */}
        <div className="flex items-center gap-4 p-5 bg-surface-container-highest border-none">
          <Search size={20} className="text-secondary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH_HISTORY..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-[#eaffde] placeholder-outline/20 text-lg font-bold uppercase tracking-wider outline-none"
          />
          <button 
            onClick={onClose} 
            className="text-outline/40 hover:text-accent transition-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto no-scrollbar p-0 bg-black">
          {results.length > 0 && (
            <div className="divide-y divide-outline/10">
              {results.map((item) => (
                <button
                  key={item.idx}
                  onClick={() => {
                    onNavigate(item.idx);
                    onClose();
                  }}
                  className="w-full text-left p-6 hover:bg-surface-container-low transition-none group"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`chip ${item.msg.role === 'user' ? 'chip-user' : 'chip-system'} scale-75 origin-left`}>
                      {item.msg.role === 'user' ? 'USER' : 'SYSTEM'}
                    </span>
                    <span className="text-[0.55rem] text-outline/20 font-bold uppercase tracking-widest">MSG_INDEX: {item.idx}</span>
                  </div>
                  <div className="text-sm font-light text-on-surface line-clamp-3 leading-relaxed group-hover:text-accent opacity-70 group-hover:opacity-100 transition-none">
                    {item.msg.content}
                  </div>
                </button>
              ))}
            </div>
          )}

          {query && results.length === 0 && (
            <div className="p-16 text-center text-outline/20 text-[0.7rem] font-bold uppercase tracking-[0.3em]">
              NO_MATCHES_FOUND
            </div>
          )}
        </div>

        {/* Footer tips */}
        <div className="px-6 py-4 bg-surface-container-highest flex items-center justify-between">
          <div className="flex gap-4 text-[0.55rem] font-bold uppercase tracking-widest text-outline/40">
            <span className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-black">ENTER</kbd> NAVIGATE
            </span>
            <span className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-black">ESC</kbd> CLOSE
            </span>
          </div>
          <span className="text-[0.55rem] text-accent/40 font-mono font-bold tracking-widest uppercase">
            LOG_QUERY_ENGINE
          </span>
        </div>
      </div>
    </div>
  );
}