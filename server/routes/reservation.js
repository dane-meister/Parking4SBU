const express = require('express');
const router = express.Router();
const { Reservation } = require('../models');
const { requireAuth } = require('./auth');

// Create a reservation
router.post('/', async (req, res) => {
    try {
      const {
        user_id,          // normally from session, not the frontend
        parking_lot_id,
        start_time,
        end_time
      } = req.body;
  
      // TEMP values for now
      const reservation = await Reservation.create({
        user_id,
        parking_lot_id,
        vehicle_id: 1, // TODO: Replace with selected vehicle ID
        start_time,
        end_time,
        total_price: 10.5,
        spot_count: 1,
        event_description: "Test Reservation",
        status: 'pending'
      });
  
      res.status(201).json({ message: "Reservation created", reservation });
    } catch (err) {
      console.error("Error creating reservation:", err);
      res.status(500).json({ message: "Failed to create reservation", error: err.message });
    }
  });
  
  module.exports = router;