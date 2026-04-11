import { useEffect, useRef, useState } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Bot, User, Copy, Check } from 'lucide-react';

export default function ChatArea({ messages, isProcessing, appName = 'narad' }) {
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
      className="flex-1 overflow-y-auto scroll-smooth bg-chat-bg"
    >
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-10 space-y-10">
        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-chat-accent/10 flex items-center justify-center text-chat-accent mb-2">
              <Bot size={32} />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-chat-text">Welcome to {appName}</h2>
            <p className="text-chat-text-secondary max-w-sm">
              Your serene workspace for intelligent thought and creative collaboration.
            </p>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`group animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div className={`flex gap-4 lg:gap-6 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-chat-text text-chat-bg' : 'bg-chat-accent/10 text-chat-accent'
              }`}>
                {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
              </div>

              {/* Message Content Area */}
              <div className={`flex-1 flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[calc(100%-3rem)]`}>
                <div className="flex items-center gap-2 mb-1.5 px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-chat-text-muted">
                    {msg.role === 'user' ? 'You' : appName}
                  </span>
                </div>
                
                <div 
                  className={`relative p-4 lg:p-5 rounded-3xl transition-all ${
                    msg.role === 'user' 
                      ? 'bg-chat-accent text-white shadow-lg shadow-chat-accent/20 rounded-tr-md' 
                      : 'bg-chat-bg-message text-chat-text border border-chat-border shadow-sm rounded-tl-md'
                  }`}
                >
                  <div 
                    className={`prose prose-sm max-w-none break-words ${msg.role === 'user' ? 'prose-invert' : 'prose-slate'}`}
                    dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                  />

                  {/* Copy button for assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="absolute top-2 right-2 flex opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => copyToClipboard(msg.content, idx)}
                        className="p-1.5 rounded-xl bg-chat-bg-secondary hover:bg-chat-bg-tertiary text-chat-text-secondary hover:text-chat-text transition-all"
                        title="Copy"
                      >
                        {copiedIdx === idx ? <Check size={14} className="text-chat-success" /> : <Copy size={14} />}
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
            <div className="w-9 h-9 rounded-2xl bg-chat-accent/10 flex items-center justify-center text-chat-accent flex-shrink-0">
              <Bot size={18} />
            </div>
            <div className="flex items-center gap-1.5 px-4 py-3 bg-chat-bg-tertiary/50 rounded-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-chat-accent/40 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-chat-accent/40 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-chat-accent/40 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
        
        {/* Padding for bottom input area space */}
        <div className="h-24" />
      </div>
    </div>
  );
}