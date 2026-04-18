import { executeQuery } from './client.js';

/**
 * Cypher query builder and executor for knowledge graph operations
 */
export class KnowledgeGraphQueries {
  /**
   * Create a new entity node
   * @param {Object} entityData - Entity properties
   * @returns {Promise<Object>} Created entity
   */
  static async createEntity(entityData) {
    const query = `
      CREATE (e:Entity $props)
      SET e.createdAt = datetime(),
          e.updatedAt = datetime()
      RETURN e.id as id, e.text as text, e.type as type, 
             e.confidence as confidence, e.createdAt as createdAt, 
             e.updatedAt as updatedAt, e.aliases as aliases
    `;

    const params = { props: entityData };
    const result = await executeQuery(query, params);
    return result.records.length > 0 ? result.records[0] : null;
  }

  /**
   * Find entities by text pattern
   * @param {string} textPattern - Text to search for (supports wildcards)
   * @param {Object} [options] - Search options
   * @returns {Promise<Array>} Matching entities
   */
  static async findEntitiesByText(textPattern, options = {}) {
    const { 
      type = null, 
      limit = 100, 
      minConfidence = 0 
    } = options;

    let query = `
      MATCH (e:Entity)
      WHERE e.text =~ $textPattern
    `;
    
    const params = { 
      textPattern: `(?i).*${textPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').*}.*`, 
      limit,
      minConfidence
    };

    if (type) {
      query += ' AND e.type = $type';
      params.type = type;
    }

    if (minConfidence > 0) {
      query += ' AND e.confidence >= $minConfidence';
    }

    query += `
      RETURN e.id as id, e.text as text, e.type as type, 
             e.confidence as confidence, e.createdAt as createdAt, 
             e.updatedAt as updatedAt, e.aliases as aliases
      ORDER BY e.confidence DESC, e.updatedAt DESC
      LIMIT $limit
    `;

    const result = await executeQuery(query, params);
    return result.records;
  }

  /**
   * Find entities by type and aliases
   * @param {string} type - Entity type
   * @param {string} alias - Alias to match
   * @param {number} limit - Maximum results
   * @returns {Promise<Array>} Matching entities
   */
  static async findEntitiesByAlias(type, alias, limit = 100) {
    const query = `
      MATCH (e:Entity {type: $type})
      WHERE $alias IN e.aliases OR e.text =~ $aliasPattern
      RETURN e.id as id, e.text as text, e.type as type, 
             e.confidence as confidence, e.createdAt as createdAt, 
             e.updatedAt as updatedAt, e.aliases as aliases
      ORDER BY e.confidence DESC, e.updatedAt DESC
      LIMIT $limit
    `;

    const params = {
      type,
      alias,
      aliasPattern: `(?i).*${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').*}.*`,
      limit
    };

    const result = await executeQuery(query, params);
    return result.records;
  }

  /**
   * Create a relationship between two entities
   * @param {Object} relationshipData - Relationship properties
   * @returns {Promise<Object>} Created relationship
   */
  static async createRelationship(relationshipData) {
    const query = `
      // Find or create source entity
      MERGE (source:Entity {text: $sourceText})
      ON CREATE SET 
        source.createdAt = datetime(),
        source.updatedAt = datetime(),
        source.type = $sourceType,
        source.confidence = $sourceConfidence
      
      // Find or create target entity
      MERGE (target:Entity {text: $targetText})
      ON CREATE SET 
        target.createdAt = datetime(),
        target.updatedAt = datetime(),
        target.type = $targetType,
        target.confidence = $targetConfidence
      
      // Create relationship
      MERGE (source)-[r:RELATIONSHIP {type: $relType}]->(target)
      ON CREATE SET 
        r.createdAt = datetime(),
        r.updatedAt = datetime(),
        r.confidence = $confidence,
        r.context = $context
      ON MATCH SET
        r.updatedAt = datetime(),
        r.confidence = CASE WHEN $confidence > r.confidence THEN $confidence ELSE r.confidence END,
        r.context = CASE 
          WHEN $context IS NOT NULL AND $context <> '' 
          THEN coalesce(r.context, '') + ' | ' + $context
          ELSE r.context
        END
      
      RETURN 
        id(r) as relId,
        source.id as sourceId,
        target.id as targetId,
        source.text as sourceText,
        target.text as targetText,
        type(r) as relType,
        r.confidence as confidence,
        r.createdAt as createdAt,
        r.updatedAt as updatedAt,
        r.context as context
    `;

    const params = {
      sourceText: relationshipData.sourceText,
      targetText: relationshipData.targetText,
      sourceType: relationshipData.sourceType || 'UNKNOWN',
      targetType: relationshipData.targetType || 'UNKNOWN',
      sourceConfidence: relationshipData.sourceConfidence || 0.5,
      targetConfidence: relationshipData.targetConfidence || 0.5,
      relType: relationshipData.type.toUpperCase().replace(/\s+/g, '_'),
      confidence: relationshipData.confidence,
      context: relationshipData.context || null
    };

    const result = await executeQuery(query, params);
    return result.records.length > 0 ? result.records[0] : null;
  }

  /**
   * Find relationships connected to an entity
   * @param {string} entityText - Entity text
   * @param {Object} [options] - Query options
   * @returns {Promise<Array>} Connected relationships
   */
  static async findRelationshipsForEntity(entityText, options = {}) {
    const {
      direction = 'both', // 'in', 'out', or 'both'
      relType = null,
      limit = 100
    } = options;

    let query = `
      MATCH (e:Entity {text: $entityText})
    `;

    if (direction === 'out' || direction === 'both') {
      query += `
        OPTIONAL MATCH (e)-[r:RELATIONSHIP]->(target)
      `;
    }

    if (direction === 'in' || direction === 'both') {
      query += `
        OPTIONAL MATCH (source)-[r:RELATIONSHIP]->(e)
      `;
    }

    query += `
      WHERE 1=1
    `;

    const params = { entityText, limit };

    if (relType) {
      query += ' AND type(r) = $relType';
      params.relType = relType;
    }

    query += `
      RETURN 
        id(r) as relId,
        id(source) as sourceId,
        source.text as sourceText,
        source.type as sourceType,
        id(target) as targetId,
        target.text as targetText,
        target.type as targetType,
        type(r) as relType,
        r.confidence as confidence,
        r.createdAt as createdAt,
        r.updatedAt as updatedAt,
        r.context as context,
        CASE 
          WHEN startNode(r) = e THEN 'out'
          ELSE 'in'
        END as direction
      ORDER BY r.confidence DESC, r.updatedAt DESC
      LIMIT $limit
    `;

    const result = await executeQuery(query, params);
    return result.records;
  }

  /**
   * Get subgraph around an entity
   * @param {string} entityText - Central entity text
   * @param {number} depth - Traversal depth (default: 1)
   * @param {number} limit - Maximum nodes to return
   * @returns {Promise<Object>} Subgraph data
   */
  static async getSubgraph(entityText, depth = 1, limit = 1000) {
    const query = `
      MATCH (center:Entity {text: $entityText})
      CALL apoc.path.subgraphAll(center, {
        maxLevel: $depth,
        relationshipFilter: 'RELATIONSHIP>',
        limit: $limit
      })
      YIELD nodes, relationships
      RETURN 
        [n IN nodes | {
          id: id(n),
          text: n.text,
          type: n.type,
          confidence: n.confidence,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          aliases: n.aliases
        }] as nodes,
        [r IN relationships | {
          id: id(r),
          type: type(r),
          confidence: r.confidence,
          context: r.context,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          startNode: id(startNode(r)),
          endNode: id(endNode(r))
        }] as relationships
    `;

    const params = { entityText, depth, limit };

    try {
      const result = await executeQuery(query, params);
      return result.records.length > 0 ? result.records[0] : { nodes: [], relationships: [] };
    } catch (error) {
      // Fallback if APOC is not available
      console.warn('APOC not available, using basic traversal:', error.message);
      return this._getSubgraphBasic(entityText, depth, limit);
    }
  }

  /**
   * Basic subgraph traversal without APOC
   * @private
   */
  static async _getSubgraphBasic(entityText, depth, limit) {
    // Simple breadth-first traversal
    const query = `
      MATCH path = (start:Entity {text: $entityText})-[:RELATIONSHIP*1..$depth]-(end:Entity)
      WITH 
        collect(DISTINCT nodes(path)) as nodeCollections,
        collect(DISTINCT relationships(path)) as relCollections,
        start
      UNWIND nodeCollections as nodesInPath
      UNWIND relCollections as relsInPath
      WITH 
        collect(DISTINCT n IN nodesInPath | {
          id: id(n),
          text: n.text,
          type: n.type,
          confidence: n.confidence,
          createdAt: n.createdAt,
          updatedAt: n.updatedAt,
          aliases: n.aliases
        }) as uniqueNodes,
        collect(DISTINCT {
          id: id(r),
          type: type(r),
          confidence: r.confidence,
          context: r.context,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
          startNode: id(startNode(r)),
          endNode: id(endNode(r))
        }) as uniqueRels
      RETURN 
        uniqueNodes[0..$limit] as nodes,
        uniqueRels[0..$limit] as relationships
    `;

    const params = { entityText, depth, limit };
    const result = await executeQuery(query, params);
    return result.records.length > 0 ? result.records[0] : { nodes: [], relationships: [] };
  }

  /**
   * Search for entities using fulltext search (requires fulltext index)
   * @param {string} searchTerm - Search term
   * @param {Object} [options] - Search options
   * @returns {Promise<Array>} Matching entities
   */
  static async searchEntities(searchTerm, options = {}) {
    const { 
      type = null,
      limit = 50 
    } = options;

    // Try to use fulltext index if available
    let query = `
      CALL db.index.fulltext.queryNodes('entitySearch', $searchTerm)
      YIELD node, score
    `;

    const params = { searchTerm, limit };

    if (type) {
      query += ' WHERE node.type = $type';
      params.type = type;
    }

    query += `
      RETURN 
        node.id as id,
        node.text as text,
        node.type as type,
        node.confidence as confidence,
        node.createdAt as createdAt,
        node.updatedAt as updatedAt,
        node.aliases as aliases,
        score as relevanceScore
      ORDER BY score DESC
      LIMIT $limit
    `;

    try {
      const result = await executeQuery(query, params);
      return result.records;
    } catch (error) {
      // Fallback to text search if fulltext index not available
      console.warn('Fulltext index not available, falling back to text search:', error.message);
      return this.findEntitiesByText(searchTerm, { type, limit });
    }
  }

  /**
   * Get statistics about the knowledge graph
   * @returns {Promise<Object>} Graph statistics
   */
  static async getStatistics() {
    const query = `
      // Node statistics
      MATCH (e:Entity)
      WITH count(e) as totalEntities,
           collect(DISTINCT e.type) as entityTypes
      
      // Relationship statistics
      MATCH ()-[r:RELATIONSHIP]->()
      WITH totalEntities, entityTypes, 
           count(r) as totalRelationships,
           collect(DISTINCT type(r)) as relationshipTypes
      
      // Confidence statistics
      MATCH (e:Entity)
      WITH totalEntities, entityTypes, totalRelationships, relationshipTypes,
           avg(e.confidence) as avgEntityConfidence,
           min(e.confidence) as minEntityConfidence,
           max(e.confidence) as maxEntityConfidence
      
      // Relationship confidence
      MATCH ()-[r:RELATIONSHIP]->()
      WITH totalEntities, entityTypes, totalRelationships, relationshipTypes,
           avgEntityConfidence, minEntityConfidence, maxEntityConfidence,
           avg(r.confidence) as avgRelConfidence,
           min(r.confidence) as minRelConfidence,
           max(r.confidence) as maxRelConfidence
      
      RETURN {
        entities: totalEntities,
        entityTypes: entityTypes,
        relationships: totalRelationships,
        relationshipTypes: relationshipTypes,
        avgEntityConfidence: avgEntityConfidence,
        minEntityConfidence: minEntityConfidence,
        maxEntityConfidence: maxEntityConfidence,
        avgRelationshipConfidence: avgRelConfidence,
        minRelationshipConfidence: minRelConfidence,
        maxRelationshipConfidence: maxRelConfidence
      } as stats
    `;

    const result = await executeQuery(query);
    return result.records.length > 0 ? result.records[0].stats : {};
  }

  /**
   * Clear all data from the knowledge graph (use with caution!)
   * @returns {Promise<Object>} Deletion statistics
   */
  static async clearAll() {
    const query = `
      MATCH (n)
      DETACH DELETE n
      RETURN 'All nodes and relationships deleted' as message
    `;

    const result = await executeQuery(query);
    return result.records.length > 0 ? result.records[0] : { message: 'Clear operation completed' };
  }
}

// Export singleton instance
export const knowledgeGraphQueries = new KnowledgeGraphQueries();