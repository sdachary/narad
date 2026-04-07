#!/usr/bin/env python3
"""
Smriti — Graph Generator (Phase 2)

Scans the Smriti vault for Markdown files and wikilinks to generate
a force-directed graph dataset (JSON).

Output: pages/smriti_graph.json
"""

import os
import re
import json
import datetime
from pathlib import Path

# ─── Configuration ───────────────────────────────────────────────
VAULT_DIR = Path(__file__).parent.parent.resolve()
PROJECTS_DIR = VAULT_DIR / "Projects"
KNOWLEDGE_DIR = VAULT_DIR / "Knowledge"
OUTPUT_FILE = VAULT_DIR.parent / "pages" / "smriti_graph.json"

# Regex for wikilinks: [[Link Name]]
WIKILINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")

def get_frontmatter_date(content: str) -> str:
    """Extract last_modified from YAML frontmatter."""
    match = re.search(r"last_modified:\s*\"([^\"]+)\"", content)
    if match:
        return match.group(1)
    return ""

def generate():
    print(f"🛰️ Generating Smriti Knowledge Graph...")
    
    nodes = []
    links = []
    node_map = {} # Maps filename to node ID
    
    # 1. Collect all Markdown files
    all_md_files = []
    for root, dirs, files in os.walk(VAULT_DIR):
        r_path = Path(root)
        if ".git" in r_path.parts or ".obsidian" in r_path.parts:
            continue
            
        for f in files:
            if f.endswith(".md"):
                all_md_files.append(r_path / f)

    # 2. First Pass: Create Nodes
    for fpath in all_md_files:
        rel_path = fpath.relative_to(VAULT_DIR)
        node_id = fpath.stem
        
        # Determine group (Project name)
        group = "General"
        if "Projects" in rel_path.parts and len(rel_path.parts) > 1:
            group = rel_path.parts[1]
        elif "Knowledge" in rel_path.parts and len(rel_path.parts) > 1:
            group = "Knowledge"

        content = fpath.read_text(encoding="utf-8", errors="replace")
        mtime = get_frontmatter_date(content)
        if not mtime:
            # Fallback to filesystem mtime
            mtime = datetime.datetime.fromtimestamp(fpath.stat().st_mtime).strftime("%Y-%m-%d %H:%M")

        nodes.append({
            "id": node_id,
            "name": fpath.name,
            "group": group,
            "time": mtime,
            "path": str(rel_path)
        })
        node_map[fpath.stem] = node_id

    # 3. Second Pass: Extract Links
    for fpath in all_md_files:
        source_id = fpath.stem
        content = fpath.read_text(encoding="utf-8", errors="replace")
        
        found_links = WIKILINK_RE.findall(content)
        for target_name in found_links:
            # Obsidian wikilinks usually match the filename/stem
            target_id = target_name.strip()
            if target_id in node_map:
                links.append({
                    "source": source_id,
                    "target": target_id,
                    "value": 1
                })

    # 4. Save to JSON
    graph_data = {
        "nodes": nodes,
        "links": links
    }
    
    # Ensure pages directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(graph_data, f, indent=2)
        
    print(f"✅ Graph generated: {OUTPUT_FILE}")
    print(f"   Nodes: {len(nodes)}, Links: {len(links)}")

if __name__ == "__main__":
    generate()
