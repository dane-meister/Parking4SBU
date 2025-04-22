require("dotenv").config({ path: __dirname + "/.env" });
const { Sequelize } = require("sequelize");

const connectionString = `postgres://${process.env.DB_USER}:${String(process.env.DB_PASSWORD)}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// const sequelize = new Sequelize(
//   process.env.DB_NAME, 
//   process.env.DB_USER, 
//   String(process.env.DB_PASSWORD), 
//   {
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     dialect: "postgres", 
//     dialectOptions: {
//       application_name: "p4sbu",
//     },
//     logging: process.env.NODE_ENV === "test" ? false : console.log, // Disable logging during test
//   }
// );

const sequelize = new Sequelize(connectionString, {
  dialect: "postgres",
  dialectOptions: process.env.NODE_ENV === "production"
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
        application_name: "p4sbu",
      }
    : {}, // No SSL for local
  logging: process.env.NODE_ENV === "test" ? false : console.log,
});


// Test Connection
// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log("PostgreSQL Connected Successfully!");
//   } catch (error) {
//     console.error("PostgreSQL Connection Failed:", error.message);
//   }
// })();

module.exports = sequelize;

