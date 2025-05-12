const { Reservation, ParkingLot, Vehicle, User, sequelize, Sequelize } = require('../models');
const { faker } = require('@faker-js/faker');
const { Op } = Sequelize;

async function populateCurrentReservations() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");

    // Fetch all lots, vehicles, and non-admin users
    const lots = await ParkingLot.findAll();
    const vehicles = await Vehicle.findAll();
    const users = await User.findAll({
      where: {
        user_type: { [Op.ne]: 'admin' }
      }
    });

    if (!lots.length || !vehicles.length || !users.length) {
      console.error("Missing lots, vehicles, or users.");
      return;
    }

    // Track how many spots are used per lot
    const lotCapacities = {};
    lots.forEach(lot => {
      lotCapacities[lot.id] = {
        capacity: lot.capacity,
        used: 0
      };
    });

    // Set reservation window: today at 00:00 to today at 23:59
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const reservationsData = [];

    const spotTypes = [
      'faculty', 'commuter_core', 'commuter_perimeter', 'commuter_satellite',
      'resident', 'visitor', 'metered', 'ada', 'ev_charging'
    ];

    // Generate up to 2000 reservations
    for (let i = 0; i < 2000; i++) {
      const availableLots = lots.filter(
        lot => lotCapacities[lot.id].used < lotCapacities[lot.id].capacity
      );
      if (!availableLots.length) {
        console.warn("All lots have reached capacity.");
        break;
      }

      const selectedLot = faker.helpers.arrayElement(availableLots);
      lotCapacities[selectedLot.id].used += 1;

      const randomUser = faker.helpers.arrayElement(users);
      const randomVehicle = faker.helpers.arrayElement(vehicles);
      const randomSpotType = faker.helpers.arrayElement(spotTypes);

      reservationsData.push({
        user_id: randomUser.user_id,
        parking_lot_id: selectedLot.id,
        vehicle_id: randomVehicle.vehicle_id,
        start_time: startOfDay,
        end_time: endOfDay,
        total_price: faker.commerce.price(10, 30, 2),
        spot_count: 1,
        event_description: null,
        status: 'confirmed',
        spot_type: randomSpotType
      });
    }

    const inserted = await Reservation.bulkCreate(reservationsData);
    console.log(`Inserted ${inserted.length} current-day reservations.`);
  } catch (error) {
    console.error("Error populating current reservations:", error);
  }
}

populateCurrentReservations();
