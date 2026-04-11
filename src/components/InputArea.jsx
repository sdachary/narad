import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function InputArea({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 glass border-t border-terminal-border">
      {disabled && (
        <div className="flex items-center gap-2 mb-2 text-sm text-terminal-text-muted">
          <span className="animate-spin">⠋</span>
          <span>Processing...</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-terminal-accent text-sm flex-shrink-0">{'>'}</span>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type / for commands..."
          className="flex-1 bg-transparent border-none text-terminal-text font-mono text-sm resize-none outline-none min-h-[20px] max-h-[150px]"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-1.5 rounded bg-terminal-accent text-white hover:bg-terminal-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}