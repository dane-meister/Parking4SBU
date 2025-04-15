const express = require('express');
const router = express.Router();
const db = require('../models');
const { sequelize, Reservation, ParkingLot, Vehicle, Sequelize } = db;
const { Op } = Sequelize;

// Create a reservation
router.post('/', async (req, res) => {
  const t = await sequelize.transaction(); // start transaction
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

        // Validate required fields
        if (!user_id || !parking_lot_id || !vehicle_id || !start_time || !end_time || !spot_type) {
            return res.status(400).json({ message: "Missing required reservation fields." });
        }

        // Lock existing reservations for that lot and time range
        const overlappingReservations = await Reservation.findAll({
          where: {
            parking_lot_id,
            spot_type,
            status: 'confirmed',
            [Op.or]: [
              { start_time: { [Op.between]: [start_time, end_time] } },
              { end_time: { [Op.between]: [start_time, end_time] } },
              {
                start_time: { [Op.lte]: start_time },
                end_time: { [Op.gte]: end_time }
              }
            ]
          },
          lock: t.LOCK.UPDATE,
          transaction: t
        });

        // Check if there are enough available spots
        const usedSpots = overlappingReservations.reduce((sum, r) => sum + (r.spot_count || 1), 0);

        // 2. Get lot capacity
        const lot = await ParkingLot.findByPk(parking_lot_id, { transaction: t });
        const capacity = lot?.[`${spot_type}_capacity`] ?? 0;

        if (usedSpots + spot_count > capacity) {
          await t.rollback();
          return res.status(409).json({ message: "Not enough spots available." });
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
            status: event_description ? 'pending' : 'confirmed'
        }, { transaction: t });

        await t.commit();
        res.status(201).json({ message: "Reservation created", reservation });
    } catch (err) {
      await t.rollback(); // rollback transaction on error
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