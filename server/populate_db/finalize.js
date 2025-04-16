const { sequelize } = require("../models");

(async () => {
  try {
    await new Promise(res => setTimeout(res, 200)); // 200ms pause
    if (sequelize) {
      await sequelize.close();
      console.log("✅ Final DB connection closed.");
    }
  } catch (err) {
    console.error("❌ Error closing connection:", err);
  }
})();
