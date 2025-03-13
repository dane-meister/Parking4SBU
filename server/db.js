require("dotenv").config({ path: __dirname + "/.env" });
const { Sequelize, Op } = require("sequelize");
const Building = require("./models/Building");
const ParkingLot = require("./models/ParkingLot");

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  String(process.env.DB_PASSWORD), 
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres", 
    dialectOptions: {
      application_name: "p4sbu",
    },
    logging: console.log, 
  }
);

// Test Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL Connected Successfully!");
  } catch (error) {
    console.error("PostgreSQL Connection Failed:", error.message);
  }
})();

module.exports = sequelize;

