export const DISCORD_CONFIG = {
  enabled: false,
  botToken: '',
  serverMappings: [],
};

export const TELEGRAM_CONFIG = {
  enabled: false,
  botToken: '',
  allowedUsers: [],
};

export function isConnectorEnabled(type) {
  const configs = {
    discord: DISCORD_CONFIG,
    telegram: TELEGRAM_CONFIG
  };
  const config = configs[type?.toLowerCase()];
  return config?.enabled === true && !!config.botToken;
}

export function getConnectorConfig(type) {
  const configs = {
    discord: DISCORD_CONFIG,
    telegram: TELEGRAM_CONFIG
  };
  return configs[type?.toLowerCase()] || null;
}

export function initConnector(type, env) {
  const typeLower = type?.toLowerCase();
  
  if (typeLower === 'discord') {
    const token = env?.DISCORD_BOT_TOKEN;
    if (token) {
      DISCORD_CONFIG.enabled = true;
      DISCORD_CONFIG.botToken = token;
    }
    return DISCORD_CONFIG;
  }
  
  if (typeLower === 'telegram') {
    const token = env?.TELEGRAM_BOT_TOKEN;
    if (token) {
      TELEGRAM_CONFIG.enabled = true;
      TELEGRAM_CONFIG.botToken = token;
    }
    return TELEGRAM_CONFIG;
  }
  
  return null;
}
