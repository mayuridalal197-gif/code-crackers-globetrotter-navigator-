const express = require("express");

const destinationController = require("../apiControllers/destinationController");

const router = express.Router();


// Get all destinations
// GET /api/destinations
router.get(
    "/",
    destinationController.getAllDestinations
);


// Search destinations
// GET /api/destinations/search?q=Goa
router.get(
    "/search",
    destinationController.searchDestinations
);


// Get one destination by ID
// GET /api/destinations/:id
router.get(
    "/:id",
    destinationController.getDestinationById
);


module.exports = router;