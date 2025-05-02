const express = require("express");
const { User, Feedback, Reservation, ParkingLot } = require("../models");
const router = express.Router();
const { Op } = require('sequelize');

const authenticate = require("../middleware/authMiddleware");
const requireAdmin = require("../middleware/adminMiddleware");

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

// Approve a user account
router.put("/users/:user_id/approve", authenticate, requireAdmin, async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isApproved = true;
    await user.save();

    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving user", error: error.message });
  }
});

// Delete a user account
router.delete("/user/:user_id/remove", authenticate, requireAdmin, async (req, res) => {
  try {
    const { user_id } = req.params;

    const deleted = await User.destroy({ where: { user_id } });

    if (deleted === 0) {
      return res.status(404).json({ message: "User not found" });
    }

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