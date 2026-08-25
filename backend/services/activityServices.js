const { pool } = require("../_config/database");


// =========================
// CREATE ACTIVITY
// =========================

const createActivity = async (data) => {

    const {
        itinerary_id,
        activity_id,
        custom_activity_name,
        description,
        start_time,
        end_time,
        location,
        estimated_cost,
        sort_order
    } = data;

    const [result] = await pool.execute(
        `
        INSERT INTO itinerary_activities
        (
            itinerary_id,
            activity_id,
            custom_activity_name,
            description,
            start_time,
            end_time,
            location,
            estimated_cost,
            sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            itinerary_id,
            activity_id || null,
            custom_activity_name || null,
            description || null,
            start_time || null,
            end_time || null,
            location || null,
            estimated_cost || 0,
            sort_order || 0
        ]
    );

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM itinerary_activities
        WHERE id = ?
        `,
        [result.insertId]
    );

    return rows[0];
};


// =========================
// GET ACTIVITIES
// =========================

const getActivities = async (itineraryId) => {

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM itinerary_activities
        WHERE itinerary_id = ?
        ORDER BY sort_order ASC, id ASC
        `,
        [itineraryId]
    );

    return rows;
};


// =========================
// UPDATE ACTIVITY
// =========================

const updateActivity = async (id, data) => {

    const {
        activity_id,
        custom_activity_name,
        description,
        start_time,
        end_time,
        location,
        estimated_cost,
        sort_order
    } = data;

    const [result] = await pool.execute(
        `
        UPDATE itinerary_activities
        SET
            activity_id = ?,
            custom_activity_name = ?,
            description = ?,
            start_time = ?,
            end_time = ?,
            location = ?,
            estimated_cost = ?,
            sort_order = ?
        WHERE id = ?
        `,
        [
            activity_id || null,
            custom_activity_name || null,
            description || null,
            start_time || null,
            end_time || null,
            location || null,
            estimated_cost || 0,
            sort_order || 0,
            id
        ]
    );

    if (result.affectedRows === 0) {
        return null;
    }

    const [rows] = await pool.execute(
        `
        SELECT *
        FROM itinerary_activities
        WHERE id = ?
        `,
        [id]
    );

    return rows[0];
};


// =========================
// DELETE ACTIVITY
// =========================

const deleteActivity = async (id) => {

    const [result] = await pool.execute(
        `
        DELETE FROM itinerary_activities
        WHERE id = ?
        `,
        [id]
    );

    return result.affectedRows > 0;
};


// =========================
// EXPORT
// =========================

module.exports = {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
};
