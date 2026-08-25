const express = require("express");

const authenticateToken = require("../_middleware/authMiddleware");

const {
    getProfile,
    updateProfile
} = require("../apicontrollers/userController");

const router = express.Router();


// GET /api/users/profile
router.get(
    "/profile",
    authenticateToken,
    getProfile
);


// PUT /api/users/profile
router.put(
    "/profile",
    authenticateToken,
    updateProfile
);


// JWT test route
router.get(
    "/me",
    authenticateToken,
    (req, res) => {
        res.json({
            success: true,
            message: "Authentication successful",
            user: req.user
        });
    }
);


module.exports = router;
