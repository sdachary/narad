import { useState, useRef, useEffect } from 'react';

export default function InputArea({ onSend, disabled, placeholder = 'ENTER COMMAND...' }) {
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
    <div className="w-full">
      {/* Command Line Container */}
      <div className="relative flex items-center bg-black border-none px-6 py-5 shadow-sunken group">
        <span className="text-accent font-bold mr-4 text-xl">&gt;</span>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:ring-0 text-[#eaffde] font-bold placeholder:text-outline/10 w-full text-lg uppercase tracking-wider resize-none py-1 h-[28px] overflow-hidden"
          rows={1}
          disabled={disabled}
        />

        <div className="flex items-center gap-6 ml-4">
          <div className={`blinking-cursor ${disabled ? 'opacity-0' : ''}`} />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className={`
              px-8 py-2 text-[0.7rem] font-bold uppercase tracking-widest transition-none active:scale-95
              ${!input.trim() || disabled 
                ? 'bg-surface-container text-outline/20' 
                : 'bg-accent text-black hover:bg-white'}
            `}
          >
            {disabled ? 'TRACING...' : 'EXECUTE'}
          </button>
        </div>
      </div>
    </div>
  );
}