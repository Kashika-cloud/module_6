const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const usersFile = path.join(__dirname, "../data/users.json");

function getUsers() {
    return JSON.parse(
        fs.readFileSync(usersFile, "utf8")
    );
}

function saveUsers(users) {
    fs.writeFileSync(
        usersFile,
        JSON.stringify(users, null, 2)
    );
}


// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        if (password.length < 6) {

            return res.status(400).json({
                success: false,
                message: "Password must contain at least 6 characters"
            });
        }

        const users = getUsers();

        // Check existing email
        const existingUser = users.find(
            user =>
                user.email.toLowerCase() ===
                email.toLowerCase()
        );

        if (existingUser) {

            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const newUser = {

            id: Date.now().toString(),

            name: name.trim(),

            email: email.toLowerCase().trim(),

            password: hashedPassword,

            createdAt: new Date().toISOString()
        };

        users.push(newUser);

        saveUsers(users);

        res.status(201).json({

            success: true,

            message: "Registration successful",

            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Registration failed"
        });
    }
});


// =========================
// LOGIN
// =========================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({

                success: false,

                message: "Email and password are required"
            });
        }

        const users = getUsers();

        const user = users.find(
            user =>
                user.email ===
                email.toLowerCase().trim()
        );

        if (!user) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"
            });
        }

        // Compare password
        const passwordMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!passwordMatch) {

            return res.status(401).json({

                success: false,

                message: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(

            {
                id: user.id,
                name: user.name,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "2h"
            }
        );

        res.json({

            success: true,

            message: "Login successful",

            token,

            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Login failed"
        });
    }
});


module.exports = router;