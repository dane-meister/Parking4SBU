const { Reservation, ParkingLot, Vehicle, User } = require('../models');
const sequelize = require('../db'); // make sure to import your sequelize instance
const { faker } = require('@faker-js/faker');


async function populateReservations() {
    try {
        //connect db
        await sequelize.authenticate();
        console.log("Database connected.");

        const lotId = 15; // replace with your actual lot id or select one from your database

        // Get the parking lot to know its capacity (or just for reference)
        const parkingLot = await ParkingLot.findOne({ where: { id: lotId } });
        if (!parkingLot) {
            console.error(`Parking lot with id ${lotId} not found.`);
            return;
        }

        // Retrieve all vehicles from the Vehicles table.
        let vehicles = await Vehicle.findAll();
        console.log("Existing vehicles:", vehicles.map(v => v.vehicle_id));
        if (vehicles.length === 0) {
            console.error("No vehicles found. Please seed vehicles first.");
            return;
        }
        vehicles = vehicles.filter(vehicle => vehicle.vehicle_id !== 2);

        const users = await User.findAll();
        if (users.length === 0) {
            console.error("No users found. Please ensure there are users in the database.");
            return;
        }


        const now = new Date();
        //define the start period: 1 month ago.
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);

        const reservationsData = [];

        const spotTypes = [
            'faculty', 'commuter_core', 'commuter_perimeter', 'commuter_satellite',
            'resident', 'visitor', 'metered', 'ada', 'ev_charging'
        ];

        // Create 100 random reservations within the last month.
        for (let i = 0; i < 100; i++) {
            //random date between monthAgo and now.
            const randomTimestamp = monthAgo.getTime() + Math.random() * (now.getTime() - monthAgo.getTime());
            const randomStart = new Date(randomTimestamp);

            //round start time to the nearest hour for simplicity.
            randomStart.setMinutes(0, 0, 0);

            //set a random duration between 1 and 3 hours.
            const durationHours = faker.number.int({ min: 1, max: 3 });
            const randomEnd = new Date(randomStart);
            randomEnd.setHours(randomEnd.getHours() + durationHours);

            const randomIndex = Math.floor(Math.random() * vehicles.length);
            const randomVehicle = vehicles[randomIndex];

            const randomUser = users[faker.number.int({ min: 0, max: users.length - 1 })];
            const randomSpotType = spotTypes[Math.floor(Math.random() * spotTypes.length)];

            reservationsData.push({
                user_id: randomUser.user_id,
                parking_lot_id: lotId,
                vehicle_id: randomVehicle.vehicle_id,
                start_time: randomStart,
                end_time: randomEnd,
                total_price: faker.commerce.price(5, 20, 2), // random price between 5 and 20
                spot_count: 1,
                event_description: null,
                status: 'confirmed',
                spot_type: randomSpotType
            });
        }

        //bulkCreate to insert reservations.
        const insertedReservations = await Reservation.bulkCreate(reservationsData);
        console.log(`Inserted ${insertedReservations.length} reservations.`);
    } catch (error) {
        console.error("Error seeding reservations:", error);
    } finally {
        //close the database connection.
        await sequelize.close();
    }
}

populateReservations();

