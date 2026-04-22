// narad/src/components/FloatingChat.jsx
import React, { useState, useEffect } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatWindow from './ChatWindow';
import { sendChat } from '../lib/api';

export default function FloatingChat({ 
  sessions = [], 
  currentSessionId, 
  onSelectSession, 
  onNewChat, 
  onDeleteSession,
  onUpdateMessages 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  // Get current messages from the active session
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const messages = currentSession?.messages || [];

  useEffect(() => {
    const handleExternalChat = (e) => {
      const { text, open = true } = e.detail;
      if (open) setIsOpen(true);
      if (text) handleSend(text);
    };
    
    const handleLoadSession = (e) => {
      onSelectSession(e.detail.id);
      setIsOpen(true);
    };

    window.addEventListener('narad:send-chat', handleExternalChat);
    window.addEventListener('narad:load-session', handleLoadSession);
    return () => {
      window.removeEventListener('narad:send-chat', handleExternalChat);
      window.removeEventListener('narad:load-session', handleLoadSession);
    };
  }, [currentSessionId, messages]);

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    onUpdateMessages(currentSessionId, newMessages);
    
    try {
      const response = await sendChat(text, currentSessionId, { messages: newMessages.slice(-10) });
      const assistantMsg = { role: 'assistant', content: response.reply || response.message };
      onUpdateMessages(currentSessionId, [...newMessages, assistantMsg]);
      if (!isOpen) setUnread(prev => prev + 1);
    } catch (err) {
      onUpdateMessages(currentSessionId, [...newMessages, { role: 'assistant', content: 'Error: ' + err.message }]);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(0);
  };

  return (
    <>
      {!isOpen && <FloatingChatButton onClick={handleOpen} unread={unread} />}
      {isOpen && (
        <ChatWindow 
          onClose={() => setIsOpen(false)} 
          messages={messages} 
          onSend={handleSend} 
          sessions={sessions}
          currentSessionId={currentSessionId}
          onSelectSession={onSelectSession}
          onNewChat={onNewChat}
          onDeleteSession={onDeleteSession}
        />
      )}
    </>
  );
}
