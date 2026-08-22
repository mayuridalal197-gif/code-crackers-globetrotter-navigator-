const express = require("express");

const tripController = require("../apicontrollers/tripController");
const authMiddleware = require("../_middleware/authMiddleware");

const router = express.Router();


// Create a new trip
// POST /api/trips
router.post(
    "/",
    authMiddleware,
    tripController.createTrip
);


// Get all trips of logged-in user
// GET /api/trips
router.get(
    "/",
    authMiddleware,
    tripController.getMyTrips
);

// Get one specific trip
// GET /api/trips/:id
router.get(
    "/:id",
    authMiddleware,
    tripController.getTripById
);
// Update a trip
// PUT /api/trips/:id
router.put(
    "/:id",
    authMiddleware,
    tripController.updateTrip
);

// Delete a trip
// DELETE /api/trips/:id
router.delete(
    "/:id",
    authMiddleware,
    tripController.deleteTrip
);


module.exports = router;