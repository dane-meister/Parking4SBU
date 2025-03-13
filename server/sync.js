const sequelize = require("./db");
const Building = require("./models/Building");
const ParkingLot = require("./models/ParkingLot");

(async () => {
  try {
    await sequelize.sync({ force: true }); 
    console.log("Tables created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
})();
