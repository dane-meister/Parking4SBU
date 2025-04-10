// Function to convert EPSG:4326 (Lat/Lon) to EPSG:3857 (Web Mercator)
function epsg4326toEpsg3857(coordinates) {
    let x = (coordinates[0] * 20037508.34) / 180;
    let y =
        Math.log(Math.tan(((90 + coordinates[1]) * Math.PI) / 360)) /
        (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    return [x, y];
}

// Function to compute Manhattan Distance in meters
function manhattanDistance(coord1, coord2) {
    let dx = Math.abs(coord2[0] - coord1[0]); // Absolute X difference
    let dy = Math.abs(coord2[1] - coord1[1]); // Absolute Y difference
    return dx + dy; // Sum for Manhattan Distance
}

// Function to convert meters to miles
function metersToMiles(meters) {
    return meters * 0.000621371; // 1 meter = 0.000621371 miles
}

// Input coordinates (Longitude, Latitude)
const lonLat1 = [-73.127930, 40.920929]; 

// Convert to Web Mercator (EPSG:3857)
const mercatorCoords1 = epsg4326toEpsg3857(lonLat1);
console.log(mercatorCoords1);

// // Compute Manhattan Distance in meters
// const distanceMeters = manhattanDistance(mercatorCoords1, mercatorCoords2);

// // Convert distance to miles
// const distanceMiles = metersToMiles(distanceMeters);

// console.log(`Manhattan Distance: ${distanceMeters.toFixed(2)} meters`);
// console.log(`Manhattan Distance: ${distanceMiles.toFixed(4)} miles`);