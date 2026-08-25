const express = require("express");

const router = express.Router();

const {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
} =
    require(
        "../apicontrollers/activityController"
    );

const authMiddleware =
    require("../_middleware/authMiddleware");


// Add activity
router.post(
    "/",
    authMiddleware,
    createActivity
);


// Get activities of itinerary
router.get(
    "/itinerary/:itineraryId",
    authMiddleware,
    getActivities
);


// Update activity
router.put(
    "/:id",
    authMiddleware,
    updateActivity
);


// Delete activity
router.delete(
    "/:id",
    authMiddleware,
    deleteActivity
);


module.exports = router;
