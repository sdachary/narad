// narad/src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Send, ChevronLeft } from 'lucide-react';

export default function ChatWindow({ onClose, messages = [], onSend, sessions = [], onSelectSession }) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesRef = useRef(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, showHistory]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    const userMsg = input;
    setInput('');
    setIsProcessing(true);
    await onSend(userMsg);
    setIsProcessing(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6 w-[400px] h-[500px] rounded-[var(--radius-xl)] flex flex-col overflow-hidden z-[100]"
      style={{ 
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-floating)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {showHistory ? (
        // History Panel
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <button onClick={() => setShowHistory(false)} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
              <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            <span className="font-semibold text-[var(--text-primary)]">History</span>
            <div className="w-8" />
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {(sessions || []).map((session, i) => (
              <button
                key={session.id || i}
                onClick={() => {
                  onSelectSession?.(session.id);
                  setShowHistory(false);
                }}
                className="w-full p-3 text-left rounded-lg hover:bg-[var(--bg-elevated)] transition-colors group"
              >
                <div className="text-sm text-[var(--text-primary)] truncate group-hover:text-[var(--accent)] transition-colors">
                  {session.label || 'Untitled Session'}
                </div>
                <div className="text-xs text-[var(--text-secondary)] mt-1">
                  {session.date || 'Recently'}
                </div>
              </button>
            ))}
            {(!sessions || sessions.length === 0) && (
              <div className="text-center text-[var(--text-secondary)] py-8 text-sm">
                No recent sessions
              </div>
            )}
          </div>
        </div>
      ) : (
        // Chat View
        <>
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--accent-alt)' }}
              />
              <span className="font-semibold text-[var(--text-primary)]">Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowHistory(true)} 
                className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                title="History"
              >
                <Clock className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
              <button 
                onClick={onClose} 
                className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
                title="Close"
              >
                <X className="w-4 h-4 text-[var(--text-secondary)]" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={messagesRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
          >
            {messages.length === 0 && (
              <div className="text-center text-[var(--text-secondary)] py-8 text-sm">
                Ask me anything...
              </div>
            )}
            {messages.map((msg, i) => (
              <div 
                key={i}
                className={`p-3 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'ml-auto bg-[var(--accent)] text-white rounded-tr-sm' 
                    : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-tl-sm'
                } max-w-[85%] shadow-sm`}
              >
                <div className="text-sm leading-relaxed">{msg.content}</div>
              </div>
            ))}
            {isProcessing && (
              <div className="bg-[var(--bg-elevated)] text-[var(--text-primary)] p-3 rounded-2xl rounded-tl-sm max-w-[85%] shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div 
            className="p-4 border-t"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 rounded-xl text-sm outline-none transition-all border border-transparent focus:border-[var(--accent)]"
                style={{ 
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="p-2.5 rounded-xl transition-all disabled:opacity-50 active:scale-95 flex items-center justify-center"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
