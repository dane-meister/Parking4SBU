const express = require('express');
const router = express.Router();
const { Reservation } = require('../models');

// Create a reservation
router.post('/', async (req, res) => {
    try {
        const {
            user_id,
            parking_lot_id,
            vehicle_id,
            start_time,
            end_time,
            total_price,
            spot_count,
            event_description
        } = req.body;

        if (!user_id || !parking_lot_id || !vehicle_id || !start_time || !end_time) {
            return res.status(400).json({ message: "Missing required reservation fields." });
        }
  
        const reservation = await Reservation.create({
            user_id,
            parking_lot_id,
            vehicle_id,
            start_time,
            end_time,
            total_price: total_price ?? 0,
            spot_count: spot_count ?? 1,
            event_description: event_description ?? null,
            status: 'pending'
        });
    
        res.status(201).json({ message: "Reservation created", reservation });
    } catch (err) {
      console.error("Error creating reservation:", err);
      res.status(500).json({ message: "Failed to create reservation", error: err.message });
    }
  });
  
  module.exports = router;