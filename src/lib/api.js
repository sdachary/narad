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