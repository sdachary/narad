import { forwardRef, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Copy, Check } from 'lucide-react';

export default forwardRef(function ChatArea({ messages, isProcessing, appName = 'NARAD AI' }, ref) {
  const containerRef = useRef(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isProcessing]);

  const renderContent = (content) => {
    try {
      const html = marked.parse(content || '');
      return DOMPurify.sanitize(html);
    } catch {
      return content;
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto no-scrollbar scroll-smooth"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-4xl mx-auto px-8 lg:px-12 py-16 space-y-20">
        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-start justify-center py-24 space-y-8 animate-in fade-in duration-1000">
            <div className="flex gap-2 mb-4">
              <div className="w-3 h-3 bg-error" />
              <div className="w-3 h-3 bg-secondary" />
              <div className="w-3 h-3 bg-tertiary-fixed" />
            </div>
            <h2 className="text-5xl font-bold tracking-tight uppercase font-headline leading-none text-[#eaffde]">
              Sovereign Console <br/> <span className="text-accent">Initialized</span>
            </h2>
            <div className="space-y-4 max-w-xl border-l border-accent/20 pl-6 py-2">
              <p className="text-xl font-light text-on-surface opacity-80 leading-relaxed">
                Kernel version 1.2.0 active. All neural pathways are synchronized. Standing by for command injection.
              </p>
              <div className="flex gap-4 text-[0.6rem] font-bold tracking-[0.3em] text-accent uppercase">
                <span>[ SECURE ]</span>
                <span>[ LOCAL_STORAGE_ACTIVE ]</span>
                <span>[ NEURAL_READY ]</span>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <article 
            key={idx} 
            data-message-index={idx}
            className={`flex flex-col items-start gap-4 group animate-in slide-in-from-bottom-4 duration-500 steps-4 ${msg.role === 'user' ? 'items-end' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span className={`chip ${msg.role === 'user' ? 'chip-user' : 'chip-system'}`}>
                {msg.role === 'user' ? 'USER' : 'SYSTEM'}
              </span>
              <span className="text-[0.6rem] text-outline/40 tracking-widest uppercase font-bold">
                {msg.role === 'user' ? '0x8291A' : 'STATUS: AUTHORIZED'}
              </span>
            </div>
            
            <div className={`
              w-full max-w-4xl transition-none p-6 text-lg
              ${msg.role === 'user' 
                ? 'bg-surface-container-low text-[#eaffde] font-light italic leading-relaxed max-w-2xl text-right' 
                : 'bg-transparent text-on-surface font-light leading-relaxed'}
            `}>
              <div 
                className={`prose prose-invert prose-emerald max-w-none break-words ${msg.role === 'assistant' ? 'assistant-editorial' : ''}`}
                dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
              />

              {/* Copy button */}
              {msg.role === 'assistant' && (
                <div className="flex justify-end mt-4 opacity-0 group-hover:opacity-100 transition-none">
                  <button
                    onClick={() => copyToClipboard(msg.content, idx)}
                    className="flex items-center gap-2 text-[0.6rem] font-bold tracking-widest text-outline/40 hover:text-accent uppercase transition-none"
                    title="Copy to terminal"
                  >
                    {copiedIdx === idx ? <Check size={12} className="text-accent" /> : <><Copy size={12} /> [ COPY_RAW ]</>}
                  </button>
                </div>
              )}
            </div>
          </article>
        ))}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <span className="chip chip-system">SYSTEM</span>
              <span className="text-[0.6rem] text-accent tracking-widest uppercase font-bold animate-pulse">
                TRACE_ACTIVE...
              </span>
            </div>
            <div className="p-8 bg-surface-container-low w-full relative overflow-hidden">
              <div className="scanline" />
              <div className="flex justify-between items-center text-[0.7rem] font-bold tracking-[0.2em] text-accent mb-4">
                <span>[ CORE_PROCESSING ]</span>
                <span className="animate-pulse">MAP_REDUCING...</span>
              </div>
              <div className="h-2 w-full bg-black">
                <div className="h-full bg-accent animate-[scan_2s_linear_infinite]" style={{ width: '30%' }} />
              </div>
            </div>
          </div>
        )}
        
        <div className="h-32" />
      </div>
    </div>
  );
});