import { forwardRef, useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { User, Copy, Check, Sparkles } from 'lucide-react';

export default forwardRef(function ChatArea({ messages, isProcessing, appName = 'narad' }, ref) {
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
      className="flex-1 overflow-y-auto scroll-smooth"
      style={{ backgroundColor: 'var(--bg)' }}
    >
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 space-y-10">
        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--accent)' }}>
              <Sparkles size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text)' }}>Welcome to {appName}</h2>
            <p className="max-w-sm" style={{ color: 'var(--text-secondary)' }}>
              Your serene workspace for intelligent thought and creative collaboration.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            data-message-index={idx}
            className="group animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className={`flex gap-4 lg:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div 
                className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ 
                  backgroundColor: msg.role === 'user' ? 'var(--text)' : 'var(--accent)', 
                  color: msg.role === 'user' ? 'var(--bg)' : '#fff' 
                }}
              >
                {msg.role === 'user' ? <User size={18} /> : <Sparkles size={18} />}
              </div>

              {/* Message Content Area */}
              <div className={`flex-1 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[calc(100%-3rem)]`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {msg.role === 'user' ? 'You' : appName}
                  </span>
                </div>
                
                <div 
                  className="relative p-4 lg:p-5 rounded-3xl transition-all"
                  style={{ 
                    backgroundColor: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-message)',
                    color: msg.role === 'user' ? 'white' : 'var(--text)',
                    border: msg.role === 'user' ? 'none' : '1px solid var(--border)',
                    boxShadow: msg.role === 'user' ? '0 10px 15px -3px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)',
                    borderTopLeftRadius: msg.role === 'user' ? undefined : '0.375rem',
                    borderTopRightRadius: msg.role === 'user' ? '0.375rem' : undefined,
                    borderBottomLeftRadius: msg.role === 'user' ? '0.375rem' : undefined,
                    borderBottomRightRadius: msg.role === 'user' ? undefined : '0.375rem',
                  }}
                >
                  <div 
                    className="prose prose-sm max-w-none break-words"
                    style={{ 
                      '--tw-prose-body': 'var(--text)',
                      '--tw-prose-headings': 'var(--text)',
                      '--tw-prose-links': 'var(--accent)',
                      '--tw-prose-bold': 'var(--text)',
                      '--tw-prose-code': 'var(--text)',
                    }}
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />

                  {/* Copy button for assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="p-1.5 rounded-xl transition-all"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}
                        title="Copy"
                      >
                        {copiedIdx === idx ? <Check size={14} style={{ color: 'var(--success)' }} /> : <Copy size={14} />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex gap-4 lg:gap-6 animate-pulse">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--accent)' }}>
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl" style={{ backgroundColor: 'var(--bg-tertiary)', opacity: 0.5 }}>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)', opacity: 0.4, animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)', opacity: 0.4, animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: 'var(--accent)', opacity: 0.4, animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        {/* Padding for bottom input area space */}
        <div className="h-24" />
      </div>
    </div>
  );
});