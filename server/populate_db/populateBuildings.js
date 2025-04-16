const fs = require('fs');
const csv = require('csv-parser');
const path = require("path");
const { Building, sequelize } = require("../models");

const populateBuildings = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    const promises = [];

    fs.createReadStream(path.join(__dirname, "../csv/buildings_with_mercator.csv"))
      .pipe(csv())
      .on('data', (row) => {
        const { campus, building_name, location, mercator_coordinates } = row;

        const promise = Building.create({
          campus,
          building_name,
          location: sequelize.literal(`ST_GeomFromText('${location}', 4326)`),
          mercator_coordinates: sequelize.literal(`ST_GeomFromText('${mercator_coordinates}', 3857)`),
        })
        .then(() => {
          console.log(`Inserted: ${building_name}`);
        })
        .catch((err) => {
          console.error(`Error inserting ${building_name}:`, err.message);
        });

        promises.push(promise); // collect all promises
      })
      .on('end', async () => {
        try {
          await Promise.all(promises); // wait for all insertions
          console.log('✅ All buildings inserted.');
        } catch (err) {
          console.error('❌ Error waiting for insertions:', err.message);
        } finally {
          console.log('🔌 Database connection closed.');
        }
      });

  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

populateBuildings();
