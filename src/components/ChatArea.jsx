import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useState } from 'react';

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
    <main 
      ref={containerRef}
      className="flex-1 overflow-y-auto"
    >
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 space-y-6">
        {/* Welcome / empty state */}
        {messages.length === 0 && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-chat-accent flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-chat-text mb-1">{appName}</div>
              <div className="text-chat-text-secondary prose prose-sm max-w-none">
                <p>Hello! How can I help you today?</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex gap-3 lg:gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-chat-text' : 'bg-chat-accent'
            }`}>
              {msg.role === 'user' 
                ? <User size={16} className="text-chat-bg" /> 
                : <Bot size={16} className="text-white" />
              }
            </div>

            {/* Message bubble */}
            <div className={`flex-1 max-w-[85%] ${msg.role === 'user' ? 'items-end flex' : ''}`}>
              <div className={`text-sm font-medium text-chat-text mb-1.5 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.role === 'user' ? 'You' : appName}
              </div>
              <div 
                className={`px-4 py-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-chat-accent text-white rounded-tr-md' 
                    : 'bg-chat-bg-tertiary text-chat-text rounded-tl-md'
                }`}
              >
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
                />
              </div>
              
              {/* Copy button for assistant messages */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => copyToClipboard(msg.content, idx)}
                  className="mt-1 p-1.5 rounded-md text-chat-text-muted hover:text-chat-text hover:bg-chat-bg-tertiary transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy"
                >
                  {copiedIdx === idx ? <Check size={14} /> : <Copy size={14} />}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isProcessing && (
          <div className="flex gap-3 lg:gap-4">
            <div className="w-8 h-8 rounded-lg bg-chat-accent flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-chat-accent animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}