const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User } = require("../models");
const router = express.Router();

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

module.exports = router;