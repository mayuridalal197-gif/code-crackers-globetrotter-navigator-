const express = require("express");

const {
    search,
    addToTrip
} = require("../apicontrollers/cityController");

const authMiddleware =
    require("../_middleware/authMiddleware");

const router = express.Router();


// =========================================
// SEARCH CITIES
// GET /api/search?q=Paris
// =========================================

router.get(
    "/search",
    search
);


// =========================================
// ADD CITY TO TRIP
// POST /api/cities/:cityId/add-to-trip
// =========================================

router.post(
    "/cities/:cityId/add-to-trip",
    authMiddleware,
    addToTrip
);


module.exports = router;
