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

    // Lock the parking lot row to ensure serialized access to its capacity
    const lot = await ParkingLot.findByPk(parking_lot_id, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!lot) {
      await t.rollback();
      return res.status(404).json({ message: "Parking lot not found." });
    }

    const capacityField = `${spot_type}_capacity`;
    const capacity = lot[capacityField] ?? 0;

    // Lock and fetch overlapping reservations
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

    const usedSpots = overlappingReservations.reduce((sum, r) => sum + (r.spot_count || 1), 0);

    if (usedSpots + (spot_count ?? 1) > capacity) {
      await t.rollback();
      return res.status(409).json({ message: "Not enough spots available." });
    }

    // Create reservation
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
    await t.rollback();
    console.error("Error creating reservation:", err);
    res.status(500).json({ message: "Failed to create reservation", error: err.message });
  }
});


// Get reservations for a specific user
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
