const express = require("express");

const router = express.Router();

const {
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
} = require("../apicontrollers/itineraryController");

const authMiddleware =
    require("../_middleware/authMiddleware");


// Create itinerary item
router.post(
    "/",
    authMiddleware,
    createItinerary
);


// Get itinerary for trip
router.get(
    "/trip/:tripId",
    authMiddleware,
    getItinerary
);


// Update itinerary item
router.put(
    "/:id",
    authMiddleware,
    updateItinerary
);


// Delete itinerary item
router.delete(
    "/:id",
    authMiddleware,
    deleteItinerary
);


module.exports = router;
