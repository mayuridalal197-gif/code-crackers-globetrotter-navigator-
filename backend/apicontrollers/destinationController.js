const destinationServices = require("../_services/destinationServices");


// Search destinations
const searchDestinations = async (req, res) => {
    try {
        // Get search keyword from query parameter
        const searchTerm = req.query.q;

        // Validate search keyword
        if (!searchTerm || searchTerm.trim().length < 2) {
            return res.status(400).json({
                success: false,
                message: "Search term must contain at least 2 characters"
            });
        }

        // Call service layer
        const destinations =
            await destinationServices.searchDestinations(
                searchTerm.trim()
            );

        return res.status(200).json({
            success: true,
            data: {
                destinations
            }
        });

    } catch (error) {

        console.error("Search destinations error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get one destination
const getDestinationById = async (req, res) => {
    try {
        // Get destination ID from URL
        const destinationId = Number(req.params.id);

        // Validate ID
        if (
            !Number.isInteger(destinationId) ||
            destinationId <= 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid destination ID"
            });
        }

        // Get destination from service
        const destination =
            await destinationServices.getDestinationById(
                destinationId
            );

        return res.status(200).json({
            success: true,
            data: {
                destination
            }
        });

    } catch (error) {

        if (error.message === "Destination not found") {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        console.error("Get destination error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get all destinations
const getAllDestinations = async (req, res) => {
    try {

        const destinations =
            await destinationServices.getAllDestinations();

        return res.status(200).json({
            success: true,
            data: {
                destinations
            }
        });

    } catch (error) {

        console.error("Get all destinations error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


module.exports = {
    searchDestinations,
    getDestinationById,
    getAllDestinations
};