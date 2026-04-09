/*
 * Smriti | Knowledge Observatory
 * Core Graph Engine (2D/3D Support with Search & Filter)
 */

let graphData = null;
let currentGraph = null;
let currentGraph2D = null;
let is3DMode = true;
const API_URL = 'smriti_graph.json';

// Utility: String to HSL Color (Stable Project Palettes)
function getProjectColor(node) {
    // Different color for header nodes
    if (node.group && node.group.startsWith('header-')) {
        return '#ff6b6b';
    }
    
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

// Utility: Get Link Color based on type
function getLinkColor(link) {
    if (!link.type) return 'rgba(255, 255, 255, 0.15)';
    
    const colors = {
        'wikilink': 'rgba(255, 255, 255, 0.15)',
        'tag_based': 'rgba(168, 85, 247, 0.4)',
        'see_also': 'rgba(34, 197, 94, 0.5)',
        'code_reference': 'rgba(249, 115, 22, 0.4)'
    };
    return colors[link.type] || colors['wikilink'];
}

// Utility: Geometric Semantics
function getGeometry(node) {
    const path = (node.path || '').toLowerCase();
    
    // Header nodes are smaller
    if (node.group && node.group.startsWith('header-')) {
        return new THREE.SphereGeometry(3);
    }
    
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
        
        // Extract metadata
        if (graphData.metadata) {
            document.getElementById('stat-nodes').textContent = graphData.metadata.nodeCount || graphData.nodes.length;
            document.getElementById('stat-links').textContent = graphData.metadata.linkCount || graphData.links.length;
            document.getElementById('stat-tags').textContent = graphData.metadata.tagCount || 0;
        } else {
            document.getElementById('stat-nodes').textContent = graphData.nodes.length;
            document.getElementById('stat-links').textContent = graphData.links.length;
        }
        
        // Sort nodes by time (Chronological Focus)
        graphData.nodes.sort((a, b) => new Date(a.time || 0) - new Date(b.time || 0));
        
        // Setup event listeners
        setupEventListeners();
        
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

function setupEventListeners() {
    // 3D/2D Toggle
    document.getElementById('view-3d').addEventListener('click', () => {
        is3DMode = true;
        document.getElementById('view-3d').classList.add('active');
        document.getElementById('view-2d').classList.remove('active');
        render3D();
    });
    
    document.getElementById('view-2d').addEventListener('click', () => {
        is3DMode = false;
        document.getElementById('view-2d').classList.add('active');
        document.getElementById('view-3d').classList.remove('active');
        render2D();
    });
    
    // Search
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
    });
    searchInput.addEventListener('focus', () => {
        document.getElementById('search-panel').classList.add('visible');
    });
    
    // Toggle panels
    document.getElementById('search-btn').addEventListener('click', () => {
        const panel = document.getElementById('search-panel');
        panel.classList.toggle('visible');
    });
    
    document.getElementById('filter-btn').addEventListener('click', () => {
        document.getElementById('filter-panel').classList.toggle('visible');
    });
    
    document.getElementById('legend-btn').addEventListener('click', () => {
        document.getElementById('legend-panel').classList.toggle('visible');
    });
    
    // Filter checkboxes
    ['wikilink', 'tag', 'seealso', 'code'].forEach(type => {
        const checkbox = document.getElementById(`filter-${type}`);
        if (checkbox) {
            checkbox.addEventListener('change', applyFilters);
        }
    });
}

function handleSearch(query) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';
    
    if (!query || query.length < 2) {
        resultsContainer.classList.remove('visible');
        return;
    }
    
    const lowerQuery = query.toLowerCase();
    const matches = graphData.nodes
        .filter(node => 
            node.name.toLowerCase().includes(lowerQuery) ||
            (node.path && node.path.toLowerCase().includes(lowerQuery)) ||
            (node.tags && node.tags.some(t => t.toLowerCase().includes(lowerQuery)))
        )
        .slice(0, 10);
    
    if (matches.length > 0) {
        resultsContainer.classList.add('visible');
        matches.forEach(node => {
            const item = document.createElement('div');
            item.className = 'search-result-item';
            item.innerHTML = `
                <div class="search-result-name">${node.name}</div>
                <div class="search-result-path">${node.path || ''}</div>
            `;
            item.addEventListener('click', () => showPreview(node));
            resultsContainer.appendChild(item);
        });
    } else {
        resultsContainer.classList.remove('visible');
    }
}

function applyFilters() {
    // For now, filters are visual - the underlying data remains
    // In a full implementation, you'd filter graphData and re-render
}

function render2D() {
    clearContainer();
    
    // Use the unified force-graph package which includes 2D
    currentGraph2D = ForceGraph2D()(document.getElementById('graph-container'))
        .graphData(graphData)
        .nodeId('id')
        .nodeLabel(node => `<div class="node-label"><b>${node.name}</b></div>`)
        .nodeColor(node => getProjectColor(node))
        .nodeCanvasObject((node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12/globalScale;
            ctx.font = `${fontSize}px Sans`;
            
            // Draw node
            ctx.beginPath();
            ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = getProjectColor(node);
            ctx.fill();
            
            // Draw label
            ctx.fillStyle = '#ccc';
            ctx.fillText(label, node.x + 8, node.y + 3);
        })
        .linkColor(link => getLinkColor(link))
        .linkWidth(1)
        .backgroundColor('#0d1117')
        .onNodeClick(node => showPreview(node));
    
    currentGraph2D.d3Force('charge').strength(-200);
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
        
        .linkColor(link => getLinkColor(link))
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
    const details = document.getElementById('preview-details');
    const icon = document.getElementById('preview-icon');
    
    title.textContent = node.name.toUpperCase();
    icon.style.background = getProjectColor(node);
    
    const project = (node.path || '').split('/')[0] || 'Smriti';
    
    // Build details content
    let detailsHtml = '';
    if (node.tags && node.tags.length > 0) {
        detailsHtml += `<div style="margin-bottom:8px;"><span style="color:#666;">Tags:</span> ${node.tags.slice(0,5).map(t => `#${t}`).join(' ')}</div>`;
    }
    if (node.headers && node.headers.length > 0) {
        detailsHtml += `<div style="margin-bottom:8px;"><span style="color:#666;">Headers:</span> ${node.headers.slice(0,3).join(', ')}</div>`;
    }
    if (node.linkTypes) {
        detailsHtml += `<div style="color:#666;font-size:11px;">Links: ${Object.entries(node.linkTypes).filter(([k,v]) => v > 0).map(([k,v]) => `${k}:${v}`).join(' | ')}</div>`;
    }
    
    body.innerHTML = `
        <div style="color: grey; font-size: 11px; margin-bottom: 8px;">PATH: ${node.path || 'N/A'}</div>
        Connecting to node via <b>Narad Neural Link</b>...<br/>
        This segment of your memory pertains to the <b>${project}</b> ecosystem.
    `;
    
    details.innerHTML = detailsHtml;
    preview.classList.add('visible');
    
    // Setup the Enter button
    document.getElementById('enter-node').onclick = () => {
        window.location.href = `reader.html?path=${encodeURIComponent(node.path || '')}`;
    };

    // Smoothly focus camera on the selected node
    if (is3DMode && currentGraph) {
        const distance = 150;
        const distRatio = 1 + distance/Math.hypot(node.x || 0, node.y || 0, node.z || 0);
        currentGraph.cameraPosition(
            { x: (node.x || 0) * distRatio, y: (node.y || 0) * distRatio, z: 400 }, 
            node, 
            2000
        );
    }
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
        
        if (currentGraph && is3DMode) {
            currentGraph.cameraPosition({ x: node.x || 0, y: node.y || 0, z: 400 }, node, sleepDuration * 0.9);
        }
        await new Promise(r => setTimeout(r, sleepDuration));
    }
    
    if (currentGraph && is3DMode) {
        currentGraph.zoomToFit(2000, 200);
    }
}

document.addEventListener('DOMContentLoaded', init);
