---
source: "/home/runner/work/narad/narad/sync_temp/narad/pages/graph.js"
project: "narad"
role: page
language: javascript
frameworks: [typescript]
lines: 164
size: 5487 bytes
last_modified: "2026-04-08 16:51"
scanned: "2026-04-08 16:51"
tags: [code, javascript, page, project/narad, typescript]
---

# graph.js

> Web page using **typescript** (164 lines).

## 📋 Metadata

| Property | Value |
|----------|-------|
| **Path** | `narad/pages/graph.js` |
| **Role** | page |
| **Language** | javascript |
| **Frameworks** | typescript |
| **Lines** | 164 |
| **Size** | 5487 bytes |
| **Modified** | 2026-04-08 16:51 |

## 🔗 Related Files

—

## 📄 Content

```javascript
/*
 * Smriti | Knowledge Observatory
 * Core Graph Engine (2D/3D Support)
 */

let graphData = null;
let currentGraph = null;
const API_URL = 'smriti_graph.json';

// Utility: String to HSL Color (Stable Project Palettes)
function getProjectColor(node) {
    const parts = node.path.split('/');
    const project = parts.length > 1 ? parts[0] : 'General';
    
    let hash = 0;
    for (let i = 0; i < project.length; i++) {
        hash = project.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use HSL for vibrant, distinct project colors
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 80%, 60%)`;
}

// Utility: Geometric Semantics
function getGeometry(node) {
    const path = node.path.toLowerCase();
    
    // Cone: Index / Hub nodes
    if (node.group === 'index' || path.includes('index.md')) {
        return new THREE.ConeGeometry(8, 16);
    }
    
    // Box: Action/Project Code files
    if (path.includes('projects/')) {
        return new THREE.BoxGeometry(10, 10, 10);
    }
    
    // Sphere: General Memory / Knowledge
    return new THREE.SphereGeometry(6);
}

async function init() {
    try {
        const response = await fetch(API_URL);
        graphData = await response.json();
        
        // Sort nodes by time (Chronological Focus)
        graphData.nodes.sort((a, b) => new Date(a.time) - new Date(b.time));
        
        render3D();
        setupPreviewControls();
        animateDiscovery();
        
        // Hide loading screen only after graph is initialized
        const loading = document.getElementById('loading');
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
        
    } catch (error) {
        console.error("Failed to load Smriti graph:", error);
        document.querySelector('.loading-text').textContent = "ERROR RECALLING MEMORIES";
    }
}

function render3D() {
    clearContainer();
    currentGraph = ForceGraph3D()(document.getElementById('graph-container'))
        .graphData(graphData)
        .nodeId('id')
        .nodeLabel(node => `<div class="node-label"><b>${node.name}</b></div>`)
        
        // GEOMETRIC SEMANTICS: Custom shapes based on content type
        .nodeThreeObject(node => {
            if (typeof THREE === 'undefined') {
                console.error("THREE is missing!");
                return null;
            }
            const material = new THREE.MeshLambertMaterial({ 
                color: getProjectColor(node),
                transparent: true,
                opacity: 0.9
            });
            const geometry = getGeometry(node);
            return new THREE.Mesh(geometry, material);
        })
        
        // NEURAL DATA FLOW: Particles represent information transfer
        .linkDirectionalParticles(2)
        .linkDirectionalParticleWidth(1.5)
        .linkDirectionalParticleSpeed(0.005)
        .linkDirectionalParticleColor(() => '#ffffff')
        
        .linkColor(() => 'rgba(255, 255, 255, 0.1)')
        .backgroundColor('#0d1117')
        .onNodeClick(node => showPreview(node));

    // Physics Tuning for high-end feel
    currentGraph.d3VelocityDecay(0.45); 
    currentGraph.d3Force('charge').strength(-250);
}

// INTERACTIVE PREVIEW LOGIC
function showPreview(node) {
    const preview = document.getElementById('node-preview');
    const title = document.getElementById('preview-title');
    const body = document.getElementById('preview-body');
    const icon = document.getElementById('preview-icon');
    
    title.textContent = node.name.toUpperCase();
    icon.style.background = getProjectColor(node);
    
    const project = node.path.split('/')[0] || 'Smriti';
    body.innerHTML = `
        <div style="color: grey; font-size: 11px; margin-bottom: 8px;">PATH: ${node.path}</div>
        Connecting to node via <b>Narad Neural Link</b>...<br/>
        This segment of your memory pertains to the <b>${project}</b> ecosystem.
    `;
    
    preview.classList.add('visible');
    
    // Setup the Enter button
    document.getElementById('enter-node').onclick = () => {
        window.location.href = `reader.html?path=${node.path}`;
    };

    // Smoothly focus camera on the selected node
    const distance = 150;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    currentGraph.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, 
        node, 
        2000
    );
}

function setupPreviewControls() {
    document.getElementById('close-preview').addEventListener('click', () => {
        document.getElementById('node-preview').classList.remove('visible');
    });
}

function clearContainer() {
    const container = document.getElementById('graph-container');
    if (container) container.innerHTML = '';
}

async function animateDiscovery() {
    if (!graphData.nodes.length) return;
    const getSpeed = () => parseInt(document.getElementById('speed-select').value);

    // Briefly orbit or highlight first few nodes to "show life"
    for (let i = 0; i < Math.min(graphData.nodes.length, 12); i++) {
        const node = graphData.nodes[i];
        const sleepDuration = getSpeed();
        currentGraph.cameraPosition({ x: node.x, y: node.y, z: 400 }, node, sleepDuration * 0.9);
        await new Promise(r => setTimeout(r, sleepDuration));
    }
    currentGraph.zoomToFit(2000, 200);
}

document.addEventListener('DOMContentLoaded', init);

```
