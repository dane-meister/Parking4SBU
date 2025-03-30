const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const router = express.Router();

const salt_rounds = 12;
const authenticate = require("../middleware/authMiddleware"); // Middleware to authenticate users

router.get("/me", authenticate, async (req, res) => {
    try {
      const user = await User.findByPk(req.user.user_id, {
        attributes: { exclude: ['password'] }
      });
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json({ user });
    } catch (err) {
      res.status(500).json({ message: "Error fetching user", error: err.message });
    }
  });
  

//registration endpoint
router.post("/register", async (req, res) => {
    try {
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

             // Basic validation
        if (
            !email || !password || !first_name || !last_name ||
            !user_type || !permit_type || !driver_license_number ||
            !dl_state || !address_line || !city || !state_region ||
            !postal_zip_code || !country
        ) {
            return res.status(400).json({ message: "Missing required fields." });
        }
            //checking if user already exists:
            const existing_user = await User.findOne({ where: { email } });
            if (existing_user) {
                return res.status(400).json({ message: "User already exists" });
            }
            //hash the password with bcrypt:
            const hashed_password = await bcrypt.hash(password, salt_rounds);
            //create new user with hashed passwords:
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

             // Respond with created user (omit password)
            const safeUser = { ...new_user.toJSON() };
            delete safeUser.password;
            
            res.status(201).json({
                message: "User registered successfully",
                user: new_user,
            });

    } catch (error){
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
});

//login endpoint
router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        //find user by email
        const user = await User.findOne({ where: { email } });
        if (!user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        //compare provided password with stored hash
        const is_valid = await bcrypt.compare(password, user.password);
        if (!is_valid){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ 
            user_id: user.user_id, 
            email: user.email, 
            user_type: user.user_type 
        },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        // Set the token in a secure, HttpOnly cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // true in production
            sameSite: 'Strict',
            maxAge: 2 * 60 * 60 * 1000, // 2 hours
        });

        res.json({ message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error during login", error: error.message });
      }
});

router.post("/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    res.json({ message: "Logged out successfully" });
  });
  

module.exports = router;