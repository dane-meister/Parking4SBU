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
          if (!row.Location || !row.mercator_coordinates) {
            console.error("Skipping invalid row:", row);
            return;
          }

          const totalCapacity = parseInt(row.Capacity) || 0;

          // Sum up all typed capacities
          const typedCapacities = [
            parseInt(row["Faculty Capacity"]) || 0,
            parseInt(row["Commuter Perimeter Capacity"]) || 0,
            parseInt(row["Commuter Core Capacity"]) || 0,
            parseInt(row["Commuter Satellite Capacity"]) || 0,
            parseInt(row["Metered Capacity"]) || 0,
            parseInt(row["Resident Capacity"]) || 0,
            parseInt(row["ADA Capacity"]) || 0,
            parseInt(row["EV Charging Capacity"]) || 0,
          ];
          const generalCapacity = totalCapacity - typedCapacities.reduce((sum, val) => sum + val, 0);

          // Sum up all typed availabilities
          const typedAvailabilities = [
            parseInt(row["Faculty Availibility"]) || 0,
            parseInt(row["Commuter Perimeter Availibility"]) || 0,
            parseInt(row["Commuter Core Availibility"]) || 0,
            parseInt(row["Commuter Satellite Availibility"]) || 0,
            parseInt(row["Metered Availibility"]) || 0,
            parseInt(row["Resident Availibility"]) || 0,
            parseInt(row["ADA Availibility"]) || 0,
            parseInt(row["EV Charging Availibility"]) || 0,
          ];
          const generalAvailability = generalCapacity > 0
            ? Math.max(0, totalCapacity - typedAvailabilities.reduce((sum, val) => sum + val, 0))
            : 0;

          // Push the parsed data into the results array
          results.push({
            name: row.Name, // Parking lot name
            location: sequelize.literal(`ST_GeomFromText('${row.Location}', 4326)`), // Location coordinates
            mercator_coordinates: sequelize.literal(`ST_GeomFromText('${row.mercator_coordinates}', 3857)`), // Mercator coordinates
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
            general_capacity: generalCapacity, // General capacity
            general_availability: generalAvailability, // General availability
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


