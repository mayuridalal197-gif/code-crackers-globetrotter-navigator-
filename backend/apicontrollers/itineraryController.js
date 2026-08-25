const itineraryService =
    require("../_services/itineraryServices");


// CREATE
const createItinerary = async (req, res, next) => {

    try {

        const {
            trip_id,
            day_number,
            date,
            title,
            notes
        } = req.body;

        if (
            !trip_id ||
            !day_number ||
            !date ||
            !title
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Trip, day, date and title are required."
            });
        }

        const itinerary =
            await itineraryService.createItinerary({
                trip_id,
                day_number,
                date,
                title,
                notes
            });

        res.status(201).json({
            success: true,
            message:
                "Itinerary item created successfully.",
            data: itinerary
        });

    } catch (error) {

        next(error);

    }
};


// GET ALL ITINERARY ITEMS
const getItinerary = async (req, res, next) => {

    try {

        const itinerary =
            await itineraryService.getItinerary(
                req.params.tripId
            );

        res.json({
            success: true,
            data: itinerary
        });

    } catch (error) {

        next(error);

    }
};


// UPDATE
const updateItinerary = async (req, res, next) => {

    try {

        const itinerary =
            await itineraryService.updateItinerary(
                req.params.id,
                req.body
            );

        if (!itinerary) {

            return res.status(404).json({
                success: false,
                message:
                    "Itinerary item not found."
            });

        }

        res.json({
            success: true,
            message:
                "Itinerary updated successfully.",
            data: itinerary
        });

    } catch (error) {

        next(error);

    }
};


// DELETE
const deleteItinerary = async (req, res, next) => {

    try {

        const deleted =
            await itineraryService.deleteItinerary(
                req.params.id
            );

        if (!deleted) {

            return res.status(404).json({
                success: false,
                message:
                    "Itinerary item not found."
            });

        }

        res.json({
            success: true,
            message:
                "Itinerary deleted successfully."
        });

    } catch (error) {

        next(error);

    }
};


module.exports = {
    createItinerary,
    getItinerary,
    updateItinerary,
    deleteItinerary
};
