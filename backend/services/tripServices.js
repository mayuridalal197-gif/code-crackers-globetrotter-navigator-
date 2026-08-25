const {pool} = require("../_config/database");


// =========================
// CREATE TRIP
// =========================

const createTrip = async (tripData) => {

    const {
        user_id,
        title,
        destination,
        start_date,
        end_date,
        travelers,
        budget,
        description
    } = tripData;


    const [result] = await pool.execute(
        `
        INSERT INTO trips
        (
            user_id,
            title,
            destination,
            start_date,
            end_date,
            travelers,
            budget,
            description,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            title,
            destination,
            start_date,
            end_date,
            travelers,
            budget,
            description || null,
            "planning"
        ]
    );


    const [rows] = await pool.execute(
        `
        SELECT *
        FROM trips
        WHERE id = ?
        `,
        [result.insertId]
    );


    return rows[0];
};


// =========================
// GET ALL USER TRIPS
// =========================

const getTrips = async (userId) => {

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM trips
        WHERE user_id = ?
        ORDER BY start_date ASC
        `,
        [userId]
    );


    return rows;
};


// =========================
// GET SINGLE TRIP
// =========================

const getTripById = async (
    tripId,
    userId
) => {

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM trips
        WHERE id = ?
        AND user_id = ?
        `,
        [
            tripId,
            userId
        ]
    );


    return rows[0];
};


// =========================
// UPDATE TRIP
// =========================

const updateTrip = async (
    tripId,
    userId,
    data
) => {

    const {
        title,
        destination,
        start_date,
        end_date,
        travelers,
        budget,
        description,
        status
    } = data;


    const [result] = await pool.execute(
        `
        UPDATE trips
        SET
            title = ?,
            destination = ?,
            start_date = ?,
            end_date = ?,
            travelers = ?,
            budget = ?,
            description = ?,
            status = ?
        WHERE id = ?
        AND user_id = ?
        `,
        [
            title,
            destination,
            start_date,
            end_date,
            travelers,
            budget,
            description || null,
            status || "planning",
            tripId,
            userId
        ]
    );


    if (result.affectedRows === 0) {
        return null;
    }


    return getTripById(
        tripId,
        userId
    );
};


// =========================
// DELETE TRIP
// =========================

const deleteTrip = async (
    tripId,
    userId
) => {

    const [result] = await pool.execute(
        `
        DELETE FROM trips
        WHERE id = ?
        AND user_id = ?
        `,
        [
            tripId,
            userId
        ]
    );


    return result.affectedRows > 0;
};


module.exports = {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip
};
