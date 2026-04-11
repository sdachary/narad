# 🧠 V2: smriti & Narad Integration Plan

This plan outlines the architecture for a fully automated, cross-repository knowledge base ("smriti") that feeds into your Narad AI agent and includes a visible knowledge graph.

## 1. Multi-Repo Automation (GitHub Actions)

We will implement a "Sync-to-smriti" workflow that can be added to any of your project repositories.

### The Sync Hook
- **Trigger**: `on: push` to the `main` or `master` branch.
- **Filtering**: The action will automatically exclude:
    - `.env`, `.env.*`
    - `wrangler.toml`, `wrangler.json`
    - `secrets.*`, `*.key`, `*.pem`
    - `node_modules/`, `vendor/`, `dist/`, `build/`
- **Destination**: Replaces or updates the corresponding folder in the `smriti/Projects/` directory.

### Requirements:
- You will need to add a GitHub Personal Access Token (PAT) with `repo` scope to your project repositories as a secret (e.g., `SMRITI_SYNC_TOKEN`).

## 2. Narad Integration (UI & Graph View)

We will modify the Narad web interface to include a visual representation of your knowledge.

### UI Enhancement
- **Location**: `narad/pages/index.html`
- **Addition**: A new button in the terminal header (next to Search) titled "GRAPH" or "🛰️".
- **Action**: Redirects to `/graph.html`.

### Graph View Implementation
- **New Page**: `graph.html` (and `graph.js`).
- **Engine**: We will use **D3.js** or **Force-Directed Graph** to render the nodes (Notes) and edges (Wikilinks).
- **Data Source**: A `graph.json` generated automatically from the smriti repo.

## 3. Deployment Workflow

Since you want this to be "serverless":
1. **GitHub Action** updates `smriti`.
2. **smriti CI** generates a fresh `graph.json` from the Markdown links.
3. **Narad Page** reads this `graph.json` and renders the interactive vault graph.

---

## Proposed Local Changes

### [NEW] [V2_smriti_Narad_Integration_Plan.md](file:///home/deepak/SecondBrain/V2_smriti_Narad_Integration_Plan.md)
*Standardizing this document as the source of truth for our next steps.*

### [NEW] [sync-to-smriti.yml](file:///home/deepak/SecondBrain/Scripts/github-actions/sync-to-smriti.yml)
*A reusable GitHub Action template for your projects.*

### [MODIFY] [index.html](file:///home/deepak/Work/narad/pages/index.html)
*Adding the Graph View button to the header.*

### [MODIFY] [app.js](file:///home/deepak/Work/narad/pages/app.js)
*Handling the redirect to the Graph View.*

### [NEW] [graph.html](file:///home/deepak/Work/narad/pages/graph.html)
*The interactive knowledge graph visualization page.*

---

## Open Questions

- **Graph Complexity**: For the initial version, should we show *all* files, or only files with major connections?
- **Public/Private**: Since Narad is on the web, do you want the Graph View to be publicly accessible, or password-protected?

## Verification Plan

1. **Automation Test**: Push a dummy commit to one repo (e.g., `narad`) and verify `smriti` is updated via action.
2. **UI Test**: Verify the button appears in Narad's terminal.
3. **Graph Test**: Verify `graph.html` correctly displays the connections between notes.
