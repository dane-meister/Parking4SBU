const fs = require('fs'); // File system module to read files
const csv = require('csv-parser'); // Module to parse CSV files
const path = require("path"); // Path module to handle file paths
const { Building, sequelize } = require("../models");

// Function to read a CSV file and populate the database with building data
const populateBuildings = async () => {
  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    console.log('Database connected.');

    // Read the CSV file and process each row
    fs.createReadStream(path.join(__dirname, "../csv/buildings_with_mercator.csv")) // Path to the CSV file
      .pipe(csv()) // Parse the CSV file
      .on('data', async (row) => { // Event listener for each row in the CSV
        const { campus, building_name, location, mercator_coordinates } = row; // Destructure row data

        try {
          // Insert the row data into the Building table
          await Building.create({
            campus,
            building_name,
            location: sequelize.literal(`ST_GeomFromText('${location}', 4326)`), // Convert location to spatial data
            mercator_coordinates: sequelize.literal(`ST_GeomFromText('${mercator_coordinates}', 3857)`), // Convert mercator coordinates to spatial data
          });
          console.log(`Inserted: ${building_name}`); // Log successful insertion
        } catch (error) {
          // Log any errors during insertion
          console.error(`Error inserting ${building_name}:`, error.message);
        }
      })
      .on('end', () => { // Event listener for when the CSV processing is complete
        console.log('CSV processing completed.');
        sequelize.close(); // Close the database connection
      });

  } catch (error) {
    // Log any errors during database connection
    console.error('Error connecting to database:', error);
  }
};

// Run the function to populate the database
populateBuildings();
