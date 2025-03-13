const fs = require('fs');
const csv = require('csv-parser');
const sequelize = require('../db');  
const Building = require("../models/Building");
const path = require("path");

// Read CSV and insert into the database
const populateBuildings = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    fs.createReadStream(path.join(__dirname, "../csv/buildings_with_mercator.csv"))
      .pipe(csv())
      .on('data', async (row) => {
        const { campus, building_name, location, mercator_coordinates } = row;

        try {
          await Building.create({
            campus,
            building_name,
            location: sequelize.literal(`ST_GeomFromText('${location}', 4326)`),
            mercator_coordinates: sequelize.literal(`ST_GeomFromText('${mercator_coordinates}', 3857)`),
          });
          console.log(`Inserted: ${building_name}`);
        } catch (error) {
          console.error(`Error inserting ${building_name}:`, error.message);
        }
      })
      .on('end', () => {
        console.log('CSV processing completed.');
        sequelize.close();
      });

  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

// Run the function
populateBuildings();
