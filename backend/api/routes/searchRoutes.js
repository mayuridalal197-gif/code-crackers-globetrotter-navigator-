const express = require("express");

const router = express.Router();

const {
    searchCities,
    addCityToTrip
} = require("../apicontrollers/searchController");

const authMiddleware =
    require("../_middleware/authMiddleware");


// SEARCH

router.get(
    "/",
    searchCities
);


// ADD CITY TO TRIP

router.post(
    "/cities/:cityId/add-to-trip",
    authMiddleware,
    addCityToTrip
);


module.exports = router;