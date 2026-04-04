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
    defaultModel: 'llama-3.3-70b-versatile'
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
    defaultModel: 'gpt-4o-mini'
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
    defaultModel: 'claude-3-haiku-20240307'
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
    requiresModelInBody: true
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
    isGemini: true
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
    defaultModel: 'mistral-small-latest'
  }
};

export const PROVIDER_FALLBACK_ORDER = ['groq', 'openrouter', 'mistral', 'gemini', 'openai', 'anthropic'];
