const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { testDatabaseConnection } = require("./_config/database");

const authRoutes = require("./apiRoutes/authRoutes");
const tripRoutes = require("./apiRoutes/tripRoutes");
const itineraryRoutes = require("./apiRoutes/itineraryRoutes");
const budgetRoutes = require("./apiRoutes/budgetRoutes");
const destinationRoutes = require("./apiRoutes/destinationRoutes");

const app = express();

app.use(cors({
    origin: "http://127.0.0.1:5500"
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/itinerary", itineraryRoutes);
app.use("/api/budget", budgetRoutes);
app.use("/api/destinations", destinationRoutes);

const PORT = process.env.PORT || 5000;

testDatabaseConnection();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
