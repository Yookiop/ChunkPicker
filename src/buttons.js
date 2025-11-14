// Randomly roll one of the potential (numbered) chunks
function pickPotentialChunk() {
    // Always mark new neighbors as potential (default behavior)
    var selectNewNeighbors = true;
    var removePotential = false; // Never remove potential chunks
	var chunks = document.getElementsByClassName("potential");
	if (chunks.length == 0) return;

    removeUnlockedTileNumbers();
    removeBetweenTileNumbers();

    // Start the awesome animation sequence!
    startPickChunkAnimation(chunks, selectNewNeighbors, removePotential);
}

// Cool animation sequence for picking a random chunk
function startPickChunkAnimation(chunks, selectNewNeighbors, removePotential) {
    // Get the button and add spinning animation
    var button = document.querySelector('button[onclick="pickPotentialChunk()"]');
    button.classList.add('spinning');
    button.disabled = true;
    button.textContent = 'Rolling...';

    // Make all potential chunks pulse
    for (var i = 0; i < chunks.length; i++) {
        chunks[i].classList.add('pulsing');
    }

    // Create confetti
    createConfetti();

    // After 2 seconds, stop button animation and pick the chunk
    setTimeout(() => {
        button.classList.remove('spinning');
        button.disabled = false;
        button.textContent = 'Pick a random potential chunk!';

        // Stop pulsing on all chunks
        for (var i = 0; i < chunks.length; i++) {
            chunks[i].classList.remove('pulsing');
        }

        // Randomly pick one of the numbered tiles
        var randomIndex = Math.floor(Math.random() * chunks.length);
        var selectedChunk = chunks[randomIndex];

        // Add highlight animation to selected chunk
        selectedChunk.classList.add('chunk-highlight');

        // Set new neighbors as potential (always enabled)
        if (selectNewNeighbors && !removePotential) {
            addPotentialNeighborsForID(selectedChunk.id);
        }
        selectedChunk.className = "between chunk-highlight";
        removeElementFromArray(potentialChunks, Number(selectedChunk.id));

        // Wait 1 second for "between" animation to finish
        setTimeout(() => {
            addChunkAsUnlocked(selectedChunk.id);
            
            // Automatically center and zoom on the selected chunk
            var chunkPoint = getChunkCenterPoint(selectedChunk.id);
            var imgDiv = document.getElementById("imgDiv");
            zoomToPoint(imgDiv, chunkPoint[0], chunkPoint[1], 2.5);
            fixMapEdges(imgDiv);
            
            // Remove highlight class after unlocking
            setTimeout(() => {
                var unlockedChunk = document.getElementById(selectedChunk.id);
                if (unlockedChunk) {
                    unlockedChunk.classList.remove('chunk-highlight');
                }
            }, 500);
        }, 1000);

        // Always update potential numbers since we never remove potential chunks
        updatePotentialNumbers();
    }, 2000);
}

// Info mode variables
var infoMode = false;

// Toggle info mode
function toggleInfoMode() {
    var button = document.getElementById('infoButton');
    var instructions = document.getElementById('infoInstructions');
    
    if (infoMode) {
        infoMode = false;
        button.textContent = 'Chunk Info Mode';
        button.style.backgroundColor = 'rgb(52, 152, 219)';
        instructions.style.display = 'none';
    } else {
        infoMode = true;
        button.textContent = 'Exit Info Mode';
        button.style.backgroundColor = '#4ecdc4';
        instructions.style.display = 'block';
    }
}

// Show chunk info
function showChunkInfo(id) {
    var chunk = document.getElementById(id);
    var rect = chunk.getBoundingClientRect();
    
    // Remove any existing info displays
    var existingInfo = document.querySelector('.chunk-info-display');
    if (existingInfo) {
        existingInfo.remove();
    }
    
    // Create info display
    var infoDisplay = document.createElement('div');
    infoDisplay.className = 'chunk-info-display';
    infoDisplay.textContent = `Chunk ID: ${id}`;
    infoDisplay.style.position = 'fixed';
    infoDisplay.style.left = rect.left + rect.width / 2 + 'px';
    infoDisplay.style.top = rect.top - 40 + 'px';
    infoDisplay.style.transform = 'translateX(-50%)';
    infoDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    infoDisplay.style.color = '#4ecdc4';
    infoDisplay.style.padding = '8px 12px';
    infoDisplay.style.borderRadius = '5px';
    infoDisplay.style.fontSize = '14px';
    infoDisplay.style.zIndex = '10000';
    infoDisplay.style.pointerEvents = 'none';
    infoDisplay.style.border = '1px solid #4ecdc4';
    
    document.body.appendChild(infoDisplay);
    
    // Remove after 3 seconds
    setTimeout(() => {
        if (infoDisplay.parentNode) {
            infoDisplay.parentNode.removeChild(infoDisplay);
        }
    }, 3000);
}

// Create confetti animation
function createConfetti() {
    var colors = ['confetti-1', 'confetti-2', 'confetti-3', 'confetti-4', 'confetti-5'];
    var button = document.querySelector('button[onclick="pickPotentialChunk()"]');
    var buttonRect = button.getBoundingClientRect();
    
    for (var i = 0; i < 50; i++) {
        setTimeout(function() {
            var confetti = document.createElement('div');
            confetti.className = 'confetti ' + colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = (buttonRect.left + Math.random() * buttonRect.width) + 'px';
            confetti.style.top = buttonRect.top + 'px';
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 3500);
        }, Math.random() * 500);
    }
}

// Move the map to the center point between all unlocked tiles
function centerOnUnlockedTiles() {
    var centerPoint = [0, 0];
    for (var i = 0; i < unlockedChunks.length; i++) {
        // Sum all unlocked chunk center points, then divide by the number of unlocked chunks
        var chunkPoint = getChunkCenterPoint(unlockedChunks[i]);
        centerPoint[0] += chunkPoint[0];
        centerPoint[1] += chunkPoint[1];
    }
    centerPoint[0] /= unlockedChunks.length;
    centerPoint[1] /= unlockedChunks.length;

    repositionMapOnPoint(document.getElementById("imgDiv"), centerPoint[0], centerPoint[1]);

    fixMapEdges(document.getElementById("imgDiv"));
}

// Return the X- and Y-values of a given chunk's center point
function getChunkCenterPoint(id) {
    var chunk = document.getElementById(id);
    // Format: [x, y]
    var point = [
        chunk.offsetWidth * (id % cols) + chunk.offsetWidth / 2,
        chunk.offsetHeight * Math.floor(id / cols) + chunk.offsetHeight / 2
    ];
    return point;
}

// Set all neighbors to this chunk as potential
function addPotentialNeighborsForID(id) {
    id = Number(id);

    var newNeighbors = getAdjacentTileIDs(id);
    for (var i = 0; i < newNeighbors.length; i++) {
        if (newNeighbors[i] == -1) continue;
        else if (document.getElementById(newNeighbors[i]).className == "locked") {
            addChunkAsPotential(newNeighbors[i]);
        }
    }
}

// TODO: Add button for this
// Select all chunks neighboring "unlocked" chunks
function selectAllNeighbors() {
    for (var i = 0; i < unlockedChunks.length; i++) {
        addPotentialNeighborsForID(unlockedChunks[i]);
    }
}

// Toggle visibility of a given sidebar
function toggleSidebar(id, side) {
    var sideDiv = document.getElementById(side);
    // Slide the sidebar off the screen
    if (getComputedStyle(sideDiv).getPropertyValue("display") == "block") {
        // Pick between the left or right sidebar
        if (side == "sidebarLeft") {
            sideDiv.style.left = -(sideDiv.offsetWidth) + "px";
        }
        else if (side == "sidebarRight") {
            sideDiv.style.right = (-sideDiv.offsetWidth) + "px";
        }
        // Wait until the sidebar is off-screen to make it invisible
        // Then fix the map if it is now out of bounds
        setTimeout(() => {
            sideDiv.style.display = "none";
            fixMapEdges(document.getElementById("imgDiv"));
        }, 750);
    }
    // Slide the sidebar back on the screen
    else {
        sideDiv.style.display = "block";
        // Wait a small amount before starting the animation because
        // Firefox sometimes doesn't show the animation
        setTimeout(() => {
            if (side == "sidebarLeft") {
                sideDiv.style.left = "0%";
            }
            else if (side == "sidebarRight") {
                sideDiv.style.right = "0%";
            }
        }, 15);
    }

    var arrowBackground = document.getElementById(id + "Background");
    var arrow = document.getElementById(id);
    // Slide and rotate the arrow to the edge of the screen
    setTimeout(() => {
        // Wait a small amount before starting the animation because
        // Firefox sometimes doesn't show the animation
    }, 15);
    if (id == "arrowLeft") {
        // Custom left value hasn't been set yet, so initialize it
        if (arrowBackground.style.left == "") arrowBackground.style.left = "13.5%";

        if (arrowBackground.style.left == "13.5%") {
            arrowBackground.style.left = "-0.5%";
            arrow.style.transform = "rotate(180deg)";
        }
        else if (arrowBackground.style.left == "-0.5%") {
            setTimeout(() => {
                arrowBackground.style.left = "13.5%";
                arrow.style.transform = "rotate(0deg)";
            }, 15);
        }
    }
    else if (id == "arrowRight") {
        // Custom right value hasn't been set yet, so initialize it
        if (arrowBackground.style.right == "") arrowBackground.style.right = "13.5%";

        if (arrowBackground.style.right == "13.5%") {
            arrowBackground.style.right = "-0.5%";
            arrow.style.transform = "rotate(-180deg)";
        }
        else if (arrowBackground.style.right == "-0.5%") {
            setTimeout(() => {
                arrowBackground.style.right = "13.5%";
                arrow.style.transform = "rotate(0deg)";
            }, 15);
        }
    }
}