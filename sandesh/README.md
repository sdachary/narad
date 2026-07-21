# Sandesh — Local File Drop

Local network file transfer via WebRTC. Pair two devices with a 6-digit code, then drag and drop a file to send it directly, browser to browser.

**How it works:** Both devices open the same page. One generates a 6-digit session code, the other enters it. PeerJS (via CDN) handles the handshake through a public broker. Once paired, file data transfers directly between browsers over WebRTC — nothing passes through the broker.

**Limitation:** Needs a brief internet connection for the initial peer handshake (loads PeerJS library, reaches its public broker). The transfer itself is direct between browsers and fast on a shared local network.

**Live URL:** `https://narad.pages.dev/sandesh/`
