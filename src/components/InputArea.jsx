import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

export default function InputArea({ onSend, disabled, placeholder = 'Ask anything...' }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-4 lg:px-6 pb-4 lg:pb-6">
      <div className="input-container max-w-3xl mx-auto">
        {/* Processing indicator */}
        {disabled && (
          <div className="flex items-center gap-2 px-4 pt-3 text-sm text-chat-text-muted">
            <Sparkles size={14} className="animate-pulse" />
            <span>Thinking...</span>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end gap-2 p-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 bg-transparent border-none text-chat-text placeholder-chat-text-muted text-[15px] resize-none outline-none min-h-[24px] max-h-[200px] py-2"
            rows={1}
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={!input.trim() || disabled}
            className="p-2.5 rounded-xl bg-chat-accent text-white hover:bg-chat-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-0.5"
          >
            <Send size={18} />
          </button>
        </div>

        {/* Helper text */}
        <div className="px-4 pb-2 text-xs text-chat-text-muted text-center">
          Press <kbd className="px-1.5 py-0.5 rounded bg-chat-bg-tertiary text-chat-text-secondary font-medium">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 rounded bg-chat-bg-tertiary text-chat-text-secondary font-medium">Shift + Enter</kbd> for new line
        </div>
      </div>
    </div>
  );
}