// API Integration Tests
// Tests for Cloudflare Worker API endpoints

// Mock the Worker environment
const mockEnv = {
  NARAD_DATA: {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    list: jest.fn()
  },
  ASSETS: {
    fetch: jest.fn()
  }
};

// Mock fetch for AI providers
global.fetch = jest.fn();

// Validation schemas (replicated from _worker.js)
const ValidationSchemas = {
  message: {
    validate: (value) => {
      if (!value || typeof value !== 'string') {
        return { valid: false, error: 'Message is required and must be a string' };
      }
      if (value.trim().length === 0) {
        return { valid: false, error: 'Message cannot be empty' };
      }
      if (value.length > 5000) {
        return { valid: false, error: 'Message exceeds 5000 characters' };
      }
      if (/<script|javascript:|onerror=|onclick=/i.test(value)) {
        return { valid: false, error: 'Invalid content detected' };
      }
      return { valid: true, value: value.trim() };
    }
  },
  sessionId: {
    pattern: /^[a-zA-Z0-9_-]{1,100}$/,
    validate: (value) => {
      if (!value || typeof value !== 'string') {
        return { valid: false, error: 'Valid session_id is required' };
      }
      if (!ValidationSchemas.sessionId.pattern.test(value)) {
        return { valid: false, error: 'Invalid session_id format' };
      }
      return { valid: true };
    }
  },
  history: {
    maxItems: 100,
    maxMessageLength: 10000,
    validate: (value) => {
      if (!Array.isArray(value)) {
        return { valid: false, error: 'History must be an array' };
      }
      if (value.length > ValidationSchemas.history.maxItems) {
        return { valid: false, error: `History exceeds ${ValidationSchemas.history.maxItems} items` };
      }
      for (const msg of value) {
        if (!msg.role || typeof msg.text !== 'string') {
          return { valid: false, error: 'Invalid history message format' };
        }
        if (msg.text.length > ValidationSchemas.history.maxMessageLength) {
          return { valid: false, error: 'History message too long' };
        }
        if (!['user', 'assistant', 'system'].includes(msg.role)) {
          return { valid: false, error: 'Invalid message role in history' };
        }
      }
      return { valid: true };
    }
  },
  score: {
    validate: (value) => {
      if (typeof value !== 'number' || ![-1, 0, 1].includes(value)) {
        return { valid: false, error: 'Score must be -1, 0, or 1' };
      }
      return { valid: true };
    }
  }
};

// Rate limiter (replicated from _worker.js)
const rateLimitStore = new Map();
const RATE_LIMIT = {
  maxRequests: 10,
  windowMs: 60000,
  burstLimit: 3
};

function checkRateLimit(identifier) {
  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  
  let record = rateLimitStore.get(key);
  if (!record || now - record.windowStart > RATE_LIMIT.windowMs) {
    record = { windowStart: now, count: 0, burstCount: 0 };
  }
  
  if (record.burstCount >= RATE_LIMIT.burstLimit) {
    const retryAfter = Math.ceil((record.windowStart + RATE_LIMIT.windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  if (record.count >= RATE_LIMIT.maxRequests) {
    const retryAfter = Math.ceil((record.windowStart + RATE_LIMIT.windowMs - now) / 1000);
    return { allowed: false, retryAfter };
  }
  
  record.count++;
  record.burstCount++;
  rateLimitStore.set(key, record);
  
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
}

// CSRF validation (replicated from _worker.js)
const CSRF_TRUSTED_ORIGINS = [
  'https://narad-7hc.pages.dev',
  'https://narad.io',
  'http://localhost:8788',
  'http://localhost:3000'
];

function validateCSRF(request) {
  const origin = request.headers.get('Origin') || request.headers.get('Referer');
  
  if (origin) {
    const isTrustedOrigin = CSRF_TRUSTED_ORIGINS.some(trusted => 
      origin.startsWith(trusted) || origin === trusted
    );
    if (!isTrustedOrigin) {
      return { valid: false, error: 'Untrusted origin' };
    }
  }
  
  return { valid: true };
}

describe('API Validation Schemas', () => {
  describe('message validation', () => {
    test('accepts valid message', () => {
      const result = ValidationSchemas.message.validate('Hello world');
      expect(result.valid).toBe(true);
    });

    test('rejects empty message', () => {
      const result = ValidationSchemas.message.validate('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('required');
    });

    test('rejects non-string', () => {
      expect(ValidationSchemas.message.validate(123).valid).toBe(false);
      expect(ValidationSchemas.message.validate(null).valid).toBe(false);
    });

    test('rejects oversized message', () => {
      const result = ValidationSchemas.message.validate('a'.repeat(5001));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    test('rejects XSS attempt', () => {
      const result = ValidationSchemas.message.validate('<script>alert(1)</script>');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    test('rejects javascript: protocol', () => {
      const result = ValidationSchemas.message.validate('Click here: javascript:alert(1)');
      expect(result.valid).toBe(false);
    });

    test('rejects event handlers', () => {
      const result = ValidationSchemas.message.validate('<img onerror="alert(1)">');
      expect(result.valid).toBe(false);
    });
  });

  describe('sessionId validation', () => {
    test('accepts valid session IDs', () => {
      expect(ValidationSchemas.sessionId.validate('session_123').valid).toBe(true);
      expect(ValidationSchemas.sessionId.validate('abc-def-ghi').valid).toBe(true);
    });

    test('rejects invalid format', () => {
      expect(ValidationSchemas.sessionId.validate('').valid).toBe(false);
      expect(ValidationSchemas.sessionId.validate('has space').valid).toBe(false);
      expect(ValidationSchemas.sessionId.validate('special@char').valid).toBe(false);
    });
  });

  describe('history validation', () => {
    test('accepts valid history', () => {
      const history = [
        { role: 'user', text: 'Hello' },
        { role: 'assistant', text: 'Hi!' }
      ];
      expect(ValidationSchemas.history.validate(history).valid).toBe(true);
    });

    test('rejects non-array', () => {
      expect(ValidationSchemas.history.validate('string').valid).toBe(false);
      expect(ValidationSchemas.history.validate({}).valid).toBe(false);
    });

    test('rejects oversized history', () => {
      const history = Array(101).fill({ role: 'user', text: 'test' });
      expect(ValidationSchemas.history.validate(history).valid).toBe(false);
    });

    test('rejects invalid role', () => {
      const history = [{ role: 'invalid', text: 'test' }];
      expect(ValidationSchemas.history.validate(history).valid).toBe(false);
    });
  });

  describe('score validation', () => {
    test('accepts valid scores', () => {
      expect(ValidationSchemas.score.validate(-1).valid).toBe(true);
      expect(ValidationSchemas.score.validate(0).valid).toBe(true);
      expect(ValidationSchemas.score.validate(1).valid).toBe(true);
    });

    test('rejects invalid scores', () => {
      expect(ValidationSchemas.score.validate(2).valid).toBe(false);
      expect(ValidationSchemas.score.validate(-2).valid).toBe(false);
      expect(ValidationSchemas.score.validate(0.5).valid).toBe(false);
    });
  });
});

describe('Rate Limiting', () => {
  beforeEach(() => {
    rateLimitStore.clear();
  });

  test('allows requests within limit', () => {
    for (let i = 0; i < 10; i++) {
      const result = checkRateLimit('test-client');
      expect(result.allowed).toBe(true);
    }
  });

  test('blocks requests over limit', () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit('test-client');
    }
    
    const result = checkRateLimit('test-client');
    expect(result.allowed).toBe(false);
    expect(result.retryAfter).toBeGreaterThan(0);
  });

  test('tracks different clients separately', () => {
    for (let i = 0; i < 10; i++) {
      checkRateLimit('client-a');
    }
    
    // Client A should be blocked
    expect(checkRateLimit('client-a').allowed).toBe(false);
    
    // Client B should still be allowed
    expect(checkRateLimit('client-b').allowed).toBe(true);
  });

  test('returns remaining count', () => {
    const result = checkRateLimit('test-client');
    expect(result.remaining).toBe(9);
  });
});

describe('CSRF Validation', () => {
  const createMockRequest = (origin, headers = {}) => ({
    headers: {
      get: (name) => headers[name] || (name === 'Origin' ? origin : null)
    }
  });

  test('allows trusted origins', () => {
    const request = createMockRequest('https://narad-7hc.pages.dev');
    const result = validateCSRF(request);
    expect(result.valid).toBe(true);
  });

  test('allows localhost', () => {
    const request = createMockRequest('http://localhost:3000');
    const result = validateCSRF(request);
    expect(result.valid).toBe(true);
  });

  test('rejects untrusted origins', () => {
    const request = createMockRequest('https://evil.com');
    const result = validateCSRF(request);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Untrusted');
  });

  test('allows requests without origin', () => {
    const request = createMockRequest(null);
    const result = validateCSRF(request);
    expect(result.valid).toBe(true);
  });
});

describe('API Request Flow', () => {
  beforeEach(() => {
    rateLimitStore.clear();
    jest.clearAllMocks();
  });

  test('complete valid request flow', () => {
    // Step 1: Rate limit check
    const rateCheck = checkRateLimit('client-ip');
    expect(rateCheck.allowed).toBe(true);
    
    // Step 2: CSRF check
    const request = createMockRequest('https://narad-7hc.pages.dev');
    const csrfCheck = validateCSRF(request);
    expect(csrfCheck.valid).toBe(true);
    
    // Step 3: Input validation
    const messageValidation = ValidationSchemas.message.validate('Hello');
    expect(messageValidation.valid).toBe(true);
    
    // Step 4: Session validation
    const sessionValidation = ValidationSchemas.sessionId.validate('session_123');
    expect(sessionValidation.valid).toBe(true);
  });

  test('blocks rate-limited requests early', () => {
    // Exhaust rate limit
    for (let i = 0; i < 10; i++) {
      checkRateLimit('attacker-ip');
    }
    
    // Request should be blocked without other checks
    const result = checkRateLimit('attacker-ip');
    expect(result.allowed).toBe(false);
  });

  test('rejects XSS in message', () => {
    const validation = ValidationSchemas.message.validate('<script>alert(1)</script>');
    expect(validation.valid).toBe(false);
  });

  test('validates history safely', () => {
    const history = [
      { role: 'user', text: 'Hello' },
      { role: 'assistant', text: '<script>evil()</script>' }
    ];
    
    // History text is not sanitized at API level - that's frontend responsibility
    const validation = ValidationSchemas.history.validate(history);
    expect(validation.valid).toBe(true);
  });
});
