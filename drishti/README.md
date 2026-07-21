# Drishti — Unreadable File Scanner

Read-only file scanner. Point it at a folder and it reports which files fail to open or read. Nothing is deleted or modified — you decide what to do with the results.

**How it works:** Uses the browser's File System Access API to walk a user-selected folder locally. Two modes:
- **Quick check** — samples the first 64KB of each file. Fast, good first pass.
- **Thorough scan** — reads every file fully, catching errors anywhere in the file. Slower but comprehensive.

**Browser support:** Chrome, Edge, and other Chromium-based desktop browsers only. Firefox and Safari don't yet support the File System Access API.

**Safety:** No file contents, paths, or scan results are sent anywhere — everything runs locally in the browser tab.

**Live URL:** `https://narad.pages.dev/drishti/`
