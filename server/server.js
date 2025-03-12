const express = require("express");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// API Routes

// Test PostgreSQL connection
pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Database connected! Server time:", res.rows[0].now);
  }
});

// Fetch all buildings
app.get("/api/buildings", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM buildings");
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Fetch all parking lots
  app.get("/api/parking-lots", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM parking_lots");
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });