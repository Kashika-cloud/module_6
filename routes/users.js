const express = require("express");
const fs = require("fs");
const path = require("path");

const authenticateToken =
    require("../middleware/auth");

const router = express.Router();

const usersFile =
    path.join(__dirname, "../data/users.json");


function getUsers() {

    return JSON.parse(
        fs.readFileSync(usersFile, "utf8")
    );
}


// =========================
// GET PROFILE
// =========================

router.get(
    "/profile",
    authenticateToken,
    (req, res) => {

        const users = getUsers();

        const user = users.find(
            user =>
                user.id === req.user.id
        );

        if (!user) {

            return res.status(404).json({

                success: false,

                message: "User not found"
            });
        }

        res.json({

            success: true,

            user: {

                id: user.id,

                name: user.name,

                email: user.email,

                createdAt: user.createdAt
            }
        });
    }
);


module.exports = router;