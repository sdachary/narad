# Narad

Standalone browser utilities — each tool is a self-contained HTML file, zero build step, zero backend.

| Tool | What |
|------|------|
| [Sandesh](sandesh/) | Local network file transfer via WebRTC. Pair devices with a 6-digit code and send files directly browser-to-browser. |
| [Drishti](drishti/) | Read-only file scanner. Point it at a folder and it reports which files fail to open — nothing is modified. |
| [Shuddhi](shuddhi/) | Windows PC cleanup guide and malware scanner. Step-by-step + automated script. |

## Deploy

Deploy as static pages to Cloudflare Pages, GitHub Pages, or any static host. No build step — point at the repo root.

```bash
# GitHub Pages: push to main, enable in repo Settings > Pages
# Cloudflare Pages: connect repo, Framework preset = None, Build output = /
```
