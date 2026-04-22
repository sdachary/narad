// narad/src/components/ChatWindow.jsx
import React, { useState, useRef, useEffect } from 'react';
import { X, Clock, Send, ChevronLeft, Trash2, Plus, MessageSquare } from 'lucide-react';

export default function ChatWindow({ 
  onClose, 
  messages = [], 
  onSend, 
  sessions = [], 
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession 
}) {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const messagesRef = useRef(null);

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
      className="fixed bottom-6 right-6 w-[400px] h-[600px] rounded-[var(--radius-xl)] flex flex-col overflow-hidden z-[100] animate-in slide-in-from-bottom-4 duration-300"
      style={{ 
        backgroundColor: 'var(--bg-surface)',
        boxShadow: 'var(--shadow-floating)',
        border: '1px solid var(--border-subtle)',
      }}
    >
      {showHistory ? (
        <div className="flex flex-col h-full bg-[var(--bg-canvas)]">
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <button onClick={() => setShowHistory(false)} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
              <ChevronLeft className="w-5 h-5 text-[var(--text-secondary)]" />
            </button>
            <span className="font-bold text-[var(--text-primary)]">Chat History</span>
            <button 
              onClick={() => { onNewChat(); setShowHistory(false); }}
              className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] text-[var(--accent)] transition-colors"
              title="New Chat"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                  session.id === currentSessionId ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/20' : 'hover:bg-[var(--bg-elevated)]'
                }`}
                onClick={() => { onSelectSession(session.id); setShowHistory(false); }}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${session.id === currentSessionId ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`} />
                  <div className="overflow-hidden">
                    <div className={`text-sm font-semibold truncate ${session.id === currentSessionId ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {session.label || 'Untitled Session'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-500/10 text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)] animate-pulse" />
              <span className="font-bold text-[var(--text-primary)]">Narad Assistant</span>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowHistory(true)} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)]">
                <Clock className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors text-[var(--text-secondary)]">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[var(--bg-canvas)]/50">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-[var(--text-secondary)] opacity-50 space-y-2">
                <MessageSquare size={32} />
                <p className="text-sm font-medium">How can I help you today?</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div 
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-3.5 rounded-2xl max-w-[85%] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--accent)] text-white rounded-tr-none' 
                      : 'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] rounded-tl-none'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-4 rounded-2xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none transition-all bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-transparent focus:border-[var(--accent)]/50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isProcessing}
                className="p-3 rounded-xl bg-[var(--accent)] text-white disabled:opacity-50 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[var(--accent)]/20"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
