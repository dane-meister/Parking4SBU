const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const sequelize = require("./db");
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservation');
const popularTimesRoutes = require('./routes/popularTimes');
const availabilityRoutes = require('./routes/availability');
const adminRoutes = require('./routes/admin');
const ticketRoutes = require('./routes/ticket');
const { computeAvailability } = require('./routes/availability');

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

// Authentication routes
app.use("/api/auth", authRoutes);

// Reservation routes
app.use("/api/reservations", reservationRoutes);

// Popular times routes
app.use("/api/popular-times", popularTimesRoutes);

// Lot availability routes
app.use('/api/lot-availability', availabilityRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);

app.use('/api/tickets', ticketRoutes);

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
    const parkingLots = await ParkingLot.findAll({
      include: [{
        model: Rate,
      }]
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
      const { start, end } = req.query;

      if (!start || !end) {
        return res.status(400).json({ message: "Missing start or end query params." });
      }

      const sortedLots = await getSortedParkingLots(buildingId);
      const availabilityMap = await computeAvailability(start, end);

     const enrichedLots = sortedLots.map(lot => ({
      ...lot,
      availability: availabilityMap[lot.id]?.hourlyAvailability ?? {}
    }));

    res.json(enrichedLots);
  } catch (error) {
      res.status(500).json({ message: "Error computing wayfinding distances", error: error.message });
  }
});
  
sequelize.authenticate()
  .then(() => {
    console.log("Database connected successfully.");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

  module.exports = app