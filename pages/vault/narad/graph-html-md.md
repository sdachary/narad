---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/vault/narad/graph-html.md"
project: "narad"
role: docs
language: markdown
frameworks: []
lines: 580
size: 16192 bytes
last_modified: "2026-04-09 15:18"
scanned: "2026-04-09 15:19"
tags: [docs, documentation, markdown, project/narad]
---

# graph-html.md

> Documentation (580 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/vault/narad/graph-html.md` |
| **Role** | docs |
| **Language** | markdown |
| **Frameworks** | — |
| **Lines** | 580 |
| **Size** | 16192 bytes |
| **Modified** | 2026-04-09 15:18 |

## 🔗 Related Files

—

## 📄 Content

```markdown
---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/graph.html"
project: "narad"
role: page
language: html
frameworks: []
lines: 542
size: 15571 bytes
last_modified: "2026-04-09 13:31"
scanned: "2026-04-09 13:31"
tags: [code, html, page, project/narad]
---

# graph.html

> Web page (542 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/graph.html` |
| **Role** | page |
| **Language** | html |
| **Frameworks** | — |
| **Lines** | 542 |
| **Size** | 15571 bytes |
| **Modified** | 2026-04-09 13:31 |

## 🔗 Related Files

—

## 📄 Content

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smriti | Knowledge Observatory</title>
    <link rel="stylesheet" href="style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;700&display=swap" rel="stylesheet">
    
    <!-- Graph Engines (CDN) -->
    <script src="https://unpkg.com/three"></script>
    <script src="https://unpkg.com/3d-force-graph"></script>
    <script src="https://unpkg.com/force-graph"></script>
    
    <style>
        body {
            margin: 0;
            background-color: #0d1117;
            color: #eee;
            overflow: hidden;
            font-family: 'Roboto Mono', monospace;
        }

        #graph-container {
            width: 100vw;
            height: 100vh;
        }

        .graph-overlay {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 100;
            pointer-events: none;
        }

        .graph-controls {
            position: absolute;
            bottom: 30px;
            right: 30px;
            display: flex;
            gap: 15px;
            z-index: 1001;
            pointer-events: auto;
            flex-wrap: wrap;
            justify-content: flex-end;
        }

        .obs-title {
            font-size: 24px;
            font-weight: 700;
            color: var(--text-secondary, #ffb000);
            text-shadow: 0 0 10px rgba(255, 176, 0, 0.4);
            margin-bottom: 5px;
            letter-spacing: 2px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .obs-title .obs-icon {
            width: 12px;
            height: 12px;
            background: var(--text-secondary, #ffb000);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--text-secondary);
        }

        .obs-subtitle {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .toggle-btn {
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #444;
            color: #888;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-family: inherit;
            font-size: 12px;
            transition: all 0.3s;
            backdrop-filter: blur(5px);
            font-weight: 700;
        }

        .toggle-btn.active {
            border-color: var(--text-secondary, #ffb000);
            color: var(--text-secondary, #ffb000);
            box-shadow: 0 0 15px rgba(255, 176, 0, 0.4);
        }

        .speed-selector {
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #444;
            color: #888;
            padding: 8px 12px;
            border-radius: 20px;
            font-family: inherit;
            font-size: 11px;
            cursor: pointer;
            outline: none;
            backdrop-filter: blur(5px);
        }

        .speed-selector:hover {
            border-color: #666;
        }

        #back-btn {
            background: rgba(255, 95, 86, 0.1);
            border-color: #ff5f56;
            color: #ff5f56;
        }

        #back-btn:hover {
            background: #ff5f56;
            color: white;
        }

        /* Interactive Preview Bubble */
        #node-preview {
            position: absolute;
            left: 20px;
            bottom: 80px;
            width: 320px;
            background: rgba(13, 17, 23, 0.85);
            border: 1px solid rgba(255, 176, 0, 0.3);
            border-radius: 12px;
            padding: 20px;
            backdrop-filter: blur(15px);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
            z-index: 2000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        #node-preview.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: auto;
        }

        .preview-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .preview-title {
            font-size: 16px;
            font-weight: 700;
            color: #fff;
            flex-grow: 1;
        }

        .preview-body {
            font-size: 13px;
            color: #aaa;
            line-height: 1.6;
            margin-bottom: 20px;
            max-height: 150px;
            overflow-y: auto;
        }

        .preview-footer {
            display: flex;
            gap: 10px;
        }

        .preview-btn {
            background: rgba(255, 176, 0, 0.1);
            border: 1px solid var(--text-secondary);
            color: var(--text-secondary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.2s;
        }

        .preview-btn:hover {
            background: var(--text-secondary);
            color: #0d1117;
        }

        .node-label {
            font-size: 11px;
            padding: 2px 6px;
            background: rgba(0,0,0,0.8);
            border-radius: 4px;
            pointer-events: none;
            border: 1px solid #333;
            color: #00ff00;
            white-space: nowrap;
        }

        .loading-screen {
            position: fixed;
            inset: 0;
            background: #0d1117;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s;
        }

        .loading-text {
            margin-top: 20px;
            color: var(--text-secondary);
            font-size: 14px;
            letter-spacing: 2px;
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { opacity: 0.5; }
            50% { opacity: 1; }
            100% { opacity: 0.5; }
        }

        /* Search Panel */
        #search-panel {
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 100;
            display: none;
        }

        #search-panel.visible {
            display: block;
        }

        #search-input {
            background: rgba(0, 0, 0, 0.6);
            border: 1px solid #444;
            color: #eee;
            padding: 10px 15px;
            border-radius: 20px;
            font-family: inherit;
            font-size: 13px;
            width: 250px;
            outline: none;
            backdrop-filter: blur(5px);
        }

        #search-input:focus {
            border-color: var(--text-secondary, #ffb000);
        }

        #search-results {
            position: absolute;
            top: 45px;
            right: 0;
            background: rgba(13, 17, 23, 0.95);
            border: 1px solid #333;
            border-radius: 8px;
            max-height: 300px;
            overflow-y: auto;
            display: none;
            min-width: 280px;
        }

        #search-results.visible {
            display: block;
        }

        .search-result-item {
            padding: 10px 15px;
            cursor: pointer;
            border-bottom: 1px solid #222;
            transition: background 0.2s;
        }

        .search-result-item:hover {
            background: rgba(255, 176, 0, 0.1);
        }

        .search-result-item:last-child {
            border-bottom: none;
        }

        .search-result-name {
            color: #fff;
            font-weight: 600;
            font-size: 13px;
        }

        .search-result-path {
            color: #666;
            font-size: 11px;
            margin-top: 3px;
        }

        /* Filter Panel */
        #filter-panel {
            position: absolute;
            top: 80px;
            right: 20px;
            z-index: 100;
            background: rgba(13, 17, 23, 0.85);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 15px;
            backdrop-filter: blur(10px);
            display: none;
        }

        #filter-panel.visible {
            display: block;
        }

        .filter-title {
            font-size: 12px;
            color: #888;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .filter-option {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            cursor: pointer;
        }

        .filter-option input {
            accent-color: var(--text-secondary, #ffb000);
        }

        .filter-option label {
            color: #ccc;
            font-size: 12px;
            cursor: pointer;
        }

        /* Legend Panel */
        #legend-panel {
            position: absolute;
            bottom: 30px;
            left: 20px;
            z-index: 100;
            background: rgba(13, 17, 23, 0.85);
            border: 1px solid #333;
            border-radius: 12px;
            padding: 15px;
            backdrop-filter: blur(10px);
            display: none;
        }

        #legend-panel.visible {
            display: block;
        }

        .legend-title {
            font-size: 11px;
            color: #888;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 6px;
            font-size: 11px;
            color: #aaa;
        }

        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
        }

        /* Stats Panel */
        #stats-panel {
            position: absolute;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 100;
            background: rgba(13, 17, 23, 0.85);
            border: 1px solid #333;
            border-radius: 20px;
            padding: 8px 20px;
            backdrop-filter: blur(10px);
            display: flex;
            gap: 20px;
            font-size: 12px;
            color: #888;
        }

        .stat-item {
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .stat-value {
            color: var(--text-secondary, #ffb000);
            font-weight: 700;
        }

        /* View mode toggle */
        .view-toggle {
            display: flex;
            gap: 5px;
        }

        .view-toggle .toggle-btn {
            padding: 8px 12px;
            font-size: 11px;
        }
    </style>
</head>
<body>
    <div id="loading" class="loading-screen">
        <div class="obs-title"><div class="obs-icon"></div> SMRITI</div>
        <div class="loading-text">RECALLING MEMORIES...</div>
    </div>

    <div class="graph-overlay">
        <div class="obs-title"><div class="obs-icon"></div> SMRITI</div>
        <div class="obs-subtitle">Knowledge Observatory</div>
    </div>

    <div id="stats-panel">
        <div class="stat-item">Nodes: <span class="stat-value" id="stat-nodes">0</span></div>
        <div class="stat-item">Links: <span class="stat-value" id="stat-links">0</span></div>
        <div class="stat-item">Tags: <span class="stat-value" id="stat-tags">0</span></div>
    </div>

    <div id="search-panel">
        <input type="text" id="search-input" placeholder="Search nodes...">
        <div id="search-results"></div>
    </div>

    <div id="filter-panel">
        <div class="filter-title">Link Types</div>
        <div class="filter-option">
            <input type="checkbox" id="filter-wikilink" checked>
            <label for="filter-wikilink">Wikilinks</label>
        </div>
        <div class="filter-option">
            <input type="checkbox" id="filter-tag" checked>
            <label for="filter-tag">Tag-based</label>
        </div>
        <div class="filter-option">
            <input type="checkbox" id="filter-seealso" checked>
            <label for="filter-seealso">See Also</label>
        </div>
        <div class="filter-option">
            <input type="checkbox" id="filter-code" checked>
            <label for="filter-code">Code Refs</label>
        </div>
    </div>

    <div id="legend-panel">
        <div class="legend-title">Link Types</div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(255,255,255,0.3)"></div>
            <span>Wikilink</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(168,85,247,0.6)"></div>
            <span>Tag-based</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: rgba(34,197,94,0.6)"></div>
            <span>See Also</span>
        </div>
        <div class="legend-title" style="margin-top:10px">Node Types</div>
        <div class="legend-item">
            <div class="legend-color" style="background: #ffb000"></div>
            <span>Project</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: #00ff88"></div>
            <span>Knowledge</span>
        </div>
        <div class="legend-item">
            <div class="legend-color" style="background: #ff6b6b"></div>
            <span>Header</span>
        </div>
    </div>

    <div class="graph-controls">
        <div class="view-toggle">
            <button id="view-3d" class="toggle-btn active">3D VIEW</button>
            <button id="view-2d" class="toggle-btn">2D VIEW</button>
        </div>
        <button id="search-btn" class="toggle-btn">SEARCH</button>
        <button id="filter-btn" class="toggle-btn">FILTER</button>
        <button id="legend-btn" class="toggle-btn">LEGEND</button>
        <select id="speed-select" class="speed-selector" title="Animation Speed">
            <option value="1000">Fast Reveal</option>
            <option value="3000">Smooth Reveal</option>
            <option value="5000">Meditative (5s)</option>
            <option value="10000" selected>Deep Meditation (10s)</option>
        </select>
        <button id="back-btn" class="toggle-btn" onclick="window.location.href='/'">RETURN TO NARAD</button>
    </div>

    <div id="node-preview" class="preview-bubble">
        <div class="preview-header">
            <div id="preview-icon" class="obs-icon"></div>
            <div id="preview-title" class="preview-title">PROJECT_NAME</div>
        </div>
        <div id="preview-body" class="preview-body">
            This project represents your deep knowledge base. Initializing visualization...
        </div>
        <div id="preview-details" style="margin-bottom: 15px; font-size: 11px; color: #666;">
            <!-- Additional details -->
        </div>
        <div class="preview-footer">
            <button id="enter-node" class="preview-btn">ENTER NODE</button>
            <button id="close-preview" class="preview-btn" style="border-color: #666; color: #666; background: transparent;">CLOSE</button>
        </div>
    </div>

    <div id="graph-container"></div>

    <script src="graph.js"></script>
</body>
</html>

```

```
