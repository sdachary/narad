import { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';

export default function InputArea({ onSend, disabled, placeholder = "ENTER_COMMAND_QUERY..." }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = () => {
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  return (
    <div className="w-full relative px-8 pb-12">
      {/* Bauhaus Geometric Composition behind the input */}
      <div className="absolute -top-12 -left-4 w-24 h-24 rounded-full bg-bauhaus-yellow opacity-10 pointer-events-none" />
      <div className="absolute top-4 -right-8 w-32 h-32 bg-bauhaus-blue opacity-10 rotate-45 pointer-events-none" />

      {/* Main Command Box */}
      <div className="relative flex items-stretch bg-white border-4 border-black p-4 shadow-bauhaus-lg transition-all">
        {/* Terminal Indicator */}
        <div className="flex flex-col items-center justify-center px-4 border-r-4 border-black bg-bauhaus-yellow">
          <span className="text-black font-black text-2xl tracking-tighter">&gt;</span>
        </div>
        
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none focus:ring-0 text-black font-bold placeholder:text-black/20 w-full text-lg uppercase tracking-widest resize-none py-4 px-6 h-[64px] overflow-hidden leading-tight"
          rows={1}
          disabled={disabled}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-4 ml-4">
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className={`
              h-full px-12 border-4 border-black text-sm font-black uppercase tracking-[0.2em] transition-all
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
              ${!input.trim() || disabled 
                ? 'bg-gray-100 text-black/20 shadow-none' 
                : 'bg-bauhaus-red text-white shadow-bauhaus-sm hover:bg-black'}
            `}
          >
            {disabled ? 'PROCESS' : 'EXECUTE'}
          </button>
        </div>
      </div>

      {/* Footer Meta labels */}
      <div className="flex justify-between mt-4 px-1">
        <div className="flex gap-8">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-bauhaus-red border-2 border-black" />
             <span className="text-[0.6rem] font-bold uppercase tracking-widest text-black/40">UPLINK: ENCRYPTED</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-bauhaus-blue border-2 border-black" />
             <span className="text-[0.6rem] font-bold uppercase tracking-widest text-black/40">NODE_VERSION: v3.1</span>
          </div>
        </div>
        <div className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-black">
          BAUHAUS_OS // CONSTRUCTIVIST_CORE
        </div>
      </div>
    </div>
  );
}