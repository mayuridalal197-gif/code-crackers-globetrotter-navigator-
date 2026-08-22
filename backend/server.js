const express = require("express");
require("dotenv").config();

const { testDatabaseConnection } = require("./_config/database");
const authRoutes = require("./apiRoutes/authRoutes");
const tripRoutes = require("./apiRoutes/tripRoutes");
const itineraryRoutes = require("./apiRoutes/itineraryRoutes");
const budgetRoutes = require("./apiRoutes/budgetRoutes");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 5000;

testDatabaseConnection();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
