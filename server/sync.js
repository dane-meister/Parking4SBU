// Import the Sequelize instance from the database configuration file
const sequelize = require("./db");

// Import the Building model
const Building = require("./models/Building");

// Import the ParkingLot model
const ParkingLot = require("./models/ParkingLot");

// Immediately Invoked Async Function Expression (IIFE) to handle database synchronization
(async () => {
  try {
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
