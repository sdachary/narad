import { useEffect, useRef, useState } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, onSearch, messages = [] }) {
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
      const found = messages.filter(msg => 
        msg.content && msg.content.toLowerCase().includes(searchTerm)
      );
      setResults(found);
    } else {
      setResults([]);
    }
  }, [query, messages]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-xl rounded-2xl shadow-lg overflow-hidden"
        style={{ backgroundColor: 'var(--bg)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 p-4" style={{ borderColor: 'var(--border)', borderBottom: '1px solid' }}>
          <Search size={20} style={{ color: 'var(--text-muted)' }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-[15px] outline-none"
            style={{ color: 'var(--text)' }}
          />
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:opacity-80 transition-colors"
            style={{ color: 'var(--text-secondary)' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-64 overflow-y-auto p-2">
            {results.map((msg, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSearch(query);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <div className="text-[11px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="text-sm line-clamp-2" style={{ color: 'var(--text)' }}>
                  {msg.content}
                </div>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="p-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            No messages found
          </div>
        )}

        {/* Tips */}
        <div className="px-4 pb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Press <kbd className="px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--bg-tertiary)' }}>Enter</kbd> to search · <kbd className="px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: 'var(--bg-tertiary)' }}>esc</kbd> to close
        </div>
      </div>
    </div>
  );
}