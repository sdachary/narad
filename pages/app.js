import { listCharacters, getCharacterByTrait, getCharacter } from './config/characters.js';

// Narad AI Terminal - Multi-Session Workspace

// Character Selector
const CHARACTER_KEY = 'narad_character';
let selectedCharacter = localStorage.getItem(CHARACTER_KEY) || 'default';

function initCharacterSelector() {
    const select = document.getElementById('character-select');
    if (!select) return;
    
    const characters = listCharacters();
    characters.forEach(char => {
        const option = document.createElement('option');
        option.value = char.id;
        option.textContent = char.name;
        select.appendChild(option);
    });
    
    select.value = selectedCharacter;
    select.addEventListener('change', (e) => {
        selectedCharacter = e.target.value || 'default';
        localStorage.setItem(CHARACTER_KEY, selectedCharacter);
    });
}

// Mode Selector
const MODE_KEY = 'narad_mode';
let currentMode = localStorage.getItem(MODE_KEY) || 'casual';

function initModeSelector() {
    const selector = document.getElementById('mode-selector');
    if (!selector) return;

    // Apply initial mode
    document.body.setAttribute('data-mode', currentMode);

    const chips = selector.querySelectorAll('.mode-chip');
    chips.forEach(chip => {
        const mode = chip.getAttribute('data-mode');
        if (mode === 'casual') chip.title = "CASUAL: Natural Q&A and Brainstorming";
        if (mode === 'rnd') chip.title = "R&D: Planning, Strategy, and Feasibility Testing";
        if (mode === 'build') chip.title = "BUILD: End-to-End Creation & File Execution";

        chip.addEventListener('click', () => {
            if (currentMode === chip.getAttribute('data-mode')) return;
            
            // Save current session before switching mode
            saveChatHistory();
            
            currentMode = chip.getAttribute('data-mode');
            localStorage.setItem(MODE_KEY, currentMode);
            document.body.setAttribute('data-mode', currentMode);
            
            // Load sessions for the new mode
            loadSessionsForCurrentMode();
            
            appendSystemMessage(`NARAD STATE SHIFT: ${currentMode.toUpperCase()} MODE ACTIVE.`);
        });
    });

    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
        });
    }

    // New Chat Button
    const newChatBtn = document.getElementById('new-chat-btn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', createNewSession);
    }
}

function appendSystemMessage(text) {
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'message system';
    msgDiv.style.borderLeft = `2px solid var(--mode-accent, #666)`;
    msgDiv.style.paddingLeft = '10px';
    msgDiv.style.opacity = '0.7';
    msgDiv.style.fontSize = '12px';
    msgDiv.style.margin = '10px 0';
    
    msgDiv.innerHTML = `
        <span class="prompt" style="color: #666;">[system@narad]</span>
        <span class="message-content" style="color: #888; font-style: italic;">${text}</span>
    `;
    
    chatContainer.appendChild(msgDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Theme management
const THEME_KEY = 'narad_theme';
let currentTheme = localStorage.getItem(THEME_KEY) || 'dark';

function initTheme() {
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeButton();
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem(THEME_KEY, currentTheme);
    updateThemeButton();
}

function updateThemeButton() {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
        btn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    }
}

// Chat search functionality
const searchOverlay = document.getElementById('chat-search-overlay');
const searchInput = document.getElementById('chat-search-input');
const searchResults = document.getElementById('chat-search-results');

function openSearch() {
    const overlay = document.getElementById('chat-search-overlay');
    if (overlay) {
        overlay.classList.add('open');
        const input = document.getElementById('chat-search-input');
        if (input) input.focus();
    }
}

function closeSearch() {
    const overlay = document.getElementById('chat-search-overlay');
    if (overlay) {
        overlay.classList.remove('open');
    }
}

function searchChat(query) {
    if (!query) {
        clearSearchHighlights();
        return;
    }
    
    const messages = document.querySelectorAll('.message-content');
    clearSearchHighlights();
    
    const lowerQuery = query.toLowerCase();
    let found = false;
    
    messages.forEach(msg => {
        if (msg.textContent.toLowerCase().includes(lowerQuery)) {
            msg.parentElement.classList.add('search-highlight');
            found = true;
        }
    });
    
    return found;
}

function clearSearchHighlights() {
    document.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight');
    });
}

// Message reactions
function addReaction(messageEl, reaction) {
    let reactionsDiv = messageEl.querySelector('.message-reactions');
    if (!reactionsDiv) {
        reactionsDiv = document.createElement('div');
        reactionsDiv.className = 'message-reactions';
        messageEl.appendChild(reactionsDiv);
    }
    
    const existingBtn = reactionsDiv.querySelector(`[data-reaction="${reaction}"]`);
    if (existingBtn) {
        const count = parseInt(existingBtn.dataset.count || '0') + 1;
        existingBtn.dataset.count = count;
        existingBtn.textContent = reaction + (count > 1 ? ` ${count}` : '');
    } else {
        const btn = document.createElement('button');
        btn.className = 'reaction-btn';
        btn.dataset.reaction = reaction;
        btn.dataset.count = '1';
        btn.textContent = reaction;
        btn.onclick = () => addReaction(messageEl.parentElement, reaction);
        reactionsDiv.appendChild(btn);
    }
    
    // Send to API
    const sessionId = localStorage.getItem('narad_session_id');
    if (sessionId) {
        submitFeedback(reaction === '👍' ? 1 : reaction === '👎' ? -1 : 0);
    }
}

// Typing indicator
function showTypingIndicator() {
    const existing = document.getElementById('typing-indicator');
    if (existing) return;
    
    const div = document.createElement('div');
    div.id = 'typing-indicator';
    div.className = 'message assistant typing';
    div.innerHTML = `
        <span class="prompt">[narad@system]</span>
        <div class="message-content typing-indicator">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
        </div>
    `;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    const existing = document.getElementById('typing-indicator');
    if (existing) existing.remove();
}

// Markdown and syntax highlighting (loaded via CDN or fallback)
const { marked, hljs } = window;

function renderMarkdown(text) {
  if (!text) return '';
  
  let html = text;
  
  // Check if marked is available
  if (typeof marked !== 'undefined' && marked.parse) {
    try {
      html = marked.parse(text, { breaks: true, gfm: true });
    } catch (e) {
      console.warn('Markdown parse error:', e);
    }
  }
  
  // Apply syntax highlighting to code blocks
  if (typeof hljs !== 'undefined') {
    setTimeout(() => {
      document.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
    }, 0);
  }
  
  return html;
}

function getApiBase() {
  const metaApiBase = document.querySelector('meta[name="api-base"]')?.getAttribute('content');
  if (metaApiBase && metaApiBase.trim() !== '') return metaApiBase;
  
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE;
  }
  
  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    return 'http://localhost:8788';
  }
  if (hostname.includes('pages.dev')) {
    return 'https://narad-7hc.pages.dev';
  }
  if (hostname.includes('narad.io')) {
    return 'https://narad.io';
  }
  
  return '';
}

function initApiBase() {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  let apiBase;
  
  console.log('[Narad] Initializing API base for hostname:', hostname, 'protocol:', protocol);
  
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    apiBase = 'http://localhost:8788';
  } else if (hostname.includes('pages.dev') || hostname.includes('workers.dev')) {
    apiBase = protocol + '//' + hostname;
  } else if (hostname.includes('narad.io')) {
    apiBase = 'https://narad.io';
  } else {
    apiBase = protocol + '//' + hostname;
    console.warn('[Narad] Unknown hostname:', hostname, '- using fallback:', apiBase);
  }
  
  console.log('[Narad] API_BASE initialized to:', apiBase);
  
  const metaApiBase = document.querySelector('meta[name="api-base"]');
  if (metaApiBase) {
    metaApiBase.setAttribute('content', apiBase);
  }
  
  return apiBase;
}

const API_BASE = initApiBase();
console.log('[Narad] API_BASE is:', API_BASE);

// Session persistence logic
const SESSIONS_KEY = 'narad_mode_sessions';
let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

// Persistent state for behavioral skills (Superpowers integration)
let activeSkill = null;

const CHAT_HISTORY_KEY = 'narad_chat_history';
const MAX_PERSISTED_MESSAGES = 100;

async function getModeSessions() {
    // Try cloud first
    try {
        const res = await fetch(`${API_BASE}/api/sessions/${currentMode}`);
        if (res.ok) {
            const data = await res.json();
            if (data.sessions && data.sessions.length > 0) return data.sessions;
        }
    } catch (e) {
        console.warn('[Narad] Cloud session fetch failed, using local.');
    }

    const all = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '{}');
    if (!all[currentMode]) {
        all[currentMode] = [sessionId];
        localStorage.setItem(SESSIONS_KEY, JSON.stringify(all));
    }
    return all[currentMode];
}

async function loadSessionsForCurrentMode() {
    const sessions = await getModeSessions();
    // Default to first session of mode if current sessionId isn't in it
    if (!sessions.includes(sessionId)) {
        sessionId = sessions[0];
        localStorage.setItem('narad_session_id', sessionId);
    }
    
    // Refresh history and UI
    chatHistory = await loadChatHistory();
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        restoreChatDisplay();
    }
    await renderSidebar();
}

async function createNewSession() {
    await saveChatHistory();
    const newId = 'session_' + Date.now();
    
    const sessions = await getModeSessions();
    sessions.unshift(newId);
    
    // Sync to cloud
    try {
        await fetch(`${API_BASE}/api/sessions/sync`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'X-CSRF-Token': CSRFManager.getToken()
            },
            body: JSON.stringify({ mode: currentMode, sessions })
        });
    } catch (e) { console.warn('Cloud sync failed'); }

    sessionId = newId;
    localStorage.setItem('narad_session_id', sessionId);
    
    chatHistory = [];
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        addMessage('Neural Channel Initialized. How can I assist you?', 'assistant');
    }
    await renderSidebar();
}

async function switchSession(id) {
    if (id === sessionId) return;
    await saveChatHistory();
    sessionId = id;
    localStorage.setItem('narad_session_id', sessionId);
    
    chatHistory = await loadChatHistory();
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
        restoreChatDisplay();
    }
    await renderSidebar();
}

async function deleteSession(id) {
    if (confirm('Are you sure you want to delete this neural channel? Memory will be lost.')) {
        const sessions = await getModeSessions();
        const updated = sessions.filter(sid => sid !== id);
        
        // Sync to cloud
        try {
            await fetch(`${API_BASE}/api/sessions/sync`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRFManager.getToken()
                },
                body: JSON.stringify({ mode: currentMode, sessions: updated })
            });
        } catch (e) { console.warn('Cloud delete failed'); }

        localStorage.removeItem(CHAT_HISTORY_KEY + '_' + id);
        
        if (updated.length === 0) {
            const newId = 'session_' + Date.now();
            sessionId = newId;
        } else if (id === sessionId) {
            sessionId = updated[0];
        }
        
        localStorage.setItem('narad_session_id', sessionId);
        
        chatHistory = await loadChatHistory();
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = '';
            restoreChatDisplay();
        }
        await renderSidebar();
    }
}

async function renderSidebar() {
    const list = document.getElementById('session-list');
    if (!list) return;
    
    const sessions = await getModeSessions();
    list.innerHTML = sessions.map(id => {
        const historyJson = localStorage.getItem(CHAT_HISTORY_KEY + '_' + id);
        const history = historyJson ? JSON.parse(historyJson) : [];
        const lastMsg = history.length > 0 ? history[history.length-1].text : 'Empty Session';
        const label = lastMsg.substring(0, 20) + (lastMsg.length > 20 ? '...' : '');
        
        return `
            <div class="session-item ${id === sessionId ? 'active' : ''}" onclick="window.switchSession('${id}')">
                <span class="session-label">${label}</span>
                <span class="delete-session-btn" onclick="event.stopPropagation(); window.deleteSession('${id}')">🗑</span>
            </div>
        `;
    }).join('');
}

// Global hooks for onclick events (since using type="module")
window.switchSession = switchSession;
window.deleteSession = deleteSession;

async function loadChatHistory() {
    try {
        const res = await fetch(`${API_BASE}/api/sessions/history/${sessionId}`);
        if (res.ok) {
            const data = await res.json();
            if (data.history) return data.history;
        }
    } catch (e) {
        console.warn('[Narad] Cloud history fetch failed, using local.');
    }

    const saved = localStorage.getItem(CHAT_HISTORY_KEY + '_' + sessionId);
    return saved ? JSON.parse(saved) : [];
}

async function saveChatHistory() {
    try {
        const historyToSave = chatHistory.slice(-MAX_PERSISTED_MESSAGES);
        localStorage.setItem(CHAT_HISTORY_KEY + '_' + sessionId, JSON.stringify(historyToSave));
        
        // Sync to cloud
        try {
            await fetch(`${API_BASE}/api/sessions/history/${sessionId}`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRFManager.getToken()
                },
                body: JSON.stringify({ history: historyToSave })
            });
        } catch (e) { console.warn('Cloud history save failed'); }

        await renderSidebar(); 
    } catch (e) {
        console.warn('[Narad] Failed to save chat history:', e);
    }
}

// ============================================
// Command Registry (inspired by Claw Code)
// ============================================
const COMMAND_REGISTRY = {
    // R&D Commands
    'last30days': {
        description: 'Run high-fidelity research on a topic across Reddit, HN, X, and YouTube',
        handler: async (args) => {
            const topic = args.join(' ');
            if (!topic) return 'Please provide a topic for research.';
            
            appendSystemMessage(`INITIATING GLOBAL RESEARCH: ${topic.toUpperCase()}...`);
            const res = await fetch(`${API_BASE}/api/research/last30days`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic })
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            return `### Research Briefing: ${topic}\n\n${data.briefing}`;
        }
    },
    
    // Build & Architect Commands
    'build': {
        description: 'Trigger a cloud codebase generation for a project',
        handler: async (args) => {
            const projectName = args[0] || 'mark0';
            const prompt = args.slice(1).join(' ');
            
            appendSystemMessage(`DISPATCHING CLOUD CONSTRUCTOR: ${projectName}...`);
            const res = await fetch(`${API_BASE}/api/github/dispatch`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRFManager.getToken()
                },
                body: JSON.stringify({
                    repo: 'narad', // or target repo
                    eventType: 'narad_build',
                    clientPayload: { projectName, prompt, mode: currentMode }
                })
            });
            const data = await res.json();
            return `✅ **Cloud Dispatch Success**: [${projectName}] is now being architected in the cloud via GitHub Actions.`;
        }
    },

    'upgrade': {
        description: 'Upgrade an existing service (e.g. Chitragupta) based on analysis',
        handler: async (args) => {
            const service = args[0];
            const instruction = args.slice(1).join(' ');
            if (!service) return 'Please specify a service (e.g. chitragupta).';
            
            appendSystemMessage(`INITIATING CROSS-REPO UPGRADE: ${service.toUpperCase()}...`);
            const res = await fetch(`${API_BASE}/api/github/dispatch`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRFManager.getToken()
                },
                body: JSON.stringify({
                    repo: service,
                    eventType: 'narad_upgrade',
                    clientPayload: { instruction, character: selectedCharacter }
                })
            });
            return `🚀 **Upgrade Dispatched**: ${service} implementation started.`;
        }
    },

    'skill': {
        description: 'Load a behavioral skill from the Superpowers library (e.g. tdd, brainstorming)',
        handler: async (args) => {
            const skillName = args[0];
            if (!skillName) return 'Please provide a skill name.';
            
            appendSystemMessage(`LOADING NEURAL SKILL: ${skillName.toUpperCase()}...`);
            const res = await fetch(`${API_BASE}/api/skills/${skillName}`);
            const data = await res.json();
            if (data.error) throw new Error(data.error);
            
            // Store active skill in session state
            activeSkill = data;
            return `⚡ **Skill Active**: Narad is now operating with the **${skillName}** protocol. Your next instructions will be steered by this behavior.`;
        }
    },

    // Single agent commands
    'dev': {
        name: 'Developer',
        icon: '⚡',
        description: 'Git, test, build, npm, code tasks',
        syntax: '/dev: <task>',
        examples: ['/dev: create a new component', '/dev: fix this bug']
    },
    'reviewer': {
        name: 'Code Reviewer',
        icon: '🔍',
        description: 'Code review, security audit, quality checks',
        syntax: '/reviewer: <code to review>',
        examples: ['/reviewer: review this PR']
    },
    'debugger': {
        name: 'Debugger',
        icon: '🔧',
        description: 'Debugging, troubleshooting, fix issues',
        syntax: '/debugger: <issue description>',
        examples: ['/debugger: fix this error']
    },
    'api': {
        name: 'API Developer',
        icon: '🔌',
        description: 'REST/GraphQL, OpenAPI, endpoints',
        syntax: '/api: <API task>',
        examples: ['/api: create a REST endpoint']
    },
    'database': {
        name: 'Database Expert',
        icon: '🗄️',
        description: 'SQL, migrations, schema design',
        syntax: '/database: <db task>',
        examples: ['/database: write a migration']
    },
    'infrastructure': {
        name: 'DevOps',
        icon: '🚀',
        description: 'Docker, K8s, CI/CD, deployment',
        syntax: '/infrastructure: <infra task>',
        examples: ['/infrastructure: write a Dockerfile']
    },
    'security': {
        name: 'Security',
        icon: '🔒',
        description: 'Auth, JWT, OAuth, security audit',
        syntax: '/security: <security task>',
        examples: ['/security: review auth flow']
    },
    'writer': {
        name: 'Writer',
        icon: '✍️',
        description: 'Documentation, README, content',
        syntax: '/writer: <writing task>',
        examples: ['/writer: write a README']
    },
    // Subagents
    'research': {
        name: 'Research Agent',
        icon: '🔬',
        description: 'Web search, information lookup',
        syntax: '/research: <topic>',
        examples: ['/research: latest AI news']
    },
    'coder': {
        name: 'Coder Agent',
        icon: '💻',
        description: 'Write code, implement features',
        syntax: '/coder: <task>',
        examples: ['/coder: write a function']
    },
    'analyst': {
        name: 'Analyst Agent',
        icon: '📊',
        description: 'Data analysis, insights, reports',
        syntax: '/analyst: <data task>',
        examples: ['/analyst: analyze this data']
    },
    'architect': {
        name: 'Architect Agent',
        icon: '🏗️',
        description: 'System design, architecture',
        syntax: '/architect: <design task>',
        examples: ['/architect: design a system']
    }
};

function parseCommand(input) {
    const trimmed = input.trim();
    
    // Check for parallel execution: /dev+reviewer:
    const parallelMatch = trimmed.match(/^\/([a-zA-Z]+)\+([a-zA-Z]+):\s*(.*)$/);
    if (parallelMatch) {
        const agent1 = parallelMatch[1].toLowerCase();
        const agent2 = parallelMatch[2].toLowerCase();
        const message = parallelMatch[3];
        
        if (COMMAND_REGISTRY[agent1] && COMMAND_REGISTRY[agent2]) {
            return {
                type: 'parallel',
                agents: [agent1, agent2],
                message: message || input
            };
        }
    }
    
    // Check for chain execution: /chain:dev->writer->reviewer:
    const chainMatch = trimmed.match(/^\/chain:([a-zA-Z]+(?:->[a-zA-Z]+)+):\s*(.*)$/);
    if (chainMatch) {
        const agents = chainMatch[1].toLowerCase().split('->');
        const validAgents = agents.filter(a => COMMAND_REGISTRY[a]);
        
        if (validAgents.length > 0) {
            return {
                type: 'chain',
                agents: validAgents,
                message: chainMatch[2] || input
            };
        }
    }
    
    // Check for single agent: /dev:
    const singleMatch = trimmed.match(/^\/([a-zA-Z]+):\s*(.*)$/);
    if (singleMatch) {
        const agent = singleMatch[1].toLowerCase();
        
        // Help command
        if (agent === 'help' || agent === '?') {
            return {
                type: 'help',
                message: singleMatch[2] || input
            };
        }
        
        // List available agents
        if (agent === 'agents' || agent === 'list') {
            return {
                type: 'agent_list'
            };
        }
        
        if (COMMAND_REGISTRY[agent]) {
            return {
                type: 'single',
                agent: agent,
                message: singleMatch[2] || input
            };
        }
    }
    
    // No command detected, return original
    return {
        type: 'none',
        message: input
    };
}

function getCommandHelp() {
    let help = 'Available Commands:\n\n';
    help += 'Single Agent:\n';
    for (const [key, cmd] of Object.entries(COMMAND_REGISTRY)) {
        help += `  ${cmd.icon} /${key}: ${cmd.description}\n`;
    }
    help += '\nParallel Execution:\n';
    help += '  /agent1+agent2: <task>  # Run two agents in parallel\n';
    help += '\nChain Execution:\n';
    help += '  /chain:agent1->agent2: <task>  # Run agents sequentially\n';
    help += '\nOther Commands:\n';
    help += '  /help [command]  # Get help for a command\n';
    help += '  /agents  # List all available agents';
    return help;
}

function showCommandHelp(agent) {
    if (agent && COMMAND_REGISTRY[agent]) {
        const cmd = COMMAND_REGISTRY[agent];
        return `${cmd.icon} **/${agent}** - ${cmd.name}\n${cmd.description}\n\nSyntax: ${cmd.syntax}\n\nExamples:\n${cmd.examples.map(e => `- ${e}`).join('\n')}`;
    }
    return getCommandHelp();
}

function saveChatHistory() {
    try {
        const historyToSave = chatHistory.slice(-MAX_PERSISTED_MESSAGES);
        localStorage.setItem(CHAT_HISTORY_KEY + '_' + sessionId, JSON.stringify(historyToSave));
        renderSidebar(); // Update sidebar labels
    } catch (e) {
        console.warn('[Narad] Failed to save chat history:', e);
    }
}

function restoreChatDisplay() {
    chatHistory.forEach(msg => {
        addMessage(msg.text, msg.role);
    });
}

let chatHistory = loadChatHistory() || [];
console.log('[Narad] Loaded', chatHistory.length, 'messages from history');
let isStreaming = false;
let currentAbortController = null;
let csrfToken = null;
let savedIdeas = JSON.parse(localStorage.getItem('narad_ideas') || '[]');

// XSS Prevention: DOMPurify configuration
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'br', 'p', 'span', 'a'],
  ALLOWED_ATTR: ['href', 'class'],
  ALLOW_DATA_ATTR: false,
};

// DOMPurify import (bundled via esbuild shim)
const DOMPurify = window.DOMPurify || {
  sanitize: function(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('script, style, iframe, object, embed');
    scripts.forEach(el => el.remove());
    const elements = doc.querySelectorAll('*');
    elements.forEach(el => {
      const attrs = Array.from(el.attributes);
      attrs.forEach(attr => {
        if (attr.name.startsWith('on') || attr.name === 'javascript') {
          el.removeAttribute(attr.name);
        }
      });
    });
    return doc.body.innerHTML;
  }
};

// Input validation patterns
const VALIDATION_PATTERNS = {
  message: { maxLength: 5000, minLength: 1 },
  sessionId: { pattern: /^[a-zA-Z0-9_-]{1,100}$/ },
  history: { maxItems: 100 }
};

// Rate limiting state
const rateLimiter = {
  requests: [],
  burstRequests: [],
  maxRequests: 30,
  maxBurstRequests: 10,
  windowMs: 60000,
  burstWindowMs: 5000,
  
  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    this.burstRequests = this.burstRequests.filter(time => now - time < this.burstWindowMs);
    
    // Check burst first - allow small burst of quick requests
    if (this.burstRequests.length < this.maxBurstRequests) {
      this.burstRequests.push(now);
      this.requests.push(now);
      return true;
    }
    
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  },
  
  getRetryAfter() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    return Math.ceil((oldestRequest + this.windowMs - Date.now()) / 1000);
  }
};

// CSRF Token Manager
const CSRFManager = {
  tokenExpiry: null,
  
  async init() {
    // First check if token is in meta tag
    const tokenEl = document.querySelector('meta[name="csrf-token"]');
    if (tokenEl && tokenEl.getAttribute('content')) {
      csrfToken = tokenEl.getAttribute('content');
      return;
    }
    
    // Fetch new token from server
    await this.fetchNewToken();
  },
  
  async fetchNewToken() {
    try {
      const response = await fetch(`${API_BASE}/api/csrf-token`);
      if (response.ok) {
        const data = await response.json();
        csrfToken = data.token;
        
        const tokenEl = document.querySelector('meta[name="csrf-token"]');
        if (tokenEl) {
          tokenEl.setAttribute('content', csrfToken);
        }
        
        // Store expiry if returned
        if (data.expiresAt) {
          this.tokenExpiry = data.expiresAt;
        }
        
        // Auto-refresh token 5 minutes before expiry
        if (data.expiresAt) {
          const refreshTime = data.expiresAt - (5 * 60 * 1000);
          setTimeout(() => this.fetchNewToken(), Math.max(refreshTime - Date.now(), 0));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch CSRF token:', e);
      // Fallback: generate client-side token for development
      csrfToken = 'client_fallback_' + Date.now();
    }
  },
  
  getToken() {
    return csrfToken;
  }
};

// Input Validator
const InputValidator = {
  validate(field, value) {
    switch (field) {
      case 'message':
        return this.validateMessage(value);
      case 'sessionId':
        return this.validateSessionId(value);
      case 'history':
        return this.validateHistory(value);
      default:
        return { valid: false, error: 'Unknown field' };
    }
  },
  
  validateMessage(value) {
    if (!value || typeof value !== 'string') {
      return { valid: false, error: 'Message must be a string' };
    }
    if (value.trim().length < VALIDATION_PATTERNS.message.minLength) {
      return { valid: false, error: 'Message cannot be empty' };
    }
    if (value.length > VALIDATION_PATTERNS.message.maxLength) {
      return { valid: false, error: `Message exceeds ${VALIDATION_PATTERNS.message.maxLength} characters` };
    }
    if (/<(script|iframe|object|embed|form)/i.test(value)) {
      return { valid: false, error: 'Invalid content detected' };
    }
    return { valid: true, value: value.trim() };
  },
  
  validateSessionId(value) {
    if (!value || typeof value !== 'string') {
      return { valid: false, error: 'Invalid session ID' };
    }
    if (!VALIDATION_PATTERNS.sessionId.pattern.test(value)) {
      return { valid: false, error: 'Invalid session ID format' };
    }
    return { valid: true };
  },
  
  validateHistory(value) {
    if (!Array.isArray(value)) {
      return { valid: false, error: 'History must be an array' };
    }
    if (value.length > VALIDATION_PATTERNS.history.maxItems) {
      return { valid: false, error: `History exceeds ${VALIDATION_PATTERNS.history.maxItems} items` };
    }
    for (const msg of value) {
      if (!msg.role || !msg.text) {
        return { valid: false, error: 'Invalid history message format' };
      }
      if (typeof msg.text !== 'string' || msg.text.length > 10000) {
        return { valid: false, error: 'Invalid message text in history' };
      }
    }
    return { valid: true };
  }
};

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const chatForm = document.getElementById('chat-form');
let apiStatus = document.getElementById('api-status');
let apiDot = document.getElementById('api-dot');
const usageRing = document.getElementById('usage-ring');
const imageInput = document.getElementById('image-input');
const imageUploadBtn = document.getElementById('image-upload-btn');
const imagePreview = document.getElementById('image-preview');
let selectedImage = null;

// Initialize
async function init() {
    // Initialize theme
    initTheme();
    
    // Initialize character selector
    initCharacterSelector();
    
    // Initialize mode selector
    initModeSelector();

    // Initialize Sessions & Sidebar
    loadSessionsForCurrentMode();
    
    // Re-query status elements in case they weren't ready at top level
    apiStatus = document.getElementById('api-status');
    apiDot = document.getElementById('api-dot');
    
    await CSRFManager.init();
    checkApiHealth();
    updateUsageRing();
    
    // Restore chat from previous session
    if (chatHistory.length > 0) {
        restoreChatDisplay();
    }

    // Periodic health check every 60 seconds
    setInterval(checkApiHealth, 60000);

    // Event listeners
    chatForm.addEventListener('submit', handleSubmit);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    });

    // Clear chat button
    const clearChatBtn = document.getElementById('clear-chat-btn');
    if (clearChatBtn) {
        clearChatBtn.addEventListener('click', clearChat);
    }

    // Auto update usage ring every 30 seconds
    setInterval(updateUsageRing, 30000);
    
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // Search button
    const searchBtn = document.getElementById('search-btn');
    const searchOverlay = document.getElementById('chat-search-overlay');
    const searchCloseBtn = document.getElementById('search-close-btn');
    const searchInputEl = document.getElementById('chat-search-input');
    
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', openSearch);
    }
    if (searchCloseBtn && searchOverlay) {
        searchCloseBtn.addEventListener('click', closeSearch);
    }
    if (searchInputEl) {
        searchInputEl.addEventListener('input', (e) => searchChat(e.target.value));
        searchInputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeSearch();
        });
    }
    
    // Help button
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', () => {
            const helpText = getCommandHelp();
            addRichMessage(helpText, 'assistant', true);
        });
    }

    // Smriti Graph Button
    const smritiBtn = document.getElementById('smriti-btn');
    if (smritiBtn) {
        smritiBtn.addEventListener('click', () => {
            window.location.href = '/graph.html';
        });
    }
}


// Clear chat
function clearChat() {
    chatMessages.innerHTML = '';
    chatHistory = [];
    sessionId = 'session_' + Date.now();
    localStorage.setItem('narad_session_id', sessionId);
}

// ============================================
// IMAGE UPLOAD HANDLERS
// ============================================

if (imageUploadBtn && imageInput) {
    imageUploadBtn.addEventListener('click', () => {
        imageInput.click();
    });
    
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        if (!file.type.startsWith('image/')) {
            showToast('Please select an image file', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            showToast('Image must be under 5MB', 'error');
            return;
        }
        
        selectedImage = file;
        showImagePreview(file);
    });
}

function showImagePreview(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.innerHTML = `
            <img src="${e.target.result}" alt="Preview">
            <button type="button" class="remove-image" onclick="removeSelectedImage()">&times;</button>
        `;
        imagePreview.style.display = 'flex';
        imageUploadBtn.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

window.removeSelectedImage = function() {
    selectedImage = null;
    imagePreview.style.display = 'none';
    imagePreview.innerHTML = '';
    imageInput.value = '';
    imageUploadBtn.classList.remove('has-image');
};

async function analyzeImage(file) {
    showToast('Analyzing image...', 'info');
    
    try {
        const formData = new FormData();
        formData.append('image', file);
        
        const token = CSRFManager.getToken();
        const headers = {};
        if (token) headers['X-CSRF-Token'] = token;
        
        const response = await fetch(`${API_BASE}/api/analyze-image`, {
            method: 'POST',
            headers,
            body: formData
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to analyze image');
        }
        
        const data = await response.json();
        return data.description;
    } catch (e) {
        showToast('Failed to analyze image: ' + e.message, 'error');
        return null;
    }
}

// ============================================
// VOICE FEATURES (STT & TTS)
// ============================================

const voiceInputBtn = document.getElementById('voice-input-btn');
const voiceOutputBtn = document.getElementById('voice-output-btn');
let mediaRecorder = null;
let audioChunks = [];
let isRecording = false;
let currentSpeechUtterance = null;

// Voice Input - Speech to Text
if (voiceInputBtn) {
    voiceInputBtn.addEventListener('click', toggleVoiceRecording);
    voiceInputBtn.addEventListener('mousedown', startRecording);
    voiceInputBtn.addEventListener('mouseup', stopRecording);
    voiceInputBtn.addEventListener('mouseleave', stopRecording);
    voiceInputBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startRecording(); });
    voiceInputBtn.addEventListener('touchend', stopRecording);
}

async function toggleVoiceRecording() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
}

async function startRecording() {
    if (isRecording || !navigator.mediaDevices?.getUserMedia) {
        showToast('Microphone not available', 'error');
        return;
    }
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
                audioChunks.push(e.data);
            }
        };
        
        mediaRecorder.onstop = async () => {
            stream.getTracks().forEach(track => track.stop());
            await transcribeAudio();
        };
        
        mediaRecorder.start();
        isRecording = true;
        voiceInputBtn.classList.add('recording');
        showToast('Listening...', 'info');
    } catch (err) {
        console.error('Recording error:', err);
        showToast('Microphone permission denied', 'error');
    }
}

function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        voiceInputBtn.classList.remove('recording');
    }
}

async function transcribeAudio() {
    if (audioChunks.length === 0) return;
    
    showToast('Transcribing...', 'info');
    
    try {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');
        
        const token = CSRFManager.getToken();
        const headers = {};
        if (token) headers['X-CSRF-Token'] = token;
        
        const response = await fetch(`${API_BASE}/api/speech-to-text`, {
            method: 'POST',
            headers,
            body: formData
        });
        
        if (!response.ok) {
            throw new Error('Transcription failed');
        }
        
        const data = await response.json();
        
        if (data.text) {
            userInput.value = data.text;
            userInput.focus();
            showToast('Voice transcribed!', 'success');
        }
    } catch (err) {
        console.error('Transcription error:', err);
        showToast('Failed to transcribe audio', 'error');
    }
}

// Voice Output - Text to Speech
if (voiceOutputBtn) {
    voiceOutputBtn.addEventListener('click', readLastResponse);
}

async function readLastResponse() {
    if (!voiceOutputBtn) return;
    
    // Find the last assistant message
    const messages = document.querySelectorAll('.message.assistant');
    if (messages.length === 0) {
        showToast('No response to read', 'info');
        return;
    }
    
    const lastMessage = messages[messages.length - 1];
    const text = lastMessage.textContent.trim();
    
    if (!text) {
        showToast('No text to read', 'info');
        return;
    }
    
    // If already speaking, stop
    if (window.speechSynthesis?.speaking) {
        window.speechSynthesis.cancel();
        voiceOutputBtn.classList.remove('speaking');
        return;
    }
    
    // Use Web Speech API (browser-native TTS)
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.pitch = 1;
        
        utterance.onstart = () => {
            voiceOutputBtn.classList.add('speaking');
        };
        
        utterance.onend = () => {
            voiceOutputBtn.classList.remove('speaking');
        };
        
        utterance.onerror = () => {
            voiceOutputBtn.classList.remove('speaking');
        };
        
        window.speechSynthesis.speak(utterance);
        showToast('Reading response...', 'info');
    } else {
        // Fallback to Workers AI TTS
        await playTextToSpeech(text);
    }
}

async function playTextToSpeech(text) {
    try {
        const token = CSRFManager.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['X-CSRF-Token'] = token;
        
        const response = await fetch(`${API_BASE}/api/text-to-speech`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ text })
        });
        
        if (!response.ok) {
            throw new Error('TTS failed');
        }
        
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        voiceOutputBtn.classList.add('speaking');
        
        audio.onended = () => {
            voiceOutputBtn.classList.remove('speaking');
            URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
            voiceOutputBtn.classList.remove('speaking');
            URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
    } catch (err) {
        console.error('TTS error:', err);
        showToast('Text-to-speech failed', 'error');
        voiceOutputBtn.classList.remove('speaking');
    }
}

// Handle form submit
async function handleSubmit(e) {
    e.preventDefault();
    if (isStreaming || (!userInput.value.trim() && !selectedImage)) return;
    
    // Rate limiting check
    if (!rateLimiter.isAllowed()) {
      const retryAfter = rateLimiter.getRetryAfter();
      showError(`Too many requests. Try again in ${retryAfter}s`);
      return;
    }
    
    let message = userInput.value.trim();
    
    // Analyze image if present
    if (selectedImage) {
        const imageDescription = await analyzeImage(selectedImage);
        
        if (imageDescription) {
            // Include image analysis in the message
            if (message) {
                message = `Regarding this image: "${imageDescription}"\n\nUser question: ${message}`;
            } else {
                message = `Please describe and analyze this image: "${imageDescription}"`;
            }
        }
        
        // Clear image selection
        removeSelectedImage();
    }
    
    if (!message) return;
    
    // Parse command syntax
    const parsed = parseCommand(message);
    
    // Handle help and list commands locally
    if (parsed.type === 'help') {
        const helpText = showCommandHelp(parsed.message.trim() || null);
        addRichMessage(helpText, 'assistant', true);
        userInput.value = '';
        return;
    }
    
    if (parsed.type === 'agent_list') {
        let agentList = '# Available Agents\n\n';
        for (const [key, cmd] of Object.entries(COMMAND_REGISTRY)) {
            agentList += `${cmd.icon} **/${key}** - ${cmd.name}\n${cmd.description}\n\n`;
        }
        addRichMessage(agentList, 'assistant', true);
        userInput.value = '';
        return;
    }
    
    // Validate message input
    const validation = InputValidator.validate('message', message);
    if (!validation.valid) {
      showError(validation.error);
      return;
    }
    
    userInput.value = '';
    
    addMessage(message, 'user');
    sendToApi(validation.value);
}

// Clear chat history
function clearHistory() {
    if (isStreaming) stopSearch();
    chatMessages.innerHTML = '';
    chatHistory = [];
    sessionId = 'session_' + Date.now();
    localStorage.setItem('narad_session_id', sessionId);
    saveChatHistory();
}

// Stop current search/generation
function stopSearch() {
    if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
    }
    isStreaming = false;
    const stopBtn = document.getElementById('stop-search-btn');
    if (stopBtn) stopBtn.style.display = 'none';
    
    // Clean up any empty/streaming messages
    const streamingMsgs = document.querySelectorAll('.message.streaming');
    streamingMsgs.forEach(m => {
        const content = m.querySelector('.message-content');
        if (content && !content.textContent) {
            m.remove();
        } else {
            m.classList.remove('streaming');
            if (content) content.textContent += ' [CANCELLED]';
        }
    });
    
    // Look for searching indicators
    const searchingIndicators = document.querySelectorAll('.searching');
    searchingIndicators.forEach(i => i.remove());
    
    showToast('Process terminated', 'warning');
}

// Keyboard shortcuts
window.addEventListener('keydown', (e) => {
    // CMD+K to clear
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        clearHistory();
    }
    
    // Ctrl+C to stop
    if (e.ctrlKey && e.key === 'c' && isStreaming) {
        e.preventDefault();
        stopSearch();
    }
    
    // CMD+F to search
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        openSearch();
    }
    
    // CMD+T to toggle theme
    if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault();
        toggleTheme();
    }
});

const clearHistoryBtn = document.getElementById('clear-history-btn');
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearHistory);
}

const stopSearchBtn = document.getElementById('stop-search-btn');
if (stopSearchBtn) {
    stopSearchBtn.addEventListener('click', stopSearch);
}

// Show error message to user
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.innerHTML = `<div class="message-content">⚠️ ${escapeHtml(message)}</div>`;
    chatMessages.appendChild(errorDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// API Health Check with detailed status
let healthCheckRetries = 0;
const MAX_HEALTH_RETRIES = 5;

async function checkApiHealth() {
    console.log('[Narad] Health check starting...');
    
    // Ensure DOM elements exist
    let statusEl = document.getElementById('api-status');
    let dotEl = document.getElementById('api-dot');
    
    // Retry DOM lookup if not found (handles race condition)
    if (!statusEl || !dotEl) {
        await new Promise(r => setTimeout(r, 100));
        statusEl = document.getElementById('api-status');
        dotEl = document.getElementById('api-dot');
    }
    
    if (!statusEl || !dotEl) {
        console.error('[Narad] Status elements not found in DOM');
        return;
    }
    
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const res = await fetch(`${API_BASE}/api/health`, { 
            signal: controller.signal,
            cache: 'no-cache'
        });
        clearTimeout(timeoutId);
        
        // Reset classes
        dotEl.classList.remove('connected', 'warning', 'error');
        
        if (res.ok) {
            const data = await res.json();
            healthCheckRetries = 0;
            
            if (data.status === 'ok') {
                statusEl.textContent = 'Connected';
                dotEl.classList.add('connected');
            } else if (data.status === 'degraded') {
                statusEl.textContent = 'Degraded';
                dotEl.classList.add('warning');
            } else {
                statusEl.textContent = 'Error';
                dotEl.classList.add('error');
            }
        } else {
            handleHealthFailure(`HTTP ${res.status}`);
        }
    } catch (e) {
        console.error('[Narad] Health check error:', e.message);
        handleHealthFailure(e.message);
    }
}

function handleHealthFailure(reason) {
    healthCheckRetries++;
    console.warn(`[Narad] Health check failed (${healthCheckRetries}/${MAX_HEALTH_RETRIES}):`, reason);
    
    // Ensure we have current references
    const statusEl = document.getElementById('api-status');
    const dotEl = document.getElementById('api-dot');
    
    if (healthCheckRetries >= MAX_HEALTH_RETRIES) {
        if (statusEl) statusEl.textContent = 'Offline';
        if (dotEl) {
            dotEl.classList.remove('connected', 'warning');
            dotEl.classList.add('error');
        }
    } else {
        if (statusEl) statusEl.textContent = `Retrying (${healthCheckRetries}/${MAX_HEALTH_RETRIES})...`;
        // Retry with exponential backoff
        setTimeout(checkApiHealth, Math.min(2000 * Math.pow(2, healthCheckRetries), 10000));
    }
}

// Add message to chat - XSS Safe using DOM APIs
const MESSAGE_LIMIT = 500;

function addMessage(text, type = 'assistant') {
    const div = document.createElement('div');
    div.className = `message ${type} slide-up`;
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = type === 'user' ? '[user@macos] >' : '[narad@system]';
    
    messageHeader.appendChild(promptSpan);
    
    if (type === 'assistant' && selectedCharacter && selectedCharacter !== 'default') {
        const charBadge = document.createElement('span');
        charBadge.className = 'character-badge';
        const char = typeof getCharacter === 'function' ? getCharacter(selectedCharacter) : null;
        charBadge.textContent = char?.name || selectedCharacter;
        messageHeader.appendChild(charBadge);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Sanitize with DOMPurify
    const sanitizedText = DOMPurify.sanitize(text || '');
    contentDiv.textContent = sanitizedText;
    
    div.appendChild(messageHeader);
    div.appendChild(contentDiv);
    
    chatMessages.appendChild(div);
    
    // Clean old messages for performance
    const messages = chatMessages.querySelectorAll('.message');
    if (messages.length > MESSAGE_LIMIT) {
        messages[0].remove();
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

// Add message with optional rich content (markdown supported)
function addRichMessage(text, type = 'assistant', allowHtml = false) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    const messageHeader = document.createElement('div');
    messageHeader.className = 'message-header';
    
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = type === 'user' ? '[user@macos] >' : '[narad@system]';
    
    messageHeader.appendChild(promptSpan);
    
    if (type === 'assistant' && selectedCharacter && selectedCharacter !== 'default') {
        const charBadge = document.createElement('span');
        charBadge.className = 'character-badge';
        const char = typeof getCharacter === 'function' ? getCharacter(selectedCharacter) : null;
        charBadge.textContent = char?.name || selectedCharacter;
        messageHeader.appendChild(charBadge);
    }
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (allowHtml || type === 'assistant') {
      const rendered = renderMarkdown(text || '');
      contentDiv.innerHTML = DOMPurify.sanitize(rendered, DOMPURIFY_CONFIG);
    } else {
      contentDiv.textContent = text || '';
    }
    
    div.appendChild(messageHeader);
    div.appendChild(contentDiv);
    
    // Add actions for assistant messages
    if (type === 'assistant') {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        actionsDiv.innerHTML = `
            <button class="message-action-btn" onclick="this.parentElement.parentElement.querySelector('.message-reactions').innerHTML = '👍'; submitFeedback(1);" title="Good response">👍</button>
            <button class="message-action-btn" onclick="this.parentElement.parentElement.querySelector('.message-reactions').innerHTML = '👎'; submitFeedback(-1);" title="Bad response">👎</button>
        `;
        div.appendChild(actionsDiv);
        
        const reactionsDiv = document.createElement('div');
        reactionsDiv.className = 'message-reactions';
        div.appendChild(reactionsDiv);
    }
    
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return div;
}

// Escape HTML (legacy support, prefer addMessage)
function escapeHtml(text) {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Check if message is a multi-agent request
async function checkMultiAgent(message) {
    try {
        const response = await fetch(`${API_BASE}/api/detect-multi-agent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        return data;
    } catch {
        return { isMultiAgent: false };
    }
}

// Send to API with CSRF protection
async function sendToApi(message) {
    isStreaming = true;
    currentAbortController = new AbortController();
    const stopBtn = document.getElementById('stop-search-btn');
    if (stopBtn) stopBtn.style.display = 'block';
    
    try {
        // Validate session ID
        const sessionValidation = InputValidator.validate('sessionId', sessionId);
        if (!sessionValidation.valid) {
          throw new Error(sessionValidation.error);
        }
        
        // Validate history
        const historyValidation = InputValidator.validate('history', chatHistory);
        if (!historyValidation.valid) {
          chatHistory = []; // Reset invalid history
        }
        
        // Build request headers
        const headers = { 'Content-Type': 'application/json' };
        const token = CSRFManager.getToken();
        if (token) {
          headers['X-CSRF-Token'] = token;
        }
        
        // Get selected agent type
        const agent_type = 'general';
        
        // Show searching indicator if needed
        const searchKeywords = ['news', 'who is', 'latest', 'what is', 'price', 'share', 'stock', 'current', 'event'];
        const isSearch = message.toLowerCase().startsWith('/search') || 
                        searchKeywords.some(k => message.toLowerCase().includes(k));
        
        let searchingEl = null;
        if (isSearch) {
            searchingEl = document.createElement('div');
            searchingEl.className = 'searching';
            searchingEl.textContent = 'Querying global data grid...';
            chatMessages.appendChild(searchingEl);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        const response = await fetch(`${API_BASE}/api/chat`, {
            method: 'POST',
            headers,
            signal: currentAbortController.signal,
            body: JSON.stringify({
                message,
                history: chatHistory,
                session_id: sessionId,
                agent_type,
                character: selectedCharacter,
                skill_context: activeSkill ? activeSkill.content : null
            })
        });
        
        // Remove searching indicator
        if (searchingEl) searchingEl.remove();

        // Show typing indicator
        showTypingIndicator();
        
        const msgEl = addMessage('', 'assistant');
        msgEl.classList.add('streaming');
        const contentEl = msgEl.querySelector('.message-content');
        
        // Handle CSRF errors
        if (response.status === 403) {
            throw new Error('Security validation failed. Please refresh the page.');
        }
        
        // Handle rate limiting
        if (response.status === 429) {
            const retryAfter = response.headers.get('Retry-After') || 60;
            throw new Error(`Rate limited. Try again in ${retryAfter} seconds.`);
        }
        
        if (!response.ok) {
            const error = await response.json();
            contentEl.textContent = `Error: ${error.error || 'Failed to get response'}`;
            msgEl.classList.remove('streaming');
            isStreaming = false;
            return;
        }
        
        const data = await response.json();
        
        if (data.reply) {
            chatHistory.push({ role: 'user', text: message });
            chatHistory.push({ role: 'assistant', text: data.reply });
            saveChatHistory();
            
            // Streaming effect
            let charIndex = 0;
            const reply = data.reply;
            const interval = setInterval(() => {
                // Check if we stop in middle of generation
                if (!isStreaming) {
                    clearInterval(interval);
                    if (stopBtn) stopBtn.style.display = 'none';
                    return;
                }

                if (charIndex < reply.length) {
                    contentEl.textContent += reply[charIndex];
                    charIndex++;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    clearInterval(interval);
                    hideTypingIndicator();
                    if (stopBtn) stopBtn.style.display = 'none';
                    msgEl.classList.remove('streaming');
                    isStreaming = false;
                    
                    // Update usage ring after response
                    updateUsageRing();
                    
                    // Show metadata
                    if (data.metadata) {
                        const meta = document.createElement('div');
                        meta.className = 'message-meta';
                        meta.textContent = `💚 ${data.metadata.tokens} tokens • ${data.metadata.agentType} agent`;
                        msgEl.appendChild(meta);
                    }
                    
                    // Auto-save important responses to memory
                    autoSaveToMemory(data.reply, message);
                    
                    // Auto-read response if enabled
                    if (autoReadEnabled && 'speechSynthesis' in window) {
                        const utterance = new SpeechSynthesisUtterance(data.reply);
                        utterance.rate = 1.1;
                        window.speechSynthesis.speak(utterance);
                        voiceOutputBtn?.classList.add('speaking');
                        utterance.onend = () => {
                            voiceOutputBtn?.classList.remove('speaking');
                        };
                    }
                }
            }, 10);
        }
    } catch (error) {
        hideTypingIndicator();
        if (stopBtn) stopBtn.style.display = 'none';
        if (error.name === 'AbortError') {
            console.log('Fetch aborted');
            return; 
        }
        contentEl.textContent = `Error: ${error.message}`;
        msgEl.classList.remove('streaming');
        isStreaming = false;
    } finally {
        hideTypingIndicator();
        currentAbortController = null;
    }
}

// Update Usage Ring in Header
async function updateUsageRing() {
    try {
        const res = await fetch(`${API_BASE}/api/usage`);
        if (!res.ok) return;
        
        const data = await res.json();
        renderUsageRing(data);
    } catch (e) {
        console.warn('Failed to update usage:', e);
    }
}

// Render usage ring (and header tokens)
function renderUsageRing(usageData) {
    const currentTokensEl = document.getElementById('current-tokens');
    const currentPercentEl = document.getElementById('current-percent');
    
    let totalUsed = 0;
    let totalLimit = 0;
    
    if (usageData && typeof usageData === 'object') {
        for (const agent in usageData) {
            if (usageData[agent]) {
                totalUsed += usageData[agent].tokensUsed || 0;
                totalLimit += usageData[agent].limit || 200000;
            }
        }
    }
    
    const percent = totalLimit > 0 ? Math.min(100, (totalUsed / totalLimit) * 100) : 0;
    
    // Update new full-screen header elements
    if (currentTokensEl) currentTokensEl.textContent = formatNumber(totalUsed);
    if (currentPercentEl) currentPercentEl.textContent = `(${percent.toFixed(0)}%)`;
    
    // Maintain old ring logic for compatibility/hidden elements if needed
    const ringEl = document.getElementById('usage-ring') || (typeof usageRing !== 'undefined' ? usageRing : null);
    if (ringEl) {
        let colorClass = '';
        if (percent >= 90) colorClass = 'danger';
        else if (percent >= 70) colorClass = 'warning';
        
        const circumference = 2 * Math.PI * 15.5;
        const dashArray = (percent / 100) * circumference;
        
        ringEl.innerHTML = `
            <svg viewBox="0 0 36 36">
                <circle class="ring-bg" cx="18" cy="18" r="15.5"></circle>
                <circle class="ring-progress ${colorClass}" cx="18" cy="18" r="15.5" 
                    stroke-dasharray="${dashArray}, ${circumference}"></circle>
            </svg>
            <span class="tokens">${formatNumber(totalUsed)}</span>
            <span class="percent ${colorClass}">${percent.toFixed(0)}%</span>
        `;
    }
}

// Format number with K/M suffix
function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    init();
});
if (document.readyState !== 'loading') {
    init();
}

// Submit feedback with CSRF protection
async function submitFeedback(score) {
    const token = CSRFManager.getToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['X-CSRF-Token'] = token;
    }
    
    try {
        const response = await fetch(`${API_BASE}/api/feedback`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                session_id: sessionId,
                score
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            console.error('Feedback error:', error.error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Feedback error:', error);
        return false;
    }
}

// ============================================
// MEMORY SIDEBAR FUNCTIONS
// ============================================

// DOM Elements
const memorySidebar = document.getElementById('memory-sidebar');
const memoryToggle = document.getElementById('memory-toggle');
const closeSidebar = document.getElementById('close-sidebar');
const memoryTabs = document.querySelectorAll('.memory-tab');
const memoryPanels = document.querySelectorAll('.memory-panel');

// Toggle sidebar with backdrop support
function toggleSidebar(open) {
    const sidebar = document.getElementById('memory-sidebar');
    if (!sidebar) return;

    if (open === undefined) {
        open = !sidebar.classList.contains('open');
    }
    
    sidebar.classList.toggle('open', open);

    // Mobile Backdrop logic
    if (window.innerWidth <= 768) {
        let backdrop = document.getElementById('sidebar-backdrop');
        if (open) {
            if (!backdrop) {
                backdrop = document.createElement('div');
                backdrop.id = 'sidebar-backdrop';
                backdrop.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:150;backdrop-filter:blur(4px);';
                backdrop.addEventListener('click', () => toggleSidebar(false));
                document.body.appendChild(backdrop);
            }
        } else if (backdrop) {
            backdrop.remove();
        }
    }
}

// Re-attach listeners for sidebar
if (memoryToggle) {
    memoryToggle.addEventListener('click', () => toggleSidebar());
}
if (closeSidebar) {
    closeSidebar.addEventListener('click', () => toggleSidebar(false));
}

// Tab switching
memoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        
        // Update active tab
        memoryTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Show corresponding panel
        memoryPanels.forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabName}-panel`);
        });
    });
});

// ============================================
// IDEAS FUNCTIONS
// ============================================

const ideaInput = document.getElementById('idea-input');
const ideaTags = document.getElementById('idea-tags');
const saveIdeaBtn = document.getElementById('save-idea');
const ideasList = document.getElementById('ideas-list');

function renderIdeas() {
    if (!ideasList) return;
    
    if (savedIdeas.length === 0) {
        ideasList.innerHTML = '<div class="empty-state">No ideas saved yet. Start capturing!</div>';
        return;
    }
    
    ideasList.innerHTML = savedIdeas.map((idea, index) => `
        <div class="idea-card" data-index="${index}">
            <div class="idea-content">${escapeHtml(idea.text)}</div>
            <div class="idea-meta">
                <span class="idea-date">${formatDate(idea.createdAt)}</span>
                ${idea.tags && idea.tags.length > 0 ? `
                    <div class="idea-tags-list">
                        ${idea.tags.map(tag => `<span class="idea-tag">${escapeHtml(tag)}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    // Add click handlers to idea cards
    ideasList.querySelectorAll('.idea-card').forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            const idea = savedIdeas[index];
            
            // Use idea in chat
            userInput.value = `/idea ${idea.text}`;
            toggleSidebar(false);
            userInput.focus();
        });
    });
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

async function saveIdea() {
    if (!ideaInput || !ideaInput.value.trim()) {
        showToast('Please enter an idea', 'error');
        return;
    }
    
    const text = ideaInput.value.trim();
    const tags = ideaTags && ideaTags.value.trim() 
        ? ideaTags.value.split(',').map(t => t.trim()).filter(t => t)
        : [];
    
    const idea = {
        text,
        tags,
        createdAt: new Date().toISOString()
    };
    
    // Save locally
    savedIdeas.unshift(idea);
    localStorage.setItem('narad_ideas', JSON.stringify(savedIdeas));
    
    // Save to server
    try {
        const token = CSRFManager.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['X-CSRF-Token'] = token;
        
        await fetch(`${API_BASE}/api/idea`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ text, tags })
        });
    } catch (e) {
        console.warn('Failed to save idea to server:', e);
    }
    
    // Clear form
    ideaInput.value = '';
    if (ideaTags) ideaTags.value = '';
    
    // Re-render
    renderIdeas();
    
    showToast('Idea saved!', 'success');
}

if (saveIdeaBtn) {
    saveIdeaBtn.addEventListener('click', saveIdea);
}

// ============================================
// AUTO-SAVE IMPORTANT CHATS TO MEMORY
// ============================================

const autoSaveSettings = {
    minCodeLength: 50,
    minResponseLength: 500,
    importantKeywords: ['solution', 'fix', 'architecture', 'implementation', 'algorithm', 'configuration', 'setup', 'guide', 'tutorial', 'best practice', 'pattern', 'optimization']
};

function shouldAutoSave(text) {
    if (!text || typeof text !== 'string') return false;
    
    // Has substantial code
    const codeMatch = text.match(/```[\s\S]*?```/g);
    if (codeMatch) {
        const codeLength = codeMatch.join('').length;
        if (codeLength >= autoSaveSettings.minCodeLength) return true;
    }
    
    // Has inline code
    const inlineCode = text.match(/`[^`]+`/g);
    if (inlineCode && inlineCode.join('').length >= autoSaveSettings.minCodeLength) return true;
    
    // Long response with important keywords
    if (text.length >= autoSaveSettings.minResponseLength) {
        const lowerText = text.toLowerCase();
        for (const keyword of autoSaveSettings.importantKeywords) {
            if (lowerText.includes(keyword)) return true;
        }
    }
    
    return false;
}

function extractSummary(text) {
    // Extract first meaningful sentence or line
    const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('```'));
    if (lines.length > 0) {
        let summary = lines[0].trim();
        if (summary.length > 150) {
            summary = summary.substring(0, 147) + '...';
        }
        return summary;
    }
    return text.substring(0, 100) + '...';
}

function generateAutoTags(text) {
    const tags = [];
    
    // Code-related tags
    if (text.includes('```')) tags.push('code');
    if (text.match(/function|const|let|var|=>|import|export|class /)) tags.push('javascript');
    if (text.match(/def |import |from |class |async |await/)) tags.push('python');
    if (text.match(/async |await |Promise|fetch\(|async function/)) tags.push('async');
    
    // Topic tags
    const lowerText = text.toLowerCase();
    if (lowerText.includes('api')) tags.push('api');
    if (lowerText.includes('database') || lowerText.includes('sql')) tags.push('database');
    if (lowerText.includes('error') || lowerText.includes('bug') || lowerText.includes('fix')) tags.push('debugging');
    if (lowerText.includes('config')) tags.push('configuration');
    if (lowerText.includes('test')) tags.push('testing');
    if (lowerText.includes('deploy')) tags.push('deployment');
    if (lowerText.includes('security') || lowerText.includes('auth')) tags.push('security');
    
    return tags.slice(0, 5);
}

async function autoSaveToMemory(text, query) {
    if (!autoSaveEnabled || !shouldAutoSave(text)) return;
    
    const summary = extractSummary(text);
    const tags = generateAutoTags(text);
    tags.push('auto-saved');
    
    const memory = {
        text: `Q: ${query}\n\nA: ${text}`,
        summary,
        tags,
        createdAt: new Date().toISOString(),
        type: 'chat'
    };
    
    try {
        const token = CSRFManager.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['X-CSRF-Token'] = token;
        
        const response = await fetch(`${API_BASE}/api/memory/store`, {
            method: 'POST',
            headers,
            body: JSON.stringify(memory)
        });
        
        if (response.ok) {
            console.log('Auto-saved important chat to memory');
        }
    } catch (e) {
        console.warn('Auto-save failed:', e);
    }
}

// ============================================
// MEMORY SEARCH FUNCTIONS
// ============================================

const memorySearchInput = document.getElementById('memory-search-input');
const memorySearchBtn = document.getElementById('memory-search-btn');
const memorySearchResults = document.getElementById('search-results');
const memoryBudget = document.getElementById('memory-budget');
const budgetFill = document.getElementById('budget-fill');
const budgetText = document.getElementById('budget-text');

async function searchMemory() {
    if (!memorySearchInput || !memorySearchInput.value.trim()) {
        showToast('Please enter a search query', 'error');
        return;
    }
    
    const query = memorySearchInput.value.trim();
    
    if (!memorySearchResults) return;
    memorySearchResults.innerHTML = '<div class="empty-state"><span class="loading-spinner"></span> Searching...</div>';
    
    try {
        const token = CSRFManager.getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['X-CSRF-Token'] = token;
        
        const response = await fetch(`${API_BASE}/api/memory/search`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ query, topK: 10, threshold: 0.5 })
        });
        
        if (!response.ok) {
            throw new Error('Search failed');
        }
        
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            memorySearchResults.innerHTML = '<div class="empty-state">No matching memories found</div>';
            return;
        }
        
        memorySearchResults.innerHTML = data.results.map(result => `
            <div class="search-result">
                <div class="result-content">
                    ${escapeHtml(result.content)}
                    <span class="result-score">${(result.similarity * 100).toFixed(0)}% match</span>
                </div>
                <div class="result-meta">${formatDate(result.createdAt)}</div>
            </div>
        `).join('');
        
        // Update budget display
        updateMemoryBudget();
        
    } catch (error) {
        console.error('Search error:', error);
        memorySearchResults.innerHTML = '<div class="empty-state">Search failed. Try again.</div>';
    }
}

async function updateMemoryBudget() {
    try {
        const response = await fetch(`${API_BASE}/api/memory/status`);
        if (!response.ok) return;
        
        const data = await response.json();
        
        if (budgetFill && budgetText && data.budget) {
            const used = data.budget.used;
            const limit = data.budget.limit;
            const percent = (used / limit) * 100;
            
            if (budgetFill) budgetFill.style.width = `${Math.min(percent, 100)}%`;
            if (budgetText) budgetText.textContent = `${used}/${limit}`;
        }
    } catch (e) {
        console.warn('Failed to fetch memory status:', e);
    }
}

if (memorySearchBtn) {
    memorySearchBtn.addEventListener('click', searchMemory);
}

if (memorySearchInput) {
    memorySearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchMemory();
    });
}

// ============================================
// EXPORT/IMPORT FUNCTIONS
// ============================================

const exportBtn = document.getElementById('export-ideas');
const exportLogSeqBtn = document.getElementById('export-logseq');
const exportAffineBtn = document.getElementById('export-affine');
const importBtn = document.getElementById('import-ideas');

function downloadFile(content, filename, type = 'text/markdown') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function exportIdeasAsMarkdown() {
    if (savedIdeas.length === 0) {
        showToast('No ideas to export', 'error');
        return;
    }
    
    let markdown = '# Narad Ideas Export\n\n';
    markdown += `Exported: ${new Date().toISOString()}\n\n`;
    
    savedIdeas.forEach((idea, i) => {
        markdown += `## Idea ${i + 1}\n`;
        markdown += `${idea.text}\n\n`;
        if (idea.tags && idea.tags.length > 0) {
            markdown += `**Tags:** ${idea.tags.join(', ')}\n`;
        }
        markdown += `**Date:** ${idea.createdAt}\n`;
        markdown += '---\n\n';
    });
    
    downloadFile(markdown, `narad-ideas-${new Date().toISOString().split('T')[0]}.md`);
    showToast('Exported as Markdown!', 'success');
}

function exportIdeasAsLogSeq() {
    if (savedIdeas.length === 0) {
        showToast('No ideas to export', 'error');
        return;
    }
    
    let logseq = '';
    const exportDate = new Date().toISOString().split('T')[0];
    
    savedIdeas.forEach((idea, i) => {
        const title = idea.text.substring(0, 50).replace(/[<>:"/\\|?*]/g, '') || `Idea ${i + 1}`;
        const createdAt = idea.createdAt ? idea.createdAt.split('T')[0] : exportDate;
        
        logseq += `title:: ${title}\n`;
        logseq += `created_at:: ${createdAt}\n`;
        if (idea.tags && idea.tags.length > 0) {
            logseq += `tags:: ${idea.tags.map(t => `#${t}`).join(' ')}\n`;
        }
        logseq += `source:: [[Narad]]\n`;
        logseq += `\n${idea.text}\n\n`;
        logseq += '---\n\n';
    });
    
    downloadFile(logseq, `narad-logseq-${exportDate}.md`);
    showToast('Exported for LogSeq!', 'success');
}

function exportIdeasAsAffine() {
    if (savedIdeas.length === 0) {
        showToast('No ideas to export', 'error');
        return;
    }
    
    let affine = '';
    const exportDate = new Date().toISOString().split('T')[0];
    
    savedIdeas.forEach((idea, i) => {
        const title = idea.text.substring(0, 50).replace(/[<>:"/\\|?*]/g, '') || `Idea ${i + 1}`;
        
        affine += `> [!info] ${title}\n`;
        if (idea.tags && idea.tags.length > 0) {
            affine += `> **Tags:** ${idea.tags.map(t => `#${t}`).join(' ')}\n`;
        }
        affine += `> **Created:** ${idea.createdAt || exportDate}\n\n`;
        affine += `${idea.text}\n\n`;
        affine += '---\n\n';
    });
    
    downloadFile(affine, `narad-affine-${exportDate}.md`);
    showToast('Exported for AFFiNe!', 'success');
}

function importIdeasFromMarkdown() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.md,.txt';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target.result;
                const ideas = parseMarkdownIdeas(content);
                
                if (ideas.length === 0) {
                    showToast('No valid ideas found in file', 'error');
                    return;
                }
                
                // Merge with existing ideas (avoiding duplicates)
                const existingTexts = new Set(savedIdeas.map(i => i.text));
                const newIdeas = ideas.filter(i => !existingTexts.has(i.text));
                
                if (newIdeas.length === 0) {
                    showToast('All ideas already exist', 'info');
                    return;
                }
                
                savedIdeas = [...newIdeas, ...savedIdeas];
                localStorage.setItem('narad_ideas', JSON.stringify(savedIdeas));
                renderIdeas();
                
                showToast(`Imported ${newIdeas.length} new ideas!`, 'success');
            } catch (err) {
                showToast('Failed to parse file', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function parseMarkdownIdeas(content) {
    const ideas = [];
    const blocks = content.split(/^---+$/m);
    
    blocks.forEach(block => {
        block = block.trim();
        if (!block || block.startsWith('#')) return;
        
        // Extract text (everything not in markdown headers)
        const lines = block.split('\n');
        const textLines = [];
        let inTags = false;
        let tags = [];
        
        lines.forEach(line => {
            if (line.startsWith('**Tags:**')) {
                inTags = true;
                const tagStr = line.replace('**Tags:**', '').trim();
                tags = tagStr.split(',').map(t => t.trim()).filter(t => t);
            } else if (line.startsWith('**Date:**')) {
                inTags = false;
            } else if (!line.startsWith('##') && !line.startsWith('**')) {
                if (inTags) {
                    tags = tags.concat(line.split(',').map(t => t.trim()).filter(t => t));
                } else {
                    textLines.push(line);
                }
            }
        });
        
        const text = textLines.join(' ').trim();
        if (text) {
            ideas.push({
                text,
                tags,
                createdAt: new Date().toISOString()
            });
        }
    });
    
    return ideas;
}

if (exportBtn) exportBtn.addEventListener('click', exportIdeasAsMarkdown);
if (exportLogSeqBtn) exportLogSeqBtn.addEventListener('click', exportIdeasAsLogSeq);
if (exportAffineBtn) exportAffineBtn.addEventListener('click', exportIdeasAsAffine);
if (importBtn) importBtn.addEventListener('click', importIdeasFromMarkdown);

// ============================================
// AUTO-SAVE TOGGLE
// ============================================

let autoSaveEnabled = localStorage.getItem('narad_auto_save') !== 'false';
const autoSaveToggle = document.getElementById('auto-save-toggle');

if (autoSaveToggle) {
    autoSaveEnabled = localStorage.getItem('narad_auto_save') !== 'false';
    autoSaveToggle.checked = autoSaveEnabled;
    autoSaveToggle.addEventListener('change', (e) => {
        autoSaveEnabled = e.target.checked;
        localStorage.setItem('narad_auto_save', autoSaveEnabled);
        showToast(autoSaveEnabled ? 'Auto-save enabled' : 'Auto-save disabled', 'info');
    });
}

let autoReadEnabled = localStorage.getItem('narad_auto_read') === 'true';
const autoReadToggle = document.getElementById('auto-read-toggle');

if (autoReadToggle) {
    autoReadEnabled = localStorage.getItem('narad_auto_read') === 'true';
    autoReadToggle.checked = autoReadEnabled;
    autoReadToggle.addEventListener('change', (e) => {
        autoReadEnabled = e.target.checked;
        localStorage.setItem('narad_auto_read', autoReadEnabled);
        showToast(autoReadEnabled ? 'Auto-read enabled' : 'Auto-read disabled', 'info');
    });
}

// ============================================
// TOAST NOTIFICATIONS
// ============================================

function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ============================================
// INITIALIZE MEMORY FEATURES
// ============================================

function initMemoryFeatures() {
    renderIdeas();
    updateMemoryBudget();
}

// Run memory init after main init
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initMemoryFeatures, 100);
});

// ============================================
// GLOBAL ERROR HANDLERS
// ============================================

window.addEventListener('error', (event) => {
  console.error('[GlobalError]', event.error);
  showToast('An error occurred. Please refresh.', 'error');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('[UnhandledRejection]', event.reason);
  showToast('Unexpected error. Please refresh.', 'error');
  event.preventDefault();
});
