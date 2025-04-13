const { Building, ParkingLot, Rate } = require("../models");

// Function to compute Manhattan Distance in meters
function manhattanDistance(coord1, coord2) {
    // Validate input coordinates
    if (!coord1 || !coord2 || coord1.length < 2 || coord2.length < 2) {
        console.error("Invalid coordinates for Manhattan Distance:", coord1, coord2);
        return Infinity; // Return large value so it doesn't interfere with min distance logic
    }
    
    // Calculate the absolute differences in X and Y coordinates
    let dx = Math.abs(coord2[1] - coord1[1]); // Absolute X difference
    let dy = Math.abs(coord2[0] - coord1[0]); // Absolute Y difference
    return dx + dy; // Return Manhattan Distance
}

// Convert meters to miles
function metersToMiles(meters) {
    return meters * 0.000621371; // Conversion factor: 1 meter = 0.000621371 miles
}

// Get sorted parking lots by Manhattan distance
async function getSortedParkingLots(buildingId) {
    try {        
        // Retrieve the building by its ID and get its Mercator coordinates
        const building = await Building.findByPk(buildingId);

        // Validate the building and its coordinates
        if (!building || !building.mercator_coordinates) {
            throw new Error("Building not found or missing coordinates");
        }

        const buildingCoords = building.mercator_coordinates.coordinates; // MULTIPOINT array

        // Ensure the building coordinates are valid
        if (!Array.isArray(buildingCoords) || buildingCoords.length === 0) {
            throw new Error("Invalid building coordinates");
        }

        // Retrieve all parking lots from the database
        const parkingLots = await ParkingLot.findAll({
            include: [{
                model: Rate
            }]
        });

        // Map parking lots to their distances from the building
        const lotDistances = parkingLots.map(lot => {
            // Validate parking lot coordinates
            if (!lot.mercator_coordinates || !Array.isArray(lot.mercator_coordinates.coordinates)) {
                console.warn(`Skipping lot ${lot.name} due to missing or invalid coordinates`);
                return null; // Skip invalid lots
            }

            const lotCoords = lot.mercator_coordinates.coordinates; // MULTIPOINT array

            let minDistance = Infinity; // Initialize minimum distance

            // Compare all building points to all parking lot points
            for (const bCoord of buildingCoords) {
                for (const lCoord of lotCoords) {
                    // Ensure both coordinates are valid
                    if (bCoord.length >= 2 && lCoord.length >= 2) {
                        // Compute Manhattan distance and update minimum distance
                        const distance = manhattanDistance(bCoord.slice(0, 2), lCoord.slice(0, 2)); 
                        if (distance < minDistance) {
                            minDistance = distance;
                        }
                    }
                }
            }


            return {
                id: lot.id,
                location: lot.location,
                name: lot.name,
                distance_meters: minDistance,
                distance_miles: metersToMiles(minDistance),
                covered: lot.covered,
                ev_charging_availability: lot.ev_charging_availability,
                ev_charging_capacity: lot.ev_charging_capacity,
                ada_availability: lot.ada_availability,
                ada_capacity: lot.ada_capacity,
                capacity: lot.capacity,
                commuter_core_availability: lot.commuter_core_availability,
                commuter_core_capacity: lot.commuter_core_capacity,
                commuter_perimeter_availability: lot.commuter_perimeter_availability,
                commuter_perimeter_capacity: lot.commuter_perimeter_capacity,
                commuter_satellite_availability: lot.commuter_satellite_availability,
                commuter_satellite_capacity: lot.commuter_satellite_capacity,
                faculty_availability: lot.faculty_availability,
                faculty_capacity: lot.faculty_capacity,
                metered_availability: lot.metered_availability,
                metered_capacity: lot.metered_capacity,
                resident_availability: lot.resident_availability,
                resident_capacity: lot.resident_capacity,
                resident_zone: lot.resident_zone,
                Rates: lot.Rates,
                time: lot.time,
            };
        }).filter(lot => lot !== null); // Remove any skipped lots

        // Sort parking lots by distance in ascending order
        lotDistances.sort((a, b) => a.distance_meters - b.distance_meters);

        return lotDistances; // Return sorted parking lots
    } catch (error) {
        // Handle and propagate errors
        throw new Error(`Wayfinding error: ${error.message}`);
    }
}

module.exports = {
    getSortedParkingLots, // Export the function for external use
};
