const express = require("express");
const authController = require("../apicontrollers/authController");
const authMiddleware = require("../_middleware/authMiddleware");

const router = express.Router();

// Register a new user
// POST /api/auth/register
router.post("/register", authController.register);

// Login an existing user
// POST /api/auth/login
router.post("/login", authController.login);

// Get currently logged-in user's information
// GET /api/auth/me
// authMiddleware runs before getMe()
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;
