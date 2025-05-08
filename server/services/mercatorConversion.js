// Function to convert EPSG:4326 (Lon, Lat) to EPSG:3857 (Web Mercator)
function epsg4326toEpsg3857(coordinates) {
    let x = (coordinates[0] * 20037508.34) / 180;
    let y =
        Math.log(Math.tan(((90 + coordinates[1]) * Math.PI) / 360)) /
        (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    return [x, y];
}

module.exports = { epsg4326toEpsg3857 };