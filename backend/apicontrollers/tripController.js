const tripService = require("../_services/tripServices");


// =========================
// CREATE TRIP
// =========================

const createTrip = async (req, res, next) => {

    try {

        const {
            title,
            description,
            destination,
            start_date,
            end_date,
            travelers,
            budget
        } = req.body;


        if (
            !title ||
            !destination ||
            !start_date ||
            !end_date
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Title, destination, start date and end date are required."
            });

        }


        // End date validation

        if (
            new Date(end_date) <
            new Date(start_date)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "End date cannot be before start date."
            });

        }


        // Start date cannot be in the past

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const selectedStartDate =
            new Date(start_date);

        if (selectedStartDate < today) {

            return res.status(400).json({
                success: false,
                message:
                    "Start date cannot be in the past."
            });

        }


        const trip =
            await tripService.createTrip({

                user_id: req.user.id,

                title,

                description,

                destination,

                start_date,

                end_date,

                travelers:
                    travelers || 1,

                budget:
                    budget || 0

            });


        return res.status(201).json({

            success: true,

            message:
                "Trip created successfully.",

            data: trip

        });


    } catch (error) {

        next(error);

    }

};


// =========================
// GET ALL TRIPS
// =========================

const getTrips = async (
    req,
    res,
    next
) => {

    try {

        const trips =
            await tripService.getTrips(
                req.user.id
            );


        return res.json({

            success: true,

            data: trips

        });


    } catch (error) {

        next(error);

    }

};


// =========================
// GET SINGLE TRIP
// =========================

const getTripById = async (
    req,
    res,
    next
) => {

    try {

        const trip =
            await tripService.getTripById(
                req.params.id,
                req.user.id
            );


        if (!trip) {

            return res.status(404).json({

                success: false,

                message:
                    "Trip not found."

            });

        }


        return res.json({

            success: true,

            data: trip

        });


    } catch (error) {

        next(error);

    }

};


// =========================
// UPDATE TRIP
// =========================

const updateTrip = async (
    req,
    res,
    next
) => {

    try {

        const trip =
            await tripService.updateTrip(
                req.params.id,
                req.user.id,
                req.body
            );


        if (!trip) {

            return res.status(404).json({

                success: false,

                message:
                    "Trip not found."

            });

        }


        return res.json({

            success: true,

            message:
                "Trip updated successfully.",

            data: trip

        });

    } catch (error) {

        next(error);

    }

};


// =========================
// DELETE TRIP
// =========================

const deleteTrip = async (
    req,
    res,
    next
) => {

    try {

        const deleted =
            await tripService.deleteTrip(
                req.params.id,
                req.user.id
            );


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "Trip not found."

            });

        }


        return res.json({

            success: true,

            message:
                "Trip deleted successfully."

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    createTrip,
    getTrips,
    getTripById,
    updateTrip,
    deleteTrip
};
