// Boss marker system for ChunkPicker
var bossMarkers = [];
var selectedBossType = "torag"; // Default boss type
var bossMode = false; // Toggle for boss placement mode

// Difficulty marker system
var difficultyMarkers = [];
var selectedDifficultyType = "insane"; // Default difficulty type
var difficultyMode = false; // Toggle for difficulty placement mode

// Available boss types with their image files
var bossTypes = {
    "torag": {
        name: "Torag the Corrupted",
        image: "images/73px-Torag_the_Corrupted.png",
        size: 45
    },
    "scurrius": {
        name: "Scurrius",
        image: "images/145px-Scurrius.png",
        size: 45
    },
    "gemstone_crab": {
        name: "Gemstone Crab",
        image: "images/150px-Gemstone_Crab.png",
        size: 45
    }
};

// Available difficulty types with their skull images
var difficultyTypes = {
    "insane": {
        name: "Insane",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='%23ffffff'%3E%3Cellipse cx='50' cy='32' rx='22' ry='20'/%3E%3Cpath d='M35 48 Q50 60 65 48 L62 58 Q50 60 38 58 Z'/%3E%3Ccircle cx='42' cy='30' r='4' fill='%23000000'/%3E%3Ccircle cx='58' cy='30' r='4' fill='%23000000'/%3E%3Cpath d='M47 38 L53 38 L50 43 Z' fill='%23000000'/%3E%3Crect x='44' y='54' width='2' height='6'/%3E%3Crect x='47' y='54' width='2' height='8'/%3E%3Crect x='50' y='54' width='2' height='8'/%3E%3Crect x='53' y='54' width='2' height='6'/%3E%3C/g%3E%3C/svg%3E",
        size: 40
    },
    "death": {
        name: "Death",
        image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cg fill='%23ff0000'%3E%3Cellipse cx='50' cy='32' rx='22' ry='20'/%3E%3Cpath d='M35 48 Q50 60 65 48 L62 58 Q50 60 38 58 Z'/%3E%3Ccircle cx='42' cy='30' r='4' fill='%23000000'/%3E%3Ccircle cx='58' cy='30' r='4' fill='%23000000'/%3E%3Cpath d='M47 38 L53 38 L50 43 Z' fill='%23000000'/%3E%3Crect x='44' y='54' width='2' height='6'/%3E%3Crect x='47' y='54' width='2' height='8'/%3E%3Crect x='50' y='54' width='2' height='8'/%3E%3Crect x='53' y='54' width='2' height='6'/%3E%3C/g%3E%3C/svg%3E",
        size: 40
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
    
    // Position the marker in the top-right of the chunk
    marker.style.position = "absolute";
    marker.style.right = "5px";
    marker.style.top = "5px";
    marker.style.transform = "none";
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

// Clear all boss markers with confirmation
function confirmClearAllBossData() {
    if (confirm("Are you sure you want to clear all boss markers? This action cannot be undone.")) {
        clearAllBossData();
    }
}

// Clear all boss markers
function clearAllBossData() {
    bossMarkers = [];
    clearAllBossMarkers();
}

// === DIFFICULTY MARKER FUNCTIONS ===

// Toggle difficulty placement mode
function toggleDifficultyMode() {
    difficultyMode = !difficultyMode;
    var button = document.getElementById("difficultyToggleButton");
    var instructions = document.getElementById("difficultyInstructions");
    
    if (difficultyMode) {
        button.textContent = "Exit Difficulty Mode";
        button.style.backgroundColor = "#e74c3c";
        instructions.style.display = "block";
        instructions.textContent = "Click on a chunk to place " + difficultyTypes[selectedDifficultyType].name + " marker";
    } else {
        button.textContent = "Difficulty Placement Mode";
        button.style.backgroundColor = "#52a4db";
        instructions.style.display = "none";
    }
}

// Set selected difficulty type
function setSelectedDifficultyType(type) {
    if (difficultyTypes[type]) {
        selectedDifficultyType = type;
        
        // Update instructions if in difficulty mode
        if (difficultyMode) {
            var instructions = document.getElementById("difficultyInstructions");
            instructions.textContent = "Click on a chunk to place " + difficultyTypes[selectedDifficultyType].name + " marker";
        }
    }
}

// Add difficulty marker to a chunk
function addDifficultyMarker(chunkId) {
    if (!difficultyMode) return;
    
    // Remove existing difficulty marker from this chunk
    removeDifficultyMarker(chunkId);
    
    // Add new difficulty marker
    var marker = {
        id: chunkId,
        type: selectedDifficultyType
    };
    
    difficultyMarkers.push(marker);
    renderDifficultyMarker(marker);
}

// Remove difficulty marker from a chunk
function removeDifficultyMarker(chunkId) {
    // Remove from array
    difficultyMarkers = difficultyMarkers.filter(marker => marker.id !== chunkId);
    
    // Remove from DOM
    var existingMarker = document.getElementById("difficulty_" + chunkId);
    if (existingMarker) {
        existingMarker.remove();
    }
}

// Render a single difficulty marker on the map
function renderDifficultyMarker(difficulty) {
    var chunk = document.getElementById(difficulty.id);
    if (!chunk) return;
    
    // Create difficulty marker element
    var marker = document.createElement("img");
    marker.id = "difficulty_" + difficulty.id;
    marker.className = "difficulty-marker";
    marker.src = difficultyTypes[difficulty.type].image;
    marker.title = difficultyTypes[difficulty.type].name;
    marker.style.width = difficultyTypes[difficulty.type].size + "px";
    marker.style.height = difficultyTypes[difficulty.type].size + "px";
    
    // Position the marker in the bottom-right of the chunk
    marker.style.position = "absolute";
    marker.style.right = "5px";
    marker.style.bottom = "5px";
    marker.style.transform = "none";
    marker.style.pointerEvents = "none"; // Don't interfere with chunk clicks
    marker.style.zIndex = "1000";
    
    // Add to chunk
    chunk.style.position = "relative";
    chunk.appendChild(marker);
}

// Render all difficulty markers
function renderAllDifficultyMarkers() {
    difficultyMarkers.forEach(marker => renderDifficultyMarker(marker));
}

// Clear all difficulty markers from DOM
function clearAllDifficultyMarkers() {
    var markers = document.querySelectorAll(".difficulty-marker");
    markers.forEach(marker => marker.remove());
}

// Clear all difficulty markers with confirmation
function confirmClearAllDifficultyData() {
    if (confirm("Are you sure you want to clear all difficulty markers? This action cannot be undone.")) {
        clearAllDifficultyData();
    }
}

// Clear all difficulty markers
function clearAllDifficultyData() {
    difficultyMarkers = [];
    clearAllDifficultyMarkers();
}