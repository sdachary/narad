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
    <div className="fixed bottom-0 left-0 right-0 lg:left-72 pointer-events-none pb-6 lg:pb-10">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 pointer-events-auto">
        <div className="input-container bg-chat-bg-message/80 backdrop-blur-xl border border-chat-border shadow-2xl shadow-black/5 rounded-[2rem] transition-all focus-within:ring-2 focus-within:ring-chat-accent/20">
          
          {/* Processing indicator */}
          {disabled && (
            <div className="flex items-center gap-2 px-6 pt-3 text-[11px] font-bold uppercase tracking-wider text-chat-accent/70 animate-pulse">
              <Sparkles size={12} />
              <span>Thinking...</span>
            </div>
          )}

          {/* Input area */}
          <div className="flex items-end gap-3 p-3 lg:p-4">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              className="flex-1 bg-transparent border-none text-chat-text placeholder-chat-text-muted text-[15px] leading-relaxed resize-none outline-none min-h-[24px] max-h-[200px] py-1 pl-2"
              rows={1}
              disabled={disabled}
            />
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              onClick={handleSubmit}
              className={`p-3 rounded-[1.25rem] transition-all transform active:scale-95 ${
                !input.trim() || disabled
                  ? 'bg-chat-bg-tertiary text-chat-text-muted opacity-50'
                  : 'bg-chat-accent text-white shadow-lg shadow-chat-accent/30 hover:bg-chat-accent-hover'
              }`}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Helper info on focus (optional / minimal) */}
          <div className="px-6 pb-2 text-[10px] text-chat-text-muted/60 text-right font-medium">
             Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}