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
const config = require(__dirname + '/../config/config.js')[env];

// Initialize Sequelize
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Initialize an empty object to hold the database models and Sequelize instance
const db = {};

// Import models as functions and initialize them
db.Building = require("./Building")(sequelize, Sequelize.DataTypes);
db.ParkingLot = require("./ParkingLot")(sequelize, Sequelize.DataTypes);
db.Rate = require("./Rate")(sequelize, Sequelize.DataTypes);
db.User = require("./User")(sequelize, Sequelize.DataTypes);
db.Vehicle = require("./Vehicle")(sequelize, Sequelize.DataTypes);
db.Reservation = require("./Reservation")(sequelize, Sequelize.DataTypes);
db.Feedback = require("./Feedback")(sequelize, Sequelize.DataTypes);

// Setup associations
db.ParkingLot.hasMany(db.Rate, {
  foreignKey: "parking_lot_id",
  onDelete: "CASCADE"
});
db.Rate.belongsTo(db.ParkingLot, {
  foreignKey: "parking_lot_id"
});

db.User.hasMany(db.Vehicle, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  onDelete: "CASCADE",
});
db.Vehicle.belongsTo(db.User, {
  foreignKey: {
    name: "user_id",
    allowNull: false,
  },
  allowNull: false,
});

// Reservation belongs to User
db.Reservation.belongsTo(db.User, {
  foreignKey: "user_id",
  onDelete: "CASCADE"
});

// Reservation belongs to ParkingLot
db.Reservation.belongsTo(db.ParkingLot, {
  foreignKey: "parking_lot_id",
  onDelete: "CASCADE"
});

// Reservation belongs to Vehicle
db.Reservation.belongsTo(db.Vehicle, {
  foreignKey: "vehicle_id",
  onDelete: "CASCADE"
});

// add reverse associations
db.User.hasMany(db.Reservation, { foreignKey: "user_id" });
db.ParkingLot.hasMany(db.Reservation, { foreignKey: "parking_lot_id" });
db.Vehicle.hasMany(db.Reservation, { foreignKey: "vehicle_id" });

// Feedback belongs to User
db.User.hasMany(db.Feedback, {
  foreignKey: "user_id",
  onDelete: "CASCADE"
});
db.Feedback.belongsTo(db.User, {
  foreignKey: "user_id"
});

// Add Sequelize instance and constructor to the `db` object
db.sequelize = sequelize;
db.Sequelize = Sequelize;


db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Database synchronized with models.");
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
  });
  
// Export the `db` object for use in other parts of the application
module.exports = db;

