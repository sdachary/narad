export const AI_PROVIDERS = {
  groq: {
    name: 'Groq',
    apiKey: 'GROQ_API_KEY',
    endpoint: 'https://api.groq.com/openai/v1/chat/completions',
    models: {
      fast: 'llama-3.1-8b-instant',
      balanced: 'llama-3.3-70b-versatile',
      strong: 'mixtral-8x7b-32768'
    },
    defaultModel: 'llama-3.3-70b-versatile',
    features: {
      streaming: true,
      vision: false,
      functionCalls: true,
      json: true,
      maxContext: 32768,
      speed: 'fastest'
    }
  },
  openai: {
    name: 'OpenAI',
    apiKey: 'OPENAI_API_KEY',
    endpoint: 'https://api.openai.com/v1/chat/completions',
    models: {
      fast: 'gpt-4o-mini',
      balanced: 'gpt-4o',
      strong: 'gpt-4-turbo'
    },
    defaultModel: 'gpt-4o-mini',
    features: {
      streaming: true,
      vision: true,
      functionCalls: true,
      json: true,
      maxContext: 128000,
      speed: 'fast'
    }
  },
  anthropic: {
    name: 'Anthropic',
    apiKey: 'ANTHROPIC_API_KEY',
    endpoint: 'https://api.anthropic.com/v1/messages',
    models: {
      fast: 'claude-3-haiku-20240307',
      balanced: 'claude-3-sonnet-20240229',
      strong: 'claude-3-opus-20240229'
    },
    defaultModel: 'claude-3-haiku-20240307',
    features: {
      streaming: true,
      vision: true,
      functionCalls: false,
      json: true,
      maxContext: 200000,
      speed: 'medium'
    }
  },
  openrouter: {
    name: 'OpenRouter',
    apiKey: 'OPENROUTER_API_KEY',
    endpoint: 'https://openrouter.ai/api/v1/chat/completions',
    models: {
      fast: 'google/gemma-2-9b-it:free',
      balanced: 'meta-llama/llama-3.1-70b-instruct',
      strong: 'deepseek/deepseek-chat'
    },
    defaultModel: 'google/gemma-2-9b-it:free',
    requiresModelInBody: true,
    features: {
      streaming: true,
      vision: false,
      functionCalls: true,
      json: true,
      maxContext: 128000,
      speed: 'variable'
    }
  },
  gemini: {
    name: 'Gemini',
    apiKey: 'GEMINI_API_KEY',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models',
    models: {
      fast: 'gemini-1.5-flash',
      balanced: 'gemini-1.5-pro',
      strong: 'gemini-1.5-pro'
    },
    defaultModel: 'gemini-1.5-flash',
    isGemini: true,
    features: {
      streaming: true,
      vision: true,
      functionCalls: true,
      json: true,
      maxContext: 1000000,
      speed: 'fast'
    }
  },
  mistral: {
    name: 'Mistral',
    apiKey: 'MISTRAL_API_KEY',
    endpoint: 'https://api.mistral.ai/v1/chat/completions',
    models: {
      fast: 'mistral-small-latest',
      balanced: 'mistral-medium-latest',
      strong: 'mistral-large-latest'
    },
    defaultModel: 'mistral-small-latest',
    features: {
      streaming: true,
      vision: false,
      functionCalls: true,
      json: true,
      maxContext: 128000,
      speed: 'fast'
    }
  }
};

// Provider Feature Matrix for intelligent fallbacks
export const PROVIDER_FEATURES = {
  streaming: { requiredFor: 'streaming', preferred: ['groq', 'openai', 'gemini', 'mistral', 'openrouter'] },
  vision: { requiredFor: 'image_analysis', preferred: ['openai', 'anthropic', 'gemini'] },
  functionCalls: { requiredFor: 'tool_use', preferred: ['openai', 'groq', 'mistral', 'openrouter', 'gemini'] },
  json: { requiredFor: 'structured_output', preferred: ['openai', 'groq', 'anthropic', 'gemini', 'mistral'] },
  longContext: { requiredFor: 'large_context', preferred: ['anthropic', 'gemini', 'openrouter', 'openai'] },
  fast: { requiredFor: 'quick_response', preferred: ['groq', 'gemini', 'openai', 'mistral'] },
  free: { requiredFor: 'no_cost', preferred: ['openrouter'] }
};

// Smart provider selection based on task requirements
export function selectBestProvider(requirements = {}) {
  const available = Object.entries(AI_PROVIDERS)
    .filter(([_, p]) => p.apiKey && (typeof process === 'undefined' || process.env?.[p.apiKey]))
    .map(([key, p]) => ({ key, ...p }));
  
  if (available.length === 0) return 'groq';
  
  // Score each provider
  const scores = available.map(provider => {
    let score = 0;
    
    if (requirements.streaming && provider.features.streaming) score += 10;
    if (requirements.vision && provider.features.vision) score += 10;
    if (requirements.functionCalls && provider.features.functionCalls) score += 10;
    if (requirements.json && provider.features.json) score += 5;
    if (requirements.fast) {
      if (provider.features.speed === 'fastest') score += 15;
      else if (provider.features.speed === 'fast') score += 10;
      else if (provider.features.speed === 'medium') score += 5;
    }
    if (requirements.longContext && provider.features.maxContext >= (requirements.longContext || 0)) score += 10;
    if (requirements.free && provider.features.speed === 'variable') score += 5;
    
    // Prefer faster providers by default
    if (!requirements.fast && !requirements.vision && !requirements.functionCalls) {
      if (provider.features.speed === 'fastest') score += 5;
      else if (provider.features.speed === 'fast') score += 3;
    }
    
    return { key: provider.key, score, ...provider };
  });
  
  // Sort by score and return best
  scores.sort((a, b) => b.score - a.score);
  return scores[0]?.key || 'groq';
}

export const PROVIDER_FALLBACK_ORDER = ['groq', 'openrouter', 'mistral', 'gemini', 'openai', 'anthropic'];
