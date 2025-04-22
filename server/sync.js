// Import the Sequelize instance from the database configuration file
const { sequelize } = require("./models");

const { ParkingLot, Rate, Building, User, Reservation, Vehicle, Feedback } = require('./models');

// Immediately Invoked Async Function Expression (IIFE) to handle database synchronization
(async () => {
  try {
     // Drop enum types that might cause conflicts manually before syncing
     await sequelize.query('DROP TYPE IF EXISTS "enum_Users_user_type" CASCADE');
     await sequelize.query('DROP TYPE IF EXISTS "enum_Users_permit_type" CASCADE');
     await sequelize.query('DROP TYPE IF EXISTS "enum_Reservations_status" CASCADE');
    // Synchronize all defined models with the database, forcing the recreation of tables
    await sequelize.sync({ force: true }); 
    console.log("Tables created successfully!");
    process.exit(); // Exit the process successfully
  } catch (error) {
    // Log any errors that occur during the synchronization process
    console.error("Error syncing database:", error);
    process.exit(1); // Exit the process with an error code
  }
})();
