const express = require('express');
const router = express.Router();
const { Reservation, ParkingLot, Vehicle } = require('../models');

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
            event_description,
            spot_type
        } = req.body;

        console.log("Received reservation data:", req.body);

        if (!user_id || !parking_lot_id || !vehicle_id || !start_time || !end_time || !spot_type) {
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
            spot_type,
            status: 'confirmed'
        });
    
        res.status(201).json({ message: "Reservation created", reservation });
    } catch (err) {
      console.error("Error creating reservation:", err);
      res.status(500).json({ message: "Failed to create reservation", error: err.message });
    }
  });

  // GET: All reservations for the current user
router.get('/:user_id', async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const reservations = await Reservation.findAll({
        where: { user_id },
        include: [
          { model: ParkingLot, attributes: ['name'] },
          { model: Vehicle, attributes: ['plate'] }
        ],
        order: [['start_time', 'DESC']]
      });
  
      res.json({ reservations });
    } catch (err) {
      console.error('Error fetching reservations:', err);
      res.status(500).json({ message: "Failed to fetch reservations", error: err.message });
    }
  });
  
  module.exports = router;