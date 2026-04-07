#!/usr/bin/env python3
"""
Second Brain — Project Scanner (Step 2)

Scans a master project folder and creates structured Markdown notes
in the Obsidian vault's Projects/ directory.

Usage:
    python3 scan_projects.py
"""

import os
import datetime
from pathlib import Path

# ─── Configuration ───────────────────────────────────────────────
SOURCE_DIR = Path("/home/deepak/Work")
VAULT_DIR = Path("/home/deepak/SecondBrain")
PROJECTS_DIR = VAULT_DIR / "Projects"

# Files/folders to always skip
SKIP_DIRS = {
    ".git", ".obsidian", ".agent", "__pycache__", "node_modules",
    ".venv", "venv", "dist", "build", ".next", ".cache",
    ".wrangler", ".turbo", "coverage",
}

SKIP_FILES = {
    ".DS_Store", "Thumbs.db", "package-lock.json",
    ".gitignore", ".env", ".env.local",
}

# File extensions we care about
CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx", ".html", ".css",
    ".json", ".toml", ".yaml", ".yml", ".sh",
}

DOC_EXTENSIONS = {".md", ".txt", ".rst"}

ALL_EXTENSIONS = CODE_EXTENSIONS | DOC_EXTENSIONS

# Max file size to read (50KB — skip huge files)
MAX_FILE_SIZE = 50 * 1024

# ─── Helpers ─────────────────────────────────────────────────────

def now_stamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M")


def should_skip(path: Path) -> bool:
    """Check if a path should be skipped."""
    parts = path.parts
    for skip in SKIP_DIRS:
        if skip in parts:
            return True
    if path.name in SKIP_FILES:
        return True
    return False


def detect_language(ext: str) -> str:
    """Map file extension to a Markdown code fence language."""
    mapping = {
        ".py": "python", ".js": "javascript", ".ts": "typescript",
        ".tsx": "tsx", ".jsx": "jsx", ".html": "html", ".css": "css",
        ".json": "json", ".toml": "toml", ".yaml": "yaml",
        ".yml": "yaml", ".sh": "bash", ".md": "markdown",
        ".txt": "text", ".rst": "rst",
    }
    return mapping.get(ext, "text")


def safe_read(filepath: Path) -> str:
    """Read a file safely, returning empty string on failure."""
    try:
        if filepath.stat().st_size > MAX_FILE_SIZE:
            return f"[File too large: {filepath.stat().st_size} bytes — skipped]"
        return filepath.read_text(encoding="utf-8", errors="replace")
    except Exception as e:
        return f"[Could not read file: {e}]"


def get_file_stats(filepath: Path) -> dict:
    """Get basic file metadata."""
    stat = filepath.stat()
    return {
        "size": stat.st_size,
        "modified": datetime.datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M"),
        "extension": filepath.suffix,
    }


# ─── Note Generation ────────────────────────────────────────────

def create_file_note(filepath: Path, project_name: str) -> str:
    """Create a Markdown note for a single file."""
    rel_path = filepath.relative_to(SOURCE_DIR)
    stats = get_file_stats(filepath)
    ext = filepath.suffix
    lang = detect_language(ext)
    content = safe_read(filepath)

    # Determine file type tag
    if ext in DOC_EXTENSIONS:
        file_type = "documentation"
    else:
        file_type = "code"

    note = f"""---
source: "{filepath}"
project: "{project_name}"
type: {file_type}
language: {lang}
size: {stats['size']} bytes
last_modified: "{stats['modified']}"
scanned: "{now_stamp()}"
tags: [project/{project_name}, {file_type}, {lang}]
---

# {filepath.name}

| Property | Value |
|----------|-------|
| **Path** | `{rel_path}` |
| **Type** | {file_type} |
| **Language** | {lang} |
| **Size** | {stats['size']} bytes |
| **Last Modified** | {stats['modified']} |

## Content

```{lang}
{content}
```
"""
    return note


def create_project_index(project_name: str, files: list[Path]) -> str:
    """Create an index note for a project."""
    # Count file types
    code_files = [f for f in files if f.suffix in CODE_EXTENSIONS]
    doc_files = [f for f in files if f.suffix in DOC_EXTENSIONS]

    # Build file listing
    file_list_lines = []
    for f in sorted(files):
        rel = f.relative_to(SOURCE_DIR / project_name)
        note_name = f.name.replace(".", "-")
        file_list_lines.append(f"- [[{note_name}]] — `{rel}`")

    file_list = "\n".join(file_list_lines)

    note = f"""---
type: project-index
project: "{project_name}"
source: "{SOURCE_DIR / project_name}"
scanned: "{now_stamp()}"
total_files: {len(files)}
tags: [project/{project_name}, index]
---

# 🗂️ {project_name}

| Metric | Count |
|--------|-------|
| **Total Files** | {len(files)} |
| **Code Files** | {len(code_files)} |
| **Doc Files** | {len(doc_files)} |
| **Source** | `{SOURCE_DIR / project_name}` |

## 📄 Files

{file_list}
"""
    return note


# ─── Scanner ─────────────────────────────────────────────────────

def scan_projects():
    """Main scanner — walks SOURCE_DIR and creates notes."""
    print(f"🔍 Scanning: {SOURCE_DIR}")
    print(f"📁 Output:   {PROJECTS_DIR}")
    print()

    # Discover projects (top-level directories)
    projects = {}
    root_files = []

    for item in sorted(SOURCE_DIR.iterdir()):
        if should_skip(item):
            continue
        if item.is_dir():
            projects[item.name] = []
        elif item.is_file() and item.suffix in ALL_EXTENSIONS:
            root_files.append(item)

    # Collect files per project
    for project_name in projects:
        project_path = SOURCE_DIR / project_name
        for root, dirs, files in os.walk(project_path):
            root_path = Path(root)
            # Filter out skipped directories
            dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

            for fname in sorted(files):
                fpath = root_path / fname
                if fpath.name in SKIP_FILES:
                    continue
                if fpath.suffix in ALL_EXTENSIONS:
                    projects[project_name].append(fpath)

    # Create notes
    total_notes = 0

    # 1. Root-level files → Projects/_root/
    if root_files:
        root_out = PROJECTS_DIR / "_root"
        root_out.mkdir(parents=True, exist_ok=True)
        for fpath in root_files:
            note_content = create_file_note(fpath, "_root")
            note_name = fpath.name.replace(".", "-") + ".md"
            out_path = root_out / note_name
            out_path.write_text(note_content, encoding="utf-8")
            total_notes += 1
            print(f"  📝 {out_path.relative_to(VAULT_DIR)}")

    # 2. Each project → Projects/<project>/
    for project_name, files in sorted(projects.items()):
        if not files:
            print(f"  ⏭️  {project_name}/ — no matching files, skipping")
            continue

        project_out = PROJECTS_DIR / project_name
        project_out.mkdir(parents=True, exist_ok=True)

        # Create project index
        index_content = create_project_index(project_name, files)
        index_path = project_out / f"{project_name}.md"
        index_path.write_text(index_content, encoding="utf-8")
        total_notes += 1
        print(f"\n📦 {project_name}/ ({len(files)} files)")
        print(f"  📋 {index_path.relative_to(VAULT_DIR)}")

        # Create individual file notes
        for fpath in files:
            note_content = create_file_note(fpath, project_name)
            note_name = fpath.name.replace(".", "-") + ".md"
            out_path = project_out / note_name
            out_path.write_text(note_content, encoding="utf-8")
            total_notes += 1
            print(f"  📝 {out_path.relative_to(VAULT_DIR)}")

    print(f"\n✅ Done! Created {total_notes} notes in {PROJECTS_DIR.relative_to(VAULT_DIR)}/")
    print(f"   Open Obsidian and check the Projects/ folder.")


# ─── Entry ───────────────────────────────────────────────────────

if __name__ == "__main__":
    scan_projects()
