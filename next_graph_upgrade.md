# Narad Smriti Graph Enhancement Plan

This document tracks the phased enhancement of Narad's Smriti knowledge graph visualization, inspired by Graphify features.

## Current State
- Basic Markdown wikilink-based graph generation
- 3D Force-directed visualization with geometric semantics
- Static JSON export with uniform link values
- Full regeneration on each run

## Enhancement Phases

### Phase 1: Enhanced Graph Generation (Foundation)
**Goal**: Improve node and link extraction from existing Markdown files

- [ ] Extract headers (#, ##, etc.) as conceptual nodes
- [ ] Identify and link code blocks to related concepts
- [ ] Extract tags/categories from frontmatter for grouping
- [ ] Process image references in Markdown for visual concepts
- [ ] Add link types: wikilink, see_also, tag_based, code_reference
- [ ] Implement basic confidence scoring for inferred relationships
- [ ] Output enhanced JSON structure maintaining backward compatibility

**Deliverable**: Updated `generate_graph.py` producing enriched `smriti_graph.json`

### Phase 2: Smart Processing & Performance
**Goal**: Optimize processing and enable incremental updates

- [ ] Implement SHA256-based file hashing for change detection
- [ ] Add `--update` flag for incremental graph updates
- [ ] Add `--force-full` flag for complete regeneration
- [ ] Create `.smritignore` support (similar to .gitignore)
- [ ] Add caching mechanism to avoid reprocessing unchanged files
- [ ] Add progress reporting during generation
- [ ] Add validation for generated graph structure

**Deliverable**: Enhanced generation script with performance optimizations

### Phase 3: Advanced Visualization Features
**Goal**: Enhance user interaction and insights from the graph

- [ ] Switch to 2D visualization with better layout algorithms (consider vis.js like Graphify)
- [ ] OR enhance current 3D view with additional interaction features
- [ ] Implement node/edge filtering by relationship type
- [ ] Add search functionality within the graph (find nodes by name/path/content)
- [ ] Implement detailed node inspection panel showing:
  - Full file path and frontmatter
  - Extracted concepts/headers
  - Incoming/outgoing links by type
  - Content preview
- [ ] Add community detection/clustering (Leiden algorithm or similar)
- [ ] Visualize link types with different styles/colors
- [ ] Add legend explaining node shapes and link types

**Deliverable**: Enhanced `graph.html` and `graph.js` with improved UI/UX

### Phase 4: Export & Integration Features
**Goal**: Make the graph more useful beyond the Narad UI

- [ ] Add multiple export formats: GraphML, SVG, CSV
- [ ] Implement Neo4j Cypher export option
- [ ] Add ability to query the graph for specific paths/connections
- [ ] Create `/graph explain` style functionality for tracing relationships
- [ ] Add option to highlight specific nodes/paths in visualization
- [ ] Implement graph statistics panel (node count, link density, etc.)
- [ ] Add ability to save/share graph views

**Deliverable**: Enhanced export and querying capabilities

### Phase 5: Automation & Maintenance
**Goal**: Make the graph self-maintaining and always up-to-date

- [ ] Add file watcher mode (`--watch`) for auto-regeneration on changes
- [ ] Implement git hook integration for automatic updates on commit
- [ ] Add scheduled regeneration option
- [ ] Create validation report showing what was added/changed in each run
- [ ] Add documentation on how to customize and extend the graph generation
- [ ] Create troubleshooting guide for common issues

**Deliverable**: Automation features and comprehensive documentation

## Tracking Progress

Use this format to mark completion:
- [x] Completed
- [ ] In Progress
- [ ] Planned
- [ ] Blocked

## Current Focus
**Phase 1: Enhanced Graph Generation** - Ready to start

## Notes & Ideas
- Consider preserving the 3D "Knowledge Observatory" theme if team prefers it
- Look into using existing Narad AI capabilities for semantic extraction where appropriate
- Ensure all changes are backward compatible with existing smriti_graph.json usage
- Test with actual Narad Smriti vault to verify improvements
- Consider performance impact of enhancements on larger vaults
