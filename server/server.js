const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./db");

// Import models
const Building = require("./models/Building");
const ParkingLot = require("./models/ParkingLot");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// API Routes
app.get("/api/buildings", async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching buildings", error: error.message });
  }
});

app.get("/api/parking-lots", async (req, res) => {
  try {
    const parkingLots = await ParkingLot.findAll();
    res.json(parkingLots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching parking lots", error: error.message });
  }
});
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });