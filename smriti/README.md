# NeuBrain (Second Brain)

A local-first, app-independent repository for structured knowledge, project tracking, and AI-assisted brain dumping.

## Repository Goals

- **Portability**: Content is kept in standard Markdown with minimal dependence on specific tools (like Obsidian).
- **Automation**: Includes scripts for scanning local work and auto-generating knowledge summaries.
- **Privacy**: Local-first by design, with strict Git exclusions for sensitive data and environment-specific artifacts.

## Structure

- `/Inbox`: Catch-all for new, unfiled notes and quick captures.
- `/Knowledge`: Permanent notes, literature notes, and structured knowledge.
- `/Projects`: Sub-projects with auto-generated indexes and enrichment metadata.
- `/Scripts`: Python tools for vault maintenance and enrichment.
- `Home.md`: Starting point for navigation and high-level view.

## Independence

While this repository is compatible with Obsidian, it does not store Obsidian-specific configuration (like themes or plugin state) by default. This ensures you can switch to any other Markdown-based tool (e.g., Logseq, SilverBullet, or VS Code Foam) without friction.

---
*Created and maintained as part of the NeuBrain ecosystem.*
