// Boss marker system for ChunkPicker
var bossMarkers = [];
var selectedBossType = "torag"; // Default boss type
var bossMode = false; // Toggle for boss placement mode

// Available boss types with their image files
var bossTypes = {
    "torag": {
        name: "Torag the Corrupted",
        image: "images/73px-Torag_the_Corrupted.png",
        size: 30
    },
    "scurrius": {
        name: "Scurrius",
        image: "images/145px-Scurrius.png",
        size: 30
    },
    "gemstone_crab": {
        name: "Gemstone Crab",
        image: "images/150px-Gemstone_Crab.png",
        size: 30
    }
};

// Boss marker data structure: { id: chunkId, type: bossType, x: xCoord, y: yCoord }

// Toggle boss placement mode
function toggleBossMode() {
    bossMode = !bossMode;
    var button = document.getElementById("bossToggleButton");
    if (bossMode) {
        button.textContent = "Exit Boss Mode";
        button.style.backgroundColor = "#ff6b6b";
        document.body.style.cursor = "crosshair";
    } else {
        button.textContent = "Boss Placement Mode";
        button.style.backgroundColor = "";
        document.body.style.cursor = "default";
    }
    updateBossInstructions();
}

// Update boss mode instructions
function updateBossInstructions() {
    var instructions = document.getElementById("bossInstructions");
    if (bossMode) {
        instructions.textContent = "Click on a chunk to place " + bossTypes[selectedBossType].name;
        instructions.style.display = "block";
    } else {
        instructions.style.display = "none";
    }
}

// Set selected boss type
function setSelectedBossType(type) {
    if (bossTypes[type]) {
        selectedBossType = type;
        updateBossInstructions();
        
        // Update dropdown display
        var dropdown = document.getElementById("bossTypeSelect");
        dropdown.value = type;
    }
}

// Add boss marker to a chunk
function addBossMarker(chunkId, bossType) {
    // Remove existing boss marker from this chunk if any
    removeBossMarker(chunkId);
    
    var boss = {
        id: chunkId,
        type: bossType || selectedBossType
    };
    
    bossMarkers.push(boss);
    renderBossMarker(boss);
}

// Remove boss marker from a chunk
function removeBossMarker(chunkId) {
    // Remove from array
    bossMarkers = bossMarkers.filter(boss => boss.id !== chunkId);
    
    // Remove from DOM
    var existingMarker = document.getElementById("boss_" + chunkId);
    if (existingMarker) {
        existingMarker.remove();
    }
}

// Check if chunk has boss marker
function hasBossMarker(chunkId) {
    return bossMarkers.some(boss => boss.id === chunkId);
}

// Get boss marker for chunk
function getBossMarker(chunkId) {
    return bossMarkers.find(boss => boss.id === chunkId);
}

// Render a single boss marker on the map
function renderBossMarker(boss) {
    var chunk = document.getElementById(boss.id);
    if (!chunk) return;
    
    // Create boss marker element
    var marker = document.createElement("img");
    marker.id = "boss_" + boss.id;
    marker.className = "boss-marker";
    marker.src = bossTypes[boss.type].image;
    marker.title = bossTypes[boss.type].name;
    marker.style.width = bossTypes[boss.type].size + "px";
    marker.style.height = bossTypes[boss.type].size + "px";
    
    // Position the marker in the center of the chunk
    marker.style.position = "absolute";
    marker.style.left = "50%";
    marker.style.top = "50%";
    marker.style.transform = "translate(-50%, -50%)";
    marker.style.pointerEvents = "none"; // Don't interfere with chunk clicks
    marker.style.zIndex = "1000";
    
    // Add to chunk
    chunk.style.position = "relative";
    chunk.appendChild(marker);
}

// Render all boss markers
function renderAllBossMarkers() {
    // Clear existing markers
    clearAllBossMarkers();
    
    // Render each boss marker
    bossMarkers.forEach(boss => {
        renderBossMarker(boss);
    });
}

// Clear all boss markers from DOM (not from data)
function clearAllBossMarkers() {
    var markers = document.querySelectorAll(".boss-marker");
    markers.forEach(marker => marker.remove());
}

// Handle chunk click for boss placement
function handleBossPlacement(chunkId) {
    if (!bossMode) return false; // Not in boss mode
    
    if (hasBossMarker(chunkId)) {
        // Remove existing boss marker
        removeBossMarker(chunkId);
    } else {
        // Add new boss marker
        addBossMarker(chunkId, selectedBossType);
    }
    
    return true; // Indicate that we handled the click
}

// Export boss markers data
function exportBossMarkers() {
    return {
        bossMarkers: bossMarkers,
        selectedBossType: selectedBossType
    };
}

// Import boss markers data
function importBossMarkers(data) {
    if (data.bossMarkers) {
        bossMarkers = data.bossMarkers;
        renderAllBossMarkers();
    }
    if (data.selectedBossType) {
        setSelectedBossType(data.selectedBossType);
    }
}

// Clear all boss markers
function clearAllBossData() {
    bossMarkers = [];
    clearAllBossMarkers();
}