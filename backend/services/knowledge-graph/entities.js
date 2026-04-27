import { executeQuery } from './client.js';
import { classifyTask, selectProviderAndModel, callAI } from '../ai.js';
import { getEnvVar } from '../../config/index.js';

/**
 * Entity extraction service for knowledge graph
 */
export class EntityExtractor {
  constructor() {
    // Cache for entity types and their properties
    this.entityTypeCache = new Map();
  }

  /**
   * Extract entities from text using AI
   * @param {string} text - Text to extract entities from
   * @param {Object} [options] - Extraction options
   * @returns {Promise<Array>} Array of extracted entities
   */
  async extractEntities(text, options = {}) {
    const {
      entityTypes = ['PERSON', 'ORGANIZATION', 'LOCATION', 'EVENT', 'CONCEPT'],
      confidenceThreshold = 0.7,
      maxEntities = 50
    } = options;

    // Truncate text if too long
    const maxTextLength = 8000;
    const processedText = text.length > maxTextLength 
      ? text.substring(0, maxTextLength) + '...' 
      : text;

    try {
      // Use AI to extract entities
      const systemPrompt = `You are an expert entity extraction system. Extract entities from the provided text and return them as a JSON array. Each entity should have the following structure:
{
  "text": "the exact entity text as it appears in the document",
  "type": "entity type (PERSON, ORGANIZATION, LOCATION, EVENT, CONCEPT, etc.)",
  "confidence": 0.0-1.0 confidence score,
  "start": character offset where entity starts (optional),
  "end": character offset where entity ends (optional),
  "aliases": ["alternative names or spellings"] (optional)
}

Only return entities with confidence >= ${confidenceThreshold}. Return maximum ${maxEntities} entities.
If no entities are found, return an empty array [].
Do not include any explanation, only the JSON array.`;

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Extract entities from this text:\n\n${processedText}` }
      ];

      // Select provider and model for entity extraction (balanced for accuracy)
      const availableProviders = ['Groq', 'OpenRouter']; // Prefer faster/cheaper providers for entity extraction
      const { provider, model } = selectProviderAndModel('analyzer', '', availableProviders);
      
      // Call AI for entity extraction
      const { reply } = await callAI(
        messages,
        { name: provider, apiKey: '', endpoint: '', models: { balanced: model || 'llama3-8b-8192' } },
        { temperature: 0.1, max_tokens: 2048 } // Low temperature for consistent extraction
      );

      // Parse the JSON response
      let entities = [];
      try {
        // Clean the response to extract JSON
        const jsonMatch = reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          entities = JSON.parse(jsonMatch[0]);
        } else {
          entities = JSON.parse(reply);
        }
      } catch (parseError) {
        console.warn('Failed to parse entity extraction response:', parseError);
        console.log('Response was:', reply);
        return [];
      }

      // Filter and validate entities
      const validatedEntities = entities
        .filter(entity => 
          entity && 
          typeof entity === 'object' &&
          entity.text && 
          entity.type && 
          entity.confidence >= confidenceThreshold &&
          entityTypes.includes(entity.type)
        )
        .map(entity => ({
          text: String(entity.text).trim(),
          type: String(entity.type),
          confidence: Math.min(1.0, Math.max(0.0, parseFloat(entity.confidence))),
          start: entity.start !== undefined ? parseInt(entity.start) : undefined,
          end: entity.end !== undefined ? parseInt(entity.end) : undefined,
          aliases: Array.isArray(entity.aliases) ? entity.aliases.map(String) : []
        }))
        .slice(0, maxEntities);

      return validatedEntities;
    } catch (error) {
      console.error('Entity extraction failed:', error);
      return [];
    }
  }

  /**
   * Extract relationships between entities
   * @param {Array} entities - Array of entities
   * @param {string} text - Original text
   * @returns {Promise<Array>} Array of relationships
   */
  async extractRelationships(entities, text) {
    if (!entities || entities.length < 2) {
      return [];
    }

    try {
      // Limit entities for relationship extraction to avoid overwhelming the AI
      const limitedEntities = entities.slice(0, 20);
      
      const systemPrompt = `You are an expert relationship extraction system. Identify relationships between entities in the provided text. Return relationships as a JSON array where each relationship has:
{
  "source": "exact text of source entity",
  "target": "exact text of target entity", 
  "type": "relationship type (WORKS_AT, LOCATED_IN, FRIENDS_WITH, etc.)",
  "confidence": 0.0-1.0 confidence score,
  "context": "brief context/sentence showing the relationship" (optional)
}

Only return relationships with confidence >= 0.6.
If no relationships are found, return an empty array [].
Do not include any explanation, only the JSON array.`;

      const entityList = limitedEntities.map(e => `- ${e.text} (${e.type})`).join('\n');
      
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Entities found:\n${entityList}\n\nText:\n\n${text}` }
      ];

      // Select provider and model for relationship extraction
      const availableProviders = ['Groq', 'OpenRouter'];
      const { provider, model } = selectProviderAndModel('analyzer', '', availableProviders);
      
      const { reply } = await callAI(
        messages,
        { name: provider, apiKey: '', endpoint: '', models: { balanced: model || 'llama3-8b-8192' } },
        { temperature: 0.1, max_tokens: 2048 }
      );

      // Parse relationships
      let relationships = [];
      try {
        const jsonMatch = reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          relationships = JSON.parse(jsonMatch[0]);
        } else {
          relationships = JSON.parse(reply);
        }
      } catch (parseError) {
        console.warn('Failed to parse relationship extraction response:', parseError);
        return [];
      }

      // Validate relationships
      const validatedRelationships = relationships
        .filter(rel => 
          rel && 
          typeof rel === 'object' &&
          rel.source && 
          rel.target && 
          rel.type && 
          rel.confidence >= 0.6
        )
        .map(rel => ({
          source: String(rel.source).trim(),
          target: String(rel.target).trim(),
          type: String(rel.type),
          confidence: Math.min(1.0, Math.max(0.0, parseFloat(rel.confidence))),
          context: rel.context ? String(rel.context).trim() : undefined
        }));

      return validatedRelationships;
    } catch (error) {
      console.error('Relationship extraction failed:', error);
      return [];
    }
  }

  /**
   * Create or update entity in Neo4j
   * @param {Object} entity - Entity object
   * @returns {Promise<Object>} Result of operation
   */
  async upsertEntity(entity) {
    const query = `
      MERGE (e:Entity {text: $text, type: $type})
      ON CREATE SET 
        e.createdAt = datetime(),
        e.updatedAt = datetime(),
        e.confidence = $confidence,
        e.aliases = $aliases
      ON MATCH SET 
        e.updatedAt = datetime(),
        e.confidence = CASE 
          WHEN $confidence > e.confidence THEN $confidence 
          ELSE e.confidence 
        END,
        e.aliases = CASE 
          WHEN $aliases IS NOT NULL AND size($aliases) > 0 
          THEN apoc.coll.union(e.aliases, $aliases) 
          ELSE e.aliases 
        END
      RETURN e.id as id, e.text as text, e.type as type, e.confidence as confidence, 
             e.createdAt as createdAt, e.updatedAt as updatedAt, e.aliases as aliases
    `;

    const params = {
      text: entity.text,
      type: entity.type,
      confidence: entity.confidence,
      aliases: entity.aliases.length > 0 ? entity.aliases : null
    };

    try {
      const result = await executeQuery(query, params);
      return result.records.length > 0 ? result.records[0] : null;
    } catch (error) {
      console.error('Failed to upsert entity:', error);
      throw error;
    }
  }

  /**
   * Create or update relationship between entities in Neo4j
   * @param {Object} relationship - Relationship object
   * @returns {Promise<Object>} Result of operation
   */
  async upsertRelationship(relationship) {
    const query = `
      // Find source and target entities
      MATCH (source:Entity {text: $sourceText, type: $sourceType})
      MATCH (target:Entity {text: $targetText, type: $targetType})
      // Merge relationship
      MERGE (source)-[r:RELATIONSHIP {type: $relType}]->(target)
      ON CREATE SET 
        r.createdAt = datetime(),
        r.updatedAt = datetime(),
        r.confidence = $confidence,
        r.context = $context
      ON MATCH SET 
        r.updatedAt = datetime(),
        r.confidence = CASE 
          WHEN $confidence > r.confidence THEN $confidence 
          ELSE r.confidence 
        END,
        r.context = CASE 
          WHEN $context IS NOT NULL AND $context <> '' 
          THEN coalesce(r.context, '') + ' | ' + $context
          ELSE r.context
        END
      RETURN 
        id(r) as relId,
        source.id as sourceId,
        target.id as targetId,
        type(r) as relType,
        r.confidence as confidence,
        r.createdAt as createdAt,
        r.updatedAt as updatedAt,
        r.context as context
    `;

    // We need to get entity types for the query - this is a limitation
    // In a production system, we'd look these up or store them with the relationship
    const params = {
      sourceText: relationship.source,
      targetText: relationship.target,
      relType: relationship.type.toUpperCase().replace(/\s+/g, '_'),
      confidence: relationship.confidence,
      context: relationship.context || null
    };

    try {
      // First, ensure entities exist
      await this.upsertEntity({ 
        text: relationship.source, 
        type: 'UNKNOWN', // Will be updated if exists
        confidence: 0.5,
        aliases: []
      });
      
      await this.upsertEntity({ 
        text: relationship.target, 
        type: 'UNKNOWN', 
        confidence: 0.5,
        aliases: []
      });
      
      // Then create relationship
      const result = await executeQuery(query, params);
      return result.records.length > 0 ? result.records[0] : null;
    } catch (error) {
      console.error('Failed to upsert relationship:', error);
      throw error;
    }
  }

  /**
   * Get entity by text and type
   * @param {string} text - Entity text
   * @param {string} type - Entity type
   * @returns {Promise<Object>} Entity data
   */
  async getEntityByTextAndType(text, type) {
    const query = `
      MATCH (e:Entity {text: $text, type: $type})
      RETURN e.id as id, e.text as text, e.type as type, e.confidence as confidence,
             e.createdAt as createdAt, e.updatedAt as updatedAt, e.aliases as aliases
    `;

    const params = { text, type };

    try {
      const result = await executeQuery(query, params);
      return result.records.length > 0 ? result.records[0] : null;
    } catch (error) {
      console.error('Failed to get entity:', error);
      return null;
    }
  }

  /**
   * Get entities by type
   * @param {string} type - Entity type
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>} Array of entities
   */
  async getEntitiesByType(type, limit = 100) {
    const query = `
      MATCH (e:Entity {type: $type})
      RETURN e.id as id, e.text as text, e.type as type, e.confidence as confidence,
             e.createdAt as createdAt, e.updatedAt as updatedAt, e.aliases as aliases
      ORDER BY e.confidence DESC, e.updatedAt DESC
      LIMIT $limit
    `;

    const params = { type, limit };

    try {
      const result = await executeQuery(query, params);
      return result.records;
    } catch (error) {
      console.error('Failed to get entities by type:', error);
      return [];
    }
  }
}

// Export singleton instance
export const entityExtractor = new EntityExtractor();