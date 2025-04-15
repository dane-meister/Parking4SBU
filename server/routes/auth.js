const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User, Vehicle, Feedback, Reservation } = require("../models");
const router = express.Router();
const { Op } = require('sequelize');

const salt_rounds = 12;
const authenticate = require("../middleware/authMiddleware"); // Middleware to authenticate users

// Route to get the currently authenticated user's details
router.get("/me", authenticate, async (req, res) => {
    try {
        // Fetch user details by primary key, excluding the password field
        const user = await User.findByPk(req.user.user_id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
});

// Registration endpoint
router.post("/register", async (req, res) => {
    try {
        // Destructure required fields from the request body
        const {
            email,
            password,
            first_name,
            last_name,
            phone_number,
            user_type,
            permit_type,
            driver_license_number,
            dl_state,
            address_line,
            city,
            state_region,
            postal_zip_code,
            country
        } = req.body;

        // Basic validation to ensure all required fields are provided
        if (
            !email || !password || !first_name || !last_name ||
            !user_type || !permit_type || !driver_license_number ||
            !dl_state || !address_line || !city || !state_region ||
            !postal_zip_code || !country
        ) {
            return res.status(400).json({ message: "Missing required fields." });
        }

        // Check if a user with the given email already exists
        const existing_user = await User.findOne({ where: { email } });
        if (existing_user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password using bcrypt
        const hashed_password = await bcrypt.hash(password, salt_rounds);

        // Create a new user with the hashed password and other details
        const new_user = await User.create({
            email,
            password: hashed_password,
            first_name,
            last_name,
            phone_number,
            user_type,
            permit_type,
            driver_license_number,
            dl_state,
            address_line,
            city,
            state_region,
            postal_zip_code,
            country,
        });

        // Respond with the created user, omitting the password
        const safeUser = { ...new_user.toJSON() };
        delete safeUser.password;

        res.status(201).json({
            message: "User registered successfully",
            user: new_user,
        });

    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

// Login endpoint
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the provided password with the stored hashed password
        const is_valid = await bcrypt.compare(password, user.password);
        if (!is_valid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate a JWT token with user details
        const token = jwt.sign({
            user_id: user.user_id,
            email: user.email,
            user_type: user.user_type
        },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in prod (HTTPS), false in dev
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
    }
});

// Logout endpoint
router.post("/logout", (req, res) => {
    // Clear the authentication token cookie
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    res.json({ message: "Logged out successfully" });
});

// Get all users endpoint (for admin use)
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

/* Profile routes */
// Route to get all vehicles for a user (accessible to the user or admin)
// written by Deepseek LLM, modified to work
router.get("/:userId/vehicles", authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUser = req.user; // From auth middleware

        // Check if the requesting user is either:
        // 1. The same user whose vehicles are being requested, OR
        // 2. An admin
        if (requestingUser.user_id !== parseInt(userId) && requestingUser.user_type !== "admin") {
            return res.status(403).json({ message: "Forbidden: You can only view your own vehicles" });
        }

        // Find the user and include their associated vehicles
        const user = await User.findByPk(userId, {
            include: [{ model: Vehicle }], // Assumes you've set up the User.hasMany(Vehicle) association
            attributes: { exclude: ['password'] } // Don't return the password
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the vehicles
        res.json({ vehicles: user.Vehicles }); // Sequelize pluralizes the association (e.g., user.getVehicles())
    } catch (error) {
        res.status(500).json({ message: "Error fetching vehicles", error: error.message });
    }
});

// writtten by Deepseek LLM, modified to work
router.post("/:userId/add-vehicle", authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUser = req.user; // From auth middleware
        const {
            plate,
            model,
            make,
            year,
            color
        } = req.body;

        // 1. Authorization Check
        // Only the user themselves or an admin can add a vehicle
        if (requestingUser.user_id !== parseInt(userId) && requestingUser.user_type !== "admin") {
            return res.status(403).json({
                message: "Forbidden: You can only add vehicles to your own account"
            });
        }

        // 2. Input Validation
        if (!plate || !model || !make || !year || !color) {
            return res.status(400).json({
                message: "All fields required to add vehicle"
            });
        }

        // 3. Check if the user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 4. Create the vehicle (assuming `db.Vehicle` is your Sequelize model)
        const newVehicle = await Vehicle.create({
            user_id: userId, // Link to the user
            plate,
            model,
            make,
            year,
            color,
        });

        // 5. Return the created vehicle (excluding sensitive fields if needed)
        res.status(201).json({
            message: "Vehicle added successfully",
            vehicle: newVehicle
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding vehicle",
            error: error.message
        });
    }
});

router.put("/edit-vehicle/:vehicleId", authenticate, async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const requestingUser = req.user; // From auth middleware
        const {
            plate,
            model,
            make,
            year,
            color,
            isDefault
        } = req.body;

        // verify all information present
        if (!plate || !model || !make || !year || !color) {
            return res.status(400).json({
                message: "All fields required to edit vehicle"
            });
        }

        // verify actual vehicle
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // verify user has permission to edit this vehicle
        if (requestingUser.user_id !== vehicle.user_id && requestingUser.user_type !== "admin") {
            return res.status(403).json({
                message: "Forbidden: You can only edit your own vehicles"
            });
        }

        const isDefaultValue = isDefault ?? false;
        await vehicle.update({ plate, model, make, year, color, isDefault: isDefaultValue });

        // if setting is Default make sure all other cars are not default
        if (isDefaultValue) {
            await Vehicle.update(
                { isDefault: false },
                {
                    where: {
                        user_id: vehicle.user_id,
                        vehicle_id: { [Op.ne]: vehicleId } // All vehicles except this one
                    }
                }
            );
        }

        res.status(200).json({
            message: "Vehicle edited successfully",
        });

    } catch (error) {
        res.status(500).json({
            message: "Error editing vehicle",
            error: error.message
        });
    }
});

router.delete("/delete-vehicle/:vehicleId", authenticate, async (req, res) => {
    try {
        const { vehicleId } = req.params;
        const requestingUser = req.user; // From auth middleware

        // verify actual vehicle
        const vehicle = await Vehicle.findByPk(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ message: "Vehicle not found" });
        }

        // verify user has permission to edit this vehicle
        if (requestingUser.user_id !== vehicle.user_id && requestingUser.user_type !== "admin") {
            return res.status(403).json({
                message: "Forbidden: You can only edit your own vehicles"
            });
        }

        await vehicle.destroy();

        res.status(200).json({
            message: "Vehicle deleted successfully",
        });

    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Error deleting vehicle",
            error: error.message
        });
    }
});

// Approve a user account (for admin use)
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

// Delete a user account (for admin use)
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

router.put("/edit-profile/:userId", authenticate, async (req, res) => {
    try {
        const { userId } = req.params;
        const requestingUser = req.user; // From auth middleware

        // verify user has permission to edit this profile
        if (requestingUser.user_id !== parseInt(userId) && requestingUser.user_type !== "admin") {
            return res.status(403).json({
                message: "Forbidden: You can only edit your own account!"
            });
        }

        // verify all fields provided
        const {
            email,
            first_name,
            last_name,
            phone_number,
            driver_license_number,
            dl_state,
            address_line,
            city,
            state_region,
            postal_zip_code,
            country
        } = req.body;

        if (!email || !first_name || !last_name || !phone_number || !driver_license_number ||
            !dl_state || !address_line || !city || !state_region || !postal_zip_code || !country
        ) {
            return res.status(400).json({
                message: "All fields must be present to update profile!"
            });
        }

        // verify user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found!"
            });
        }

        // update user
        await user.update({
            email,
            first_name,
            last_name,
            phone_number,
            driver_license_number,
            dl_state,
            address_line,
            city,
            state_region,
            postal_zip_code,
            country
        });

        return res.status(200).json({
            message: "Profile edited successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: 'Error editing profile!',
            error: err
        });
    }
});

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

router.post("/feedback/add", authenticate, async (req, res) => {
    try {
        const { feedback_text, rating } = req.body;

        if (!feedback_text || !rating) {
            return res.status(400).json({ message: "Feedback and rating are required." });
        }

        const feedback = await Feedback.create({
            user_id: req.user.user_id,
            feedback_text,
            rating
        });

        res.status(201).json({ message: "Feedback submitted", feedback });
    } catch (error) {
        res.status(500).json({ message: "Error submitting feedback", error: error.message });
    }
});

router.get("/admin/feedback", authenticate, async (req, res) => {
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

router.put("/admin/feedback/:feedback_id/respond", authenticate, async (req, res) => {
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

router.get('/admin/event-reservations', authenticate, async (req, res) => {
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

router.put('/admin/event-reservations/:id/approve', authenticate, async (req, res) => {
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

router.put('/admin/event-reservations/:id/reject', authenticate, async (req, res) => {
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