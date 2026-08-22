const { pool } = require("../_config/database");


// Create a new trip for the logged-in user
const createTrip = async (
    userId,
    title,
    destination,
    startDate,
    endDate,
    description
) => {

    // Insert trip into database
    const [result] = await pool.execute(
        `INSERT INTO trips
        (user_id, title, destination, start_date, end_date, description)
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            userId,
            title,
            destination,
            startDate,
            endDate,
            description || null
        ]
    );

    // Return the newly created trip ID
    return {
        id: result.insertId,
        user_id: userId,
        title,
        destination,
        start_date: startDate,
        end_date: endDate,
        description: description || null,
        status: "planned"
    };
};


// Get all trips belonging to the logged-in user
const getMyTrips = async (userId) => {

    const [trips] = await pool.execute(
        `SELECT
            id,
            title,
            destination,
            start_date,
            end_date,
            description,
            status,
            created_at,
            updated_at
         FROM trips
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return trips;
};


// Get one specific trip belonging to the logged-in user
const getTripById = async (tripId, userId) => {

    const [trips] = await pool.execute(
        `SELECT
            id,
            title,
            destination,
            start_date,
            end_date,
            description,
            status,
            created_at,
            updated_at
         FROM trips
         WHERE id = ? AND user_id = ?`,
        [tripId, userId]
    );

    if (trips.length === 0) {
        throw new Error("Trip not found");
    }

    return trips[0];
};

// Update an existing trip
const updateTrip = async (
    tripId,
    userId,
    title,
    destination,
    startDate,
    endDate,
    description,
    status
) => {

    // Update only the trip that belongs to the logged-in user
    const [result] = await pool.execute(
        `UPDATE trips
         SET title = ?,
             destination = ?,
             start_date = ?,
             end_date = ?,
             description = ?,
             status = ?
         WHERE id = ? AND user_id = ?`,
        [
            title,
            destination,
            startDate,
            endDate,
            description || null,
            status || "planned",
            tripId,
            userId
        ]
    );

    // Check whether the trip existed and belonged to this user
    if (result.affectedRows === 0) {
        throw new Error("Trip not found");
    }

    // Return updated trip
    return getTripById(tripId, userId);
};


// Delete an existing trip
const deleteTrip = async (tripId, userId) => {

    // Delete only the user's own trip
    const [result] = await pool.execute(
        `DELETE FROM trips
         WHERE id = ? AND user_id = ?`,
        [tripId, userId]
    );

    // Check whether a trip was actually deleted
    if (result.affectedRows === 0) {
        throw new Error("Trip not found");
    }

    return true;
};


module.exports = {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip
};