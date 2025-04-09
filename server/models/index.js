// Import required modules
const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");

// Get the base name of the current file
const basename = path.basename(__filename);

// Determine the environment (default to "development" if not set)
const env = process.env.NODE_ENV || "development";

// Load the configuration for the current environment
const config = require(__dirname + "/../config/config.json")[env];

// Initialize an empty object to hold the database models and Sequelize instance
const db = {};

// Initialize Sequelize instance based on configuration
let sequelize;
if (config.use_env_variable) {
  // If an environment variable is specified, use it to connect to the database
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Otherwise, use the database credentials from the configuration file
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load models and associate them with the `db` object
const Building = require("./Building"); // Import the Building model
const ParkingLot = require("./ParkingLot"); // Import the ParkingLot model
const User = require("./User"); // Import the User model

// Add models to the `db` object
db.Building = Building;
db.ParkingLot = ParkingLot;

// Add Sequelize instance and constructor to the `db` object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the `db` object for use in other parts of the application
module.exports = db;

