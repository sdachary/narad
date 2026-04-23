# Obsidian Setup Guide for Narad Second Brain

This guide helps you set up Obsidian as your local "Second Brain" for the narad project.

---

## What is Obsidian?

Obsidian is a powerful knowledge base that works on local Markdown files. It provides:
- 🗺️ Interactive graph view of your notes
- 🔍 Instant search across all files
- 🔗 Wikilinks support (`[[note-name]]`)
- 📱 Works completely offline
- 🎨 Highly customizable

---

## Step 1: Install Obsidian

### macOS
```bash
brew install --cask obsidian
```

### Linux
```bash
# Download AppImage from https://obsidian.md
chmod +x Obsidian-*.AppImage
./Obsidian-*.AppImage
```

### Windows
Download from: https://obsidian.md/download

---

## Step 2: Open the Narad Smriti Vault

1. Open Obsidian
2. Click **Open Vault**
3. Select: `/home/deepak/Work/narad/smriti/`

Or from terminal:
```bash
# macOS
open -a Obsidian /home/deepak/Work/narad/smriti/

# Linux
obsidian /home/deepak/Work/narad/smriti/
```

---

## Step 3: Recommended Obsidian Settings

### Enable Graph View
1. Open a note
2. Press `Ctrl+P` (or `Cmd+P` on Mac)
3. Type "graph" and select "Open local graph"
4. Or use the ribbon button (bottom left)

### Recommended Plugins (Optional)

Install from Settings → Plugins → Browse:

| Plugin | Purpose |
|--------|---------|
| **Dataview** | Query and organize notes with code |
| **Templater** | Auto-create notes from templates |
| **Obsidian Git** | Auto-backup to Git |
| **Advanced Tables** | Better table editing |

### Quick Settings
- **Editor** → Default view: Reading view
- **Appearance** → Theme: Dark (or your preference)
- **Core Plugins** → Enable: Slash commands, File recovery

---

## Step 4: Understanding Your Smriti Structure

```
narad/smriti/
├── Home.md              # Entry point
├── Inbox/               # Quick capture notes
│   └── Changelog.md
├── Knowledge/           # Research & learnings (moved to Znext)
├── Projects/            # Project-specific notes
│   ├── narad/           # AI Workspace
│   │   └── SUMMARY.md   # One-page overview
│   ├── vishwakarma/     # Cloud provisioning
│   ├── chitragupta/     # Auth & analytics
│   ├── karma/           # Compute marketplace
│   ├── kanak/           # Inventory & billing
│   └── unnati/          # Career hunt assistant
└── Scripts/             # Automation scripts
```

---

## Step 5: Using the Graph View

### Local Graph (One Note)
1. Open any note
2. Click the graph icon in the ribbon (bottom left)
3. Shows: All links from/to current note

### Graph View (All Notes)
1. Press `Ctrl+P` → "graph view"
2. Shows: Entire vault as interactive graph
3. **Controls:**
   - Scroll: Zoom in/out
   - Drag: Move the graph
   - Click node: Open note
   - Right-click: Show in Finder

### Graph Colors
- **Center node**: Currently open note
- **Connected nodes**: Notes linked to current note
- **Other nodes**: Rest of your vault

---

## Step 6: Creating New Notes

### Quick Create
- Press `Ctrl+N` (new note)
- Press `Ctrl+Shift+N` (new note in specific folder)

### Using Templates
1. Create a note
2. Type `tp` and press Tab (if Templater installed)

### Template Example (for new project)
```markdown
---
project: 
status: planning
created: {{date:YYYY-MM-DD}}
tags: []
---

# {{project}}

## Overview


## Key Files


## API Endpoints


## Next Steps

- [ ] 
```

---

## Step 7: Linking Notes

### Wikilinks
```markdown
See [[vishwakarma]] for cloud provisioning details.
```

### Links with Display Text
```markdown
Learn more about [[vishwakarma|cloud infrastructure]].
```

### Backlinks
- Obsidian automatically shows "Backlinks" (notes that link to current note)
- Check the bottom of any note for backlinks panel

---

## Step 8: Search & Navigation

### Quick Switcher
- Press `Ctrl+O` (or `Cmd+O`)
- Type note name → Enter to open

### Command Palette
- Press `Ctrl+P` (or `Cmd+P`)
- Search any command

### Global Search
- Press `Ctrl+Shift+F` (or `Cmd+Shift+F`)
- Search across all notes

---

## Step 9: Sync with Git (Optional)

### Option A: Obsidian Git Plugin
1. Install "Obsidian Git" plugin
2. Configure repository path: `/home/deepak/Work/narad`
3. Set auto-commit interval (e.g., 5 minutes)
4. Enable auto-push on commit

### Option B: Manual Git Sync
```bash
cd /home/deepak/Work/narad/smriti
git add .
git commit -m "Update notes"
git push
```

---

## Narad Integration

### From Command Center
The Knowledge Graph button (🗺️) in `/command-center` shows:
- All projects as nodes
- Wikilinks as connections
- Click any node to see project details

### Future: Open in Obsidian
You can add a button to open Obsidian directly:
```javascript
// In command-center.js
document.getElementById('obsidian-btn').onclick = () => {
  window.open('obsidian://open?vault=narad&folder=smriti');
};
```

---

## Tips & Tricks

1. **Daily Notes**: Use daily notes plugin for journaling
2. **Canvas**: Try Obsidian Canvas for visual thinking
3. **Mermaid**: Use Mermaid diagrams in code blocks
4. **Callouts**: Use > [!note] for highlighted boxes
5. **Keyboard Shortcuts**: Learn `Ctrl+L`, `Ctrl+K` for linking

---

## Troubleshooting

### Vault Not Opening
- Check path: `/home/deepak/Work/narad/smriti/` exists
- Ensure `.obsidian` folder is present

### Graph Not Showing Links
- Enable "Show links" in graph settings
- Check notes use `[[wikilinks]]` format

### Slow Performance
- Disable heavy plugins
- Reduce graph nodes displayed
- Use search instead of graph for large vaults

---

## Resources

- Official Docs: https://help.obsidian.md
- Discord: https://discord.gg/obsidian
- Plugins: https://obsidian.md/plugins

---

*Last updated: 2026-04-22*
*For narad project: https://narad-7hc.pages.dev*