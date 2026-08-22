const itineraryServices = require("../_services/itineraryServices");


// Validate itinerary item data
const validateItineraryItem = (
    dayNumber,
    title,
    startTime,
    endTime
) => {
    const errors = [];

    // Day number must be a positive integer
    if (
        !Number.isInteger(Number(dayNumber)) ||
        Number(dayNumber) <= 0
    ) {
        errors.push("Day number must be a positive number");
    }

    // Activity title is required
    if (!title || title.trim().length === 0) {
        errors.push("Activity title is required");
    }

    // If both times are provided, end time must be after start time
    if (startTime && endTime && startTime >= endTime) {
        errors.push("End time must be after start time");
    }

    return errors;
};


// Add itinerary item
const createItineraryItem = async (req, res) => {
    try {
        // Get trip ID from URL
        const tripId = Number(req.params.tripId);

        // Get itinerary data from frontend
        const {
            dayNumber,
            title,
            location,
            activityType,
            startTime,
            endTime,
            notes
        } = req.body;

        // Validate trip ID
        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        // Validate itinerary data
        const errors = validateItineraryItem(
            dayNumber,
            title,
            startTime,
            endTime
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Get authenticated user ID from JWT
        const userId = req.user.id;

        // Create itinerary item through service layer
        const item = await itineraryServices.createItineraryItem(
            tripId,
            userId,
            Number(dayNumber),
            title.trim(),
            location ? location.trim() : null,
            activityType ? activityType.trim() : null,
            startTime || null,
            endTime || null,
            notes ? notes.trim() : null
        );

        return res.status(201).json({
            success: true,
            message: "Itinerary item created successfully",
            data: {
                item
            }
        });

    } catch (error) {

        if (error.message === "Trip not found or access denied") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Create itinerary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get complete itinerary of a trip
const getTripItinerary = async (req, res) => {
    try {
        // Get trip ID from URL
        const tripId = Number(req.params.tripId);

        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        // Get authenticated user ID
        const userId = req.user.id;

        // Get itinerary through service layer
        const items = await itineraryServices.getTripItinerary(
            tripId,
            userId
        );

        return res.status(200).json({
            success: true,
            data: {
                itinerary: items
            }
        });

    } catch (error) {

        if (error.message === "Trip not found or access denied") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Get itinerary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get one itinerary item
const getItineraryItemById = async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        if (!Number.isInteger(itemId) || itemId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid itinerary item ID"
            });
        }

        const userId = req.user.id;

        const item = await itineraryServices.getItineraryItemById(
            itemId,
            userId
        );

        return res.status(200).json({
            success: true,
            data: {
                item
            }
        });

    } catch (error) {

        if (error.message === "Itinerary item not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Get itinerary item error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Update itinerary item
const updateItineraryItem = async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        if (!Number.isInteger(itemId) || itemId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid itinerary item ID"
            });
        }

        const {
            dayNumber,
            title,
            location,
            activityType,
            startTime,
            endTime,
            notes
        } = req.body;

        // Validate updated data
        const errors = validateItineraryItem(
            dayNumber,
            title,
            startTime,
            endTime
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        const userId = req.user.id;

        const item = await itineraryServices.updateItineraryItem(
            itemId,
            userId,
            Number(dayNumber),
            title.trim(),
            location ? location.trim() : null,
            activityType ? activityType.trim() : null,
            startTime || null,
            endTime || null,
            notes ? notes.trim() : null
        );

        return res.status(200).json({
            success: true,
            message: "Itinerary item updated successfully",
            data: {
                item
            }
        });

    } catch (error) {

        if (error.message === "Itinerary item not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Update itinerary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Delete itinerary item
const deleteItineraryItem = async (req, res) => {
    try {
        const itemId = Number(req.params.id);

        if (!Number.isInteger(itemId) || itemId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid itinerary item ID"
            });
        }

        const userId = req.user.id;

        await itineraryServices.deleteItineraryItem(
            itemId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Itinerary item deleted successfully"
        });

    } catch (error) {

        if (error.message === "Itinerary item not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Delete itinerary error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    createItineraryItem,
    getTripItinerary,
    getItineraryItemById,
    updateItineraryItem,
    deleteItineraryItem
};