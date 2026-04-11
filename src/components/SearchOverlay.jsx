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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div 
        className="relative w-full max-w-xl bg-chat-bg rounded-2xl shadow-soft-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 p-4">
          <Search size={20} className="text-chat-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search messages..."
            className="flex-1 bg-transparent border-none text-chat-text placeholder-chat-text-muted text-[15px] outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(e.target.value);
                onClose();
              }
            }}
          />
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-chat-bg-tertiary text-chat-text-secondary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tips */}
        <div className="px-4 pb-3 text-xs text-chat-text-muted">
          Press <kbd className="px-1.5 py-0.5 rounded bg-chat-bg-tertiary font-medium">Enter</kbd> to search · <kbd className="px-1.5 py-0.5 rounded bg-chat-bg-tertiary font-medium">esc</kbd> to close
        </div>
      </div>
    </div>
  );
}