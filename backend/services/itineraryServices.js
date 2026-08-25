const { pool } = require("../_config/database");


// =========================
// CREATE ITINERARY
// =========================

const createItinerary = async (data) => {

    const {
        trip_id,
        day_number,
        date,
        title,
        notes
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO itineraries
        (
            trip_id,
            day_number,
            date,
            title,
            notes
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
            trip_id,
            day_number,
            date,
            title,
            notes || null
        ]
    );

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM itineraries
        WHERE id = ?
        `,
        [result.insertId]
    );

    return rows[0];
};


// =========================
// GET ITINERARY
// =========================

const getItinerary = async (tripId) => {

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM itineraries
        WHERE trip_id = ?
        ORDER BY day_number ASC, date ASC, id ASC
        `,
        [tripId]
    );

    return rows;
};


// =========================
// UPDATE ITINERARY
// =========================

const updateItinerary = async (id, data) => {

    const {
        day_number,
        date,
        title,
        notes
    } = data;

    const [result] = await pool.execute(
        `
        UPDATE itineraries
        SET
            day_number = ?,
            date = ?,
            title = ?,
            notes = ?
        WHERE id = ?
        `,
        [
            day_number,
            date,
            title,
            notes || null,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM itineraries
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};


// =========================
// DELETE ITINERARY
// =========================

const deleteItinerary = async (id) => {

    const [result] = await pool.execute(
        `
        DELETE FROM itineraries
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows > 0;
};


// =========================
// EXPORTS
// =========================

module.exports = {
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
};
