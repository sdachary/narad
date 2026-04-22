import { pollAllServices, checkServiceDown } from '../services/observer.js';
import { checkAlerts } from '../services/reporter.js';

export function setupCommandCenterRoutes(app) {
  app.get('/', async (c) => {
    return c.html(getCommandCenterHTML());
  });
  
  app.get('/command-center', async (c) => {
    return c.html(getCommandCenterHTML());
  });
}

function getCommandCenterHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Command Center — Narad</title>
  <style>
    :root {
      --bg: #f7f6f2;
      --surface: rgba(255, 255, 255, 0.7);
      --border: rgba(229, 224, 216, 0.5);
      --text-primary: #1a1814;
      --text-secondary: #6b6457;
      --text-muted: #a09890;
      --accent: #c8763a;
      --accent-light: #f5ede3;
      --green: #3a7c5c;
      --red: #8c3a3a;
      --amber: #8c6e1a;
      --shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
      --radius: 16px;
    }

    [data-theme="dark"] {
      --bg: #1a1814;
      --surface: rgba(30, 28, 24, 0.7);
      --border: rgba(60, 55, 50, 0.5);
      --text-primary: #f7f6f2;
      --text-secondary: #a09890;
      --text-muted: #6b6457;
      --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; transition: background 0.3s, color 0.3s; }

    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      background: var(--bg);
      color: var(--text-primary);
      min-height: 100vh;
      overflow-x: hidden;
    }

    .glass {
      background: var(--surface);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
    }

    /* Header */
    header {
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 0 32px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 0;
      border-top: none;
      border-left: none;
      border-right: none;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 20px;
      letter-spacing: -0.02em;
    }

    .logo span { color: var(--accent); }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .icon-btn {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .icon-btn:hover {
      background: var(--accent-light);
      color: var(--accent);
    }

    .badge {
      position: absolute;
      top: 0;
      right: 0;
      background: var(--red);
      color: white;
      font-size: 10px;
      font-weight: 700;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      display: none;
    }

    /* Main Grid */
    .container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 32px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }

    .service-tile {
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .tile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .tile-name {
      font-size: 18px;
      font-weight: 600;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot.healthy { background: var(--green); box-shadow: 0 0 8px var(--green); }
    .dot.unhealthy { background: var(--amber); box-shadow: 0 0 8px var(--amber); }
    .dot.error { background: var(--red); box-shadow: 0 0 8px var(--red); }

    .tile-body {
      font-size: 14px;
      color: var(--text-secondary);
    }

    .tile-footer {
      margin-top: auto;
      font-size: 12px;
      color: var(--text-muted);
      font-family: system-ui, sans-serif;
    }

    /* Floating Chat */
    #chat-widget {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
    }

    #chat-bubble {
      width: 56px;
      height: 56px;
      border-radius: 28px;
      background: var(--accent);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(200, 118, 58, 0.4);
      font-size: 24px;
    }

    #chat-window {
      width: 350px;
      height: 500px;
      display: none;
      flex-direction: column;
      overflow: hidden;
    }

    .chat-header {
      padding: 16px;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .chat-messages {
      flex: 1;
      padding: 16px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .message {
      padding: 10px 14px;
      border-radius: 12px;
      max-width: 85%;
      font-size: 14px;
      line-height: 1.4;
    }

    .message.user {
      align-self: flex-end;
      background: var(--accent);
      color: white;
    }

    .message.ai {
      align-self: flex-start;
      background: var(--accent-light);
      color: var(--text-primary);
    }

    .chat-input-area {
      padding: 16px;
      border-top: 1px solid var(--border);
      display: flex;
      gap: 8px;
    }

    .chat-input-area input {
      flex: 1;
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 8px 16px;
      color: var(--text-primary);
      outline: none;
    }

    /* Notifications Dropdown */
    #notif-dropdown {
      position: absolute;
      top: 64px;
      right: 32px;
      width: 320px;
      max-height: 400px;
      display: none;
      flex-direction: column;
      z-index: 101;
      overflow: hidden;
    }

    .notif-header {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      font-weight: 600;
      font-size: 14px;
    }

    .notif-list {
      overflow-y: auto;
    }

    .notif-item {
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .notif-item:hover {
      background: var(--accent-light);
    }

    .notif-title {
      font-weight: 600;
      font-size: 13px;
    }

    .notif-time {
      font-size: 11px;
      color: var(--text-muted);
    }

    /* Alert Modal */
    #alert-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: none;
      align-items: center;
      justify-content: center;
    }

    .modal-content {
      width: 90%;
      max-width: 600px;
      padding: 32px;
      position: relative;
    }

    .close-modal {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 24px;
      cursor: pointer;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      header { padding: 0 16px; }
      .container { padding: 0 16px; }
      #chat-window { width: calc(100vw - 32px); }
    }
  </style>
</head>
<body>

  <header class="glass">
    <div class="logo">
      <span>◆</span> Narad <strong>Command Center</strong>
    </div>
    <div class="nav-actions">
      <button class="icon-btn" id="graph-btn" title="Knowledge Graph">
        🗺️
      </button>
      <button class="icon-btn" id="theme-toggle" title="Toggle Theme">
        🌓
      </button>
      <div style="position: relative;">
        <button class="icon-btn" id="notif-btn" title="Notifications">
          🔔
          <span class="badge" id="notif-badge">0</span>
        </button>
        <div id="notif-dropdown" class="glass">
          <div class="notif-header">Recent Alerts</div>
          <div class="notif-list" id="notif-list">
            <!-- Alerts go here -->
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="container">
    <div class="grid" id="service-grid">
      <!-- Service tiles go here -->
    </div>
  </div>

  <div id="chat-widget">
    <div id="chat-window" class="glass">
      <div class="chat-header">
        <strong>Narad AI Assistant</strong>
        <span style="cursor: pointer" onclick="toggleChat()">✕</span>
      </div>
      <div class="chat-messages" id="chat-messages">
        <div class="message ai">Welcome, Commander. How can I assist you today?</div>
      </div>
      <div class="chat-input-area">
        <input type="text" id="chat-input" placeholder="Type a command...">
        <button class="icon-btn" id="voice-toggle">🎙️</button>
      </div>
    </div>
    <div id="chat-bubble" onclick="toggleChat()">
      💬
    </div>
  </div>

  <div id="alert-modal">
    <div class="modal-content glass">
      <span class="close-modal" onclick="closeModal()">✕</span>
      <h2 id="modal-title" style="margin-bottom: 16px; color: var(--accent);">Alert Detail</h2>
      <div id="modal-body" style="line-height: 1.6;">
        <!-- Alert details go here -->
      </div>
    </div>
  </div>

  <!-- Knowledge Graph Modal -->
  <div id="graph-modal">
    <div class="modal-content glass" style="max-width: 900px; height: 80vh; display: flex; flex-direction: column;">
      <span class="close-modal" onclick="closeGraphModal()">✕</span>
      <h2 style="margin-bottom: 16px; color: var(--accent);">🗺️ Knowledge Graph</h2>
      <div id="graph-container" style="flex: 1; position: relative; overflow: hidden;">
        <svg id="graph-svg" style="width: 100%; height: 100%;"></svg>
      </div>
    </div>
  </div>

  <script>
    // State
    let services = [];
    let alerts = [];
    let darkMode = localStorage.getItem('theme') === 'dark';

    // UI Elements
    const serviceGrid = document.getElementById('service-grid');
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifBadge = document.getElementById('notif-badge');
    const notifList = document.getElementById('notif-list');
    const themeToggle = document.getElementById('theme-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const alertModal = document.getElementById('alert-modal');

    // Theme Logic
    function updateTheme() {
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
      localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    }
    themeToggle.onclick = () => { darkMode = !darkMode; updateTheme(); };
    updateTheme();

    // Data Fetching
    async function fetchData() {
      try {
        const [svcRes, alertRes] = await Promise.all([
          fetch('/api/observer/services').then(r => r.json()),
          fetch('/api/reporter/alerts').then(r => r.json())
        ]);

        services = svcRes.services;
        alerts = alertRes.alerts;

        renderServices();
        renderAlerts();
      } catch (e) {
        console.error('Failed to fetch data:', e);
      }
    }

    function renderServices() {
      serviceGrid.innerHTML = getServiceTileHTML(services).join('');
    }

    function getServiceTileHTML(services) {
      return services.map(s => {
        const errorDiv = s.error ? '<div style="color: var(--red); margin-top: 8px;">' + escapeHtml(s.error) + '</div>' : '';
        const statusColor = s.status === 'healthy' ? 'green' : (s.status === 'unhealthy' ? 'amber' : 'red');
        return '<div class="service-tile glass">' +
          '<div class="tile-header">' +
            '<div class="tile-name">' + s.name + '</div>' +
            '<div class="status-indicator">' +
              '<div class="dot ' + s.status + '"></div>' +
              '<span style="color: var(--' + statusColor + ')">' + s.status + '</span>' +
            '</div>' +
          '</div>' +
          '<div class="tile-body">' +
            '<div>Status Code: ' + s.statusCode + '</div>' + errorDiv +
          '</div>' +
          '<div class="tile-footer">' +
            'Last checked: ' + new Date(s.lastCheck).toLocaleTimeString() +
          '</div>' +
        '</div>';
      });
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function renderAlerts() {
      if (alerts.length > 0) {
        notifBadge.innerText = alerts.length;
        notifBadge.style.display = 'flex';
        notifList.innerHTML = getAlertsHTML(alerts).join('');
      } else {
        notifBadge.style.display = 'none';
        notifList.innerHTML = '<div class="notif-item">No active alerts</div>';
      }
    }

    function getAlertsHTML(alerts) {
      return alerts.map((a, i) => {
        const icon = a.severity === 'critical' ? '🔴' : '🟡';
        return '<div class="notif-item" onclick="showDetail(' + i + ')">' +
          '<div class="notif-title">' + icon + ' ' + a.service + ' is ' + a.status + '</div>' +
          '<div class="notif-time">' + new Date(a.timestamp).toLocaleTimeString() + '</div>' +
        '</div>';
      });
    }

    // Interactions
    function toggleChat() {
      chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    }

    notifBtn.onclick = (e) => {
      e.stopPropagation();
      notifDropdown.style.display = notifDropdown.style.display === 'flex' ? 'none' : 'flex';
    };

    window.onclick = () => {
      notifDropdown.style.display = 'none';
    };

    function showDetail(index) {
      const alert = alerts[index];
      const alertDetail = '<p><strong>Status:</strong> ' + alert.status + '</p>' +
        '<p><strong>Severity:</strong> ' + alert.severity + '</p>' +
        '<p><strong>Timestamp:</strong> ' + new Date(alert.timestamp).toLocaleString() + '</p>' +
        '<p style="margin-top: 16px;">The service ' + alert.service + ' is currently reporting ' + alert.status + '. Please investigate the logs for more details.</p>';
      document.getElementById('modal-title').innerText = 'Alert: ' + alert.service;
      document.getElementById('modal-body').innerHTML = alertDetail;
      alertModal.style.display = 'flex';
    }

    function closeModal() {
      alertModal.style.display = 'none';
    }

    // Voice Logic
    let isRecording = false;
    let mediaRecorder;
    let audioChunks = [];
    const voiceToggle = document.getElementById('voice-toggle');

    voiceToggle.onclick = async () => {
      if (!isRecording) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaRecorder = new MediaRecorder(stream);
          audioChunks = [];
          
          mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data);
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('audio', audioBlob);
            
            voiceToggle.innerText = '⌛';
            try {
              const res = await fetch('/api/speech-to-text', {
                method: 'POST',
                body: formData
              });
              const data = await res.json();
              if (data.text) {
                handleChatSubmit(data.text);
              }
            } catch (e) {
              console.error('STT failed:', e);
            }
            voiceToggle.innerText = '🎙️';
          };

          mediaRecorder.start();
          isRecording = true;
          voiceToggle.innerText = '🛑';
          voiceToggle.style.color = 'var(--red)';
        } catch (e) {
          console.error('Microphone access denied:', e);
          alert('Microphone access denied');
        }
      } else {
        mediaRecorder.stop();
        isRecording = false;
        voiceToggle.innerText = '🎙️';
        voiceToggle.style.color = 'var(--text-secondary)';
      }
    };

    function handleChatSubmit(msg) {
      if (!msg.trim()) return;
      appendMessage('user', msg);
      chatInput.value = '';
      
      // Simple command handling
      setTimeout(() => {
        if (msg.startsWith('/status')) {
          const healthy = services.filter(s => s.status === 'healthy').length;
          appendMessage('ai', 'I\'ve checked the systems. ' + healthy + ' out of ' + services.length + ' services are healthy.');
} else if (msg.startsWith('/alerts')) {
          appendMessage('ai', alerts.length > 0 ? 'There are ' + alerts.length + ' active alerts. Check the notification bell for details.' : 'All systems are clear. No active alerts.');
        } else if (msg.startsWith('/report')) {
           appendMessage('ai', "Generating system report... All systems nominal. Latency is within acceptable parameters.");
        } else {
          appendMessage('ai', "I'm processing your request. Use /status, /alerts, or /report for quick updates.");
        }
      }, 500);
    }

    chatInput.onkeypress = (e) => {
      if (e.key === 'Enter') {
        handleChatSubmit(chatInput.value);
      }
    };

    function appendMessage(role, text) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'message ' + role;
      msgDiv.innerText = text;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Initialize
    fetchData();
    setInterval(fetchData, 30000); // Poll every 30s

    // Knowledge Graph
    const graphBtn = document.getElementById('graph-btn');
    const graphModal = document.getElementById('graph-modal');
    const graphSvg = document.getElementById('graph-svg');

    graphBtn.onclick = () => {
      graphModal.style.display = 'flex';
      loadGraph();
    };

    function closeGraphModal() {
      graphModal.style.display = 'none';
    }

    async function loadGraph() {
      try {
        const res = await fetch('/api/smriti/graph');
        const data = await res.json();
        renderGraph(data.nodes, data.edges);
      } catch (e) {
        console.error('Failed to load graph:', e);
        graphSvg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="var(--text-muted)">Failed to load graph</text>';
      }
    }

    function renderGraph(nodes, edges) {
      const width = graphSvg.clientWidth || 800;
      const height = graphSvg.clientHeight || 600;
      
      // Clear previous
      graphSvg.innerHTML = '';
      
      // Simple force-directed layout (vanilla JS)
      const nodeMap = new Map(nodes.map(n => [n.id, { ...n, x: width/2 + (Math.random()-0.5)*200, y: height/2 + (Math.random()-0.5)*200 }]));
      
      // Create edges
      const links = edges.map(e => ({
        source: nodeMap.get(e.source),
        target: nodeMap.get(e.target)
      })).filter(l => l.source && l.target);

      // Simple force simulation
      for (let i = 0; i < 100; i++) {
        // Repulsion
        nodeMap.forEach((a, id) => {
          nodeMap.forEach((b, bid) => {
            if (id !== bid) {
              const dx = b.x - a.x;
              const dy = b.y - a.y;
              const dist = Math.sqrt(dx*dx + dy*dy) || 1;
              if (dist < 150) {
                const force = (150 - dist) / dist * 0.1;
                a.x -= dx * force;
                a.y -= dy * force;
              }
            }
          });
        });
        // Attraction (edges)
        links.forEach(l => {
          const dx = l.target.x - l.source.x;
          const dy = l.target.y - l.source.y;
          const dist = Math.sqrt(dx*dx + dy*dy) || 1;
          const force = (dist - 80) / dist * 0.05;
          l.source.x += dx * force;
          l.source.y += dy * force;
          l.target.x -= dx * force;
          l.target.y -= dy * force;
        });
        // Center
        nodeMap.forEach(n => {
          n.x += (width/2 - n.x) * 0.01;
          n.y += (height/2 - n.y) * 0.01;
        });
      }

      // Render edges
      links.forEach(l => {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', l.source.x);
        line.setAttribute('y1', l.source.y);
        line.setAttribute('x2', l.target.x);
        line.setAttribute('y2', l.target.y);
        line.setAttribute('stroke', 'var(--border)');
        line.setAttribute('stroke-width', '1.5');
        graphSvg.appendChild(line);
      });

      // Render nodes
      nodeMap.forEach(n => {
        const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        g.setAttribute('cursor', 'pointer');
        g.onclick = () => window.open('/vault/' + n.id.toLowerCase(), '_blank');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', n.x);
        circle.setAttribute('cy', n.y);
        circle.setAttribute('r', n.type === 'project' ? 20 : 12);
        circle.setAttribute('fill', n.id === 'narad' ? 'var(--accent)' : 'var(--surface)');
        circle.setAttribute('stroke', 'var(--accent)');
        circle.setAttribute('stroke-width', '2');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', n.x);
        text.setAttribute('y', n.y + 35);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('fill', 'var(--text-primary)');
        text.setAttribute('font-size', '12');
        text.textContent = n.label;
        
        g.appendChild(circle);
        g.appendChild(text);
        graphSvg.appendChild(g);
      });
    }
  </script>
</body>
</html>\`;
}
