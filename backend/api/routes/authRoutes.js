const express = require("express");

const {
    register,
    login,
    getMe
} = require("../apicontrollers/authController");

const authMiddleware =
    require("../_middleware/authMiddleware");

const router = express.Router();


// ==============================
// REGISTER
// ==============================

router.post(
    "/register",
    register
);


// ==============================
// LOGIN
// ==============================

router.post(
    "/login",
    login
);


// ==============================
// CURRENT USER
// ==============================

router.get(
    "/me",
    authMiddleware,
    getMe
);


module.exports = router;
