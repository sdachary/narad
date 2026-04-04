// Narad AI Terminal - Original Theme with Minimal Ring Charts
function getApiBase() {
  const metaApiBase = document.querySelector('meta[name="api-base"]')?.getAttribute('content');
  if (metaApiBase) return metaApiBase;
  
  if (typeof process !== 'undefined' && process.env?.REACT_APP_API_BASE) {
    return process.env.REACT_APP_API_BASE;
  }
  
  const hostname = window.location.hostname;
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    return 'http://localhost:8788';
  }
  
  return '';
}

function initApiBase() {
  const hostname = window.location.hostname;
  let apiBase;
  
  if (hostname.includes('localhost') || hostname === '127.0.0.1') {
    apiBase = 'http://localhost:8788';
  } else if (hostname.includes('pages.dev')) {
    apiBase = 'https://narad-7hc.pages.dev';
  } else if (hostname.includes('narad.io')) {
    apiBase = 'https://narad.io';
  } else {
    apiBase = '';
  }
  
  const metaApiBase = document.querySelector('meta[name="api-base"]');
  if (metaApiBase) {
    metaApiBase.setAttribute('content', apiBase);
  }
  
  return apiBase;
}

const API_BASE = initApiBase();
let sessionId = localStorage.getItem('narad_session_id') || 'session_' + Date.now();
localStorage.setItem('narad_session_id', sessionId);

let chatHistory = [];
let isStreaming = false;
let csrfToken = null;
let savedIdeas = JSON.parse(localStorage.getItem('narad_ideas') || '[]');

// XSS Prevention: DOMPurify configuration
const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'br', 'p', 'span', 'a'],
  ALLOWED_ATTR: ['href', 'class'],
  ALLOW_DATA_ATTR: false,
};

// Simple DOMPurify implementation for vanilla JS
const DOMPurify = {
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
const apiStatus = document.getElementById('api-status');
const apiDot = document.getElementById('api-dot');
const usageRing = document.getElementById('usage-ring');
const imageInput = document.getElementById('image-input');
const imageUploadBtn = document.getElementById('image-upload-btn');
const imagePreview = document.getElementById('image-preview');
let selectedImage = null;

// Initialize
async function init() {
    await CSRFManager.init();
    checkApiHealth();
    updateUsageRing();

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
}


// Clear chat
function clearChat() {
    if (confirm('Are you sure you want to clear the chat?')) {
        chatMessages.innerHTML = '';
        // Add welcome message back
        addMessage('Hello. I am Narad, your simplified AI assistant. How can I help you today?', 'assistant');
        showToast('Chat cleared', 'info');
    }
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
    chatMessages.innerHTML = '';
    chatHistory = [];
    sessionId = 'session_' + Date.now();
    localStorage.setItem('narad_session_id', sessionId);
    
    addMessage('Terminal buffer cleared. Ready for input.', 'assistant');
    showToast('History cleared', 'info');
}

// CMD+K to clear
window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        clearHistory();
    }
});

const clearHistoryBtn = document.getElementById('clear-history-btn');
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', clearHistory);
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
    
    if (healthCheckRetries >= MAX_HEALTH_RETRIES) {
        if (apiStatus) apiStatus.textContent = 'Offline';
        if (apiDot) {
            apiDot.classList.remove('connected', 'warning');
            apiDot.classList.add('error');
        }
    } else {
        // Retry with exponential backoff
        setTimeout(checkApiHealth, Math.min(2000 * Math.pow(2, healthCheckRetries), 10000));
    }
}

// Add message to chat - XSS Safe using DOM APIs
const MESSAGE_LIMIT = 500;

function addMessage(text, type = 'assistant') {
    const div = document.createElement('div');
    div.className = `message ${type} slide-up`;
    
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = type === 'user' ? '[user@macos] >' : '[narad@system]';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Sanitize with DOMPurify
    const sanitizedText = DOMPurify.sanitize(text || '');
    contentDiv.textContent = sanitizedText;
    
    div.appendChild(promptSpan);
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

// Add message with optional rich content (limited HTML)
function addRichMessage(text, type = 'assistant', allowHtml = false) {
    const div = document.createElement('div');
    div.className = `message ${type}`;
    
    const promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    promptSpan.textContent = type === 'user' ? '[user@macos] >' : '[narad@system]';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (allowHtml) {
      // Sanitize with DOMPurify for rich content
      contentDiv.innerHTML = DOMPurify.sanitize(text || '', DOMPURIFY_CONFIG);
    } else {
      // Plain text - use textContent
      contentDiv.textContent = text || '';
    }
    
    div.appendChild(promptSpan);
    div.appendChild(contentDiv);
    
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
            body: JSON.stringify({
                message,
                history: chatHistory,
                session_id: sessionId,
                agent_type
            })
        });
        
        // Remove searching indicator
        if (searchingEl) searchingEl.remove();

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
            
            // Streaming effect
            let charIndex = 0;
            const reply = data.reply;
            const interval = setInterval(() => {
                if (charIndex < reply.length) {
                    contentEl.textContent += reply[charIndex];
                    charIndex++;
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                } else {
                    clearInterval(interval);
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
            }, 15);
        }
    } catch (error) {
        contentEl.textContent = `Error: ${error.message}`;
        msgEl.classList.remove('streaming');
        isStreaming = false;
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
const searchResults = document.getElementById('search-results');
const memoryBudget = document.getElementById('memory-budget');
const budgetFill = document.getElementById('budget-fill');
const budgetText = document.getElementById('budget-text');

async function searchMemory() {
    if (!memorySearchInput || !memorySearchInput.value.trim()) {
        showToast('Please enter a search query', 'error');
        return;
    }
    
    const query = memorySearchInput.value.trim();
    
    if (!searchResults) return;
    searchResults.innerHTML = '<div class="empty-state"><span class="loading-spinner"></span> Searching...</div>';
    
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
            searchResults.innerHTML = '<div class="empty-state">No matching memories found</div>';
            return;
        }
        
        searchResults.innerHTML = data.results.map(result => `
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
        searchResults.innerHTML = '<div class="empty-state">Search failed. Try again.</div>';
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
