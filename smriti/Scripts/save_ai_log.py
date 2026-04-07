#!/usr/bin/env python3
"""
Second Brain — AI Conversation Logger (Step 5)

Saves AI conversations as structured Markdown notes in the vault's AI-Logs/.

Usage:
    # Interactive mode — opens editor or prompts for input
    python3 save_ai_log.py

    # Quick save with title and content
    python3 save_ai_log.py --title "Docker networking" --content "Key insight..."

    # Save from a file
    python3 save_ai_log.py --title "React patterns" --file conversation.txt

    # Pipe from clipboard or other tools
    xclip -o | python3 save_ai_log.py --title "API design"

    # Specify AI source
    python3 save_ai_log.py --source chatgpt --title "SQL optimization"

    # Add custom tags
    python3 save_ai_log.py --title "K8s setup" --tags devops,kubernetes
"""

import os
import sys
import re
import argparse
import datetime
from pathlib import Path

# ─── Configuration ───────────────────────────────────────────────
VAULT_DIR = Path("/home/deepak/SecondBrain")
AI_LOGS_DIR = VAULT_DIR / "AI-Logs"

SOURCES = ["claude", "chatgpt", "gemini", "copilot", "local-llm", "other"]
DEFAULT_SOURCE = "claude"


# ─── Helpers ─────────────────────────────────────────────────────

def now_stamp():
    return datetime.datetime.now().strftime("%Y-%m-%d %H:%M")


def date_stamp():
    return datetime.datetime.now().strftime("%Y-%m-%d")


def slug(text: str) -> str:
    """Convert text to a filename-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text[:80].strip("-")


def extract_title_from_content(content: str) -> str:
    """Try to extract a title from the first meaningful line of content."""
    for line in content.splitlines():
        line = line.strip()
        if not line:
            continue
        # Skip markdown headers
        clean = re.sub(r"^#+\s*", "", line)
        # Skip role prefixes
        clean = re.sub(r"^(User|Human|Assistant|AI|Claude|ChatGPT|System):\s*", "", clean, flags=re.IGNORECASE)
        if len(clean) > 5:
            # Truncate to first sentence or 60 chars
            clean = re.split(r"[.!?]", clean)[0]
            return clean[:60].strip()
    return "Untitled conversation"


def detect_conversation_structure(content: str) -> str:
    """Try to format raw conversation text into a cleaner structure."""
    lines = content.splitlines()
    formatted = []
    in_code_block = False

    for line in lines:
        # Track code blocks
        if line.strip().startswith("```"):
            in_code_block = not in_code_block
            formatted.append(line)
            continue

        if in_code_block:
            formatted.append(line)
            continue

        # Detect speaker turns and format them
        speaker_match = re.match(
            r"^(User|Human|Me|Assistant|AI|Claude|ChatGPT|Gemini|Copilot|System)\s*[:>]\s*(.*)",
            line,
            re.IGNORECASE,
        )
        if speaker_match:
            speaker = speaker_match.group(1).title()
            text = speaker_match.group(2)
            if speaker.lower() in ("user", "human", "me"):
                formatted.append(f"\n**🧑 You:** {text}")
            else:
                formatted.append(f"\n**🤖 {speaker}:** {text}")
        else:
            formatted.append(line)

    return "\n".join(formatted)


# ─── Note Generation ────────────────────────────────────────────

def create_ai_log(title: str, content: str, source: str, tags: list[str]) -> tuple[Path, str]:
    """Create a structured AI conversation note.

    Returns (filepath, note_content).
    """
    # Build filename: YYYY-MM-DD-slug.md
    date = date_stamp()
    filename = f"{date}-{slug(title)}.md"
    filepath = AI_LOGS_DIR / filename

    # Avoid overwriting — append counter if needed
    counter = 1
    while filepath.exists():
        counter += 1
        filename = f"{date}-{slug(title)}-{counter}.md"
        filepath = AI_LOGS_DIR / filename

    # Format content
    formatted_content = detect_conversation_structure(content)

    # Build tags
    all_tags = ["ai-log", f"source/{source}"] + [t.strip() for t in tags if t.strip()]
    tags_str = ", ".join(all_tags)

    # Word count
    word_count = len(content.split())

    note = f"""---
title: "{title}"
source: {source}
date: "{now_stamp()}"
word_count: {word_count}
tags: [{tags_str}]
---

# 🤖 {title}

| Property | Value |
|----------|-------|
| **Source** | {source} |
| **Date** | {now_stamp()} |
| **Words** | {word_count:,} |

## 💬 Conversation

{formatted_content}

---

## 📝 Key Takeaways

> [Add your key takeaways here after reviewing the conversation]

## 🔗 Related

> [Link to related projects or notes, e.g. [[project-name]] ]
"""
    return filepath, note


# ─── Input Methods ───────────────────────────────────────────────

def read_from_stdin() -> str:
    """Read piped input from stdin."""
    if not sys.stdin.isatty():
        return sys.stdin.read()
    return ""


def read_from_file(path: str) -> str:
    """Read content from a file."""
    p = Path(path)
    if not p.exists():
        print(f"❌ File not found: {path}")
        sys.exit(1)
    return p.read_text(encoding="utf-8", errors="replace")


def read_interactive() -> str:
    """Prompt user for multi-line input."""
    print("\n📝 Paste your AI conversation below.")
    print("   When done, press Enter on an empty line, then Ctrl+D (or type 'END' on a new line).\n")
    print("---")

    lines = []
    try:
        while True:
            line = input()
            if line.strip().upper() == "END":
                break
            lines.append(line)
    except EOFError:
        pass

    return "\n".join(lines)


# ─── Entry ───────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="Save AI conversations to your Second Brain",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python3 save_ai_log.py
  python3 save_ai_log.py --title "Docker tips" --content "Key insight here"
  python3 save_ai_log.py --title "React patterns" --file chat.txt
  python3 save_ai_log.py --title "SQL tips" --source chatgpt --tags sql,database
  xclip -o | python3 save_ai_log.py --title "Clipboard conversation"
        """,
    )
    parser.add_argument("--title", "-t", help="Title for the note (auto-detected if omitted)")
    parser.add_argument("--content", "-c", help="Conversation content as a string")
    parser.add_argument("--file", "-f", help="Read conversation from a file")
    parser.add_argument("--source", "-s", default=DEFAULT_SOURCE, choices=SOURCES, help=f"AI source (default: {DEFAULT_SOURCE})")
    parser.add_argument("--tags", help="Comma-separated tags (e.g. python,docker)")
    parser.add_argument("--list", "-l", action="store_true", help="List recent AI logs")
    args = parser.parse_args()

    # List mode
    if args.list:
        logs = sorted(AI_LOGS_DIR.glob("*.md"), reverse=True)
        logs = [l for l in logs if l.name != "README.md"]
        if not logs:
            print("📭 No AI logs yet.")
            return
        print(f"\n📋 Recent AI Logs ({len(logs)} total):\n")
        for log in logs[:15]:
            size = log.stat().st_size
            print(f"  📝 {log.name}  ({size:,} bytes)")
        if len(logs) > 15:
            print(f"  ... and {len(logs) - 15} more")
        return

    # Get content
    content = ""
    if args.content:
        content = args.content
    elif args.file:
        content = read_from_file(args.file)
    else:
        # Try stdin pipe first
        piped = read_from_stdin()
        if piped:
            content = piped
        else:
            content = read_interactive()

    if not content.strip():
        print("❌ No content provided. Nothing to save.")
        sys.exit(1)

    # Get title
    title = args.title or extract_title_from_content(content)

    # Get tags
    tags = args.tags.split(",") if args.tags else []

    # Create and save
    filepath, note = create_ai_log(title, content, args.source, tags)
    AI_LOGS_DIR.mkdir(parents=True, exist_ok=True)
    filepath.write_text(note, encoding="utf-8")

    print(f"\n✅ Saved AI conversation:")
    print(f"   📝 {filepath.relative_to(VAULT_DIR)}")
    print(f"   📌 Title:  {title}")
    print(f"   🤖 Source: {args.source}")
    print(f"   📊 Words:  {len(content.split()):,}")
    if tags:
        print(f"   🏷️  Tags:   {', '.join(tags)}")
    print(f"\n   Open in Obsidian: AI-Logs/{filepath.name}")


if __name__ == "__main__":
    main()
