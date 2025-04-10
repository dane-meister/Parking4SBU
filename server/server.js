const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const sequelize = require("./db");
const authRoutes = require('./routes/auth');

// Import models
const { Building, ParkingLot, Rate, User } = require("./models");
const { getSortedParkingLots } = require("./services/wayfindingService");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(cookieParser()); // Parse cookies from requests
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000", // Allow requests from the client app
  credentials: true // Allow cookies to be sent with requests
}));

// //authentication routes
app.use("/api/auth", authRoutes);


// API Routes
app.get("/api/buildings", async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching buildings", error: error.message });
  }
});

// Endpoint to fetch all parking lots
app.get("/api/parking-lots", async (req, res) => {
  try {
    console.log("Fetching parking lots..."); // Log when fetching parking lots
    const parkingLots = await ParkingLot.findAll({
      include: [{
        model: Rate,
      }]
    });

    // Log basic association information
    console.log(`Found ${parkingLots.length} parking lots.`);

    parkingLots.forEach((lot, index) => {
      console.log(`\n[${index + 1}] ${lot.name} (ID: ${lot.id})`);

      if (lot.Rates && lot.Rates.length > 0) {
        lot.Rates.forEach((rate, rateIdx) => {
          console.log(
            `  ├── Rate ${rateIdx + 1}: Permit Type: ${rate.permit_type}, Hourly: $${rate.hourly ?? "N/A"}, Daily: $${rate.daily ?? "N/A"}`
          );
        });
      } else {
        console.log("  └── No associated rates found.");
      }
    });

    res.json(parkingLots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parking lots", error: error.message });
  }
});

// Wayfinding endpoint
app.get("/api/wayfinding/:buildingId", async (req, res) => {
  try {
      const { buildingId } = req.params;
      const sortedLots = await getSortedParkingLots(buildingId);
      res.json(sortedLots);
  } catch (error) {
      res.status(500).json({ message: "Error computing wayfinding distances", error: error.message });
  }
});
  
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });