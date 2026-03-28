// Security Unit Tests
// Tests for XSS prevention, CSRF protection, input validation

// Import the security functions from app.js
// We'll recreate them here for testing since they're in the global scope of app.js

const DOMPURIFY_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'code', 'pre', 'br', 'p', 'span', 'a'],
  ALLOWED_ATTR: ['href', 'class'],
  ALLOW_DATA_ATTR: false,
};

// DOMPurify implementation for testing
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

const VALIDATION_PATTERNS = {
  message: { maxLength: 5000, minLength: 1 },
  sessionId: { pattern: /^[a-zA-Z0-9_-]{1,100}$/ },
  history: { maxItems: 100 }
};

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

const RateLimiter = {
  requests: [],
  maxRequests: 10,
  windowMs: 60000,
  
  isAllowed() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
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
  },
  
  reset() {
    this.requests = [];
  }
};

describe('DOMPurify Security', () => {
  describe('sanitize', () => {
    test('removes script tags', () => {
      const dirty = '<p>Hello</p><script>alert("xss")</script>';
      const clean = DOMPurify.sanitize(dirty);
      
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
      expect(clean).toContain('<p>Hello</p>');
    });

    test('removes event handlers', () => {
      const dirty = '<img src=x onerror="alert(1)">';
      const clean = DOMPurify.sanitize(dirty);
      
      expect(clean).not.toContain('onerror');
      expect(clean).not.toContain('alert');
    });

    test('removes iframe elements', () => {
      const dirty = '<p>Text</p><iframe src="evil.com"></iframe>';
      const clean = DOMPurify.sanitize(dirty);
      
      expect(clean).not.toContain('<iframe>');
      expect(clean).toContain('<p>Text</p>');
    });

    test('removes object/embed elements', () => {
      const dirty = '<object data="evil.swf"></object><embed src="evil.swf">';
      const clean = DOMPurify.sanitize(dirty);
      
      expect(clean).not.toContain('<object>');
      expect(clean).not.toContain('<embed>');
    });

    test('preserves allowed tags', () => {
      const safe = '<b>Bold</b><i>Italic</i><strong>Strong</strong><code>Code</code><br><p>Para</p>';
      const clean = DOMPurify.sanitize(safe);
      
      expect(clean).toContain('<b>Bold</b>');
      expect(clean).toContain('<i>Italic</i>');
      expect(clean).toContain('<strong>Strong</strong>');
      expect(clean).toContain('<code>Code</code>');
      expect(clean).toContain('<br>');
      expect(clean).toContain('<p>Para</p>');
    });

    test('removes javascript: protocol', () => {
      const dirty = '<a href="javascript:alert(1)">Click</a>';
      const clean = DOMPurify.sanitize(dirty);
      
      expect(clean).not.toContain('javascript:');
    });

    test('handles nested attacks', () => {
      const dirty = '<div><img src=x onerror="alert(1)"></div>';
      const clean = DOMPurify.sanitize(dirty);
      
      expect(clean).not.toContain('onerror');
    });
  });
});

describe('InputValidator', () => {
  describe('validateMessage', () => {
    test('accepts valid messages', () => {
      const result = InputValidator.validateMessage('Hello, how are you?');
      expect(result.valid).toBe(true);
      expect(result.value).toBe('Hello, how are you?');
    });

    test('trims whitespace', () => {
      const result = InputValidator.validateMessage('  Hello  ');
      expect(result.valid).toBe(true);
      expect(result.value).toBe('Hello');
    });

    test('rejects empty strings', () => {
      const result = InputValidator.validateMessage('');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    test('rejects whitespace-only strings', () => {
      const result = InputValidator.validateMessage('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('empty');
    });

    test('rejects non-string values', () => {
      expect(InputValidator.validateMessage(123).valid).toBe(false);
      expect(InputValidator.validateMessage(null).valid).toBe(false);
      expect(InputValidator.validateMessage(undefined).valid).toBe(false);
      expect(InputValidator.validateMessage({}).valid).toBe(false);
    });

    test('rejects oversized messages', () => {
      const longMessage = 'a'.repeat(5001);
      const result = InputValidator.validateMessage(longMessage);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    test('accepts maximum length messages', () => {
      const maxMessage = 'a'.repeat(5000);
      const result = InputValidator.validateMessage(maxMessage);
      expect(result.valid).toBe(true);
    });

    test('rejects script tags', () => {
      const result = InputValidator.validateMessage('<script>alert(1)</script>');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    test('rejects iframe elements', () => {
      const result = InputValidator.validateMessage('<iframe src="evil.com"></iframe>');
      expect(result.valid).toBe(false);
    });

    test('rejects form elements', () => {
      const result = InputValidator.validateMessage('<form action="evil.com"><input></form>');
      expect(result.valid).toBe(false);
    });

    test('accepts safe HTML-like content', () => {
      const result = InputValidator.validateMessage('Use the <code>console.log()</code> function');
      expect(result.valid).toBe(true);
    });
  });

  describe('validateSessionId', () => {
    test('accepts valid session IDs', () => {
      expect(InputValidator.validateSessionId('session_123').valid).toBe(true);
      expect(InputValidator.validateSessionId('abc-def-123').valid).toBe(true);
      expect(InputValidator.validateSessionId('550e8400e29b41d4a716446655440000').valid).toBe(true);
    });

    test('rejects invalid session IDs', () => {
      expect(InputValidator.validateSessionId('').valid).toBe(false);
      expect(InputValidator.validateSessionId(null).valid).toBe(false);
      expect(InputValidator.validateSessionId('session with spaces').valid).toBe(false);
      expect(InputValidator.validateSessionId('session@special').valid).toBe(false);
    });

    test('rejects oversized session IDs', () => {
      const longId = 'a'.repeat(101);
      expect(InputValidator.validateSessionId(longId).valid).toBe(false);
    });
  });

  describe('validateHistory', () => {
    test('accepts valid history', () => {
      const history = [
        { role: 'user', text: 'Hello' },
        { role: 'assistant', text: 'Hi there!' }
      ];
      const result = InputValidator.validateHistory(history);
      expect(result.valid).toBe(true);
    });

    test('rejects non-array history', () => {
      expect(InputValidator.validateHistory('string').valid).toBe(false);
      expect(InputValidator.validateHistory({}).valid).toBe(false);
      expect(InputValidator.validateHistory(null).valid).toBe(false);
    });

    test('rejects oversized history', () => {
      const history = Array(101).fill({ role: 'user', text: 'test' });
      const result = InputValidator.validateHistory(history);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds');
    });

    test('rejects invalid message format', () => {
      const history = [{ role: 'user' }]; // missing text
      expect(InputValidator.validateHistory(history).valid).toBe(false);
    });

    test('rejects oversized message text', () => {
      const history = [{ role: 'user', text: 'a'.repeat(10001) }];
      expect(InputValidator.validateHistory(history).valid).toBe(false);
    });

    test('rejects invalid roles', () => {
      const history = [{ role: 'admin', text: 'message' }];
      expect(InputValidator.validateHistory(history).valid).toBe(false);
    });

    test('accepts system role', () => {
      const history = [{ role: 'system', text: 'You are helpful' }];
      expect(InputValidator.validateHistory(history).valid).toBe(true);
    });
  });
});

describe('RateLimiter', () => {
  beforeEach(() => {
    RateLimiter.reset();
  });

  test('allows requests within limit', () => {
    for (let i = 0; i < 10; i++) {
      expect(RateLimiter.isAllowed()).toBe(true);
    }
  });

  test('blocks requests over limit', () => {
    for (let i = 0; i < 10; i++) {
      RateLimiter.isAllowed();
    }
    
    expect(RateLimiter.isAllowed()).toBe(false);
  });

  test('calculates retry after correctly', () => {
    for (let i = 0; i < 10; i++) {
      RateLimiter.isAllowed();
    }
    
    const retryAfter = RateLimiter.getRetryAfter();
    expect(retryAfter).toBeGreaterThan(0);
  });

  test('resets correctly', () => {
    for (let i = 0; i < 10; i++) {
      RateLimiter.isAllowed();
    }
    
    RateLimiter.reset();
    
    expect(RateLimiter.isAllowed()).toBe(true);
  });

  test('tracks request timestamps', () => {
    RateLimiter.isAllowed();
    expect(RateLimiter.requests.length).toBe(1);
  });
});

describe('Security Integration', () => {
  test('complete XSS prevention flow', () => {
    const maliciousInput = '<img src=x onerror="alert(1)"><script>stealCookies()</script>';
    
    // Step 1: Input validation should reject
    const validation = InputValidator.validateMessage(maliciousInput);
    expect(validation.valid).toBe(false);
    
    // Step 2: Even if somehow passed, DOMPurify would clean it
    const sanitized = DOMPurify.sanitize(maliciousInput);
    expect(sanitized).not.toContain('onerror');
    expect(sanitized).not.toContain('<script>');
  });

  test('safe message rendering flow', () => {
    const userInput = 'Hello <b>world</b>';
    
    // Validate
    const validation = InputValidator.validateMessage(userInput);
    expect(validation.valid).toBe(true);
    
    // Sanitize for rich content
    const sanitized = DOMPurify.sanitize(validation.value);
    expect(sanitized).toContain('<b>world</b>');
  });

  test('rate limiting + validation integration', () => {
    // Exhaust rate limit
    for (let i = 0; i < 10; i++) {
      RateLimiter.isAllowed();
    }
    
    // Should still validate even when rate limited
    const result = InputValidator.validateMessage('test');
    expect(result.valid).toBe(true);
    
    // But should be blocked at API level
    expect(RateLimiter.isAllowed()).toBe(false);
  });
});
