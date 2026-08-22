const tripServices = require("../_services/tripServices");
const { validateTrip } = require("../_utils/validation");


// Create a new trip
const createTrip = async (req, res) => {
    try {
        // Get trip details sent by frontend
        const {
            title,
            destination,
            startDate,
            endDate,
            description
        } = req.body;

        // Validate trip data
        const errors = validateTrip(
            title,
            destination,
            startDate,
            endDate
        );

        // Stop request if validation fails
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Get user ID from verified JWT
        // We do NOT trust userId sent by frontend
        const userId = req.user.id;

        // Call service layer
        const trip = await tripServices.createTrip(
            userId,
            title.trim(),
            destination.trim(),
            startDate,
            endDate,
            description ? description.trim() : null
        );

        // Send successful response
        return res.status(201).json({
            success: true,
            message: "Trip created successfully",
            data: {
                trip
            }
        });

    } catch (error) {
        console.error("Create trip error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get all trips of logged-in user
const getMyTrips = async (req, res) => {
    try {
        // Get user ID from verified JWT
        const userId = req.user.id;

        // Get user's trips from service layer
        const trips = await tripServices.getMyTrips(userId);

        return res.status(200).json({
            success: true,
            data: {
                trips
            }
        });

    } catch (error) {
        console.error("Get trips error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get one specific trip
const getTripById = async (req, res) => {
    try {
        // Get trip ID from URL parameter
        const tripId = Number(req.params.id);

        // Check whether trip ID is valid
        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        // Get logged-in user's ID from JWT
        const userId = req.user.id;

        // Get trip only if it belongs to this user
        const trip = await tripServices.getTripById(
            tripId,
            userId
        );

        return res.status(200).json({
            success: true,
            data: {
                trip
            }
        });

    } catch (error) {

        // Trip does not exist or does not belong to user
        if (error.message === "Trip not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Get trip error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Update an existing trip
const updateTrip = async (req, res) => {
    try {
        // Get trip ID from URL
        const tripId = Number(req.params.id);

        // Validate trip ID
        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        // Get updated trip data
        const {
            title,
            destination,
            startDate,
            endDate,
            description,
            status
        } = req.body;

        // Validate required trip data
        const errors = validateTrip(
            title,
            destination,
            startDate,
            endDate
        );

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Get authenticated user's ID from JWT
        const userId = req.user.id;

        // Update trip
        const trip = await tripServices.updateTrip(
            tripId,
            userId,
            title.trim(),
            destination.trim(),
            startDate,
            endDate,
            description ? description.trim() : null,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Trip updated successfully",
            data: {
                trip
            }
        });

    } catch (error) {

        if (error.message === "Trip not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Update trip error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Delete an existing trip
const deleteTrip = async (req, res) => {
    try {
        // Get trip ID from URL
        const tripId = Number(req.params.id);

        // Validate trip ID
        if (!Number.isInteger(tripId) || tripId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid trip ID"
            });
        }

        // Get authenticated user's ID
        const userId = req.user.id;

        // Delete trip
        await tripServices.deleteTrip(
            tripId,
            userId
        );

        return res.status(200).json({
            success: true,
            message: "Trip deleted successfully"
        });

    } catch (error) {

        if (error.message === "Trip not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Delete trip error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    createTrip,
    getMyTrips,
    getTripById,
    updateTrip,
    deleteTrip,

};