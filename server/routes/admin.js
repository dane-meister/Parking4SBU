const express = require("express");
const { User, Feedback, Reservation, ParkingLot, Rate, sequelize, Building } = require("../models");
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Op } = require('sequelize');

const authenticate = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

const coordinateConverter = require('../services/mercatorConversion');

//to sign one-time tokens and email them
const nodemailer = require('nodemailer');
const mailer = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: false,  //port 587
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Get all users
router.get("/users", authenticate, requireAdmin, async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

// Approve a user account (for admin use)
router.put("/users/:user_id/approve", authenticate, async (req, res) => {
  console.log("user: ", req.user.user_id, " approved");
  try {
      if (req.user.user_type !== "admin") {
          return res.status(403).json({ message: "Forbidden" });
      }

      const { user_id } = req.params;

      const user = await User.findByPk(user_id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      user.isApproved = true;
      await user.save();

      //send magic-link
      const token = jwt.sign(
          { user_id, type: 'email-verify' },
          process.env.JWT_SECRET,
          { expiresIn: '10m' }
      );

      const link = `${process.env.FRONTEND_URL}/auth/verify?token=${token}`;
      await mailer.sendMail({
          to: user.email,
          from: process.env.SMTP_FROM,
          subject: 'Your account is approved – activate now',
          text: `Hi ${user.first_name},\n\n` +
              `Your account has been approved! Click within 10 minutes to activate:\n\n${link}`
      });
      res.json({ message: 'User approved & verification email sent' });

  } catch (error) {
      res.status(500).json({ message: "Error approving user", error: error.message });
  }
});

// Resend verification email by email
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "No account associated with that email" });
    }

    if (!user.isApproved) {
      return res.status(400).json({ message: "Account is not approved yet" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Account is already verified" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, type: 'email-verify' },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    const link = `${process.env.FRONTEND_URL}auth/verify?token=${token}`;
    await mailer.sendMail({
      to: user.email,
      from: process.env.SMTP_FROM,
      subject: 'Verify your account',
      text: `Hi ${user.first_name},\n\nYour account has been approved! Click the link below to verify it:\n\n${link}`
    });

    res.json({ message: "Verification email resent successfully" });
  } catch (error) {
    console.error("Error resending verification:", error.message);
    res.status(500).json({ message: "Server error while resending verification email" });
  }
});


// Delete a user account (for admin use)
router.delete("/user/:user_id/remove", authenticate, async (req, res) => {
  try {
      if (req.user.user_type !== "admin") {
          return res.status(403).json({ message: "Forbidden" });
      }

      const { user_id } = req.params;

      // const deleted = await User.destroy({ where: { user_id } });

      // if (deleted === 0) {
      //     return res.status(404).json({ message: "User not found" });
      // }

      //load user to check their approval state
      const user = await User.findByPk(user_id);
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      //if still pending approval, so deletion means user is denied.
      if (!user.isApproved) {
          await mailer.sendMail({
              to: user.email,
              from: process.env.SMTP_FROM,
              subject: 'Registration Denied',
              text:
                  `Hi ${user.first_name},\n\n` +
                  `We’re sorry, but your registration request has been denied by our admin.\n\n` +
                  `If you believe this was a mistake, please contact us.\n\n` +
                  `– The SBU Parking Team-06`
          });
      }

      //delete user
      await user.destroy();

      res.json({ message: "User deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

// Edit a user account
router.put("/users/:userId/edit", authenticate, requireAdmin, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowedUpdates = ['email', 'user_type', 'permit_type'];
    allowedUpdates.forEach(field => {
      if (req.body[field]) user[field] = req.body[field];
    });

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// Get users feedback
router.get("/feedback", authenticate, requireAdmin, async (req, res) => {
  try {
    const feedbacks = await Feedback.findAll({
      include: [{ model: User, attributes: ["first_name", "last_name", "email"] }]
    });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving feedback", error: error.message });
  }
});

// Get feedback by ID
router.get("/auth/feedback/my", authenticate, async (req, res) => {
  try {
    const userFeedback = await Feedback.findAll({
      where: { user_id: req.user.user_id },
      order: [['createdAt', 'DESC']],
    });

    if (!userFeedback) {
      return res.status(200).json(null); // No feedback submitted yet
    }

    res.json(userFeedback);
  } catch (error) {
    console.error("Error fetching user feedback:", error);
    res.status(500).json({ error: "Failed to load feedback" });
  }
});


// Answer feedback
router.put("/feedback/:feedback_id/respond", authenticate, requireAdmin, async (req, res) => {
  try {
    const { feedback_id } = req.params;
    const { response_text } = req.body;

    const feedback = await Feedback.findByPk(feedback_id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    feedback.admin_response = response_text;
    await feedback.save();

    res.status(200).json({ message: "Response saved", feedback });
  } catch (err) {
    res.status(500).json({ message: "Error saving response", error: err.message });
  }
});

// Get event reservations
router.get('/event-reservations', authenticate, requireAdmin, async (req, res) => {
  try {
    const events = await Reservation.findAll({
      where: {
        spot_count: {
          [Op.gt]: 1
        },
      }
    });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Approve event reservation
router.put('/event-reservations/:id/approve', authenticate, requireAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation || reservation.spot_count <= 1 || reservation.status !== 'pending') {
      return res.status(404).json({ message: 'Reservation not found or not valid for approval' });
    }

    reservation.status = 'confirmed';
    await reservation.save();

    res.json({ message: 'Reservation approved', reservation });
  } catch (err) {
    console.error("Approval failed:", err);
    res.status(500).json({ message: "Failed to approve reservation", error: err.message });
  }
});

// Reject event reservation
router.put('/event-reservations/:id/reject', authenticate, requireAdmin, async (req, res) => {
  try {
    const reservation = await Reservation.findByPk(req.params.id);
    if (!reservation || reservation.spot_count <= 1 || reservation.status !== 'pending') {
      return res.status(404).json({ message: 'Reservation not found or not valid for rejection' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({ message: 'Reservation rejected', reservation });
  } catch (err) {
    console.error("Rejection failed:", err);
    res.status(500).json({ message: "Failed to reject reservation", error: err.message });
  }
});

// Add a lot
router.post('/lots/add', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, coordinates, capacity, rates, covered, resident_zone } = req.body;

    if(!name || !coordinates || !capacity){
      res.status(500).json({ error: 'Failed to create lot! (Missing fields)'});
      return;
    }

    const numberCoordinates = coordinates
      .map(c => c.replaceAll(' ', ''))          // trim whitespace
      .map(c => c.split(','))                   // split to get lat long
      .map(c => [Number(c[0]), Number(c[1])]);  // to numbers

    const coordinates_formatted = numberCoordinates
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const coordinates_str = `ST_GeomFromText('MULTIPOINT(${coordinates_formatted})', 4326)`;

    const mercator_coordinates_formatted = numberCoordinates
      .map(c => [c[1], c[0]])  // reverse lat and long because of dane
      .map(c => coordinateConverter.epsg4326toEpsg3857(c))
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const mercator_str = `ST_GeomFromText('MULTIPOINT(${mercator_coordinates_formatted})', 3857)`;

    const total_capacity = Object.keys(capacity).reduce(
      (total, key) => key === 'capacity' ? total : total + capacity[key],
      0
    );

    const newParkingLot = await ParkingLot.create({
      name,
      location: sequelize.literal(coordinates_str),
      mercator_coordinates: sequelize.literal(mercator_str),
      capacity: total_capacity,
      faculty_capacity: capacity.faculty_capacity,
      faculty_availability: capacity.faculty_capacity,
      commuter_perimeter_capacity: capacity.commuter_perimeter_capacity,
      commuter_perimeter_availability: capacity.commuter_perimeter_capacity,
      commuter_core_capacity: capacity.commuter_core_capacity,
      commuter_core_availability: capacity.commuter_core_capacity,
      commuter_satellite_capacity: capacity.commuter_satellite_capacity,
      commuter_satellite_availability: capacity.commuter_satellite_capacity,
      metered_capacity: capacity.metered_capacity,
      metered_availability: capacity.metered_capacity,
      resident_capacity: capacity.resident_capacity,
      resident_availability: capacity.resident_capacity,
      resident_zone: resident_zone,
      ada_capacity: capacity.ada_capacity,
      ada_availability: capacity.ada_capacity,
      ev_charging_capacity: capacity.ev_charging_capacity,
      ev_charging_availability: capacity.ev_charging_capacity,
      general_capacity: capacity.general_capacity,
      general_availability: capacity.general_capacity,
      covered: covered,
    });

    // now add rates
    for(const rate of rates){
      await Rate.create({
        permit_type: rate.permit_type,
        hourly: rate.hourly,
        daily: rate.daily,
        max_hours: rate.max_hours,
        monthly: rate.monthly,
        semesterly_fall_spring: rate.semesterly_fall_spring,
        semesterly_summer: rate.semesterly_summer,
        yearly: rate.yearly,
        lot_start_time: rate.lot_start_time,
        lot_end_time: rate.lot_end_time,
        event_parking_price: rate.event_parking_price,
        sheet_number: rate.sheet_number,
        sheet_price: rate.sheet_price,
        
        // Foreign key column
        parking_lot_id: newParkingLot.id
      });
    }


    res.status(201).json({ message: 'Successfully added lot!' });
  } catch (err) {
    console.error("Failed adding lot:", err);
    res.status(500).json({ error: `Failed to add lot: ${err}`});
  }
});

// Edit a lot
router.put('/lots/:id/update', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, coordinates, capacity, rates, covered, resident_zone } = req.body;

    if(!name || !coordinates || !capacity){
      res.status(500).json({ error: 'Failed to edit lot! (Missing fields)'});
      return;
    }

    // check if lot exists
    const { id } = req.params;
    const lot = await ParkingLot.findByPk(id);
    if(!lot){
      res.status(404).json({ error: 'Lot not found!' });
      return;
    }

    const numberCoordinates = coordinates
      .map(c => c.replaceAll(' ', ''))          // trim whitespace
      .map(c => c.split(','))                   // split to get lat long
      .map(c => [Number(c[0]), Number(c[1])]);  // to numbers

    const coordinates_formatted = numberCoordinates
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const coordinates_str = `ST_GeomFromText('MULTIPOINT(${coordinates_formatted})', 4326)`

    const mercator_coordinates_formatted = numberCoordinates
      .map(c => [c[1], c[0]])  // reverse lat and long because of dane
      .map(c => coordinateConverter.epsg4326toEpsg3857(c))
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const mercator_str = `ST_GeomFromText('MULTIPOINT(${mercator_coordinates_formatted})', 3857)`

    const total_capacity = Object.keys(capacity).reduce(
      (total, key) => key === 'capacity' ? total : total + capacity[key],
      0
    );

    await lot.update({
      name,
      location: sequelize.literal(coordinates_str),
      mercator_coordinates: sequelize.literal(mercator_str),
      capacity: total_capacity,
      faculty_capacity: capacity.faculty_capacity,
      faculty_availability: capacity.faculty_capacity,
      commuter_perimeter_capacity: capacity.commuter_perimeter_capacity,
      commuter_perimeter_availability: capacity.commuter_perimeter_capacity,
      commuter_core_capacity: capacity.commuter_core_capacity,
      commuter_core_availability: capacity.commuter_core_capacity,
      commuter_satellite_capacity: capacity.commuter_satellite_capacity,
      commuter_satellite_availability: capacity.commuter_satellite_capacity,
      metered_capacity: capacity.metered_capacity,
      metered_availability: capacity.metered_capacity,
      resident_capacity: capacity.resident_capacity,
      resident_availability: capacity.resident_capacity,
      resident_zone: resident_zone,
      ada_capacity: capacity.ada_capacity,
      ada_availability: capacity.ada_capacity,
      ev_charging_capacity: capacity.ev_charging_capacity,
      ev_charging_availability: capacity.ev_charging_capacity,
      general_capacity: capacity.general_capacity,
      general_availability: capacity.general_capacity,
      covered: covered,
    });

    // delete missing rates
    const rate_ids = rates.map(r => r.id);
    const old_rates = await Rate.findAll({
      where: { parking_lot_id: id }
    });
    for(const old_rate of old_rates){
      if(!rate_ids.includes(old_rate.id)){
        // no longer a rate
        await old_rate.destroy();
      }
    }

    // now add/edit rates
    for(const rate of rates){
      if(rate.id === undefined){
        // new rate to add
        await Rate.create({
          permit_type: rate.permit_type,
          hourly: rate.hourly,
          daily: rate.daily,
          max_hours: rate.max_hours,
          monthly: rate.monthly,
          semesterly_fall_spring: rate.semesterly_fall_spring,
          semesterly_summer: rate.semesterly_summer,
          yearly: rate.yearly,
          lot_start_time: rate.lot_start_time,
          lot_end_time: rate.lot_end_time,
          event_parking_price: rate.event_parking_price,
          sheet_number: rate.sheet_number,
          sheet_price: rate.sheet_price,
          parking_lot_id: id
        });
      } else {
        // old rate to edit
        const rate_db_obj = await Rate.findByPk(rate.id);
        await rate_db_obj.update({
          permit_type: rate.permit_type,
          hourly: rate.hourly,
          daily: rate.daily,
          max_hours: rate.max_hours,
          monthly: rate.monthly,
          semesterly_fall_spring: rate.semesterly_fall_spring,
          semesterly_summer: rate.semesterly_summer,
          yearly: rate.yearly,
          lot_start_time: rate.lot_start_time,
          lot_end_time: rate.lot_end_time,
          event_parking_price: rate.event_parking_price,
          sheet_number: rate.sheet_number,
          sheet_price: rate.sheet_price,
          parking_lot_id: id
        })
      }
    } 

    res.status(201).json({ message: 'Successfully edited lot!' });
  } catch (err) {
    console.error("Failed adding lot:", err);
    res.status(500).json({ error: `Failed to edit lot: ${err}`});
  }
});

// Delete a lot
router.delete('/parking-lots/:id/remove', authenticate, requireAdmin, async (req, res) => {
  const lotId = req.params.id;
  try {
    const lot = await ParkingLot.findByPk(lotId);
    if (!lot) {
      return res.status(404).json({ success: false, message: 'Parking lot not found' });
    }

    await lot.destroy();

    res.json({ success: true, message: `Parking lot ${lotId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete parking lot', error: error.message });
  }
});

// Add a building
router.post('/buildings/add', authenticate, requireAdmin, async (req, res) => {
  try{
    const { name, campus, coordinates } = req.body;

    console.log("Coordinates:", coordinates);
    console.log("Name:", name);
    console.log("Campus:", campus);

    if(!name || !campus || !coordinates){
      res.status(500).json({ error: 'Failed to create building! (Missing fields)'});
      return;
    }

    const numberCoordinates = coordinates
      .map(c => c.replaceAll(' ', ''))          // trim whitespace
      .map(c => c.split(','))                   // split to get lat long
      .map(c => [Number(c[0]), Number(c[1])]);  // to numbers

    const coordinates_formatted = numberCoordinates
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const coordinates_str = `ST_GeomFromText('MULTIPOINT(${coordinates_formatted})', 4326)`;

    const mercator_coordinates_formatted = numberCoordinates
      .map(c => [c[1], c[0]])  // reverse lat and long because of dane
      .map(c => coordinateConverter.epsg4326toEpsg3857(c))
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const mercator_str = `ST_GeomFromText('MULTIPOINT(${mercator_coordinates_formatted})', 3857)`;

    await Building.create({
      building_name: name,
      campus,
      location: sequelize.literal(coordinates_str),
      mercator_coordinates: sequelize.literal(mercator_str),
    });

    res.status(201).json({ message: 'Successfully added building!' });
  } catch (err){
    console.error("Failed adding building:", err);
    res.status(500).json({ error: `Failed to add building: ${err}`});
  }
});

// Edit a building
router.put('/buildings/:id/update', authenticate, requireAdmin, async (req, res) => {
  try{
    const { id } = req.params;
    const { name, campus, coordinates } = req.body;

    if(!name || !campus || !coordinates){
      res.status(500).json({ error: 'Failed to edit building! (Missing fields)'});
      return;
    }

    // check if exists
    const bldg = await Building.findByPk(id);
    if(!bldg){
      res.status(404).json({ error: 'Building not found!' });
      return;
    }

    const numberCoordinates = coordinates
      .map(c => c.replaceAll(' ', ''))          // trim whitespace
      .map(c => c.split(','))                   // split to get lat long
      .map(c => [Number(c[0]), Number(c[1])]);  // to numbers

    const coordinates_formatted = numberCoordinates
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const coordinates_str = `ST_GeomFromText('MULTIPOINT(${coordinates_formatted})', 4326)`;

    const mercator_coordinates_formatted = numberCoordinates
      .map(c => [c[1], c[0]])  // reverse lat and long because of dane
      .map(c => coordinateConverter.epsg4326toEpsg3857(c))
      .map(c => `(${c[0]} ${c[1]})`)
      .join(',');
    const mercator_str = `ST_GeomFromText('MULTIPOINT(${mercator_coordinates_formatted})', 3857)`;

    await bldg.update({
      building_name: name,
      campus,
      location: sequelize.literal(coordinates_str),
      mercator_coordinates: sequelize.literal(mercator_str),
    });

    res.status(201).json({ message: 'Successfully edited building!' });
  } catch (err){
    console.error("Failed editing building:", err);
    res.status(500).json({ error: `Failed to edit building: ${err}`});
  }
});

// Delete a building
router.delete('/buildings/:id/remove', authenticate, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const bldg = await Building.findByPk(id);
    if(!bldg){
      res.status(404).json({ error: 'Building not found!' });
      return;
    }
  
    await bldg.destroy();

    res.json({ success: true, message: `Building ${id} deleted successfully` });
  } catch (err) {
    console.error("Failed deleting building:", err);
    res.status(500).json({ error: `Failed to delete building: ${err}`});
  }
});

// Get capacity analysis
router.get('/analytics/capacity-analysis', authenticate, requireAdmin, async (req, res) => {
  try {
    const lots = await ParkingLot.findAll();
    const reservations = await Reservation.findAll({
      where: { status: 'confirmed' },
      include: [{ model: User, attributes: ['user_type'] }]
    });

    const userCapacity = {};
    reservations.forEach(res => {
      const type = res.User.user_type || 'Unknown';
      userCapacity[type] = (userCapacity[type] || 0) + (res.spot_count || 1);
    });

    const lotData = lots.map(lot => {
      const lotReservations = reservations.filter(r => r.parking_lot_id === lot.id);

      const occupancy = lotReservations.length;
      const occupancyRate = lot.capacity > 0
        ? (occupancy / lot.capacity) * 100
        : 0;

      return {
        lotId: lot.id,
        lotName: lot.name,
        capacity: lot.capacity,
        currentOccupancy: occupancy,
        occupancyRate: `${occupancyRate.toFixed(2)}%`
      };
    });

    res.json({
      success: true,
      results: lotData,
      userCategorySummary: Object.entries(userCapacity).map(([name, value]) => ({
        name,
        value
      }))
    });

  } catch (error) {
    console.error('Error in capacity analysis:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve capacity data.' });
  }
});

module.exports = router;