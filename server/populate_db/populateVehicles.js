const { Vehicle } = require('../models');
const sequelize = require('../db');
const { faker } = require('@faker-js/faker');

async function populateVehicles() {
  const totalUsers = 4;
  let usersWithVehicle = new Set();
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    
    const vehiclesData = [];
    for (let i = 0; i < 10; i++) {
      const user_id = 1 + (i % totalUsers);
      let seen_user = false;
      if(usersWithVehicle.has(user_id)){
        seen_user = true;
      }else{
        usersWithVehicle.add(user_id);
      }

      vehiclesData.push({
        plate: faker.vehicle.vin().slice(0, 7), // generate a fake plate 
        make: faker.vehicle.manufacturer(),
        model: faker.vehicle.model(),
        year: faker.date.past(10).getFullYear().toString(),
        color: faker.color.human(),
        isDefault: !seen_user, // mark the first vehicle as default
        user_id: user_id,
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