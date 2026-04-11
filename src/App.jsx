import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Sidebar from './components/Sidebar';
import { sendChat } from './lib/api';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import CommandPalette from './components/CommandPalette';
import BrainModal from './components/BrainModal';
import SearchOverlay from './components/SearchOverlay';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showBrain, setShowBrain] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('narad_sessions');
    if (saved) {
      const parsed = JSON.parse(saved);
      setSessions(parsed);
      setCurrentSession(parsed[0]?.id || null);
    } else {
      const initial = [{ id: 'default', label: 'New Chat', messages: [] }];
      setSessions(initial);
      setCurrentSession('default');
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('narad_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Load current session messages
  useEffect(() => {
    const session = sessions.find(s => s.id === currentSession);
    if (session?.messages) {
      setMessages(session.messages);
    } else {
      setMessages([]);
    }
  }, [currentSession, sessions]);

  const handleToggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('narad_theme', newTheme);
  };

  const handleNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      label: 'New Chat',
      messages: [],
    };
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession.id);
    setSidebarOpen(false);
  };

  const handleSelectSession = (id) => {
    setCurrentSession(id);
  };

  const handleDeleteSession = (id) => {
    const filtered = sessions.filter(s => s.id !== id);
    setSessions(filtered);
    if (currentSession === id) {
      setCurrentSession(filtered[0]?.id || null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+T - Toggle theme
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        handleToggleTheme();
      }
      // Cmd+K - Clear chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setMessages([]);
      }
      // Cmd+F - Search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
      // / - Command palette (when not in input)
      if (e.key === '/' && document.activeElement?.tagName !== 'TEXTAREA' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault();
        setShowCommands(true);
      }
      // Ctrl+C - Stop
      if (e.key === 'c' && e.ctrlKey && isProcessing) {
        e.preventDefault();
        setIsProcessing(false);
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, isProcessing]);

  const handleSendMessage = async (text) => {
    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsProcessing(true);
    
    try {
      const response = await sendChat(text, currentSession, {
        messages: newMessages.slice(-10),
      });
      
      const assistantMsg = { role: 'assistant', content: response.reply || response.message };
      setMessages([...newMessages, assistantMsg]);
      
      const updatedSessions = sessions.map(s => 
        s.id === currentSession 
          ? { ...s, messages: [...newMessages, assistantMsg] }
          : s
      );
      setSessions(updatedSessions);
    } catch (err) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Error: ' + err.message 
      }]);
    }
    
    setIsProcessing(false);
  };

  return (
    <div data-theme={theme} className="h-screen flex flex-col bg-chat-bg text-chat-text selection:bg-chat-accent/20">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSearch={() => setShowSearch(true)}
        onClear={() => setMessages([])}
        onBrainStats={() => setShowBrain(true)}
        onStop={() => {}}
        isConnected={isConnected}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <aside className={`
          fixed lg:relative inset-y-0 left-0 z-40
          w-72 bg-chat-bg-secondary border-r border-chat-border
          flex flex-col transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            <button
              onClick={handleNewSession}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-chat-accent text-white font-medium hover:bg-chat-accent-hover shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <Plus size={18} />
              New Chat
            </button>
          </div>
          <Sidebar
            sessions={sessions}
            currentSession={currentSession}
            onNewSession={handleNewSession}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            sidebarOpen={sidebarOpen}
          />
        </aside>
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <ChatArea 
            messages={messages} 
            isProcessing={isProcessing} 
          />
          <InputArea 
            onSend={handleSendMessage} 
            disabled={isProcessing} 
          />
        </main>
        
        <CommandPalette 
          isOpen={showCommands} 
          onClose={() => setShowCommands(false)}
          onSelect={(cmd) => {
            setShowCommands(false);
          }}
        />
        <BrainModal isOpen={showBrain} onClose={() => setShowBrain(false)} />
        <SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} onSearch={(q) => {}} />
      </div>
    </div>
  );
}