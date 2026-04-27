import { knowledgeGraphQueries } from './queries.js';
import { executeQuery } from './client.js';

/**
 * Recommendation engine for knowledge graph
 * Provides intelligent suggestions based on graph structure and entity relationships
 */
export class KnowledgeGraphRecommendations {
  /**
   * Find similar entities based on shared connections
   * @param {string} entityText - Entity to find similar ones for
   * @param {Object} [options] - Recommendation options
   * @returns {Promise<Array>} Similar entities with scores
   */
  async findSimilarEntities(entityText, options = {}) {
    const {
      limit = 10,
      minSharedConnections = 1,
      excludeDirectConnections = false
    } = options;

    try {
      // Find entities that share connections with the target entity
      const query = `
        MATCH (target:Entity {text: $entityText})
        OPTIONAL MATCH (target)-[r1:RELATIONSHIP]-(shared)
        OPTIONAL MATCH (candidate:Entity {text: shared.text})-[r2:RELATIONSHIP]-(shared)
        WHERE candidate <> target
        WITH candidate, 
             count(DISTINCT shared) as sharedConnections,
             collect(DISTINCT {
               entityId: id(shared),
               entityText: shared.text,
               connectionType1: type(r1),
               connectionType2: type(r2)
             }) as connectionDetails
        WHERE sharedConnections >= $minSharedConnections
        RETURN 
          id(candidate) as entityId,
          candidate.text as entityText,
          candidate.type as entityType,
          candidate.confidence as confidence,
          sharedConnections,
          connectionDetails
        ORDER BY sharedConnections DESC, candidate.confidence DESC
        LIMIT $limit
      `;

      const params = { entityText, limit, minSharedConnections };
      const result = await executeQuery(query, params);
      
      return result.records.map(record => ({
        entityId: record.entityId,
        entityText: record.entityText,
        entityType: record.entityType,
        confidence: record.confidence,
        similarityScore: record.sharedConnections,
        sharedConnections: record.sharedConnections,
        connectionDetails: record.connectionDetails
      }));
    } catch (error) {
      console.error('Failed to find similar entities:', error);
      return [];
    }
  }

  /**
   * Suggest potential connections between entities
   * @param {string} sourceEntityText - Source entity
   * @param {string} targetEntityText - Target entity
   * @returns {Promise<Array>} Suggested connection paths
   */
  async suggestConnectionPaths(sourceEntityText, targetEntityText) {
    try {
      // Find shortest paths between entities (up to 3 hops)
      const query = `
        MATCH (source:Entity {text: $sourceText})
        MATCH (target:Entity {text: $targetText})
        WHERE source <> target
        CALL apoc.path.expandConfig(source, {
          relationshipFilter: 'RELATIONSHIP>',
          labelFilter: '+Entity',
          minLevel: 1,
          maxLevel: 3,
          endNodes: [target]
        }) YIELD path
        RETURN 
          [n IN nodes(path) | {
            id: id(n),
            text: n.text,
            type: n.type,
            confidence: n.confidence
          }] as nodes,
          [r IN relationships(path) | {
            id: id(r),
            type: type(r),
            confidence: r.confidence
          }] as relationships,
          length(path) as pathLength
        ORDER BY pathLength ASC
        LIMIT 5
      `;

      const params = { sourceText: sourceEntityText, targetText: targetEntityText };
      const result = await executeQuery(query, params);
      
      return result.records.map(record => ({
        pathLength: record.pathLength,
        nodes: record.nodes,
        relationships: record.relationships,
        strength: Math.pow(0.8, record.pathLength) // Shorter paths = stronger connection
      }));
    } catch (error) {
      // Fallback if APOC is not available
      console.warn('APOC not available for path finding, using basic traversal:', error.message);
      return this._suggestConnectionPathsBasic(sourceEntityText, targetEntityText);
    }
  }

  /**
   * Basic connection path suggestion without APOC
   * @private
   */
  async _suggestConnectionPathsBasic(sourceEntityText, targetEntityText) {
    try {
      // Simple approach: find entities that connect to both source and target
      const query = `
        MATCH (source:Entity {text: $sourceText})
        MATCH (target:Entity {text: $targetText})
        WHERE source <> target
        OPTIONAL MATCH (source)-[r1:RELATIONSHIP]-(middle:Entity)-[r2:RELATIONSHIP]-(target)
        WHERE middle <> source AND middle <> target
        WITH middle, 
             collect(DISTINCT {
               middleId: id(middle),
               middleText: middle.text,
               middleType: middle.type,
               connection1Type: type(r1),
               connection2Type: type(r2)
             }) as paths
        WHERE size(paths) > 0
        RETURN 
          [ 
            { 
              id: id(source), 
              text: source.text, 
              type: source.type, 
              confidence: source.confidence 
            },
            middleInfo,
            { 
              id: id(target), 
              text: target.text, 
              type: target.type, 
              confidence: target.confidence 
            }
          ] as nodes,
          [ 
            { 
              id: null, 
              type: middleInfo[0].connection1Type, 
              confidence: 0.8 
            },
            { 
              id: null, 
              type: middleInfo[0].connection2Type, 
              confidence: 0.8 
            }
          ] as relationships,
          2 as pathLength
        LIMIT 5
      `;

      const params = { sourceText: sourceEntityText, targetText: targetEntityText };
      const result = await executeQuery(query, params);
      
      return result.records.map(record => ({
        pathLength: record.pathLength,
        nodes: record.nodes,
        relationships: record.relationships,
        strength: 0.6 // Fixed strength for 2-hop connections
      }));
    } catch (error) {
      console.error('Failed to suggest connection paths:', error);
      return [];
    }
  }

  /**
   * Recommend entities to explore based on user interests
   * @param {Array} userInterests - Array of entity texts the user is interested in
   * @param {Object} [options] - Recommendation options
   * @returns {Promise<Array>} Recommended entities
   */
  async recommendEntitiesByInterest(userInterests, options = {}) {
    const {
      limit = 10,
      minInterestScore = 0.3
    } = options;

    if (!userInterests || userInterests.length === 0) {
      return [];
    }

    try {
      // Find entities that are connected to user's interests
      const query = `
        UNWIND $interests as interestText
        MATCH (interest:Entity {text: interestText})
        OPTIONAL MATCH (interest)-[r:RELATIONSHIP]-(recommended:Entity)
        WHERE NOT recommended.text IN $interests
        WITH recommended, 
             count(DISTINCT interest) as interestCount,
             collect(DISTINCT interest.text) as matchingInterests,
             avg(r.confidence) as avgConnectionStrength
        WHERE interestCount >= 1
        WITH recommended, 
             interestCount as connectionCount,
             matchingInterests,
             avgConnectionStrength,
             (interestCount * avgConnectionStrength) as interestScore
        WHERE interestScore >= $minInterestScore
        RETURN 
          id(recommended) as entityId,
          recommended.text as entityText,
          recommended.type as entityType,
          recommended.confidence as entityConfidence,
          interestScore,
          connectionCount,
          matchingInterests,
          avgConnectionStrength
        ORDER BY interestScore DESC
        LIMIT $limit
      `;

      const params = { 
        interests: userInterests,
        limit,
        minInterestScore
      };
      const result = await executeQuery(query, params);
      
      return result.records.map(record => ({
        entityId: record.entityId,
        entityText: record.entityText,
        entityType: record.entityType,
        entityConfidence: record.entityConfidence,
        recommendationScore: record.interestScore,
        connectionCount: record.connectionCount,
        matchingInterests: record.matchingInterests,
        avgConnectionStrength: record.avgConnectionStrength
      }));
    } catch (error) {
      console.error('Failed to recommend entities by interest:', error);
      return [];
    }
  }

  /**
   * Find trending or popular entities in the knowledge graph
   * @param {Object} [options] - Trending options
   * @returns {Promise<Array>} Trending entities
   */
  async getTrendingEntities(options = {}) {
    const {
      limit = 10,
      timeWindowHours = 24,
      minConnections = 2
    } = options;

    try {
      // Find entities with recent activity or high connectivity
      const query = `
        MATCH (e:Entity)
        WHERE 
          // Either recently updated
          e.updatedAt > datetime() - duration({hours: $timeWindowHours})
          // Or highly connected
          OR size([(e)-[r:RELATIONSHIP]-() | r]) >= $minConnections
        WITH e, 
             size([(e)-[r:RELATIONSHIP]-() | r]) as connectionCount,
             CASE 
               WHEN e.updatedAt > datetime() - duration({hours: $timeWindowHours}) 
               THEN 1.0 
               ELSE 0.0 
             end as recencyScore
        WITH e, 
             connectionCount,
             recencyScore,
             (log(connectionCount + 1) * 0.7 + recencyScore * 0.3) as popularityScore
        WHERE popularityScore > 0
        RETURN 
          id(e) as entityId,
          e.text as entityText,
          e.type as entityType,
          e.confidence as entityConfidence,
          connectionCount,
          recencyScore,
          popularityScore
        ORDER BY popularityScore DESC
        LIMIT $limit
      `;

      const params = { limit, timeWindowHours, minConnections };
      const result = await executeQuery(query, params);
      
      return result.records.map(record => ({
        entityId: record.entityId,
        entityText: record.entityText,
        entityType: record.entityType,
        entityConfidence: record.entityConfidence,
        connectionCount: record.connectionCount,
        recencyScore: record.recencyScore,
        popularityScore: record.popularityScore
      }));
    } catch (error) {
      console.error('Failed to get trending entities:', error);
      return [];
    }
  }

  /**
   * Recommend learning paths based on knowledge gaps
   * @param {Array} knownEntities - Array of entity texts the user knows
   * @param {Array} goalEntities - Array of entity texts the user wants to learn about
   * @param {Object} [options] - Learning path options
   * @returns {Promise<Array>} Recommended learning paths
   */
  async recommendLearningPaths(knownEntities, goalEntities, options = {}) {
    const {
      maxPathLength = 4,
      limit = 5
    } = options;

    if (!knownEntities || knownEntities.length === 0 || 
        !goalEntities || goalEntities.length === 0) {
      return [];
    }

    try {
      // Find paths from known entities to goal entities
      const query = `
        UNWIND $known as knownText
        MATCH (known:Entity {text: knownText})
        UNWIND $goals as goalText
        MATCH (goal:Entity {text: goalText})
        WHERE known <> goal
        CALL apoc.path.expandConfig(known, {
          relationshipFilter: 'RELATIONSHIP>',
          labelFilter: '+Entity',
          minLevel: 1,
          maxLevel: $maxPathLength,
          endNodes: [goal]
        }) YIELD path
        WITH 
          known,
          goal,
          path,
          length(path) as pathLength,
          reduce(score = 1.0, r IN relationships(path) | score * r.confidence) as pathStrength
        ORDER BY pathStrength DESC, pathLength ASC
        LIMIT $limit
        RETURN 
          knownText as knownEntity,
          goalText as goalEntity,
          [n IN nodes(path) | {
            id: id(n),
            text: n.text,
            type: n.type,
            confidence: n.confidence
          }] as pathNodes,
          [r IN relationships(path) | {
            id: id(r),
            type: type(r),
            confidence: r.confidence
          }] as pathRelationships,
          pathLength,
          pathStrength
      `;

      const params = { 
        known: knownEntities,
        goals: goalEntities,
        maxPathLength,
        limit
      };
      const result = await executeQuery(query, params);
      
      return result.records.map(record => ({
        knownEntity: record.knownEntity,
        goalEntity: record.goalEntity,
        pathLength: record.pathLength,
        pathStrength: record.pathStrength,
        pathNodes: record.pathNodes,
        pathRelationships: record.pathRelationships
      }));
    } catch (error) {
      // Fallback if APOC is not available
      console.warn('APOC not available for learning paths, using basic approach:', error.message);
      return this._recommendLearningPathsBasic(knownEntities, goalEntities, options);
    }
  }

  /**
   * Basic learning path recommendation without APOC
   * @private
   */
  async _recommendLearningPathsBasic(knownEntities, goalEntities, options = {}) {
    const {
      maxPathLength = 4,
      limit = 5
    } = options;

    try {
      // Simple approach: find intermediate entities that connect known to goals
      const query = `
        UNWIND $known as knownText
        MATCH (known:Entity {text: knownText})
        UNWIND $goals as goalText
        MATCH (goal:Entity {text: goalText})
        WHERE known <> goal
        // Look for 2-hop paths through intermediate entities
        OPTIONAL MATCH (known)-[r1:RELATIONSHIP]-(intermediate:Entity)-[r2:RELATIONSHIP]-(goal)
        WHERE intermediate <> known AND intermediate <> goal
        WITH known, goal, intermediate, r1, r2
        WHERE r1 IS NOT NULL AND r2 IS NOT NULL
        WITH 
          known,
          goal,
          collect(DISTINCT {
            intermediateId: id(intermediate),
            intermediateText: intermediate.text,
            intermediateType: intermediate.type,
            connection1: { type: type(r1), confidence: r1.confidence },
            connection2: { type: type(r2), confidence: r2.confidence }
          }) as intermediates
        WHERE size(intermediates) > 0
        UNWIND intermediates as intermediate
        RETURN 
          knownText as knownEntity,
          goalText as goalEntity,
          [
            { id: id(known), text: knownText, type: 'KNOWN', confidence: 1.0 },
            { 
              id: intermediate.intermediateId, 
              text: intermediate.intermediateText, 
              type: intermediate.intermediateType, 
              confidence: 0.8 
            },
            { id: id(goal), text: goalText, type: 'GOAL', confidence: 1.0 }
          ] as pathNodes,
          [
            { 
              id: null, 
              type: intermediate.connection1.type, 
              confidence: intermediate.connection1.confidence 
            },
            { 
              id: null, 
              type: intermediate.connection2.type, 
              confidence: intermediate.connection2.confidence 
            }
          ] as pathRelationships,
          2 as pathLength,
          (intermediate.connection1.confidence * intermediate.connection2.confidence * 0.8) as pathStrength
        ORDER BY pathStrength DESC
        LIMIT $limit
      `;

      const params = { 
        known: knownEntities,
        goals: goalEntities,
        limit
      };
      const result = await executeQuery(query, params);
      
      return result.records.map(record => ({
        knownEntity: record.knownEntity,
        goalEntity: record.goalEntity,
        pathLength: record.pathLength,
        pathStrength: record.pathStrength,
        pathNodes: record.pathNodes,
        pathRelationships: record.pathRelationships
      }));
    } catch (error) {
      console.error('Failed to recommend learning paths:', error);
      return [];
    }
  }
}

// Export singleton instance
export const knowledgeGraphRecommendations = new KnowledgeGraphRecommendations();