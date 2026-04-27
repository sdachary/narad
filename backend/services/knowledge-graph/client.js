import { NEO4J_CONFIG } from '../config/knowledge-graph.js';

// Import neo4j driver
import { v1 as neo4j } from 'neo4j-driver';

// Connection state
let driver = null;
let sessionCache = new Map();

/**
 * Initialize Neo4j driver connection
 * @returns {Promise<Driver>} Neo4j driver instance
 */
export async function getDriver() {
  if (!driver) {
    try {
      driver = neo4j.driver(
        NEO4J_CONFIG.uri,
        neo4j.auth.basic(NEO4J_CONFIG.username, NEO4J_CONFIG.password),
        {
          maxConnectionPoolSize: NEO4J_CONFIG.maxConnectionPoolSize,
          connectionAcquisitionTimeout: NEO4J_CONFIG.connectionAcquisitionTimeout,
          encrypted: NEO4J_CONFIG.encrypted,
          trust: NEO4J_CONFIG.trust as any,
          disableLosslessIntegers: true
        }
      );
      
      // Verify connectivity
      await driver.verifyConnectivity();
      
      // Set up error handling
      driver.on('error', (error) => {
        console.error('Neo4j driver error:', error);
        // Attempt to reconnect on error
        driver = null;
      });
    } catch (error) {
      console.error('Failed to initialize Neo4j driver:', error);
      driver = null;
      throw new Error(`Neo4j connection failed: ${error.message}`);
    }
  }
  
  return driver;
}

/**
 * Get a Neo4j session
 * @param {Object} [options] - Session options
 * @returns {Promise<Session>} Neo4j session
 */
export async function getSession(options = {}) {
  const driverInstance = await getDriver();
  const session = driverInstance.session({
    database: NEO4J_CONFIG.database,
    defaultAccessMode: neo4j.session.READ,
    ...options
  });
  
  // Cache session for cleanup tracking
  const sessionId = Math.random().toString(36).substring(2, 9);
  sessionCache.set(sessionId, session);
  
  return session;
}

/**
 * Close a Neo4j session
 * @param {Session} session - Neo4j session to close
 */
export async function closeSession(session) {
  if (session) {
    await session.close();
    // Remove from cache
    for (const [id, cachedSession] of sessionCache.entries()) {
      if (cachedSession === session) {
        sessionCache.delete(id);
        break;
      }
    }
  }
}

/**
 * Close all sessions and driver
 */
export async function close() {
  // Close all cached sessions
  for (const session of sessionCache.values()) {
    try {
      await session.close();
    } catch (error) {
      console.warn('Error closing Neo4j session:', error);
    }
  }
  sessionCache.clear();
  
  // Close driver
  if (driver) {
    try {
      await driver.close();
    } catch (error) {
      console.warn('Error closing Neo4j driver:', error);
    }
    driver = null;
  }
}

/**
 * Execute a Cypher query with retry logic
 * @param {string} query - Cypher query to execute
 * @param {Object} [params] - Query parameters
 * @param {Object} [options] - Session options
 * @returns {Promise<any>} Query result
 */
export async function executeQuery(query, params = {}, options = {}) {
  let lastError;
  const maxRetries = NEO4J_CONFIG.maxRetries;
  const retryTimeout = NEO4J_CONFIG.retryTimeout;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let session;
    try {
      session = await getSession(options);
      const result = await session.run(query, params);
      await closeSession(session);
      
      // Extract records from result
      const records = [];
      result.records.forEach(record => {
        records.append(record);
      });
      
      return {
        records: records.length > 0 ? records.map(r => r.toObject()) : [],
        summary: {
          query: result.summary.query.text,
          parameters: result.summary.parameters,
          counters: result.summary.counters,
          resultAvailableAfter: result.summary.resultAvailableAfter,
          resultConsumedAfter: result.summary.resultConsumedAfter
        }
      };
    } catch (error) {
      lastError = error;
      
      // Close session if it was opened
      if (session) {
        try {
          await closeSession(session);
        } catch (closeError) {
          console.warn('Error closing session during retry:', closeError);
        }
      }
      
      // Check if error is retryable
      const isRetryable = error.code?.includes('TransientError') ||
                         error.message?.includes('timeout') ||
                         error.message?.includes('connection') ||
                         error.message?.includes('ServiceUnavailable');
      
      if (!isRetryable || attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retryTimeout * Math.pow(2, attempt)));
    }
  }
  
  throw new Error(`Neo4j query failed after ${maxRetries + 1} attempts: ${lastError.message}`);
}

/**
 * Health check for Neo4j connection
 * @returns {Promise<boolean>} True if connection is healthy
 */
export async function healthCheck() {
  try {
    const result = await executeQuery('RETURN 1 as health');
    return result.records.length > 0 && result.records[0].health === 1;
  } catch (error) {
    console.error('Neo4j health check failed:', error);
    return false;
  }
}

// Export neo4j types for use in other modules
export { neo4j };