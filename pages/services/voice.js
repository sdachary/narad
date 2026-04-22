export const VOICE_CONFIG = {
  enabled: true,
  language: 'en-US',
  continuous: false,
  interimResults: true,
  maxAlternatives: 1
};

export function setupVoiceHandler(app) {
  app.post('/api/voice/transcribe', async (c) => {
    const body = await c.req.json();
    const audioData = body.audio;
    
    if (!audioData) {
      return c.json({ error: 'No audio data provided' }, 400);
    }
    
    return c.json({
      transcript: 'Voice transcription requires Web Speech API in browser',
      alternative: 'Use Telegram voice messages for better transcription',
      note: 'Web Speech API is browser-only'
    });
  });
  
  app.get('/api/voice/status', async (c) => {
    return c.json({
      enabled: VOICE_CONFIG.enabled,
      methods: ['telegram_voice', 'browser_speech'],
      endpoints: {
        transcribe: '/api/voice/transcribe',
        status: '/api/voice/status'
      }
    });
  });
}

export function getVoiceTranscript(audioBlob) {
  return new Promise((resolve, reject) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    
    recognition.lang = VOICE_CONFIG.language;
    recognition.continuous = VOICE_CONFIG.continuous;
    recognition.interimResults = VOICE_CONFIG.interimResults;
    recognition.maxAlternatives = VOICE_CONFIG.maxAlternatives;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      resolve({ transcript, confidence: event.results[0][0].confidence });
    };
    
    recognition.onerror = (event) => {
      reject({ error: event.error });
    };
    
    recognition.start();
  });
}

export const VOICE_COMMANDS = {
  '/status': 'Check all service status',
  '/alerts': 'View active alerts',
  '/report': 'Get daily summary',
  '/rd': 'Get weekly R&D suggestions',
  '/help': 'Show available commands'
};

export default { VOICE_CONFIG, VOICE_COMMANDS };