const {
    searchCities,
    addCityToTrip
} = require("../_services/cityServices");

const {
    successResponse,
    errorResponse
} = require("../_utils/response");


// =========================================
// SEARCH CITIES
// =========================================

async function search(req, res) {

    try {

        const query =
            (req.query.q || "").trim();


        if (!query) {

            return errorResponse(
                res,
                "Search query is required",
                400
            );
        }


        const cities =
            await searchCities(query);


        return successResponse(
            res,
            "Cities fetched successfully",
            cities
        );

    } catch (error) {

        console.error(
            "City search error:",
            error
        );


        return errorResponse(
            res,
            error.message ||
                "Unable to search cities",
            error.statusCode ||
                500
        );
    }
}


// =========================================
// ADD CITY TO TRIP
// =========================================

async function addToTrip(req, res) {

    try {

        const userId =
            req.user.id;

        const cityId =
            Number(req.params.cityId);

        const {
            tripId
        } = req.body;


        if (!cityId) {

            return errorResponse(
                res,
                "City ID is required",
                400
            );
        }


        if (!tripId) {

            return errorResponse(
                res,
                "Trip ID is required",
                400
            );
        }


        const result =
            await addCityToTrip(
                userId,
                Number(tripId),
                cityId
            );


        return successResponse(
            res,
            "City added to trip successfully",
            result,
            201
        );

    } catch (error) {

        console.error(
            "Add city to trip error:",
            error
        );


        return errorResponse(
            res,
            error.message ||
                "Unable to add city to trip",
            error.statusCode ||
                500
        );
    }
}


// =========================================
// EXPORTS
// =========================================

module.exports = {

    search,
    addToTrip

};
