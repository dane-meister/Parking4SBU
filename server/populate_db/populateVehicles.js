const { Vehicle } = require('../models');
const sequelize = require('../db');
const { faker } = require('@faker-js/faker');

async function populateVehicles() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    
    const vehiclesData = [];
    for (let i = 0; i < 10; i++) {
      vehiclesData.push({
        plate: faker.vehicle.vin().slice(0, 7), // generate a fake plate 
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.date.past(10).getFullYear().toString(),
        color: faker.color.human(),
        isDefault: i === 0, // mark the first vehicle as default
      });
    }

    await Vehicle.bulkCreate(vehiclesData);
    console.log(`Inserted ${vehiclesData.length} vehicles.`);
  } catch (error) {
    console.error("Error seeding vehicles:", error);
  } finally {
    await sequelize.close();
  }
}

populateVehicles();