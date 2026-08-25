const express = require("express");

const router = express.Router();

const {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip
} = require("../apicontrollers/tripController");

const authMiddleware =
    require("../_middleware/authMiddleware");


// CREATE
router.post(
    "/",
    authMiddleware,
    createTrip
);


// GET ALL
router.get(
    "/",
    authMiddleware,
    getTrips
);


// GET ONE
router.get(
    "/:id",
    authMiddleware,
    getTripById
);


// UPDATE
router.put(
    "/:id",
    authMiddleware,
    updateTrip
);


// DELETE
router.delete(
    "/:id",
    authMiddleware,
    deleteTrip
);


module.exports = router;
