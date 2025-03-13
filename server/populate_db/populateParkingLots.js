const ParkingLot = require("../models/ParkingLot");
const sequelize = require("../db");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// Function to parse CSV data and insert it into the database
async function insertParkingLots() {
  try {
    const results = [];

    // Read CSV file
    fs.createReadStream(path.join(__dirname, "../csv/parking_lots_with_mercator.csv"))
      .pipe(csv())
      .on("data", (row) => {
        try {

            // Extract only the first two coordinates [X, Y]
            const locationCoords = row.Location.match(/[-\d.]+/g).slice(0, 2);
            const mercatorCoords = row.mercator_coordinates.match(/[-\d.]+/g).slice(0, 2); 

            if (!locationCoords || locationCoords.length < 2 || !mercatorCoords || mercatorCoords.length < 2) {
              console.error("Skipping invalid row:", row);
              return;
            }

            // Convert to GeoJSON format for PostGIS
            const locationGeoJSON = `{
              "type": "MultiPoint",
              "coordinates": [[${locationCoords[1]}, ${locationCoords[0]}]]  
            }`;
            const mercatorGeoJSON = `{
              "type": "MultiPoint",
              "coordinates": [[${mercatorCoords[0]}, ${mercatorCoords[1]}]]  
            }`;
            results.push({
              name: row.Name,
              location: sequelize.literal(`ST_SetSRID(ST_GeomFromGeoJSON('${locationGeoJSON}'), 4326)`),
              mercator_coordinates: sequelize.literal(`ST_SetSRID(ST_GeomFromGeoJSON('${mercatorGeoJSON}'), 3857)`),
              capacity: parseInt(row.Capacity) || 0,
              faculty_capacity: parseInt(row["Faculty Capacity"]) || 0,
              faculty_availability: parseInt(row["Faculty Availibility"]) || 0,
              commuter_perimeter_capacity: parseInt(row["Commuter Perimeter Capacity"]) || 0,
              commuter_perimeter_availability: parseInt(row["Commuter Perimeter Availibility"]) || 0,
              commuter_core_capacity: parseInt(row["Commuter Core Capacity"]) || 0,
              commuter_core_availability: parseInt(row["Commuter Core Availibility"]) || 0,
              commuter_satellite_capacity: parseInt(row["Commuter Satellite Capacity"]) || 0,
              commuter_satellite_availability: parseInt(row["Commuter Satellite Availibility"]) || 0,
              metered_capacity: parseInt(row["Metered Capacity"]) || 0,
              metered_availability: parseInt(row["Metered Availibility"]) || 0,
              resident_capacity: parseInt(row["Resident Capacity"]) || 0,
              resident_availability: parseInt(row["Resident Availibility"]) || 0,
              resident_zone: row["Resident Zone"] === "NULL" ? null : row["Resident Zone"],
              ada_capacity: parseInt(row["ADA Capacity"]) || 0,
              ada_availability: parseInt(row["ADA Availibility"]) || 0,
              ev_charging_capacity: parseInt(row["EV Charging Capacity"]) || 0,
              ev_charging_availability: parseInt(row["EV Charging Availibility"]) || 0,
              covered: row.Covered.toLowerCase() === "true",
            });
        } catch (error) {
          console.error("Error processing row:", row, error);
        }})
        .on("end", async () => {
          try {
            await ParkingLot.bulkCreate(results);
            console.log("Data inserted successfully!");
          } catch (error) {
            console.error("Error inserting into database:", error);
          }
        });
  } catch (error) {
    console.error("Error processing CSV file:", error);
  }
}

// Run the insertion function
insertParkingLots();


