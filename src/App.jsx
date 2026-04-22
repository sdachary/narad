import { useState, useEffect, useRef } from 'react';
import { Plus, PanelLeft, LayoutDashboard, MessageSquare } from 'lucide-react';

import { sendChat, SKILL_CONTEXTS } from './lib/api';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import CommandPalette from './components/CommandPalette';
import BrainModal from './components/BrainModal';
import SearchOverlay from './components/SearchOverlay';
import Dashboard from './components/Dashboard';
import FloatingChat from './components/FloatingChat';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState('dashboard');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [isConnected, setIsConnected] = useState(true);
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCommands, setShowCommands] = useState(false);
  const [showBrain, setShowBrain] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const chatAreaRef = useRef(null);

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
    localStorage.setItem('narad_sessions', JSON.stringify(sessions));
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
    toggleTheme();
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
    if (filtered.length === 0) {
      const initial = [{ id: 'default', label: 'New Chat', messages: [] }];
      setSessions(initial);
      setCurrentSession('default');
    } else {
      setSessions(filtered);
      if (currentSession === id) {
        setCurrentSession(filtered[0]?.id);
      }
    }
  };

  const handleClearMessages = () => {
    setMessages([]);
    setSessions(prev => prev.map(s => 
      s.id === currentSession ? { ...s, messages: [] } : s
    ));
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
        handleClearMessages();
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
      
      if (response.error) {
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Error: ' + (response.error || 'Unknown error')
        }]);
      } else {
        const assistantMsg = { role: 'assistant', content: response.reply || response.message };
        setMessages([...newMessages, assistantMsg]);
        
        const updatedSessions = sessions.map(s => 
          s.id === currentSession 
            ? { ...s, messages: [...newMessages, assistantMsg] }
            : s
        );
        setSessions(updatedSessions);
      }
    } catch (err) {
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Error: ' + err.message 
      }]);
    }
    
    setIsProcessing(false);
  };

  const scrollToMessage = (index) => {
    const container = chatAreaRef.current;
    if (!container) return;
    const messageEl = container.querySelector(`[data-message-index="${index}"]`);
    if (messageEl) {
      messageEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div data-theme={theme} className="h-screen flex flex-col bg-surface-container-lowest text-on-surface selection:bg-accent selection:text-black font-body overflow-hidden">
      {/* Floating Micro-Header */}
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSearch={() => setShowSearch(true)}
        onClear={handleClearMessages}
        onBrainStats={() => setShowBrain(true)}
        onStop={() => {}}
        isConnected={isConnected}
        onViewDashboard={() => setView('dashboard')}
        onViewChat={() => setView('chat')}
        currentView={view}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 flex flex-col items-center overflow-hidden">
          {view === 'dashboard' ? (
            <div className="w-full h-full overflow-y-auto relative">
              <Dashboard />
              <FloatingChat 
                sessions={sessions} 
                onSelectSession={(id) => {
                  handleSelectSession(id);
                  setView('chat');
                }} 
              />
            </div>
          ) : (
            <div className="w-full max-w-5xl flex-1 flex flex-col overflow-hidden relative">
              <ChatArea 
                ref={chatAreaRef}
                messages={messages} 
                isProcessing={isProcessing} 
              />
              <div className="w-full">
                <InputArea 
                  onSend={handleSendMessage} 
                  disabled={isProcessing} 
                />
              </div>
            </div>
          )}
        </main>
        
        <CommandPalette 
          isOpen={showCommands} 
          onClose={() => setShowCommands(false)}
          onSelect={async (cmd) => {
            setShowCommands(false);
            
            // Handle skill commands with context
            if (SKILL_CONTEXTS[cmd]) {
              const skillContext = SKILL_CONTEXTS[cmd];
              setIsProcessing(true);
              try {
                const response = await sendChat(`Starting ${cmd} workflow`, currentSession, {
                  skill_context: skillContext,
                  messages: messages.slice(-10),
                });
                setMessages(prev => [...prev, { role: 'assistant', content: response.reply || response.message }]);
              } catch (err) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
              }
              setIsProcessing(false);
              return;
            }
            
            // Handle provider switching commands
            const providerCommands = ['/cerebras', '/cloudflare', '/groq', '/openrouter', '/github'];
            if (providerCommands.includes(cmd)) {
              const provider = cmd.replace('/', '');
              setIsProcessing(true);
              try {
                const response = await sendChat(`Switch to ${provider} provider`, currentSession, {
                  force_provider: provider,
                  messages: messages.slice(-10),
                });
                setMessages(prev => [...prev, { role: 'assistant', content: response.reply || response.message }]);
              } catch (err) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
              }
              setIsProcessing(false);
              return;
            }
            
            // Handle /models command
            if (cmd === '/models') {
              setIsProcessing(true);
              try {
                const response = await sendChat('List all available models', currentSession, {
                  messages: [],
                });
                setMessages(prev => [...prev, { role: 'assistant', content: response.reply || response.message }]);
              } catch (err) {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
              }
              setIsProcessing(false);
              return;
            }
            
            // Default: send command as message
            setMessages(prev => [...prev, { role: 'user', content: cmd + ' ' }]);
            setIsProcessing(true);
            try {
              const response = await sendChat(cmd, currentSession, {
                messages: messages.slice(-10),
              });
              setMessages(prev => [...prev, { role: 'assistant', content: response.reply || response.message }]);
            } catch (err) {
              setMessages(prev => [...prev, { role: 'assistant', content: 'Error: ' + err.message }]);
            }
            setIsProcessing(false);
          }}
        />
        <BrainModal isOpen={showBrain} onClose={() => setShowBrain(false)} />
        <SearchOverlay 
          isOpen={showSearch} 
          onClose={() => setShowSearch(false)} 
          onNavigate={scrollToMessage}
          messages={messages}
        />
      </div>
    </div>
  );
}