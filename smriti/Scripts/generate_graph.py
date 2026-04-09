#!/usr/bin/env python3
"""
Smriti — Graph Generator (Phase 2 Enhanced)

Scans the Smriti vault for Markdown files and wikilinks to generate
a force-directed graph dataset (JSON) with enhanced metadata.

Output: pages/smriti_graph.json

Features:
- Extract headers as conceptual nodes
- Extract tags/categories from frontmatter
- Process image references
- Add link types: wikilink, see_also, tag_based, code_reference
- SHA256-based change detection
- Incremental update support
"""

import os
import re
import json
import hashlib
import datetime
import argparse
from pathlib import Path
from collections import defaultdict

# ─── Configuration ───────────────────────────────────────────────
VAULT_DIR = Path(__file__).parent.parent.resolve()
PROJECTS_DIR = VAULT_DIR / "Projects"
KNOWLEDGE_DIR = VAULT_DIR / "Knowledge"
OUTPUT_FILE = VAULT_DIR.parent / "pages" / "smriti_graph.json"
CACHE_FILE = VAULT_DIR / ".smriti_graph_cache"

# Regex patterns
WIKILINK_RE = re.compile(r"\[\[([^\]|]+)(?:\|[^\]]+)?\]\]")
HEADER_RE = re.compile(r"^(#{1,6})\s+(.+)$", re.MULTILINE)
TAG_RE = re.compile(r"(?:^|\s)#([a-zA-Z][a-zA-Z0-9_-]+)", re.MULTILINE)
FRONTMATTER_RE = re.compile(r"^---\n([\s\S]+?)\n---", re.MULTILINE)
CODE_BLOCK_RE = re.compile(r"```(\w+)?\n([\s\S]*?)```", re.MULTILINE)
IMAGE_RE = re.compile(r"!\[([^\]]*)\]\(([^\)]+)\)")
SEE_ALSO_RE = re.compile(r"(?:^|\n)\s*(?:see also|seealso|ref|references?):\s*([^\n]+)", re.IGNORECASE)
SMRITIGNORE_FILE = VAULT_DIR / ".smritignore"

def parse_args():
    parser = argparse.ArgumentParser(description="Generate Smriti Knowledge Graph")
    parser.add_argument("--update", action="store_true", help="Incremental update (skip unchanged files)")
    parser.add_argument("--force-full", action="store_true", help="Force complete regeneration")
    parser.add_argument("--export", type=str, help="Export formats: csv,graphml,neo4j,svg (comma-separated)")
    parser.add_argument("--watch", action="store_true", help="Watch mode - auto-regenerate on file changes")
    parser.add_argument("--install-hooks", action="store_true", help="Install git hooks for auto-sync")
    return parser.parse_args()

def install_git_hooks():
    """Install git hooks for automatic graph regeneration on commit"""
    hooks_dir = VAULT_DIR / ".git" / "hooks"
    hooks_dir.mkdir(parents=True, exist_ok=True)
    
    # Pre-commit hook
    pre_commit = hooks_dir / "pre-commit"
    pre_commit.write_text("""#!/bin/bash
# Smriti auto-graph update on commit
echo "🧠 Generating Smriti graph..."
python3 smriti/Scripts/generate_graph.py --update
git add pages/smriti_graph.json
""")
    os.chmod(pre_commit, 0o755)
    
    # Post-commit hook for notification
    post_commit = hooks_dir / "post-commit"
    post_commit.write_text("""#!/bin/bash
# Notify that graph was updated
echo "✅ Smriti graph updated"
""")
    os.chmod(post_commit, 0o755)
    
    print(f"✅ Git hooks installed in {hooks_dir}")
    print("   - pre-commit: Auto-regenerates graph")
    print("   - post-commit: Notifies of updates")

def watch_mode():
    """Watch for file changes and regenerate graph"""
    import time
    import watchdog
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler
    
    class GraphRefreshHandler(FileSystemEventHandler):
        def __init__(self):
            self.last_update = 0
            
        def on_modified(self, event):
            if event.is_directory:
                return
            if event.src_path.endswith('.md'):
                # Debounce - wait 2 seconds for multiple changes
                current_time = time.time()
                if current_time - self.last_update > 2:
                    self.last_update = current_time
                    print(f"🔄 File changed: {event.src_path}")
                    generate()
    
    print("👀 Watching for file changes in Smriti vault...")
    print("   Press Ctrl+C to stop")
    
    event_handler = GraphRefreshHandler()
    observer = Observer()
    observer.schedule(event_handler, str(VAULT_DIR), recursive=True)
    observer.start()
    
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n👋 Stopped watching")

def load_smritignore():
    """Load patterns to ignore from .smritignore file"""
    ignore_patterns = []
    if SMRITIGNORE_FILE.exists():
        with open(SMRITIGNORE_FILE) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    ignore_patterns.append(line)
    return ignore_patterns

def should_ignore(path_str):
    """Check if path matches any ignore pattern"""
    ignore_patterns = load_smritignore()
    for pattern in ignore_patterns:
        if pattern in path_str:
            return True
    return False

def get_file_hash(file_path):
    """Calculate SHA256 hash of file content"""
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            sha256.update(chunk)
    return sha256.hexdigest()

def load_cache():
    """Load file hash cache for incremental updates"""
    if CACHE_FILE.exists():
        try:
            with open(CACHE_FILE) as f:
                return json.load(f)
        except:
            pass
    return {}

def save_cache(cache):
    """Save file hash cache"""
    with open(CACHE_FILE, "w") as f:
        json.dump(cache, f)

def get_frontmatter(content: str):
    """Extract YAML frontmatter metadata"""
    match = FRONTMATTER_RE.match(content)
    if not match:
        return {}
    
    frontmatter = {}
    for line in match.group(1).split("\n"):
        if ":" in line:
            key, value = line.split(":", 1)
            frontmatter[key.strip()] = value.strip().strip('"')
    return frontmatter

def extract_tags(content: str):
    """Extract tags from frontmatter and inline hashtags"""
    tags = set()
    
    # From frontmatter
    fm = get_frontmatter(content)
    if "tags" in fm:
        if isinstance(fm["tags"], list):
            tags.update(fm["tags"])
        else:
            tags.update(fm["tags"].split())
    
    # Inline tags
    for tag_match in TAG_RE.finditer(content):
        tags.add(tag_match.group(1))
    
    return list(tags)

def extract_headers(content: str, file_path: str):
    """Extract headers as conceptual nodes with link to parent"""
    headers = []
    for match in HEADER_RE.finditer(content):
        level = len(match.group(1))
        text = match.group(2).strip()
        if text and len(text) > 2:  # Skip very short headers
            headers.append({
                "level": level,
                "text": text,
                "file": file_path
            })
    return headers

def get_link_type(content: str, link_target: str):
    """Determine the type of link based on context"""
    # Check for code references
    if link_target.lower().endswith(('.js', '.py', '.ts', '.jsx', '.tsx', '.md', '.json')):
        return "code_reference"
    
    # Check for see also section
    if SEE_ALSO_RE.search(content):
        return "see_also"
    
    # Default to wikilink
    return "wikilink"

def generate():
    args = parse_args()
    
    # Handle special commands
    if args.install_hooks:
        install_git_hooks()
        return
    
    if args.watch:
        try:
            watch_mode()
        except ImportError:
            print("⚠️ Watch mode requires watchdog: pip install watchdog")
        return
    
    print(f"🛰️ Generating Smriti Knowledge Graph...")
    
    # Load cache for incremental updates
    file_cache = load_cache() if args.update else {}
    new_cache = {}
    
    nodes = []
    links = []
    node_map = {}
    header_nodes = []
    tag_groups = defaultdict(list)
    
    # Track all files
    all_md_files = []
    for root, dirs, files in os.walk(VAULT_DIR):
        r_path = Path(root)
        if ".git" in r_path.parts or ".obsidian" in r_path.parts:
            continue
            
        for f in files:
            if f.endswith(".md"):
                all_md_files.append(r_path / f)
    
    print(f"📁 Found {len(all_md_files)} Markdown files")
    
    processed = 0
    skipped = 0
    
    # First Pass: Create Nodes with Enhanced Metadata
    for fpath in all_md_files:
        rel_path = fpath.relative_to(VAULT_DIR)
        
        if should_ignore(str(rel_path)):
            continue
            
        # Check for changes
        if args.update:
            file_hash = get_file_hash(fpath)
            new_cache[str(fpath)] = file_hash
            
            if not args.force_full and str(fpath) in file_cache:
                if file_cache[str(fpath)] == file_hash:
                    skipped += 1
                    continue
        else:
            file_hash = get_file_hash(fpath)
            
        processed += 1
        node_id = fpath.stem
        
        # Determine group (Project name)
        group = "General"
        if "Projects" in rel_path.parts and len(rel_path.parts) > 1:
            group = rel_path.parts[1]
        elif "Knowledge" in rel_path.parts and len(rel_path.parts) > 1:
            group = "Knowledge"
        
        content = fpath.read_text(encoding="utf-8", errors="replace")
        
        # Get frontmatter
        frontmatter = get_frontmatter(content)
        
        # Extract tags
        tags = extract_tags(content)
        
        # Extract headers
        headers = extract_headers(content, str(rel_path))
        
        # Extract image references
        images = IMAGE_RE.findall(content)
        
        # Get timestamps
        mtime = frontmatter.get("last_modified") or ""
        if not mtime:
            mtime = datetime.datetime.fromtimestamp(fpath.stat().st_mtime).strftime("%Y-%m-%d %H:%M")
        
        node = {
            "id": node_id,
            "name": fpath.name,
            "group": group,
            "time": mtime,
            "path": str(rel_path),
            "tags": tags[:10],  # Limit to 10 tags
            "headers": [h["text"] for h in headers[:5]],  # Limit to 5 headers
            "imageCount": len(images),
            "fileHash": file_hash[:16],  # Store partial hash for verification
            "linkTypes": {
                "wikilink": 0,
                "see_also": 0,
                "tag_based": 0,
                "code_reference": 0
            }
        }
        
        # Add frontmatter as metadata if present
        if frontmatter:
            if "source" in frontmatter:
                node["source"] = frontmatter["source"]
            if "type" in frontmatter:
                node["type"] = frontmatter["type"]
        
        nodes.append(node)
        node_map[fpath.stem] = node_id
        
        # Group tags for tag-based links
        for tag in tags:
            tag_groups[tag].append(node_id)
        
        # Add header nodes
        for header in headers:
            header_id = f"{node_id}:{header['text'][:30]}"
            header_nodes.append({
                "id": header_id,
                "name": header["text"],
                "group": f"header-{header['level']}",
                "path": str(rel_path),
                "parent": node_id,
                "level": header["level"],
                "time": mtime
            })
    
    # Second Pass: Extract Links with Types
    for fpath in all_md_files:
        source_id = fpath.stem
        content = fpath.read_text(encoding="utf-8", errors="replace")
        
        # Extract wikilinks
        found_links = WIKILINK_RE.findall(content)
        for target_name in found_links:
            target_id = target_name.strip()
            if target_id in node_map:
                link_type = get_link_type(content, target_id)
                links.append({
                    "source": source_id,
                    "target": target_id,
                    "type": "wikilink",
                    "value": 1
                })
                # Update link type count on source node
                for node in nodes:
                    if node["id"] == source_id:
                        node["linkTypes"]["wikilink"] += 1
                        break
        
        # Extract see also links
        see_also_match = SEE_ALSO_RE.search(content)
        if see_also_match:
            see_also_text = see_also_match.group(1)
            for target_name in WIKILINK_RE.findall(see_also_text):
                target_id = target_name.strip()
                if target_id in node_map:
                    links.append({
                        "source": source_id,
                        "target": target_id,
                        "type": "see_also",
                        "value": 2  # Higher value for explicit references
                    })
    
    # Add tag-based links (link nodes that share tags)
    for tag, node_ids in tag_groups.items():
        if len(node_ids) > 1:
            for i, source_id in enumerate(node_ids):
                for target_id in node_ids[i+1:]:
                    links.append({
                        "source": source_id,
                        "target": target_id,
                        "type": "tag_based",
                        "value": 0.5,  # Lower confidence for inferred links
                        "tag": tag
                    })
                    # Update link type counts
                    for node in nodes:
                        if node["id"] == source_id:
                            node["linkTypes"]["tag_based"] += 1
    
    # Add header nodes to final graph
    all_nodes = nodes + header_nodes
    
    # Save cache
    if args.update:
        save_cache(new_cache)
    
    # Build final graph data
    graph_data = {
        "nodes": all_nodes,
        "links": links,
        "metadata": {
            "generated": datetime.datetime.now().isoformat(),
            "nodeCount": len(nodes),
            "headerCount": len(header_nodes),
            "linkCount": len(links),
            "tagCount": len(tag_groups),
            "processed": processed,
            "skipped": skipped,
            "version": "2.0"
        }
    }
    
    # Ensure pages directory exists
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(graph_data, f, indent=2)
        
    # Export to other formats
    if args.export:
        export_formats(args.export, graph_data)
        
    print(f"✅ Graph generated: {OUTPUT_FILE}")
    print(f"   Nodes: {len(nodes)} (+ {len(header_nodes)} headers)")
    print(f"   Links: {len(links)}")
    print(f"   Tags: {len(tag_groups)}")
    if args.update:
        print(f"   Processed: {processed}, Skipped: {skipped}")

def export_formats(formats, graph_data):
    """Export graph to various formats"""
    base_name = OUTPUT_FILE.stem
    
    if 'csv' in formats:
        export_csv(graph_data, OUTPUT_FILE.parent / f"{base_name}_nodes.csv", OUTPUT_FILE.parent / f"{base_name}_links.csv")
        print(f"   📄 Exported CSV")
    
    if 'graphml' in formats:
        export_graphml(graph_data, OUTPUT_FILE.parent / f"{base_name}.graphml")
        print(f"   📊 Exported GraphML")
    
    if 'neo4j' in formats:
        export_neo4j(graph_data, OUTPUT_FILE.parent / f"{base_name}_neo4j.cql")
        print(f"   🐬 Exported Neo4j Cypher")
    
    if 'svg' in formats:
        export_svg_summary(graph_data, OUTPUT_FILE.parent / f"{base_name}_summary.svg")
        print(f"   🎨 Exported SVG summary")

def export_csv(graph_data, nodes_file, links_file):
    """Export to CSV format"""
    # Nodes CSV
    with open(nodes_file, 'w', encoding='utf-8') as f:
        f.write('id,name,group,path,time,tags,headers\n')
        for node in graph_data['nodes']:
            tags = '|'.join(node.get('tags', [])) if node.get('tags') else ''
            headers = '|'.join(node.get('headers', []))[:100] if node.get('headers') else ''
            path = node.get('path', '').replace(',', ';')
            f.write(f'"{node["id"]}","{node["name"]}","{node.get("group","")}","{path}","{node.get("time","")}","{tags}","{headers}"\n')
    
    # Links CSV
    with open(links_file, 'w', encoding='utf-8') as f:
        f.write('source,target,type,value\n')
        for link in graph_data['links']:
            f.write(f'"{link["source"]}","{link["target"]}","{link.get("type","wikilink")}",{link.get("value",1)}\n')

def export_graphml(graph_data, output_file):
    """Export to GraphML format"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        f.write('<graphml xmlns="http://graphml.graphdrawing.org/xmlns">\n')
        
        # Define node attributes
        f.write('  <key id="name" for="node" attr.name="name" attr.type="string"/>\n')
        f.write('  <key id="group" for="node" attr.name="group" attr.type="string"/>\n')
        f.write('  <key id="path" for="node" attr.name="path" attr.type="string"/>\n')
        f.write('  <key id="time" for="node" attr.name="time" attr.type="string"/>\n')
        f.write('  <key id="tags" for="node" attr.name="tags" attr.type="string"/>\n')
        
        # Define edge attributes
        f.write('  <key id="linkType" for="edge" attr.name="type" attr.type="string"/>\n')
        
        f.write('  <graph id="G" edgedefault="undirected">\n')
        
        # Write nodes
        for node in graph_data['nodes']:
            tags = ','.join(node.get('tags', []))
            f.write(f'    <node id="{node["id"]}">\n')
            f.write(f'      <data key="name">{node["name"]}</data>\n')
            f.write(f'      <data key="group">{node.get("group", "")}</data>\n')
            f.write(f'      <data key="path">{node.get("path", "")}</data>\n')
            f.write(f'      <data key="time">{node.get("time", "")}</data>\n')
            f.write(f'      <data key="tags">{tags}</data>\n')
            f.write('    </node>\n')
        
        # Write edges
        for link in graph_data['links']:
            f.write(f'    <edge source="{link["source"]}" target="{link["target"]}">\n')
            f.write(f'      <data key="linkType">{link.get("type", "wikilink")}</data>\n')
            f.write('    </edge>\n')
        
        f.write('  </graph>\n')
        f.write('</graphml>')

def export_neo4j(graph_data, output_file):
    """Export to Neo4j Cypher format"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('-- Neo4j Import Script for Smriti Graph\n')
        f.write('-- Run this in Neo4j Browser or cypher-shell\n\n')
        
        f.write('-- Create nodes\n')
        for node in graph_data['nodes']:
            tags = ':'.join(node.get('tags', [])) if node.get('tags') else ''
            group = node.get('group', 'General').replace("'", "\\'")
            name = node['name'].replace("'", "\\'")
            path = node.get('path', '').replace("'", "\\'")
            
            labels = ['Note']
            if node.get('group', '').startswith('header-'):
                labels.append('Header')
            if tags:
                labels.append(tags)
            
            label_str = ':'.join(labels)
            f.write(f'CREATE (n:{label_str} {{id: "{node["id"]}", name: "{name}", group: "{group}", path: "{path}", time: "{node.get("time","")}"}})\n')
        
        f.write('\n-- Create relationships\n')
        for link in graph_data['links']:
            link_type = link.get('type', 'wikilink').replace('_', '').upper()
            if link_type == 'WIKILINK':
                link_type = 'LINKS_TO'
            elif link_type == 'TAG_BASED':
                link_type = 'SHARES_TAG'
            elif link_type == 'SEE_ALSO':
                link_type = 'SEE_ALSO'
            elif link_type == 'CODE_REFERENCE':
                link_type = 'REFERENCES_CODE'
            
            f.write(f'MATCH (a:{{id: "{link["source"]}"}}), (b:{{id: "{link["target"]}"}}) CREATE (a)-[r:{link_type}]->(b)\n')

def export_svg_summary(graph_data, output_file):
    """Export a simple SVG visualization summary"""
    nodes_by_group = defaultdict(list)
    for node in graph_data['nodes']:
        if not node.get('group', '').startswith('header-'):
            nodes_by_group[node.get('group', 'General')].append(node)
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">\n')
        f.write('  <style>text { font-family: sans-serif; }</style>\n')
        f.write('  <rect width="100%" height="100%" fill="#0d1117"/>\n')
        f.write('  <text x="20" y="30" fill="#ffb000" font-size="20" font-weight="bold">Smriti Knowledge Graph</text>\n')
        
        y = 60
        for group, nodes in sorted(nodes_by_group.items(), key=lambda x: -len(x[1])):
            if y > 550:
                break
            color = get_project_color_svg(group)
            f.write(f'  <circle cx="30" cy="{y}" r="8" fill="{color}"/>\n')
            f.write(f'  <text x="50" y="{y+5}" fill="#ccc" font-size="14">{group}: {len(nodes)} nodes</text>\n')
            y += 25
        
        f.write('</svg>\n')

def get_project_color_svg(group):
    """Get color for SVG export"""
    colors = {
        'General': '#888888',
        'Knowledge': '#00ff88',
        'narad': '#ffb000',
        'vishwakarma': '#3b82f6',
        'chitragupta': '#a855f7',
        'unnati': '#f97316',
    }
    return colors.get(group, '#ff6b6b')

if __name__ == "__main__":
    generate()
