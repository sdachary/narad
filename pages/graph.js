/*
 * Smriti | Knowledge Observatory
 * Core Graph Engine (2D/3D Support)
 */

let graphData = null;
let currentGraph = null;
const API_URL = 'smriti_graph.json';

// Terminal Colors
const COLORS = {
    PROJECT: '#00ff00',      // Green (Code)
    KNOWLEDGE: '#ffb000',    // Orange (Memory)
    INDEX: '#ffff00',        // Yellow (Hub)
    GENERAL: '#888888',      // Gray
    LINK: 'rgba(255, 255, 255, 0.1)',
    HIGHLIGHT: '#ffffff'
};

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
        .nodeLabel(node => `<div class="node-label"><b>${node.name}</b><br/>${new Date(node.time).toLocaleDateString()}</div>`)
        .nodeColor(getNodeColor)
        .nodeOpacity(0.9)
        .nodeResolution(20)
        .linkColor(() => COLORS.LINK)
        .linkWidth(1)
        .linkOpacity(0.2)
        .backgroundColor('#0d1117')
        .showNavInfo(false)
        .onNodeClick(node => {
            window.parent.postMessage({ type: 'GOTO_NODE', path: node.path }, '*');
        });

    // SMOOTHNESS: Adjust physics for a more 'meditative' canvas feel
    // Increase velocity decay (friction) to make it settle faster and feel less 'bouncy'
    currentGraph.d3VelocityDecay(0.4); 
    
    // Strengthen forces for better structure
    currentGraph.d3Force('charge').strength(-200);
    currentGraph.d3Force('link').distance(100);

    // Initial Zoom Level
    currentGraph.cameraPosition({ z: 1200 });
}

function getNodeColor(node) {
    if (node.path.includes('.md')) {
        if (node.path.includes('Projects/')) return COLORS.PROJECT;
        if (node.path.includes('Knowledge/')) return COLORS.KNOWLEDGE;
    }
    if (node.group === 'index') return COLORS.INDEX;
    return COLORS.GENERAL;
}

function clearContainer() {
    const container = document.getElementById('graph-container');
    container.innerHTML = '';
}

/**
 * Chronological Focus Animation (Old-to-New)
 */
async function animateDiscovery() {
    if (!graphData.nodes.length) return;

    const getSpeed = () => parseInt(document.getElementById('speed-select').value);

    // Initial reveal of key nodes
    for (let i = 0; i < Math.min(graphData.nodes.length, 12); i++) {
        const node = graphData.nodes[i];
        const sleepDuration = getSpeed();
        
        // Smooth flight transit
        currentGraph.cameraPosition({ x: node.x, y: node.y, z: 400 }, node, sleepDuration * 0.9);
        
        await new Promise(r => setTimeout(r, sleepDuration));
    }
    
    // Zoom out to see everything at the end
    currentGraph.zoomToFit(2000, 200, node => true);
}

document.addEventListener('DOMContentLoaded', init);

document.addEventListener('DOMContentLoaded', init);
