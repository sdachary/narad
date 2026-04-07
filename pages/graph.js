/*
 * Smriti | Knowledge Observatory
 * Core Graph Engine (2D/3D Support)
 */

let graphData = null;
let currentGraph = null;
let is3D = false;
const API_URL = 'smriti_graph.json';

// Terminal Colors
const COLORS = {
    PROJECT: '#00ff00',      // Green (Code)
    KNOWLEDGE: '#ffb000',    // Orange (Memory)
    INDEX: '#ffff00',        // Yellow (Hub)
    GENERAL: '#888888',      // Gray
    LINK: 'rgba(255, 255, 255, 0.1)'
};

async function init() {
    try {
        const response = await fetch(API_URL);
        graphData = await response.json();
        
        // Sort nodes by time (Chrological Focus)
        graphData.nodes.sort((a, b) => new Date(a.time) - new Date(b.time));
        
        // Hide loading screen
        document.getElementById('loading').style.opacity = '0';
        setTimeout(() => document.getElementById('loading').style.display = 'none', 500);
        
        render2D();
        setupToggles();
        animateDiscovery();
        
    } catch (error) {
        console.error("Failed to load Smriti graph:", error);
        document.querySelector('.loading-text').textContent = "ERROR RECALLING MEMORIES";
    }
}

function setupToggles() {
    document.getElementById('toggle-2d').addEventListener('click', () => {
        if (!is3D) return;
        is3D = false;
        document.getElementById('toggle-2d').classList.add('active');
        document.getElementById('toggle-3d').classList.remove('active');
        render2D();
    });

    document.getElementById('toggle-3d').addEventListener('click', () => {
        if (is3D) return;
        is3D = true;
        document.getElementById('toggle-3d').classList.add('active');
        document.getElementById('toggle-2d').classList.remove('active');
        render3D();
    });
}

function render2D() {
    clearContainer();
    currentGraph = ForceGraph()(document.getElementById('graph-container'))
        .graphData(graphData)
        .nodeId('id')
        .nodeLabel('name')
        .nodeAutoColorBy('group')
        .linkColor(() => COLORS.LINK)
        .nodeCanvasObject((node, ctx, globalScale) => {
            const label = node.name;
            const fontSize = 12 / globalScale;
            ctx.font = `${fontSize}px Roboto Mono`;
            const textWidth = ctx.measureText(label).width;
            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); 

            ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);

            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = getNodeColor(node);
            ctx.fillText(label, node.x, node.y);

            node.__bckgDimensions = bckgDimensions; // to use in nodePointerAreaPaint
        })
        .onNodeClick(node => {
            window.parent.postMessage({ type: 'GOTO_NODE', path: node.path }, '*');
        });

    currentGraph.d3Force('charge').strength(-150);
}

function render3D() {
    clearContainer();
    currentGraph = ForceGraph3D()(document.getElementById('graph-container'))
        .graphData(graphData)
        .nodeId('id')
        .nodeLabel('name')
        .nodeColor(getNodeColor)
        .linkColor(() => COLORS.LINK)
        .backgroundColor('#0d1117')
        .onNodeClick(node => {
            window.parent.postMessage({ type: 'GOTO_NODE', path: node.path }, '*');
        });
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
 * Focuses on nodes in order of their modification time.
 */
async function animateDiscovery() {
    if (!graphData.nodes.length) return;

    // Read speed from user selector
    const getSpeed = () => parseInt(document.getElementById('speed-select').value);

    // Reveal chronological history (Oldest -> Newest)
    for (let i = 0; i < Math.min(graphData.nodes.length, 12); i++) {
        const node = graphData.nodes[i];
        const sleepDuration = getSpeed();
        
        // Flight animation
        if (is3D) {
            currentGraph.cameraPosition({ x: node.x, y: node.y, z: 200 }, node, sleepDuration * 0.8);
        } else {
            currentGraph.centerAt(node.x, node.y, sleepDuration * 0.8);
            currentGraph.zoom(2.5, sleepDuration * 0.8);
        }
        
        await new Promise(r => setTimeout(r, sleepDuration));
    }
    
    // Final zoom to show overall structure
    if (!is3D) {
        currentGraph.zoomToFit(1500);
    }
}

document.addEventListener('DOMContentLoaded', init);
