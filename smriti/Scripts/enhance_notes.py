#!/usr/bin/env python3
"""
Second Brain — Note Enhancer (Step 3)

Re-scans source files and produces enriched Markdown notes with:
  - Auto-generated summaries (heuristic)
  - Smart tags (framework/library detection)
  - File role classification (config, component, route, etc.)
  - Import/dependency links as Obsidian wikilinks
  - Project-level tech stack overview

Usage:
    python3 enhance_notes.py
"""

import os
import re
import datetime
from pathlib import Path
from collections import defaultdict

# ─── Configuration ───────────────────────────────────────────────
# SOURCE_DIR can be overridden by environment variable for CI/CD
SOURCE_DIR = Path(os.getenv("SMRITI_SOURCE_DIR", "/home/deepak/Work"))
# The vault is now the parent of the Scripts directory
VAULT_DIR = Path(__file__).parent.parent.resolve()
PROJECTS_DIR = VAULT_DIR / "Projects"

SKIP_DIRS = {
    ".git", ".obsidian", ".agent", "__pycache__", "node_modules",
    ".venv", "venv", "dist", "build", ".next", ".cache",
    ".wrangler", ".turbo", "coverage", "smriti",
}
SKIP_FILES = {
    ".DS_Store", "Thumbs.db", "package-lock.json",
    ".gitignore", ".env", ".env.local",
    "wrangler.toml", "wrangler.json",
}
CODE_EXTENSIONS = {
    ".py", ".js", ".ts", ".tsx", ".jsx", ".html", ".css",
    ".json", ".toml", ".yaml", ".yml", ".sh",
}
DOC_EXTENSIONS = {".md", ".txt", ".rst"}
ALL_EXTENSIONS = CODE_EXTENSIONS | DOC_EXTENSIONS
MAX_FILE_SIZE = 50 * 1024


# ─── Framework / Library Detection ──────────────────────────────

FRAMEWORK_PATTERNS = {
    # JavaScript / TypeScript
    "react":        [r"from\s+['\"]react['\"]", r"import\s+React", r"useState|useEffect|useRef"],
    "vite":         [r"vite", r"defineConfig.*vite"],
    "cloudflare-workers": [r"addEventListener\(['\"]fetch['\"]", r"export\s+default\s*\{.*fetch", r"wrangler"],
    "express":      [r"from\s+['\"]express['\"]", r"require\(['\"]express['\"]"],
    "hono":         [r"from\s+['\"]hono['\"]", r"new\s+Hono"],
    "tailwind":     [r"tailwindcss", r"@apply\s+"],
    "typescript":   [r":\s*(string|number|boolean|void|any)\b", r"interface\s+\w+", r"type\s+\w+\s*="],
    # Python
    "fastapi":      [r"from\s+fastapi", r"FastAPI\(\)"],
    "flask":        [r"from\s+flask", r"Flask\(__name__\)"],
    "django":       [r"from\s+django", r"INSTALLED_APPS"],
    # Config
    "docker":       [r"FROM\s+\w+", r"docker-compose"],
    "terraform":    [r"resource\s+\"", r"provider\s+\""],
    "ansible":      [r"hosts:", r"tasks:", r"become:\s*true"],
    "github-actions": [r"on:\s*\n\s*(push|pull_request)", r"runs-on:"],
}

ROLE_PATTERNS = {
    "config":     [r"config", r"wrangler", r"tsconfig", r"package\.json", r"vite\.config", r"\.toml$", r"\.yaml$", r"\.yml$"],
    "component":  [r"\.tsx$", r"\.jsx$", r"export\s+(default\s+)?function\s+\w+.*return\s*\("],
    "route":      [r"router\.", r"app\.(get|post|put|delete)", r"\[\[.*path\]\]"],
    "middleware":  [r"middleware", r"next\(\)", r"req,\s*res"],
    "utility":    [r"utils?\.(?:js|ts)$", r"helpers?\.(?:js|ts)$", r"lib/"],
    "style":      [r"\.css$"],
    "test":       [r"\.test\.", r"\.spec\.", r"describe\(", r"it\(.*should"],
    "script":     [r"\.sh$", r"scripts/", r"#!/"],
    "docs":       [r"\.md$", r"README", r"GUIDE", r"DEPLOYMENT", r"RUNBOOK"],
    "page":       [r"\.html$", r"pages/"],
    "service":    [r"service", r"Service\b", r"api\.", r"client\."],
    "worker":     [r"_worker\.", r"worker/", r"addEventListener.*fetch"],
    "auth":       [r"auth", r"login", r"session", r"token", r"jwt"],
    "deployment": [r"deploy", r"provision", r"install", r"\.yml$.*github"],
}


# ─── Helpers ─────────────────────────────────────────────────────

def now_stamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M")


def safe_read(filepath: Path) -> str:
    try:
        if filepath.stat().st_size > MAX_FILE_SIZE:
            return ""
        return filepath.read_text(encoding="utf-8", errors="replace")
    except Exception:
        return ""


def detect_language(ext: str) -> str:
    mapping = {
        ".py": "python", ".js": "javascript", ".ts": "typescript",
        ".tsx": "tsx", ".jsx": "jsx", ".html": "html", ".css": "css",
        ".json": "json", ".toml": "toml", ".yaml": "yaml",
        ".yml": "yaml", ".sh": "bash", ".md": "markdown",
        ".txt": "text", ".rst": "rst",
    }
    return mapping.get(ext, "text")


def get_file_stats(filepath: Path) -> dict:
    stat = filepath.stat()
    return {
        "size": stat.st_size,
        "modified": datetime.datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M"),
    }


# ─── Analysis Engine ────────────────────────────────────────────

def detect_frameworks(content: str, filepath: Path) -> list[str]:
    """Detect frameworks/libraries used in a file."""
    found = []
    combined = content + " " + str(filepath)
    for framework, patterns in FRAMEWORK_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, combined, re.IGNORECASE):
                found.append(framework)
                break
    return sorted(set(found))


def detect_role(content: str, filepath: Path) -> str:
    """Classify the file's role/purpose."""
    combined = content + " " + str(filepath)
    scores = {}
    for role, patterns in ROLE_PATTERNS.items():
        score = 0
        for pattern in patterns:
            if re.search(pattern, combined, re.IGNORECASE):
                score += 1
        if score > 0:
            scores[role] = score
    if scores:
        return max(scores, key=scores.get)
    return "other"


def extract_imports(content: str, ext: str) -> list[str]:
    """Extract import/require statements to find dependencies."""
    imports = []

    if ext in {".js", ".ts", ".tsx", ".jsx"}:
        # ES imports: import X from 'Y'
        for m in re.finditer(r"(?:import|export).*from\s+['\"]([^'\"]+)['\"]", content):
            imports.append(m.group(1))
        # require: require('Y')
        for m in re.finditer(r"require\(['\"]([^'\"]+)['\"]\)", content):
            imports.append(m.group(1))
    elif ext == ".py":
        # from X import Y  /  import X
        for m in re.finditer(r"(?:from\s+(\S+)\s+import|^import\s+(\S+))", content, re.MULTILINE):
            imports.append(m.group(1) or m.group(2))

    return imports


def extract_exports(content: str, ext: str) -> list[str]:
    """Extract exported functions/classes/variables."""
    exports = []

    if ext in {".js", ".ts", ".tsx", ".jsx"}:
        # export function/const/class
        for m in re.finditer(r"export\s+(?:default\s+)?(?:function|const|class|let|var)\s+(\w+)", content):
            exports.append(m.group(1))
        # module.exports
        for m in re.finditer(r"module\.exports\s*=\s*(?:\{([^}]+)\}|(\w+))", content):
            if m.group(1):
                exports.extend(re.findall(r"\w+", m.group(1)))
            elif m.group(2):
                exports.append(m.group(2))
    elif ext == ".py":
        # top-level def / class
        for m in re.finditer(r"^(?:def|class)\s+(\w+)", content, re.MULTILINE):
            exports.append(m.group(1))

    return exports


def count_lines(content: str) -> int:
    return len(content.splitlines()) if content else 0


def generate_summary(filepath: Path, content: str, role: str, frameworks: list[str], exports: list[str]) -> str:
    """Generate a brief human-readable summary of the file."""
    name = filepath.name
    ext = filepath.suffix
    lines = count_lines(content)

    parts = []

    # Role-based opener
    role_descriptions = {
        "config":     f"Configuration file for the project",
        "component":  f"UI component",
        "route":      f"Route handler / API endpoint",
        "middleware":  f"Middleware layer",
        "utility":    f"Utility / helper module",
        "style":      f"Stylesheet",
        "test":       f"Test suite",
        "script":     f"Automation script",
        "docs":       f"Documentation",
        "page":       f"Web page",
        "service":    f"Service / API client module",
        "worker":     f"Cloudflare Worker / background worker",
        "auth":       f"Authentication / authorization module",
        "deployment": f"Deployment / infrastructure config",
        "other":      f"Project file",
    }
    parts.append(role_descriptions.get(role, "Project file"))

    # Framework context
    if frameworks:
        parts.append(f"using **{', '.join(frameworks)}**")

    # Size context
    parts.append(f"({lines} lines)")

    summary = " ".join(parts) + "."

    # Exports
    if exports:
        top_exports = exports[:8]
        export_str = ", ".join(f"`{e}`" for e in top_exports)
        if len(exports) > 8:
            export_str += f", +{len(exports) - 8} more"
        summary += f"\n\n**Key exports:** {export_str}"

    return summary


# ─── Note Generation ────────────────────────────────────────────

def get_parent_name(project_name: str) -> str:
    """If project is a monorepo child (e.g. 'nisha-chitragupta'), return parent ('nisha')."""
    for parent in MONOREPO_SERVICE_DIRS:
        if project_name.startswith(f"{parent}-"):
            return parent
    return ""


def build_note(filepath: Path, project_name: str, all_files_in_project: list[Path]) -> str:
    """Create an enhanced Markdown note for a file."""
    rel_path = filepath.relative_to(SOURCE_DIR)
    stats = get_file_stats(filepath)
    ext = filepath.suffix
    lang = detect_language(ext)
    content = safe_read(filepath)

    # Analysis
    frameworks = detect_frameworks(content, filepath)
    role = detect_role(content, filepath)
    imports = extract_imports(content, ext)
    exports = extract_exports(content, ext)
    summary = generate_summary(filepath, content, role, frameworks, exports)
    lines = count_lines(content)

    # Build tags — include parent tag for monorepo children
    parent = get_parent_name(project_name)
    tags = [f"project/{project_name}", role]
    if parent:
        tags.append(f"parent/{parent}")
    if ext in DOC_EXTENSIONS:
        tags.append("documentation")
    else:
        tags.append("code")
    tags.append(lang)
    tags.extend(frameworks)
    tags = sorted(set(tags))

    # Build related files (wikilinks for local imports)
    related_links = []
    for imp in imports:
        # Check if import points to a local file in the same project
        imp_base = imp.split("/")[-1]
        for other in all_files_in_project:
            other_stem = other.stem
            if imp_base == other_stem or imp_base == other.name:
                note_name = other.name.replace(".", "-")
                related_links.append(f"[[{note_name}]]")
                break

    # Format content - truncate very large files for readability
    if content and len(content) > MAX_FILE_SIZE:
        display_content = "[File too large — skipped]"
    elif not content:
        display_content = "[Could not read file]"
    else:
        display_content = content

    # Assemble note
    tags_str = ", ".join(tags)
    frameworks_str = ", ".join(frameworks) if frameworks else "—"
    related_str = ", ".join(sorted(set(related_links))) if related_links else "—"

    # Parent link for monorepo children
    parent_line = ""
    if parent:
        parent_line = f'parent: "{parent}"\n'

    parent_link_section = ""
    if parent:
        parent_link_section = f"\n**Part of:** [[{parent}]]\n"

    note = f"""---
source: "{filepath}"
project: "{project_name}"
{parent_line}role: {role}
language: {lang}
frameworks: [{', '.join(frameworks)}]
lines: {lines}
size: {stats['size']} bytes
last_modified: "{stats['modified']}"
scanned: "{now_stamp()}"
tags: [{tags_str}]
---

# {filepath.name}
{parent_link_section}
> {summary}

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `{rel_path}` |
| **Role** | {role} |
| **Language** | {lang} |
| **Frameworks** | {frameworks_str} |
| **Lines** | {lines} |
| **Size** | {stats['size']} bytes |
| **Modified** | {stats['modified']} |

## 🔗 Related Files

{related_str}

## 📄 Content

```{lang}
{display_content}
```
"""
    return note


def build_project_index(project_name: str, source_root: Path, files: list[Path], all_analyses: dict) -> str:
    """Create an enriched project index with tech stack overview."""
    parent = get_parent_name(project_name)

    # Aggregate data across all files
    all_frameworks = set()
    all_roles = defaultdict(list)
    total_lines = 0
    code_files = []
    doc_files = []

    for f in files:
        info = all_analyses.get(str(f), {})
        all_frameworks.update(info.get("frameworks", []))
        role = info.get("role", "other")
        note_name = f.name.replace(".", "-")
        all_roles[role].append((f, note_name))
        total_lines += info.get("lines", 0)
        if f.suffix in CODE_EXTENSIONS:
            code_files.append(f)
        else:
            doc_files.append(f)

    frameworks_str = ", ".join(f"`{fw}`" for fw in sorted(all_frameworks)) if all_frameworks else "—"

    # Tags — include parent for sub-projects
    index_tags = [f"project/{project_name}", "index"]
    if parent:
        index_tags.append(f"parent/{parent}")
    index_tags_str = ", ".join(index_tags)

    # Build role-grouped file listing
    role_sections = []
    role_icons = {
        "component": "🧩", "route": "🛤️", "config": "⚙️",
        "middleware": "🔌", "utility": "🔧", "style": "🎨",
        "test": "🧪", "script": "📜", "docs": "📖",
        "page": "📄", "service": "🌐", "worker": "⚡",
        "auth": "🔐", "deployment": "🚀", "other": "📁",
    }

    for role in sorted(all_roles.keys()):
        items = all_roles[role]
        icon = role_icons.get(role, "📁")
        lines = [f"### {icon} {role.title()} ({len(items)})"]
        for f, note_name in sorted(items, key=lambda x: x[0].name):
            rel = f.relative_to(source_root)
            lines.append(f"- [[{note_name}]] — `{rel}`")
        role_sections.append("\n".join(lines))

    grouped_listing = "\n\n".join(role_sections)

    # Parent link
    parent_line_yaml = f'parent: "{parent}"\n' if parent else ""
    parent_link_md = f"\n**Part of:** [[{parent}]]\n" if parent else ""

    note = f"""---
type: project-index
project: "{project_name}"
{parent_line_yaml}source: "{source_root}"
scanned: "{now_stamp()}"
total_files: {len(files)}
total_lines: {total_lines}
tags: [{index_tags_str}]
---

# 🗂️ {project_name}
{parent_link_md}
## 📊 Overview

| Metric | Value |
|--------|-------|
| **Total Files** | {len(files)} |
| **Code Files** | {len(code_files)} |
| **Doc Files** | {len(doc_files)} |
| **Total Lines** | {total_lines:,} |
| **Tech Stack** | {frameworks_str} |
| **Source** | `{source_root}` |

## 📂 Files by Role

{grouped_listing}
"""
    return note


# ─── Monorepo Detection ─────────────────────────────────────────

# Directories inside certain projects that should be treated as
# separate projects.  Format: { "top-level-dir": "subpath/to/services" }
MONOREPO_SERVICE_DIRS = {
    "nisha": "services",
}


# ─── Main Scanner ────────────────────────────────────────────────

def collect_files(root_path: Path) -> list[Path]:
    """Walk a directory and return all matching files."""
    results = []
    for root, dirs, files in os.walk(root_path):
        rp = Path(root)
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in sorted(files):
            fpath = rp / fname
            if fpath.name in SKIP_FILES:
                continue
            if fpath.suffix in ALL_EXTENSIONS:
                results.append(fpath)
    return results


def discover_projects() -> dict[str, tuple[Path, list[Path]]]:
    """Discover projects, promoting monorepo sub-services to top-level.

    Returns dict of { display_name: (source_root, [files]) }
    """
    projects: dict[str, tuple[Path, list[Path]]] = {}

    for item in sorted(SOURCE_DIR.iterdir()):
        if item.name in SKIP_DIRS or not item.is_dir():
            continue

        # Check if this is a monorepo with sub-services
        if item.name in MONOREPO_SERVICE_DIRS:
            services_subdir = item / MONOREPO_SERVICE_DIRS[item.name]

            # Collect files that belong to the parent project (NOT in services/)
            parent_files = []
            for root, dirs, files in os.walk(item):
                rp = Path(root)
                dirs[:] = [d for d in dirs if d not in SKIP_DIRS]

                # Skip the services directory — those become their own projects
                if services_subdir.is_dir():
                    try:
                        rp.relative_to(services_subdir)
                        continue  # This path is inside services/, skip it
                    except ValueError:
                        pass  # Not inside services/, include it

                for fname in sorted(files):
                    fpath = rp / fname
                    if fpath.name in SKIP_FILES:
                        continue
                    if fpath.suffix in ALL_EXTENSIONS:
                        parent_files.append(fpath)

            if parent_files:
                projects[item.name] = (item, parent_files)

            # Promote each service subdirectory as its own project
            if services_subdir.is_dir():
                for svc in sorted(services_subdir.iterdir()):
                    if svc.is_dir() and svc.name not in SKIP_DIRS:
                        svc_name = f"{item.name}-{svc.name}"
                        svc_files = collect_files(svc)
                        if svc_files:
                            projects[svc_name] = (svc, svc_files)
        else:
            # Normal flat project
            files = collect_files(item)
            if files:
                projects[item.name] = (item, files)

    return projects


def run():
    print(f"🔍 Enhanced scan: {SOURCE_DIR}")
    print(f"📁 Output:        {PROJECTS_DIR}")
    print()

    # Discover projects (with monorepo expansion)
    projects = discover_projects()

    # Collect root-level files
    root_files = [
        f for f in sorted(SOURCE_DIR.iterdir())
        if f.is_file() and f.suffix in ALL_EXTENSIONS and f.name not in SKIP_FILES
    ]

    total_notes = 0

    # Process root files
    if root_files:
        root_out = PROJECTS_DIR / "_root"
        root_out.mkdir(parents=True, exist_ok=True)
        for fpath in root_files:
            note = build_note(fpath, "_root", root_files)
            note_name = fpath.name.replace(".", "-") + ".md"
            (root_out / note_name).write_text(note, encoding="utf-8")
            total_notes += 1
            print(f"  📝 _root/{note_name}")

    # Process each project
    for project_name, (source_root, files) in sorted(projects.items()):
        project_out = PROJECTS_DIR / project_name
        project_out.mkdir(parents=True, exist_ok=True)

        # First pass: analyze all files
        analyses = {}
        for fpath in files:
            content = safe_read(fpath)
            ext = fpath.suffix
            frameworks = detect_frameworks(content, fpath)
            role = detect_role(content, fpath)
            exports = extract_exports(content, ext)
            lines = count_lines(content)
            analyses[str(fpath)] = {
                "frameworks": frameworks,
                "role": role,
                "exports": exports,
                "lines": lines,
            }

        # Second pass: generate enhanced notes
        print(f"\n📦 {project_name}/ ({len(files)} files)  ← {source_root}")

        # Project index
        index = build_project_index(project_name, source_root, files, analyses)
        index_path = project_out / f"{project_name}.md"
        index_path.write_text(index, encoding="utf-8")
        total_notes += 1
        print(f"  📋 {project_name}/{project_name}.md (index)")

        # Individual notes
        for fpath in files:
            note = build_note(fpath, project_name, files)
            note_name = fpath.name.replace(".", "-") + ".md"
            (project_out / note_name).write_text(note, encoding="utf-8")
            total_notes += 1

        # Print role summary
        role_counts = defaultdict(int)
        for info in analyses.values():
            role_counts[info["role"]] += 1
        role_summary = " | ".join(f"{r}: {c}" for r, c in sorted(role_counts.items()))
        print(f"  🏷️  Roles → {role_summary}")

        # Print frameworks
        all_fw = set()
        for info in analyses.values():
            all_fw.update(info["frameworks"])
        if all_fw:
            print(f"  🔧 Stack → {', '.join(sorted(all_fw))}")

    # ─── Generate parent hub notes for monorepos ────────────────
    for parent_name, services_subpath in MONOREPO_SERVICE_DIRS.items():
        # Find all child projects for this parent
        children = [pn for pn in projects if pn.startswith(f"{parent_name}-")]
        if not children:
            continue

        # Build child listing with wikilinks
        child_links = []
        for child in sorted(children):
            child_display = child.replace(f"{parent_name}-", "")
            _, (src, files) = child, projects[child]
            child_links.append(f"- [[{child}]] — **{child_display}** ({len(files)} files)")
        child_listing = "\n".join(child_links)

        # Count totals across all children
        total_child_files = sum(len(projects[c][1]) for c in children)

        hub_note = f"""---
type: parent-index
project: "{parent_name}"
children: [{', '.join(children)}]
scanned: "{now_stamp()}"
tags: [parent/{parent_name}, index]
---

# 🏗️ {parent_name} (Ecosystem)

> Parent project containing {len(children)} sub-projects and {total_child_files} total files.

## 🧩 Sub-Projects

{child_listing}

## 📂 Core Files

See [[{parent_name}]] project index for files outside of services.
"""
        # Write hub note at Projects level (not inside a subfolder)
        hub_path = PROJECTS_DIR / f"{parent_name}.md"
        hub_path.write_text(hub_note, encoding="utf-8")
        total_notes += 1
        print(f"\n🏗️  Created parent hub: Projects/{parent_name}.md → links to {children}")

    # ─── Write Obsidian graph color config ───────────────────────
    import json

    graph_colors = [
        {"query": "tag:#parent/nisha",       "color": {"a": 1, "rgb": 14423100}},  # #DC2626 red
        {"query": "tag:#project/nisha ",      "color": {"a": 1, "rgb": 16750848}},  # #FF9500 orange
        {"query": "tag:#project/narad",       "color": {"a": 1, "rgb": 5025616}},   # #4CAF50 green
        {"query": "tag:#project/social-blueprint-ai", "color": {"a": 1, "rgb": 4359924}},  # #428AF4 blue
        {"query": "tag:#index",               "color": {"a": 1, "rgb": 16776960}},  # #FFFF00 yellow
    ]

    graph_config = {
        "collapse-filter": False,
        "search": "",
        "showTags": False,
        "showAttachments": False,
        "hideUnresolved": False,
        "showOrphans": True,
        "collapse-color-groups": False,
        "colorGroups": graph_colors,
        "collapse-display": False,
        "showArrow": True,
        "textFadeMultiplier": 0,
        "nodeSizeMultiplier": 1,
        "lineSizeMultiplier": 1,
        "collapse-forces": True,
        "centerStrength": 0.518713248970312,
        "repelStrength": 10,
        "linkStrength": 1,
        "linkDistance": 250,
    }

    graph_path = VAULT_DIR / ".obsidian" / "graph.json"
    graph_path.write_text(json.dumps(graph_config, indent=2), encoding="utf-8")
    print(f"\n🎨 Wrote Obsidian graph config: .obsidian/graph.json")
    print(f"   Color groups: nisha children (red), nisha core (orange), narad (green), social-blueprint-ai (blue), indexes (yellow)")

    print(f"\n✅ Done! Enhanced {total_notes} notes in Projects/")
    print(f"   Notes now include: summaries, role tags, tech stack, related links")
    print(f"   Monorepo services promoted: {list(MONOREPO_SERVICE_DIRS.keys())}")


if __name__ == "__main__":
    run()
