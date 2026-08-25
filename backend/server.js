const express = require("express");
const cors = require("cors");
require("dotenv").config();

const errorMiddleware = require("./_middleware/errorMiddleware");
const { testDatabaseConnection } = require("./_config/database");

const authRoutes = require("./apiRoutes/authRoutes");
const userRoutes = require("./apiRoutes/userRoutes");
const tripRoutes = require("./apiRoutes/tripRoutes");
const itineraryRoutes = require("./apiRoutes/itineraryRoutes");
const itineraryActivityRoutes = require("./apiRoutes/activityRoutes");
const communityRoutes = require("./apiRoutes/communityRoutes");
const profileRoutes = require("./apiRoutes/profileRoutes");
const searchRoutes = require("./apiRoutes/searchRoutes");
const adminRoutes = require("./apiRoutes/adminRoutes");

const app = express();

const PORT = process.env.PORT || 5000;


// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);


// =========================
// ROUTES
// =========================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/users",
    userRoutes
);

app.use(
    "/api/trips",
    tripRoutes
);

app.use(
    "/api/itineraries",
    itineraryRoutes
);

app.use(
    "/api/itinerary-activities",
    itineraryActivityRoutes
);

app.use(
    "/api/community",
    communityRoutes
);

app.use(
    "/api/profile",
    profileRoutes
);

app.use(
    "/api/search",
    searchRoutes
);

app.use(
    "/api/admin",
    adminRoutes
);

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {

    res.json({

        success: true,

        message:
            "GlobeTrotter API is running"

    });

});


// =========================
// ERROR MIDDLEWARE
// =========================

app.use(errorMiddleware);


// =========================
// START SERVER
// =========================

async function startServer() {

    try {

        await testDatabaseConnection();

        app.listen(
            PORT,
            () => {

                console.log(
                    `GlobeTrotter server running on http://localhost:${PORT}`
                );

            }
        );

    } catch (error) {

        console.error(
            "Server could not start."
        );

        console.error(
            "Actual error:",
            error
        );

        console.error(
            "Error message:",
            error.message
        );

        process.exit(1);
    }
}


startServer();
