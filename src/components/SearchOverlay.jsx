import { useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, onSearch }) {
  const inputRef = useRef(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-md glass rounded-lg p-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <Search size={18} className="text-terminal-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search messages..."
            className="flex-1 bg-transparent border-none text-terminal-text font-mono text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(e.target.value);
                onClose();
              }
            }}
          />
          <button onClick={onClose} className="p-1 hover:bg-terminal-bg-tertiary rounded">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}