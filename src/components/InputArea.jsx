import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

const styles = {
  container: { backgroundColor: 'var(--bg-message)', borderColor: 'var(--border)', boxShadow: 'var(--shadow-lg)' },
  containerFocus: { borderColor: 'var(--accent)', boxShadow: '0 0 0 3px rgba(79, 70, 229, 0.1)' },
  text: { color: 'var(--text)' },
  textMuted: { color: 'var(--text-muted)' },
  accent: { color: 'var(--accent)' },
  input: { backgroundColor: 'transparent', color: 'var(--text)' },
  placeholder: { color: 'var(--text-muted)' },
  btnDisabled: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-muted)', opacity: 0.5 },
  btnEnabled: { backgroundColor: 'var(--accent)', color: '#FFFFFF', boxShadow: 'var(--shadow-sm)' },
};

export default function InputArea({ onSend, disabled, placeholder = 'Ask anything...' }) {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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
        <div 
          className="input-container backdrop-blur-xl border shadow-2xl shadow-black/5 rounded-[2rem] transition-all"
          style={{ ...styles.container, ...(isFocused ? styles.containerFocus : {}) }}
        >
          
          {/* Processing indicator */}
          {disabled && (
            <div className="flex items-center gap-2 px-6 pt-3 text-[11px] font-bold uppercase tracking-wider animate-pulse" style={styles.accent}>
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
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className="flex-1 border-none text-[15px] leading-relaxed resize-none outline-none min-h-[24px] max-h-[200px] py-1 pl-2"
              style={styles.input}
              rows={1}
              disabled={disabled}
            />
            <button
              type="submit"
              disabled={!input.trim() || disabled}
              onClick={handleSubmit}
              className="p-3 rounded-[1.25rem] transition-all transform active:scale-95"
              style={!input.trim() || disabled ? styles.btnDisabled : styles.btnEnabled}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Helper info */}
          <div className="px-6 pb-2 text-[10px] text-right font-medium" style={{ ...styles.textMuted, opacity: 0.6 }}>
             Shift + Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}