import { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FloatingChat from './components/FloatingChat';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

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

  const handleSelectSession = (id) => {
    setCurrentSession(id);
  };

  const handleNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      label: 'New Chat',
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession.id);
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

  return (
    <div className="flex h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent)] selection:text-white">
      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-[var(--accent)]/5 blur-[120px]"></div>
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[50%] rounded-full bg-[var(--accent-alt)]/5 blur-[120px]"></div>
      </div>

      <div className="flex-1 flex flex-col relative z-10 overflow-hidden">
        <Header 
          theme={theme} 
          onToggleTheme={toggleTheme} 
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Dashboard />
        </main>

        <FloatingChat 
          sessions={sessions} 
          currentSessionId={currentSession}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewSession}
          onDeleteSession={handleDeleteSession}
          onUpdateMessages={(id, messages) => {
            setSessions(prev => prev.map(s => s.id === id ? { ...s, messages } : s));
          }}
        />
      </div>
    </div>
  );
}