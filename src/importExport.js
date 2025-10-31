// Combine the two arrays of chunk IDs into one text file
function chunksToJSON() {
    // Create data object with chunks and boss markers
    var saveData = {
        unlockedChunks: unlockedChunks,
        potentialChunks: potentialChunks,
        bossData: typeof exportBossMarkers === 'function' ? exportBossMarkers() : null
    };
    
    var packedString = JSON.stringify(saveData);
    var packedURI = 'data:text/json;charset=utf-8,' + encodeURIComponent(packedString);

    var downloadAnchor = document.createElement("a"); // Create a temporary element
    downloadAnchor.setAttribute("href", packedURI); // Set the link as a download
    downloadAnchor.setAttribute("download", "Chunk-Picker-Save.txt"); // Set the filename
    document.body.appendChild(downloadAnchor); // Firefox
    downloadAnchor.click(); // "Click" the link to download the file
    downloadAnchor.remove();
}

// Allow user to upload a JSON file to the website to be parsed
function JSONToChunks() {
    var jsonFile = document.getElementById("select").files;
    if (jsonFile.length <= 0) {
        return false;
    }

    var reader = new FileReader();
    reader.readAsText(jsonFile.item(0));

    reader.onload = function(e) {
        try {
            var result = JSON.parse(e.target.result);
            
            // Reset all tiles to "locked"
            var chunks = document.getElementById("btnDiv").children;
            for (var i = 0; i < chunks.length; i++) {
                addChunkAsLocked(i);
            }
            
            // Clear all boss markers
            if (typeof clearAllBossData === 'function') {
                clearAllBossData();
            }
            
            // Check if this is new format (object) or old format (string)
            if (typeof result === 'object' && result.unlockedChunks !== undefined) {
                // New format with boss data support
                var unlocked = result.unlockedChunks || [];
                var potential = result.potentialChunks || [];
                
                // Add parsed unlocked chunks
                for (var i = 0; i < unlocked.length; i++) {
                    addChunkAsUnlocked(unlocked[i]);
                }
                
                // Add parsed potential chunks
                for (var i = 0; i < potential.length; i++) {
                    addChunkAsPotential(potential[i]);
                }
                
                // Import boss data if available
                if (result.bossData && typeof importBossMarkers === 'function') {
                    importBossMarkers(result.bossData);
                }
            } else {
                // Old format - handle legacy saves
                var split = result.slice(1, -1).split("][");
                
                // Add parsed unlocked chunks
                var unlocked = split[0].split(",");
                for (var i = 0; i < unlocked.length; i++) {
                    // Check if the array is empty from the JSON parsing
                    if (unlocked[i] != "") {
                        addChunkAsUnlocked(unlocked[i]);
                    }
                }

                var potential = split[1].split(",");
                for (var i = 0; i < potential.length; i++) {
                    // Check if the array is empty from the JSON parsing
                    if (potential[i] != "") {
                        addChunkAsPotential(potential[i]);
                    }
                }
            }
        } catch (error) {
            alert("Error loading save file: " + error.message);
        }
    }

    // Reset the value of the input form in case the user wants to upload the same file
    document.getElementById("select").value = "";
}