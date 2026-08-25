const express = require("express");

const router = express.Router();

const {
    getProfile,
    updateProfile
} = require("../apicontrollers/profilecontroller");

const authMiddleware =
    require("../_middleware/authMiddleware");


// =========================================
// GET PROFILE
// =========================================

router.get(
    "/",
    authMiddleware,
    getProfile
);


// =========================================
// UPDATE PROFILE
// =========================================

router.put(
    "/",
    authMiddleware,
    updateProfile
);


module.exports = router;