const express = require("express");

const router =
    express.Router();


const {
    dashboardStats,
    users,
    removeUser,
    cities,
    removeCity,
    trips,
    communityPosts,
    removeCommunityPost
} = require("../apicontrollers/adminController");


const authMiddleware =
    require("../_middleware/authMiddleware");

const adminMiddleware =
    require("../_middleware/adminMiddleware");


// =========================================
// ADMIN AUTHORIZATION
// =========================================

router.use(
    authMiddleware,
    adminMiddleware
);


// =========================================
// DASHBOARD
// =========================================

router.get(
    "/stats",
    dashboardStats
);


// =========================================
// USERS
// =========================================

router.get(
    "/users",
    users
);


router.delete(
    "/users/:id",
    removeUser
);


// =========================================
// CITIES
// =========================================

router.get(
    "/cities",
    cities
);


router.delete(
    "/cities/:id",
    removeCity
);


// =========================================
// TRIPS
// =========================================

router.get(
    "/trips",
    trips
);


// =========================================
// COMMUNITY
// =========================================

router.get(
    "/community",
    communityPosts
);


router.delete(
    "/community/:id",
    removeCommunityPost
);


module.exports = router;
