const express = require("express");
const { User, Feedback, Reservation } = require("../models");
const router = express.Router();
const { Op } = require('sequelize');

const authenticate = require("../middleware/authMiddleware"); // Middleware to authenticate users

// Get all users
router.get("/users", authenticate, async (req, res) => {
    try {
        // Only allow admin users to access this endpoint
        if (req.user.user_type !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

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
router.put("/users/:user_id/approve", authenticate, async (req, res) => {
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

        res.json({ message: "User approved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error approving user", error: error.message });
    }
});

// Delete a user account
router.delete("/user/:user_id/remove", authenticate, async (req, res) => {
    try {
        if (req.user.user_type !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

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
router.put("/users/:userId/edit", authenticate, async (req, res) => {
    try {
        if (req.user.user_type !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

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
router.get("/feedback", authenticate, async (req, res) => {
    try {
        if (req.user.user_type !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

        const feedbacks = await Feedback.findAll({
            include: [{ model: User, attributes: ["first_name", "last_name", "email"] }]
        });

        res.json(feedbacks);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving feedback", error: error.message });
    }
});

// Answer feedback
router.put("/feedback/:feedback_id/respond", authenticate, async (req, res) => {
    try {
        if (req.user.user_type !== "admin") {
            return res.status(403).json({ message: "Forbidden" });
        }

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
router.get('/event-reservations', authenticate, async (req, res) => {
    try {
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const events = await Reservation.findAll({
            where: {
                spot_count: {
                    [Op.gt]: 1
                },
            }
        });
        console.log("Fetched event reservations:", events);
        res.json(events);
    } catch (err) {
        console.error("Error fetching event reservations:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Approve event reservation
router.put('/event-reservations/:id/approve', authenticate, async (req, res) => {
    try {
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

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
router.put('/event-reservations/:id/reject', authenticate, async (req, res) => {
    try {
        if (req.user.user_type !== 'admin') {
            return res.status(403).json({ message: 'Forbidden' });
        }

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

module.exports = router;