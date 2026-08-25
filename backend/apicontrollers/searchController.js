const searchService =
    require("../_services/searchServices");

const {
    addCityToTrip
} = require("../_services/cityServices");


// =========================================
// SEARCH CITIES
// GET /api/search?q=Paris
// =========================================

const searchCities = async (req, res) => {

    try {

        const query =
            (req.query.q || "").trim();


        if (!query) {

            return res.status(400).json({
                success: false,
                message: "Search query is required."
            });

        }


        const cities =
            await searchService.searchCities(
                query
            );


        return res.json({

            success: true,

            count: cities.length,

            data: cities

        });


    } catch (error) {

        console.error(
            "SEARCH ERROR:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Search failed."

        });

    }

};


// =========================================
// ADD CITY TO TRIP
// POST /api/search/cities/:cityId/add-to-trip
// =========================================

const addCityToTripController =
    async (req, res) => {

        try {

            // Logged-in user

            const userId =
                req.user.id;


            // City ID from URL

            const cityId =
                Number(
                    req.params.cityId
                );


            // Trip ID from request body

            const tripId =
                Number(
                    req.body.tripId
                );


            if (!cityId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "City ID is required."

                });

            }


            if (!tripId) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Trip ID is required."

                });

            }


            const result =
                await addCityToTrip(
                    userId,
                    tripId,
                    cityId
                );


            return res.status(201).json({

                success: true,

                message:
                    "City added to trip successfully.",

                data: result

            });


        } catch (error) {

            console.error(
                "ADD CITY TO TRIP ERROR:",
                error
            );


            return res.status(
                error.statusCode || 500
            ).json({

                success: false,

                message:
                    error.message ||
                    "Unable to add city to trip."

            });

        }

    };


// =========================================
// EXPORTS
// =========================================

module.exports = {

    searchCities,

    addCityToTrip:
        addCityToTripController

};