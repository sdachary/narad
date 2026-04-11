# Narad React UI Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate narad from vanilla HTML/CSS/JS to React using 21st.dev components while preserving all functionality.

**Architecture:** React + Vite + Tailwind CSS → static files → Cloudflare Pages. Keep existing `_worker.js` backend unchanged. New frontend in `/src/` with React components.

**Tech Stack:** React 18, Vite, Tailwind CSS, 21st.dev components, Lucide icons

---

## File Structure

```
narad/
├── src/                          # NEW React frontend
│   ├── main.jsx                  # Entry point
│   ├── index.css                # Tailwind + custom styles
│   ├── App.jsx                  # Main app component
│   ├── components/
│   │   ├── Sidebar.jsx          # Session sidebar
│   │   ├── Header.jsx           # Top header
│   │   ├── ChatArea.jsx         # Messages display
│   │   ├── InputArea.jsx        # User input
│   │   ├── CommandPalette.jsx    # /commands modal
│   │   ├── BrainModal.jsx       # Brain stats modal
│   │   └── SearchOverlay.jsx     # Search modal
│   ├── hooks/
│   │   ├── useSessions.js       # Session management
│   │   └── useChat.js         # Chat logic
│   └── lib/
│       ├── api.js             # API calls (adapted from app.js)
│       └── utils.js          # Utilities
├── pages/                       # EXISTING (unchanged)
│   ├── _worker.js            # Backend (keep as-is)
│   ├── routes/               # API routes (keep)
│   └── services/             # Services (keep)
├── index.html                  # Update to load React
├── package.json               # Add React dependencies
├── vite.config.js           # Vite config for Cloudflare
├── tailwind.config.js       # Tailwind config
└── postcss.config.js        # PostCSS config
```

---

## Tasks

### Task 1: Setup React + Vite + Tailwind

**Files:**
- Modify: `narad/package.json`
- Create: `narad/vite.config.js`
- Create: `narad/tailwind.config.js`
- Create: `narad/postcss.config.js`

- [ ] **Step 1: Update package.json with React deps**

```json
{
  "name": "narad",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "wrangler pages dev pages",
    "deploy": "wrangler pages deploy pages",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "wrangler": "^4.80.0",
    "vite": "^5.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  },
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "dompurify": "^3.3.3",
    "highlight.js": "^11.11.1",
    "hono": "^4.6.0",
    "marked": "^17.0.5",
    "xlsx": "^0.18.5"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    host: true,
  },
});
```

- [ ] **Step 3: Create tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          'bg-tertiary': '#21262d',
          border: '#30363d',
          text: '#e6edf3',
          'text-secondary': '#8b949e',
          'text-muted': '#6e7681',
          accent: '#58a6ff',
          'accent-hover': '#79c0ff',
          success: '#3fb950',
          error: '#f85149',
          user: '#238636',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

- [ ] **Step 4: Create postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: Run npm install in /home/deepak/Work/narad**

```bash
cd /home/deepak/Work/narad && npm install
```

Expected: install completes with no errors

---

### Task 2: Create React Entry Point & Base Styles

**Files:**
- Create: `narad/src/main.jsx`
- Create: `narad/src/index.css`
- Modify: `narad/index.html`

- [ ] **Step 1: Create src/main.jsx**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 2: Create src/index.css with Tailwind**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Base styles */
@layer base {
  :root {
    --bg: #0d1117;
    --bg-secondary: #161b22;
    --bg-tertiary: #21262d;
    --border: #30363d;
    --text: #e6edf3;
    --text-secondary: #8b949e;
    --text-muted: #6e7681;
    --accent: #58a6ff;
    --accent-hover: #79c0ff;
    --success: #3fb950;
    --error: #f85149;
    --user-bg: #238636;
    --user-text: #ffffff;
  }

  [data-theme='light'] {
    --bg: #ffffff;
    --bg-secondary: #f6f8fa;
    --bg-tertiary: #eaeef2;
    --border: #d0d7de;
    --text: #1f2328;
    --text-secondary: #656d76;
    --text-muted: #8c959f;
    --accent: #0969da;
    --accent-hover: #0550ae;
    --user-bg: #1a7f37;
  }

  html {
    font-size: 14px;
    line-height: 1.6;
  }

  body {
    @apply bg-terminal-bg text-terminal-text font-mono;
    height: 100vh;
    overflow: hidden;
  }
}

/* Glass effect utility */
@layer utilities {
  .glass {
    @apply bg-terminal-bg-secondary backdrop-blur-md border border-terminal-border;
  }

  .glass-card {
    @apply glass rounded-lg;
  }
}

/* Message code blocks */
.message-content pre {
  @apply bg-terminal-bg-secondary border border-terminal-border rounded-md p-3 overflow-x-auto my-2;
}

.message-content code {
  @apply bg-terminal-bg-tertiary px-1 py-0.5 rounded text-terminal-accent text-sm;
}

.message-content pre code {
  @apply bg-transparent p-0 text-terminal-text;
}
```

- [ ] **Step 3: Update index.html for React**

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>narad</title>
    <meta name="description" content="OpenCode-inspired terminal AI">
    <meta name="theme-color" content="#0d1117">
    <link rel="stylesheet" href="/src/index.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

- [ ] **Step 4: Create placeholder App.jsx**

```jsx
import { useState } from 'react';

export default function App() {
  const [theme, setTheme] = useState('dark');
  
  return (
    <div data-theme={theme} className="h-screen flex">
      <div className="p-4">Loading narad...</div>
    </div>
  );
}
```

- [ ] **Step 5: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: dist/ folder created with index.html and assets/

---

### Task 3: Build Sidebar Component

**Files:**
- Create: `narad/src/components/Sidebar.jsx`
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Create Sidebar.jsx**

```jsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, Brain } from 'lucide-react';

export default function Sidebar({ sessions, currentSession, onNewSession, onSelectSession, onDeleteSession }) {
  const [hoveredSession, setHoveredSession] = useState(null);

  return (
    <aside className="w-60 h-full glass flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-terminal-border">
        <span className="text-xs font-semibold text-terminal-text-secondary uppercase tracking-wide">
          Sessions
        </span>
        <button
          onClick={onNewSession}
          className="p-1 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-accent transition-colors"
          title="New Session"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Session List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sessions.map((session) => (
          <div
            key={session.id}
            onClick={() => onSelectSession(session.id)}
            onMouseEnter={() => setHoveredSession(session.id)}
            onMouseLeave={() => setHoveredSession(null)}
            className={`group flex items-center justify-between p-2 rounded cursor-pointer text-xs transition-all
              ${session.id === currentSession 
                ? 'bg-terminal-accent text-terminal-bg border-l-2 border-terminal-accent' 
                : 'hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text'
              }`}
          >
            <span className="truncate max-w-[140px]">{session.label}</span>
            {hoveredSession === session.id && session.id !== currentSession && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteSession(session.id);
                }}
                className="p-1 opacity-60 hover:opacity-100 hover:text-terminal-error"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
```

- [ ] **Step 2: Update App.jsx with Sidebar**

```jsx
import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  // Load sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('narad_sessions');
    if (saved) {
      setSessions(JSON.parse(saved));
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

  const handleNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      label: 'New Chat',
      messages: [],
    };
    setSessions([...sessions, newSession]);
    setCurrentSession(newSession.id);
  };

  const handleSelectSession = (id) => {
    setCurrentSession(id);
  };

  const handleDeleteSession = (id) => {
    setSessions(sessions.filter(s => s.id !== id));
    if (currentSession === id) {
      setCurrentSession(sessions[0]?.id || null);
    }
  };

  return (
    <div data-theme={theme} className="h-screen flex">
      <Sidebar
        sessions={sessions}
        currentSession={currentSession}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
      />
    </div>
  );
}
```

- [ ] **Step 3: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

### Task 4: Build Header Component

**Files:**
- Create: `narad/src/components/Header.jsx`
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Create Header.jsx**

```jsx
import { Moon, Search, Trash2, Brain, Square, Sun } from 'lucide-react';

export default function Header({ 
  theme, 
  onToggleTheme, 
  onSearch, 
  onClear, 
  onBrainStats,
  onStop,
  isConnected 
}) {
  return (
    <header className="h-10 glass flex items-center justify-between px-3 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-terminal-success animate-pulse" />
        <span className="text-sm font-medium text-terminal-text-secondary">narad</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Toggle Theme (Cmd+T)"
        >
          {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <button
          onClick={onSearch}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Search (Cmd+F)"
        >
          <Search size={16} />
        </button>

        <button
          onClick={onClear}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Clear Chat (Cmd+K)"
        >
          <Trash2 size={16} />
        </button>

        <button
          onClick={onBrainStats}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Brain Stats"
        >
          <Brain size={16} />
        </button>

        <button
          onClick={onStop}
          className="p-1.5 rounded hover:bg-terminal-bg-tertiary text-terminal-text-muted hover:text-terminal-text transition-colors"
          title="Stop (Ctrl+C)"
        >
          <Square size={16} />
        </button>

        {/* Status */}
        <button
          onClick={() => window.checkApiHealth?.()}
          className="flex items-center gap-1.5 ml-2"
        >
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-terminal-success' : 'bg-terminal-error'}`} />
        </button>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Update App.jsx with Header**

```jsx
// Add to imports
import Header from './components/Header';

// Add state
const [isConnected, setIsConnected] = useState(true);

// Add toggle handler
const toggleTheme = () => {
  const newTheme = theme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('narad_theme', newTheme);
};

// Update JSX in return
<div data-theme={theme} className="h-screen flex flex-col">
  <Header
    theme={theme}
    onToggleTheme={toggleTheme}
    onSearch={() => {}}
    onClear={() => {}}
    onBrainStats={() => {}}
    onStop={() => {}}
    isConnected={isConnected}
  />
  <div className="flex flex-1">
    <Sidebar ... />
  </div>
</div>
```

- [ ] **Step 3: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

### Task 5: Build ChatArea Component

**Files:**
- Create: `narad/src/components/ChatArea.jsx`
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Create ChatArea.jsx**

```jsx
import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

export default function ChatArea({ messages, isProcessing }) {
  const containerRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Render markdown
  const renderContent = (content) => {
    const html = marked.parse(content || '');
    return DOMPurify.sanitize(html);
  };

  return (
    <main 
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {/* Welcome message */}
      {messages.length === 0 && (
        <div className="message assistant">
          <span className="text-xs text-terminal-text-muted w-14 flex-shrink-0 pt-1">narad</span>
          <div className="message-content">
            <p>Hello! How can I help?</p>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`message ${msg.role === 'user' ? 'user' : 'assistant'} flex`}
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

      {/* Typing indicator */}
      {isProcessing && (
        <div className="message assistant flex">
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
```

- [ ] **Step 2: Update App.jsx with ChatArea**

```jsx
import ChatArea from './components/ChatArea';

// Add message state
const [messages, setMessages] = useState([]);

// Update JSX
<div className="flex flex-1 overflow-hidden">
  <Sidebar ... />
  <ChatArea messages={messages} isProcessing={false} />
</div>
```

- [ ] **Step 3: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

### Task 6: Build InputArea Component

**Files:**
- Create: `narad/src/components/InputArea.jsx`
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Create InputArea.jsx**

```jsx
import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

export default function InputArea({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + 'px';
    }
  }, [input]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 glass border-t border-terminal-border">
      {/* Processing indicator */}
      {disabled && (
        <div className="flex items-center gap-2 mb-2 text-sm text-terminal-text-muted">
          <span className="animate-spin">⠋</span>
          <span>Processing...</span>
        </div>
      )}

      <div className="flex items-center gap-2">
        <span className="text-terminal-accent text-sm flex-shrink-0">{'>'}</span>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type / for commands..."
          className="flex-1 bg-transparent border-none text-terminal-text font-mono text-sm resize-none outline-none min-h-[20px] max-h-[150px]"
          rows={1}
          disabled={disabled}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className="p-1.5 rounded bg-terminal-accent text-white hover:bg-terminal-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}
```

- [ ] **Step 2: Update App.jsx with InputArea**

```jsx
import InputArea from './components/InputArea';

// Add handler
const handleSendMessage = (text) => {
  // Add user message
  const userMsg = { role: 'user', content: text };
  setMessages([...messages, userMsg]);
  
  // TODO: Call API and add assistant response
};

// Update JSX
<ChatArea messages={messages} isProcessing={isProcessing} />
<InputArea onSend={handleSendMessage} disabled={isProcessing} />
```

- [ ] **Step 3: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

### Task 7: Build CommandPalette Component

**Files:**
- Create: `narad/src/components/CommandPalette.jsx`
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Create CommandPalette.jsx**

```jsx
import { useState, useEffect, useRef } from 'react';

const COMMANDS = [
  { cmd: '/mode', desc: 'Switch plan/build mode' },
  { cmd: '/session', desc: 'Manage sessions' },
  { cmd: '/dev', desc: 'Developer agent' },
  { cmd: '/reviewer', desc: 'Code reviewer agent' },
  { cmd: '/debugger', desc: 'Debugger agent' },
  { cmd: '/spec', desc: 'Create specification' },
  { cmd: '/plan', desc: 'Create plan' },
  { cmd: '/build', desc: 'Build code' },
  { cmd: '/test', desc: 'Run tests' },
  { cmd: '/review', desc: 'Review code' },
  { cmd: '/ship', desc: 'Ship to production' },
];

export default function CommandPalette({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);

  const filtered = COMMANDS.filter(c => 
    c.cmd.toLowerCase().includes(query.toLowerCase()) ||
    c.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelected(s => Math.min(s + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelected(s => Math.max(s - 1, 0));
    } else if (e.key === 'Enter' && filtered[selected]) {
      onSelect(filtered[selected].cmd);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-md glass rounded-lg overflow-hidden">
        <div className="p-2 border-b border-terminal-border">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="w-full bg-transparent border-none text-terminal-text font-mono text-sm outline-none"
          />
        </div>
        <div className="max-h-60 overflow-y-auto p-2">
          {filtered.map((cmd, idx) => (
            <div
              key={cmd.cmd}
              onClick={() => onSelect(cmd.cmd)}
              className={`px-3 py-2 rounded cursor-pointer flex justify-between items-center ${
                idx === selected 
                  ? 'bg-terminal-accent text-terminal-bg' 
                  : 'text-terminal-text hover:bg-terminal-bg-tertiary'
              }`}
            >
              <span className="font-mono text-sm">{cmd.cmd}</span>
              <span className="text-xs text-terminal-text-muted">{cmd.desc}</span>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-3 text-center text-terminal-text-muted text-sm">
              No commands found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update App.jsx to integrate**

```jsx
import CommandPalette from './components/CommandPalette';

// Add state
const [showCommands, setShowCommands] = useState(false);

// Add handler for / key
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === '/' && !showCommands) {
      e.preventDefault();
      setShowCommands(true);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, [showCommands]);

// Update JSX before closing tags
<InputArea onSend={handleSendMessage} disabled={isProcessing} />
<CommandPalette 
  isOpen={showCommands} 
  onClose={() => setShowCommands(false)}
  onSelect={(cmd) => {
    setShowCommands(false);
    // Handle command
  }}
/>
```

- [ ] **Step 3: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

### Task 8: Build Modals (BrainModal & SearchOverlay)

**Files:**
- Create: `narad/src/components/BrainModal.jsx`
- Create: `narad/src/components/SearchOverlay.jsx`
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Create BrainModal.jsx**

```jsx
import { useEffect, useState } from 'react';
import { X, Brain, RefreshCw } from 'lucide-react';

export default function BrainModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/brain/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      setStats({ error: 'Failed to load stats' });
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-lg glass-card p-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Brain size={20} />
            Narad Brain
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-terminal-bg-tertiary rounded">
            <X size={20} />
          </button>
        </div>
        <div className="mb-4">
          {loading ? (
            <div className="text-terminal-text-muted">Loading...</div>
          ) : stats ? (
            <pre className="text-sm text-terminal-text-secondary whitespace-pre-wrap">
              {JSON.stringify(stats, null, 2)}
            </pre>
          ) : (
            <div className="text-terminal-text-muted">No data</div>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={fetchStats} className="btn flex items-center gap-2">
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => {}} className="btn">
            View Insights
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create SearchOverlay.jsx**

```jsx
import { useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';

export default function SearchOverlay({ isOpen, onClose, onSearch }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative w-full max-w-md glass rounded-lg p-2" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2">
          <Search size={18} className="text-terminal-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search messages..."
            className="flex-1 bg-transparent border-none text-terminal-text font-mono text-sm outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch(e.target.value);
                onClose();
              }
            }}
          />
          <button onClick={onClose} className="p-1 hover:bg-terminal-bg-tertiary rounded">
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Update App.jsx with modals**

```jsx
import BrainModal from './components/BrainModal';
import SearchOverlay from './components/SearchOverlay';

// Add state
const [showBrain, setShowBrain] = useState(false);
const [showSearch, setShowSearch] = useState(false);

// Update JSX
<CommandPalette ... />
<BrainModal isOpen={showBrain} onClose={() => setShowBrain(false)} />
<SearchOverlay isOpen={showSearch} onClose={() => setShowSearch(false)} onSearch={(q) => {}} />
```

- [ ] **Step 4: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

### Task 9: Wire Up API & Chat Logic

**Files:**
- Create: `narad/src/lib/api.js`
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Create api.js**

```javascript
const API_BASE = '';

export async function sendChat(message, sessionId, options = {}) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      sessionId,
      ...options,
    }),
  });
  return res.json();
}

export async function getBrainStats() {
  const res = await fetch(`${API_BASE}/brain/stats`);
  return res.json();
}

export async function checkHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Update App.jsx chat logic**

```jsx
import { sendChat } from './lib/api';

// Update handleSendMessage
const handleSendMessage = async (text) => {
  const userMsg = { role: 'user', content: text };
  const newMessages = [...messages, userMsg];
  setMessages(newMessages);
  setIsProcessing(true);
  
  try {
    const response = await sendChat(text, currentSession, {
      messages: newMessages.slice(-10),
    });
    
    const assistantMsg = { role: 'assistant', content: response.message };
    setMessages([...newMessages, assistantMsg]);
  } catch (err) {
    setMessages([...newMessages, { 
      role: 'assistant', 
      content: 'Error: ' + err.message 
    }]);
  }
  
  setIsProcessing(false);
};
```

- [ ] **Step 3: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

### Task 10: Add Global Keyboard Shortcuts

**Files:**
- Modify: `narad/src/App.jsx`

- [ ] **Step 1: Add keyboard shortcuts**

```jsx
// Add to App.jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    // Cmd+T - Toggle theme
    if ((e.metaKey || e.ctrlKey) && e.key === 't') {
      e.preventDefault();
      toggleTheme();
    }
    // Cmd+K - Clear chat
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      handleClear();
    }
    // Cmd+F - Search
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      setShowSearch(true);
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

// Add handleClear
const handleClear = () => {
  setMessages([]);
};
```

- [ ] **Step 2: Test build**

```bash
cd /home/deepak/Work/narad && npm run build
```

Expected: PASS

---

## Verification

Run this to verify the complete build:

```bash
cd /home/deepak/Work/narad && npm run build
ls -la dist/
```

Expected: `dist/` contains index.html and assets.

---

## Next Steps After Complete

1. Deploy to Cloudflare Pages: `npm run deploy`
2. Test all functionality works
3. Verify keyboard shortcuts
4. Check theme toggle works

---

## Notes

- Backend `_worker.js` unchanged — just new frontend
- All existing functionality preserved
- Keyboard shortcuts preserved
- Dark/light theme preserved