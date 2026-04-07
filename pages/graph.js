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
        
        // Hide loading screen
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => document.getElementById('loading').style.display = 'none', 500);
        
        render3D();
        setupPreviewControls();
        animateDiscovery();
        
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
    
    // Simulate content summary (In Phase 4 we will fetch real summary)
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
    document.getElementById('graph-container').innerHTML = '';
}

async function animateDiscovery() {
    if (!graphData.nodes.length) return;
    const getSpeed = () => parseInt(document.getElementById('speed-select').value);

    for (let i = 0; i < Math.min(graphData.nodes.length, 12); i++) {
        const node = graphData.nodes[i];
        const sleepDuration = getSpeed();
        currentGraph.cameraPosition({ x: node.x, y: node.y, z: 400 }, node, sleepDuration * 0.9);
        await new Promise(r => setTimeout(r, sleepDuration));
    }
    currentGraph.zoomToFit(2000, 200);
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', init);
