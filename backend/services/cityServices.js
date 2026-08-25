const { pool } = require("../_config/database");


// =========================================
// SEARCH CITIES
// =========================================

async function searchCities(query) {

    const search = `%${query}%`;

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            country,
            description,
            image_url,
            average_budget,
            created_at
        FROM cities
        WHERE
            name LIKE ?
            OR country LIKE ?
        ORDER BY name ASC
        `,
        [search, search]
    );

    return rows;
}


// =========================================
// ADD CITY TO TRIP
// =========================================

async function addCityToTrip(
    userId,
    tripId,
    cityId
) {

    // Check city exists

    const [cities] = await pool.execute(
        `
        SELECT id, name
        FROM cities
        WHERE id = ?
        `,
        [cityId]
    );


    if (cities.length === 0) {

        const error =
            new Error("City not found");

        error.statusCode = 404;

        throw error;
    }


    // Check trip belongs to logged-in user

    const [trips] = await pool.execute(
        `
        SELECT id, title
        FROM trips
        WHERE id = ?
        AND user_id = ?
        `,
        [
            tripId,
            userId
        ]
    );


    if (trips.length === 0) {

        const error =
            new Error(
                "Trip not found or access denied"
            );

        error.statusCode = 404;

        throw error;
    }


    // Check if already added

    const [existing] =
        await pool.execute(
            `
            SELECT id
            FROM saved_cities
            WHERE user_id = ?
            AND trip_id = ?
            AND city_id = ?
            `,
            [
                userId,
                tripId,
                cityId
            ]
        );


    if (existing.length > 0) {

        const error =
            new Error(
                "City is already added to this trip"
            );

        error.statusCode = 409;

        throw error;
    }


    // Add city to trip

    const [result] =
        await pool.execute(
            `
            INSERT INTO saved_cities
            (
                user_id,
                trip_id,
                city_id
            )
            VALUES (?, ?, ?)
            `,
            [
                userId,
                tripId,
                cityId
            ]
        );


    return {
        id: result.insertId,
        user_id: userId,
        trip_id: tripId,
        city_id: cityId,
        city_name: cities[0].name,
        trip_title: trips[0].title
    };
}


module.exports = {

    searchCities,
    addCityToTrip

};
