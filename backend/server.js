const express = require("express");
require("dotenv").config();

const { testDatabaseConnection } = require("./_config/database");
const authRoutes = require("./apiRoutes/authRoutes");

const app = express();

app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

testDatabaseConnection();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
