import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export default function ChatArea({ messages, isProcessing }) {
  const containerRef = useRef(null);

  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const renderContent = (content) => {
    try {
      const html = marked.parse(content || '');
      return DOMPurify.sanitize(html);
    } catch {
      return content;
    }
  };

  return (
    <main 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.length === 0 && (
        <div className="flex">
          <span className="text-xs text-terminal-text-muted w-14 flex-shrink-0 pt-1">narad</span>
          <div className="message-content">
            <p>Hello! How can I help?</p>
          </div>
        </div>
      )}

      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`flex ${msg.role === 'user' ? 'justify-end' : ''}`}
        >
          {msg.role === 'assistant' && (
            <span className="text-xs text-terminal-text-muted w-14 flex-shrink-0 pt-1">
              narad
            </span>
          )}
          <div 
            className={`message-content glass-card px-3 py-2 max-w-[80%] ${
              msg.role === 'user' 
                ? 'bg-terminal-user text-terminal-user-text' 
                : ''
            }`}
            dangerouslySetInnerHTML={{ __html: renderContent(msg.content) }}
          />
        </div>
      ))}

      {isProcessing && (
        <div className="flex">
          <span className="text-xs text-terminal-text-muted w-14 flex-shrink-0 pt-1">narad</span>
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-text-muted animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-text-muted animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1.5 h-1.5 rounded-full bg-terminal-text-muted animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </main>
  );
}