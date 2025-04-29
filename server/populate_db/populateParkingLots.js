const fs = require("fs"); // File system module for reading files
const path = require("path"); // Path module for handling file paths
const csv = require("csv-parser"); // CSV parser module for parsing CSV files
const { ParkingLot, sequelize } = require("../models");

// Function to parse CSV data and insert it into the database
async function insertParkingLots() {
  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    const results = []; // Array to store parsed parking lot data

    // Read the CSV file containing parking lot data
    fs.createReadStream(path.join(__dirname, "../csv/parking_lots_with_mercator.csv"))
      .pipe(csv()) // Parse the CSV file
      .on("data", (row) => {
        try {
          // Extract only the first two coordinates [X, Y] from the Location and Mercator fields
          const locationCoords = row.Location.match(/[-\d.]+/g).slice(0, 2);
          const mercatorCoords = row.mercator_coordinates.match(/[-\d.]+/g).slice(0, 2);

          // Validate that both coordinate sets are present and valid
          if (!locationCoords || locationCoords.length < 2 || !mercatorCoords || mercatorCoords.length < 2) {
            console.error("Skipping invalid row:", row);
            return;
          }

          // Convert coordinates to GeoJSON format for PostGIS
          const locationGeoJSON = `{
            "type": "MultiPoint",
            "coordinates": [[${locationCoords[1]}, ${locationCoords[0]}]]  
          }`;
          const mercatorGeoJSON = `{
            "type": "MultiPoint",
            "coordinates": [[${mercatorCoords[0]}, ${mercatorCoords[1]}]]  
          }`;

          // Push the parsed data into the results array
          results.push({
            name: row.Name, // Parking lot name
            location: sequelize.literal(`ST_SetSRID(ST_GeomFromGeoJSON('${locationGeoJSON}'), 4326)`), // GeoJSON for geographic coordinates
            mercator_coordinates: sequelize.literal(`ST_SetSRID(ST_GeomFromGeoJSON('${mercatorGeoJSON}'), 3857)`), // GeoJSON for Mercator coordinates
            capacity: parseInt(row.Capacity) || 0, // Total capacity
            faculty_capacity: parseInt(row["Faculty Capacity"]) || 0, // Faculty capacity
            faculty_availability: parseInt(row["Faculty Availibility"]) || 0, // Faculty availability
            commuter_perimeter_capacity: parseInt(row["Commuter Perimeter Capacity"]) || 0, // Commuter perimeter capacity
            commuter_perimeter_availability: parseInt(row["Commuter Perimeter Availibility"]) || 0, // Commuter perimeter availability
            commuter_core_capacity: parseInt(row["Commuter Core Capacity"]) || 0, // Commuter core capacity
            commuter_core_availability: parseInt(row["Commuter Core Availibility"]) || 0, // Commuter core availability
            commuter_satellite_capacity: parseInt(row["Commuter Satellite Capacity"]) || 0, // Commuter satellite capacity
            commuter_satellite_availability: parseInt(row["Commuter Satellite Availibility"]) || 0, // Commuter satellite availability
            metered_capacity: parseInt(row["Metered Capacity"]) || 0, // Metered capacity
            metered_availability: parseInt(row["Metered Availibility"]) || 0, // Metered availability
            resident_capacity: parseInt(row["Resident Capacity"]) || 0, // Resident capacity
            resident_availability: parseInt(row["Resident Availibility"]) || 0, // Resident availability
            resident_zone: row["Resident Zone"] === "NULL" ? null : row["Resident Zone"], // Resident zone (null if "NULL")
            ada_capacity: parseInt(row["ADA Capacity"]) || 0, // ADA capacity
            ada_availability: parseInt(row["ADA Availibility"]) || 0, // ADA availability
            ev_charging_capacity: parseInt(row["EV Charging Capacity"]) || 0, // EV charging capacity
            ev_charging_availability: parseInt(row["EV Charging Availibility"]) || 0, // EV charging availability
            covered: row.Covered.toLowerCase() === "true", // Whether the parking lot is covered
          });
        } catch (error) {
          // Log any errors encountered while processing a row
          console.error("Error processing row:", row, error);
        }
      })
      .on("end", async () => {
        try {
          // Insert the parsed data into the database
          await ParkingLot.bulkCreate(results);
          console.log("Data inserted successfully!");
        } catch (error) {
          // Log any errors encountered during database insertion
          console.error("Error inserting into database:", error);
        }
      });
  } catch (error) {
    // Log any errors encountered while processing the CSV file
    console.error("Error processing CSV file:", error);
  }
}

// Run the insertion function
insertParkingLots();


