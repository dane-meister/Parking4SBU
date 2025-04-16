const { sequelize } = require("./models");

(async () => {
  try {
    await sequelize.sync({ force: true }); // creates all tables fresh
    console.log("✅ Schema generated successfully.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Schema generation failed:", err);
    process.exit(1);
  }
})();
