const express = require("express");

const itineraryController = require("./apicontrollers/itineraryController");
const authMiddleware = require("../_middleware/authMiddleware");

const router = express.Router();


// Add a new itinerary item to a trip
// POST /api/itinerary/trips/:tripId
router.post(
    "/trips/:tripId",
    authMiddleware,
    itineraryController.createItineraryItem
);


// Get complete itinerary of a trip
// GET /api/itinerary/trips/:tripId
router.get(
    "/trips/:tripId",
    authMiddleware,
    itineraryController.getTripItinerary
);


// Get one itinerary item
// GET /api/itinerary/items/:id
router.get(
    "/items/:id",
    authMiddleware,
    itineraryController.getItineraryItemById
);


// Update an itinerary item
// PUT /api/itinerary/items/:id
router.put(
    "/items/:id",
    authMiddleware,
    itineraryController.updateItineraryItem
);


// Delete an itinerary item
// DELETE /api/itinerary/items/:id
router.delete(
    "/items/:id",
    authMiddleware,
    itineraryController.deleteItineraryItem
);


module.exports = router;