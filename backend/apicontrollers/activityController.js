const activityService =
    require("../_services/activityServices");


// =========================
// CREATE
// =========================

const createActivity = async (
    req,
    res,
    next
) => {

    try {

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
        } = req.body;


        if (!itinerary_id) {

            return res.status(400).json({

                success: false,

                message:
                    "Itinerary ID is required."

            });

        }


        if (
            !activity_id &&
            !custom_activity_name
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Select an activity or enter a custom activity."

            });

        }


        const activity =
            await activityService.createActivity({

                itinerary_id,

                activity_id,

                custom_activity_name,

                description,

                start_time,

                end_time,

                location,

                estimated_cost,

                sort_order

            });


        return res.status(201).json({

            success: true,

            message:
                "Activity added successfully.",

            data: activity

        });


    } catch (error) {

        next(error);

    }

};


// =========================
// GET
// =========================

const getActivities = async (
    req,
    res,
    next
) => {

    try {

        const activities =
            await activityService.getActivities(
                req.params.itineraryId
            );


        return res.json({

            success: true,

            data: activities

        });


    } catch (error) {

        next(error);

    }

};


// =========================
// UPDATE
// =========================

const updateActivity = async (
    req,
    res,
    next
) => {

    try {

        const activity =
            await activityService.updateActivity(
                req.params.id,
                req.body
            );


        if (!activity) {

            return res.status(404).json({

                success: false,

                message:
                    "Activity not found."

            });

        }


        return res.json({

            success: true,

            message:
                "Activity updated successfully.",

            data: activity

        });


    } catch (error) {

        next(error);

    }

};


// =========================
// DELETE
// =========================

const deleteActivity = async (
    req,
    res,
    next
) => {

    try {

        const deleted =
            await activityService.deleteActivity(
                req.params.id
            );


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "Activity not found."

            });

        }


        return res.json({

            success: true,

            message:
                "Activity deleted successfully."

        });

    } catch (error) {

        next(error);

    }

};


module.exports = {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
};
