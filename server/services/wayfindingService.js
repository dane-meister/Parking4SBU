const { Building, ParkingLot } = require("../models");

// Function to compute Manhattan Distance in meters
function manhattanDistance(coord1, coord2) {
    if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) {
        console.error("Invalid coordinates for Manhattan Distance:", coord1, coord2);
        return Infinity; // Return large value so it doesn't interfere with min distance logic
    }
    console.log("Calculating distance between:", coord1, coord2);
    let dx = Math.abs(coord2[1] - coord1[1]); // Absolute X difference
    let dy = Math.abs(coord2[0] - coord1[0]); // Absolute Y difference
    return dx + dy; // Manhattan Distance
}

// Convert meters to miles
function metersToMiles(meters) {
    return meters * 0.000621371; // 1 meter = 0.000621371 miles
}

// Get sorted parking lots by Manhattan distance
async function getSortedParkingLots(buildingId) {
    try {
        console.log("Received buildingId:", buildingId);
        
        // Get selected building's Mercator coordinates
        const building = await Building.findByPk(buildingId);

        if (!building || !building.mercator_coordinates) {
            throw new Error("Building not found or missing coordinates");
        }

        const buildingCoords = building.mercator_coordinates.coordinates; // MULTIPOINT array

        if (!Array.isArray(buildingCoords) || buildingCoords.length === 0) {
            throw new Error("Invalid building coordinates");
        }

        console.log(`Building has ${buildingCoords.length} coordinate(s)`, buildingCoords);

        // Get all parking lots and compute distances
        const parkingLots = await ParkingLot.findAll();
        const lotDistances = parkingLots.map(lot => {
            if (!lot.mercator_coordinates || !Array.isArray(lot.mercator_coordinates.coordinates)) {
                console.warn(`Skipping lot ${lot.name} due to missing or invalid coordinates`);
                return null;
            }

            const lotCoords = lot.mercator_coordinates.coordinates; // MULTIPOINT array
            console.log(`Lot ${lot.name} has ${lotCoords.length} coordinate(s)`, lotCoords);
            console.log("Building coordinates:", buildingCoords);

            let minDistance = Infinity;

            // Compare all building points to all lot points
            for (const bCoord of buildingCoords) {
                for (const lCoord of lotCoords) {
                    if (bCoord.length >= 2 && lCoord.length >= 2) {
                        const distance = manhattanDistance(bCoord.slice(0, 2), lCoord.slice(0, 2)); 
                        if (distance < minDistance) {
                            minDistance = distance;
                        }
                    }
                }
            }

            return {
                id: lot.id,
                name: lot.name,
                distance_meters: minDistance,
                distance_miles: metersToMiles(minDistance),
            };
        }).filter(lot => lot !== null); // Remove any skipped lots

        // Sort by distance (ascending)
        lotDistances.sort((a, b) => a.distance_meters - b.distance_meters);

        return lotDistances;
    } catch (error) {
        throw new Error(`Wayfinding error: ${error.message}`);
    }
}

module.exports = {
    getSortedParkingLots,
};

