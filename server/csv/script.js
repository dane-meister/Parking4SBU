const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Function to convert EPSG:4326 (Lat/Lon) to EPSG:3857 (Web Mercator)
function epsg4326toEpsg3857(coordinates) {
    let x = (coordinates[0] * 20037508.34) / 180;
    let y =
        Math.log(Math.tan(((90 + coordinates[1]) * Math.PI) / 360)) /
        (Math.PI / 180);
    y = (y * 20037508.34) / 180;
    return [x, y];
}

// Function to extract multiple Lat/Lon pairs from MULTIPOINT format
function extractLatLonMulti(locationStr) {
    const matches = [...locationStr.matchAll(/([-.\d]+)\s+([-.\d]+)/g)];
    return matches.map(match => [parseFloat(match[2]), parseFloat(match[1])]); // Convert to [Longitude, Latitude]
}

// Read and process CSV
const inputCsv = "parking_lot_data.csv"; // Update filename for building data
const outputCsv = "parking_lots_with_mercator.csv"; // Output file with Mercator coordinates

let data = [];
fs.createReadStream(inputCsv)
    .pipe(csv())
    .on("data", (row) => {
        const locationStr = row["Location"]; // Extract location column
        const latLonList = extractLatLonMulti(locationStr);

        if (latLonList.length > 0) {
            const mercatorCoordsList = latLonList
                .map(coords => epsg4326toEpsg3857(coords)) // Convert all lat/lon pairs
                .map(merc => `(${merc[0]} ${merc[1]})`) // Format for MULTIPOINT
                .join(", "); // Join all points into a single MULTIPOINT

            row["mercator_coordinates"] = `MULTIPOINT (${mercatorCoordsList})`;
        } else {
            row["mercator_coordinates"] = "INVALID_COORDINATES";
        }

        data.push(row);
    })
    .on("end", () => {
        console.log("CSV processing complete. Writing new file...");

        const csvWriter = createCsvWriter({
            path: outputCsv,
            header: Object.keys(data[0]).map((key) => ({ id: key, title: key })),
        });

        csvWriter
            .writeRecords(data)
            .then(() => console.log(`✅ New CSV saved as ${outputCsv}`))
            .catch((err) => console.error("Error writing CSV:", err));
    });
