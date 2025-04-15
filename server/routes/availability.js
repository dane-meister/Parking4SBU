const express = require('express');
const router = express.Router();
const { Reservation, ParkingLot } = require('../models');
const { Op } = require('sequelize');

async function computeAvailability(start, end) {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const buckets = getHourlyBuckets(startTime, endTime);
  
    const reservations = await Reservation.findAll({
      where: {
        [Op.and]: [
          { status: 'confirmed' },
          {
            [Op.or]: [
              { start_time: { [Op.between]: [startTime, endTime] } },
              { end_time: { [Op.between]: [startTime, endTime] } },
              {
                start_time: { [Op.lte]: startTime },
                end_time: { [Op.gte]: endTime }
              }
            ]
          }
        ]
      }
    });
  
    const parkingLots = await ParkingLot.findAll();
  
    const availabilityMap = {};
  
    for (const lot of parkingLots) {
      const lotId = lot.id;
      availabilityMap[lotId] = {
        lotId,
        name: lot.name,
        capacity: lot.capacity,
        hourlyAvailability: {}
      };
  
      for (const hour of buckets) {
        const availabilityByType = {
          faculty: lot.faculty_capacity ?? 0,
          commuter_core: lot.commuter_core_capacity ?? 0,
          commuter_perimeter: lot.commuter_perimeter_capacity ?? 0,
          commuter_satellite: lot.commuter_satellite_capacity ?? 0,
          resident: lot.resident_capacity ?? 0,
          metered: lot.metered_capacity ?? 0,
          ada: lot.ada_capacity ?? 0,
          ev_charging: lot.ev_charging_capacity ?? 0,
          total: lot.capacity ?? 0,
        };
  
        const overlapping = reservations.filter(r =>
          r.parking_lot_id === lotId &&
          new Date(r.start_time) <= hour &&
          new Date(r.end_time) > hour
        );
  
        for (const r of overlapping) {
          const type = r.spot_type;
          const count = r.spot_count ?? 1;
  
          if (availabilityByType[type] !== undefined) {
            availabilityByType[type] = Math.max(0, availabilityByType[type] - count);
          }
  
          availabilityByType.total = Math.max(0, availabilityByType.total - count);
        }
  
        const hourKey = hour.toISOString();
        availabilityMap[lotId].hourlyAvailability[hourKey] = availabilityByType;
      }
    }
  
    return availabilityMap;
  }
  

// Get all hours between start and end (rounded to hour buckets)
function getHourlyBuckets(start, end) {
    const buckets = [];
    const current = new Date(start);
    current.setMinutes(0, 0, 0);
  
    while (current < end) {
      buckets.push(new Date(current));
      current.setHours(current.getHours() + 1);
    }
  
    return buckets;
  }

router.get("/", async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: "Missing start or end query params." });
    }

    const startTime = new Date(start);
    const endTime = new Date(end);
    const buckets = getHourlyBuckets(startTime, endTime);

    const reservations = await Reservation.findAll({
      where: {
        [Op.and]: [
          { status: 'confirmed' },
          {
            [Op.or]: [
              {
                start_time: { [Op.between]: [startTime, endTime] }
              },
              {
                end_time: { [Op.between]: [startTime, endTime] }
              },
              {
                start_time: { [Op.lte]: startTime },
                end_time: { [Op.gte]: endTime }
              }
            ]
          }
        ]
      }
    });

    const parkingLots = await ParkingLot.findAll();

    const availabilityMap = {};

    for (const lot of parkingLots) {
        try {
          const lotId = lot.id;
          availabilityMap[lotId] = {
            lotId,
            name: lot.name,
            capacity: lot.capacity,
            hourlyAvailability: {}
          };
      
          for (const hour of buckets) {
            const availabilityByType = {
              faculty: lot.faculty_capacity ?? 0,
              commuter_core: lot.commuter_core_capacity ?? 0,
              commuter_perimeter: lot.commuter_perimeter_capacity ?? 0,
              commuter_satellite: lot.commuter_satellite_capacity ?? 0,
              resident: lot.resident_capacity ?? 0,
              metered: lot.metered_capacity ?? 0,
              ada: lot.ada_capacity ?? 0,
              ev_charging: lot.ev_charging_capacity ?? 0,
              total: lot.capacity ?? 0,
            };
      
            const overlapping = reservations.filter(r =>
              r.parking_lot_id === lotId &&
              new Date(r.start_time) <= hour &&
              new Date(r.end_time) > hour
            );
      
            for (const r of overlapping) {
              const type = r.spot_type;
              const count = r.spot_count ?? 1;
      
              if (availabilityByType[type] !== undefined) {
                availabilityByType[type] = Math.max(0, availabilityByType[type] - count);
              }
      
              availabilityByType.total = Math.max(0, availabilityByType.total - count);
            }
      
            const hourKey = hour.toISOString();
            availabilityMap[lotId].hourlyAvailability[hourKey] = availabilityByType;
          }
        } catch (err) {
          console.error(`Error processing lot ID ${lot.id}:`, err);
        }
      }
      

    res.json(Object.values(availabilityMap));
  } catch (error) {
    console.error("Error computing lot availability:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
module.exports.computeAvailability = computeAvailability;

