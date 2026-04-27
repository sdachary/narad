// narad/src/components/FloatingChatButton.jsx
import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function FloatingChatButton({ onClick, unread = 0 }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 z-[100]"
      style={{ 
        backgroundColor: 'var(--accent)',
        boxShadow: 'var(--shadow-floating)',
      }}
    >
      <MessageSquare className="w-6 h-6 text-white" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--status-error)] rounded-full text-xs text-white flex items-center justify-center">
          {unread}
        </span>
      )}
    </button>
  );
}
