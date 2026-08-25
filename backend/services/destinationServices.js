const { pool } = require("../_config/database");


// Search destinations by name, city or country
const searchDestinations = async (searchTerm) => {

    // Add % for partial matching
    const keyword = `%${searchTerm}%`;

    const [destinations] = await pool.execute(
        `SELECT
            id,
            name,
            country,
            city,
            description,
            image_url,
            best_time,
            average_daily_budget
         FROM destinations
         WHERE name LIKE ?
            OR city LIKE ?
            OR country LIKE ?
         ORDER BY name ASC`,
        [
            keyword,
            keyword,
            keyword
        ]
    );

    return destinations;
};


// Get one destination by ID
const getDestinationById = async (destinationId) => {

    const [destinations] = await pool.execute(
        `SELECT
            id,
            name,
            country,
            city,
            description,
            image_url,
            best_time,
            average_daily_budget
         FROM destinations
         WHERE id = ?`,
        [destinationId]
    );

    if (destinations.length === 0) {
        throw new Error("Destination not found");
    }

    return destinations[0];
};


// Get all destinations
const getAllDestinations = async () => {

    const [destinations] = await pool.execute(
        `SELECT
            id,
            name,
            country,
            city,
            description,
            image_url,
            best_time,
            average_daily_budget
         FROM destinations
         ORDER BY name ASC`
    );

    return destinations;
};


module.exports = {
    searchDestinations,
    getDestinationById,
    getAllDestinations
};