const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "globetrotter",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testDatabaseConnection = async () => {
    const connection = await pool.getConnection();

    console.log("MySQL database connected successfully.");

    connection.release();
};

module.exports = {
    pool,
    testDatabaseConnection
};
