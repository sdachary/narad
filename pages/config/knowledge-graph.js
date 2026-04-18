// Neo4j Knowledge Graph Configuration
import { getEnvVar } from './index.js';

export const NEO4J_CONFIG = {
  // Connection settings
  uri: getEnvVar('NEO4J_URI', 'bolt://localhost:7687'),
  username: getEnvVar('NEO4J_USERNAME', 'neo4j'),
  password: getEnvVar('NEO4J_PASSWORD', 'password'),
  
  // Connection pool settings
  maxConnectionPoolSize: parseInt(getEnvVar('NEO4J_MAX_POOL_SIZE', '50')),
  connectionAcquisitionTimeout: parseInt(getEnvVar('NEO4J_ACQUIRE_TIMEOUT_MS', '60000')),
  
  // Encryption settings
  encrypted: getEnvVar('NEO4J_ENCRYPTED', 'true') === 'true',
  trust: getEnvVar('NEO4J_TRUST', 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'),
  
  // Database settings
  database: getEnvVar('NEO4J_DATABASE', 'neo4j'),
  
  // Retry settings
  maxRetries: parseInt(getEnvVar('NEO4J_MAX_RETRIES', '3')),
  retryTimeout: parseInt(getEnvVar('NEO4J_RETRY_TIMEOUT_MS', '1000')),
};