const { pool } = require("../_config/database");


// Check whether a trip belongs to the logged-in user
const verifyTripOwnership = async (tripId, userId) => {

    const [trips] = await pool.execute(
        `SELECT id
         FROM trips
         WHERE id = ? AND user_id = ?`,
        [tripId, userId]
    );

    if (trips.length === 0) {
        throw new Error("Trip not found or access denied");
    }

    return true;
};


// Add a new itinerary item to a trip
const createItineraryItem = async (
    tripId,
    userId,
    dayNumber,
    title,
    location,
    activityType,
    startTime,
    endTime,
    notes
) => {

    // Make sure the trip belongs to the logged-in user
    await verifyTripOwnership(tripId, userId);

    // Insert itinerary item
    const [result] = await pool.execute(
        `INSERT INTO itinerary_items
        (
            trip_id,
            day_number,
            title,
            location,
            activity_type,
            start_time,
            end_time,
            notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            tripId,
            dayNumber,
            title,
            location || null,
            activityType || null,
            startTime || null,
            endTime || null,
            notes || null
        ]
    );

    return {
        id: result.insertId,
        trip_id: tripId,
        day_number: dayNumber,
        title,
        location: location || null,
        activity_type: activityType || null,
        start_time: startTime || null,
        end_time: endTime || null,
        notes: notes || null
    };
};


// Get all itinerary items for a trip
const getTripItinerary = async (tripId, userId) => {

    // Check ownership before returning itinerary
    await verifyTripOwnership(tripId, userId);

    const [items] = await pool.execute(
        `SELECT
            id,
            trip_id,
            day_number,
            title,
            location,
            activity_type,
            start_time,
            end_time,
            notes,
            created_at,
            updated_at
         FROM itinerary_items
         WHERE trip_id = ?
         ORDER BY day_number ASC, start_time ASC`,
        [tripId]
    );

    return items;
};


// Update an itinerary item
const updateItineraryItem = async (
    itemId,
    userId,
    dayNumber,
    title,
    location,
    activityType,
    startTime,
    endTime,
    notes
) => {

    // Update only if the item belongs to user's trip
    const [result] = await pool.execute(
        `UPDATE itinerary_items AS i
         INNER JOIN trips AS t
             ON i.trip_id = t.id
         SET
             i.day_number = ?,
             i.title = ?,
             i.location = ?,
             i.activity_type = ?,
             i.start_time = ?,
             i.end_time = ?,
             i.notes = ?
         WHERE i.id = ?
         AND t.user_id = ?`,
        [
            dayNumber,
            title,
            location || null,
            activityType || null,
            startTime || null,
            endTime || null,
            notes || null,
            itemId,
            userId
        ]
    );

    if (result.affectedRows === 0) {
        throw new Error("Itinerary item not found");
    }

    return getItineraryItemById(itemId, userId);
};


// Get one itinerary item
const getItineraryItemById = async (itemId, userId) => {

    const [items] = await pool.execute(
        `SELECT
            i.id,
            i.trip_id,
            i.day_number,
            i.title,
            i.location,
            i.activity_type,
            i.start_time,
            i.end_time,
            i.notes,
            i.created_at,
            i.updated_at
         FROM itinerary_items AS i
         INNER JOIN trips AS t
             ON i.trip_id = t.id
         WHERE i.id = ?
         AND t.user_id = ?`,
        [itemId, userId]
    );

    if (items.length === 0) {
        throw new Error("Itinerary item not found");
    }

    return items[0];
};


// Delete an itinerary item
const deleteItineraryItem = async (itemId, userId) => {

    const [result] = await pool.execute(
        `DELETE i
         FROM itinerary_items AS i
         INNER JOIN trips AS t
             ON i.trip_id = t.id
         WHERE i.id = ?
         AND t.user_id = ?`,
        [itemId, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Itinerary item not found");
    }

    return true;
};


module.exports = {
    createItineraryItem,
    getTripItinerary,
    updateItineraryItem,
    getItineraryItemById,
    deleteItineraryItem
};