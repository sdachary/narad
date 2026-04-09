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
    return parser.parse_args()

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
        
    print(f"✅ Graph generated: {OUTPUT_FILE}")
    print(f"   Nodes: {len(nodes)} (+ {len(header_nodes)} headers)")
    print(f"   Links: {len(links)}")
    print(f"   Tags: {len(tag_groups)}")
    if args.update:
        print(f"   Processed: {processed}, Skipped: {skipped}")

if __name__ == "__main__":
    generate()
