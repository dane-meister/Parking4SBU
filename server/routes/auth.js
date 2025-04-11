const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { User, Vehicle } = require("../models");
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
    console.log("\nentered add vehicle");
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

module.exports = router;