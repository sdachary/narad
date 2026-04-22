export function getFloatWidgetHTML() {
  return `
<style>
#narad-float {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 999999;
  font-family: 'Georgia', serif;
}

#narad-float-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #c8763a 0%, #9e5a26 100%);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(200, 118, 58, 0.4);
  transition: transform 0.2s, box-shadow 0.2s;
}

#narad-float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px rgba(200, 118, 58, 0.5);
}

#narad-float-btn svg {
  width: 24px;
  height: 24px;
  fill: white;
}

#narad-float-panel {
  position: absolute;
  bottom: 72px;
  right: 0;
  width: 320px;
  background: #f7f6f2;
  border: 1px solid #e5e0d8;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  display: none;
  overflow: hidden;
}

#narad-float-panel.open {
  display: block;
}

.float-header {
  background: linear-gradient(135deg, #c8763a 0%, #9e5a26 100%);
  color: white;
  padding: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.float-header span {
  font-size: 14px;
}

.float-tabs {
  display: flex;
  border-bottom: 1px solid #e5e0d8;
}

.float-tab {
  flex: 1;
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: #6b6457;
  background: none;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.float-tab:hover {
  background: #f0ede6;
}

.float-tab.active {
  background: #f0ede6;
  color: #1a1814;
  font-weight: 600;
}

.float-content {
  padding: 16px;
  max-height: 240px;
  overflow-y: auto;
}

.float-service {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  margin-bottom: 8px;
  background: white;
  border: 1px solid #e5e0d8;
  border-radius: 8px;
}

.float-service.healthy {
  border-left: 3px solid #3a7c5c;
}

.float-service.unhealthy {
  border-left: 3px solid #8c3a3a;
  background: #fcf2f2;
}

.float-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 10px;
}

.float-dot.healthy { background: #3a7c5c; }
.float-dot.unhealthy { background: #8c3a3a; }
</style>

<div id="narad-float">
  <button id="narad-float-btn" onclick="toggleFloatPanel()">
    <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
  </button>
  
  <div id="narad-float-panel">
    <div class="float-header">
      <span>◆</span> Narad Agent
    </div>
    <div class="float-tabs">
      <button class="float-tab active" onclick="switchFloatTab('status')">Status</button>
      <button class="float-tab" onclick="switchFloatTab('alerts')">Alerts</button>
      <button class="float-tab" onclick="switchFloatTab('chat')">Chat</button>
    </div>
    <div class="float-content" id="float-content">
      Loading...
    </div>
  </div>
</div>

<script>
let floatPanel = document.getElementById('narad-float-panel');
let floatContent = document.getElementById('float-content');
let currentTab = 'status';

function toggleFloatPanel() {
  floatPanel.classList.toggle('open');
  if (floatPanel.classList.contains('open')) {
    loadFloatData();
  }
}

function switchFloatTab(tab) {
  currentTab = tab;
  document.querySelectorAll('.float-tab').forEach(t => t.classList.remove('active'));
  event.target.classList.add('active');
  loadFloatData();
}

async function loadFloatData() {
  if (currentTab === 'status') {
    const res = await fetch('/api/observer/services');
    const data = await res.json();
    floatContent.innerHTML = data.services.map(s => 
      '<div class="float-service ' + s.status + '">' +
        '<div style="display:flex;align-items:center">' +
          '<div class="float-dot ' + s.status + '"></div>' +
          s.name +
        '</div>' +
        '<div style="font-size:12px;color:#' + (s.status === 'healthy' ? '3a7c5c' : '8c3a3a') + '">' + s.status + '</div>' +
      '</div>'
    ).join('');
  } else if (currentTab === 'alerts') {
    const res = await fetch('/api/reporter/alerts');
    const data = await res.json();
    if (data.alerts.length === 0) {
      floatContent.innerHTML = '<div style="text-align:center;color:#6b6457;padding:20px">No alerts</div>';
    } else {
      floatContent.innerHTML = data.alerts.map(a => 
        '<div class="float-service unhealthy">' +
          '<div>' + a.service + '</div>' +
          '<div style="font-size:12px;color:#8c3a3a">' + a.status + '</div>' +
        '</div>'
      ).join('');
    }
  } else if (currentTab === 'chat') {
    floatContent.innerHTML = '<a href="/chat" style="display:block;padding:12px;background:#c8763a;color:white;text-align:center;border-radius:8px;text-decoration:none">Open Chat →</a>';
  }
}

// Auto-refresh every 30 seconds
setInterval(() => {
  if (floatPanel.classList.contains('open')) loadFloatData();
}, 30000);
</script>`;
}