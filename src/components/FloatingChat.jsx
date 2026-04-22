// narad/src/components/FloatingChat.jsx
import React, { useState } from 'react';
import FloatingChatButton from './FloatingChatButton';
import ChatWindow from './ChatWindow';
import { sendChat } from '../lib/api';

export default function FloatingChat({ sessions = [], onSelectSession }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [unread, setUnread] = useState(0);

  const handleSend = async (text) => {
    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    
    try {
      const response = await sendChat(text, 'floating-chat', { messages });
      const assistantMsg = { role: 'assistant', content: response.reply || response.message };
      setMessages(prev => [...prev, assistantMsg]);
      if (!isOpen) setUnread(prev => prev + 1);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnread(0);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {!isOpen && <FloatingChatButton onClick={handleOpen} unread={unread} />}
      {isOpen && (
        <ChatWindow 
          onClose={handleClose} 
          messages={messages} 
          onSend={handleSend} 
          sessions={sessions}
          onSelectSession={onSelectSession}
        />
      )}
    </>
  );
}
