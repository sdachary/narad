#!/usr/bin/env python3
"""
Second Brain — File Watcher (Step 4)

Monitors /home/deepak/Work for file changes and:
  1. Re-generates the Obsidian note for changed/new files
  2. Removes notes for deleted files
  3. Logs every change to Inbox/Changelog.md

Uses only the standard library (polling-based, no watchdog needed).

Usage:
    python3 file_watcher.py              # Run in foreground
    python3 file_watcher.py --daemon      # Run in background
    python3 file_watcher.py --interval 10 # Custom poll interval (seconds)
"""

import os
import sys
import time
import signal
import argparse
import datetime
from pathlib import Path

# ─── Import the enhancer's analysis functions ───────────────────
# We reuse the analysis engine from enhance_notes.py
sys.path.insert(0, str(Path(__file__).parent))
from enhance_notes import (
    SOURCE_DIR, VAULT_DIR, PROJECTS_DIR, MONOREPO_SERVICE_DIRS,
    SKIP_DIRS, SKIP_FILES, ALL_EXTENSIONS,
    build_note, collect_files, get_parent_name,
    safe_read, detect_frameworks, detect_role, extract_exports, count_lines,
)

# ─── Configuration ───────────────────────────────────────────────
CHANGELOG_PATH = VAULT_DIR / "Inbox" / "Changelog.md"
STATE_FILE = Path(__file__).parent / ".watcher_state.json"
DEFAULT_INTERVAL = 5  # seconds

# ─── State Management ───────────────────────────────────────────

def load_state() -> dict[str, float]:
    """Load the last-known file modification times."""
    import json
    if STATE_FILE.exists():
        try:
            return json.loads(STATE_FILE.read_text())
        except Exception:
            return {}
    return {}


def save_state(state: dict[str, float]):
    """Persist current file modification times."""
    import json
    STATE_FILE.write_text(json.dumps(state, indent=2))


# ─── Project Resolution ─────────────────────────────────────────

def resolve_project(filepath: Path) -> tuple[str, Path]:
    """Determine which project a file belongs to and return (project_name, source_root).

    Handles monorepo sub-projects (e.g., nisha/services/chitragupta → nisha-chitragupta).
    """
    try:
        rel = filepath.relative_to(SOURCE_DIR)
    except ValueError:
        return ("_root", SOURCE_DIR)

    parts = rel.parts

    if len(parts) < 1:
        return ("_root", SOURCE_DIR)

    top_dir = parts[0]

    # Check if it's inside a monorepo service
    if top_dir in MONOREPO_SERVICE_DIRS and len(parts) >= 3:
        services_subpath = MONOREPO_SERVICE_DIRS[top_dir]
        if parts[1] == services_subpath:
            svc_name = parts[2]
            project_name = f"{top_dir}-{svc_name}"
            source_root = SOURCE_DIR / top_dir / services_subpath / svc_name
            return (project_name, source_root)

    # Normal project
    if (SOURCE_DIR / top_dir).is_dir():
        return (top_dir, SOURCE_DIR / top_dir)

    # Root-level file
    return ("_root", SOURCE_DIR)


def note_path_for(filepath: Path) -> Path:
    """Get the vault note path for a source file."""
    project_name, _ = resolve_project(filepath)
    note_name = filepath.name.replace(".", "-") + ".md"
    return PROJECTS_DIR / project_name / note_name


# ─── Scanning ───────────────────────────────────────────────────

def scan_all_files() -> dict[str, float]:
    """Scan SOURCE_DIR and return {filepath_str: mtime} for all tracked files."""
    files = {}
    for root, dirs, filenames in os.walk(SOURCE_DIR):
        root_path = Path(root)
        dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
        for fname in filenames:
            fpath = root_path / fname
            if fname in SKIP_FILES:
                continue
            if fpath.suffix not in ALL_EXTENSIONS:
                continue
            try:
                files[str(fpath)] = fpath.stat().st_mtime
            except OSError:
                continue
    return files


# ─── Change Handling ─────────────────────────────────────────────

def log_change(action: str, filepath: Path, project_name: str):
    """Append an entry to the changelog."""
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    note_name = filepath.name.replace(".", "-")
    rel_path = filepath.relative_to(SOURCE_DIR)

    entry = f"- `{now}` **{action}** → [[{note_name}]] `{rel_path}` (project: {project_name})\n"

    # Create changelog if it doesn't exist
    if not CHANGELOG_PATH.exists():
        header = """---
type: changelog
tags: [changelog, automation]
---

# 📋 Changelog

Auto-generated log of file changes detected by the watcher.

---

"""
        CHANGELOG_PATH.write_text(header, encoding="utf-8")

    # Append entry
    with open(CHANGELOG_PATH, "a", encoding="utf-8") as f:
        f.write(entry)


def handle_created(filepath: Path):
    """Handle a newly created file."""
    project_name, source_root = resolve_project(filepath)

    # Gather sibling files for related-file linking
    siblings = collect_files(source_root)

    note_content = build_note(filepath, project_name, siblings)
    out_path = note_path_for(filepath)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(note_content, encoding="utf-8")

    log_change("CREATED", filepath, project_name)
    print(f"  ✅ CREATED  {filepath.relative_to(SOURCE_DIR)} → {out_path.relative_to(VAULT_DIR)}")


def handle_modified(filepath: Path):
    """Handle a modified file."""
    project_name, source_root = resolve_project(filepath)
    siblings = collect_files(source_root)

    note_content = build_note(filepath, project_name, siblings)
    out_path = note_path_for(filepath)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(note_content, encoding="utf-8")

    log_change("MODIFIED", filepath, project_name)
    print(f"  📝 MODIFIED {filepath.relative_to(SOURCE_DIR)} → {out_path.relative_to(VAULT_DIR)}")


def handle_deleted(filepath: Path):
    """Handle a deleted file."""
    project_name, _ = resolve_project(filepath)
    out_path = note_path_for(filepath)

    if out_path.exists():
        out_path.unlink()

    log_change("DELETED", filepath, project_name)
    print(f"  🗑️  DELETED  {filepath.relative_to(SOURCE_DIR)}")


# ─── Main Loop ───────────────────────────────────────────────────

def watch(interval: int):
    """Main polling loop — compares snapshots to detect changes."""
    print(f"👁️  Second Brain Watcher")
    print(f"   Monitoring: {SOURCE_DIR}")
    print(f"   Output:     {PROJECTS_DIR}")
    print(f"   Changelog:  {CHANGELOG_PATH}")
    print(f"   Interval:   {interval}s")
    print(f"   Press Ctrl+C to stop\n")

    # Load or build initial state
    old_state = load_state()
    if not old_state:
        print("   📸 Building initial snapshot...")
        old_state = scan_all_files()
        save_state(old_state)
        print(f"   📸 Tracking {len(old_state)} files\n")

    cycle = 0
    try:
        while True:
            time.sleep(interval)
            cycle += 1

            new_state = scan_all_files()

            # Detect changes
            old_keys = set(old_state.keys())
            new_keys = set(new_state.keys())

            created = new_keys - old_keys
            deleted = old_keys - new_keys
            common = old_keys & new_keys
            modified = {f for f in common if new_state[f] != old_state[f]}

            if not (created or deleted or modified):
                # Silent polling — only print heartbeat every 60 cycles
                if cycle % (60 // max(interval, 1)) == 0:
                    now = datetime.datetime.now().strftime("%H:%M:%S")
                    print(f"   💓 {now} — watching ({len(new_state)} files)")
                continue

            # Process changes
            now_str = datetime.datetime.now().strftime("%H:%M:%S")
            total_changes = len(created) + len(modified) + len(deleted)
            print(f"\n🔔 [{now_str}] {total_changes} change(s) detected:")

            for f in sorted(created):
                try:
                    handle_created(Path(f))
                except Exception as e:
                    print(f"  ⚠️  Error processing {f}: {e}")

            for f in sorted(modified):
                try:
                    handle_modified(Path(f))
                except Exception as e:
                    print(f"  ⚠️  Error processing {f}: {e}")

            for f in sorted(deleted):
                try:
                    handle_deleted(Path(f))
                except Exception as e:
                    print(f"  ⚠️  Error processing {f}: {e}")

            # Save new state
            old_state = new_state
            save_state(old_state)
            print()

    except KeyboardInterrupt:
        print("\n\n👋 Watcher stopped.")
        save_state(old_state)


# ─── Daemon Mode ─────────────────────────────────────────────────

def daemonize():
    """Fork into background (Unix only)."""
    pid = os.fork()
    if pid > 0:
        print(f"🚀 Watcher started in background (PID: {pid})")
        print(f"   To stop: kill {pid}")
        # Save PID for convenience
        pid_file = Path(__file__).parent / ".watcher.pid"
        pid_file.write_text(str(pid))
        sys.exit(0)

    # Child process
    os.setsid()
    # Redirect stdout/stderr to log file
    log_file = Path(__file__).parent / "watcher.log"
    sys.stdout = open(log_file, "a")
    sys.stderr = sys.stdout
    print(f"\n--- Watcher started at {datetime.datetime.now()} ---")


# ─── Entry ───────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Second Brain File Watcher")
    parser.add_argument("--daemon", action="store_true", help="Run in background")
    parser.add_argument("--interval", type=int, default=DEFAULT_INTERVAL, help="Poll interval in seconds")
    parser.add_argument("--reset", action="store_true", help="Reset state and rebuild snapshot")
    args = parser.parse_args()

    if args.reset:
        if STATE_FILE.exists():
            STATE_FILE.unlink()
        print("🔄 State reset. Will rebuild snapshot on next run.")
        sys.exit(0)

    if args.daemon:
        daemonize()

    watch(args.interval)
