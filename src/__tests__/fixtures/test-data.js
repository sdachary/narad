// Test Fixtures and Utilities

export const testData = {
  validMessages: [
    'Hello, how are you?',
    'What is the capital of France?',
    'Explain quantum computing in simple terms',
    'Write a function to reverse a string',
    'Hello 👋',
  ],
  
  invalidMessages: [
    { input: '', error: 'empty' },
    { input: '   ', error: 'empty' },
    { input: 123, error: 'string' },
    { input: null, error: 'string' },
    { input: '<script>alert(1)</script>', error: 'Invalid' },
    { input: '<img onerror="alert(1)">', error: 'Invalid' },
    { input: 'a'.repeat(5001), error: 'exceeds' },
  ],
  
  validSessionIds: [
    'session_123',
    'user-abc-def',
    '550e8400e29b41d4a716446655440000',
    'test-session-001',
  ],
  
  invalidSessionIds: [
    '',
    'has space',
    'special@char',
    'a'.repeat(101),
  ],
  
  xssPayloads: [
    '<script>alert(1)</script>',
    '<img src=x onerror="alert(1)">',
    '<svg onload="alert(1)">',
    'javascript:alert(1)',
    '<iframe src="evil.com"></iframe>',
    '<object data="evil.swf"></object>',
    '<form action="evil.com"><input></form>',
    '<div onClick="alert(1)">Click</div>',
    '<a href="javascript:alert(1)">Link</a>',
  ],
  
  validHistory: [
    { role: 'user', text: 'Hello' },
    { role: 'assistant', text: 'Hi there!' },
    { role: 'user', text: 'How are you?' },
  ],
};

export function createMockRequest(overrides = {}) {
  return {
    headers: {
      get: (name) => overrides.headers?.[name] || null,
    },
    body: overrides.body,
    ...overrides,
  };
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retry(fn, maxAttempts = 3, delay = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxAttempts - 1) throw error;
      await sleep(delay);
    }
  }
}
