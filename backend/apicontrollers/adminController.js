const {
    getDashboardStats,
    getUsers,
    deleteUser,
    getCities,
    deleteCity,
    getTrips,
    getCommunityPosts,
    deleteCommunityPost
} = require("../_services/adminServices");


// =========================================
// DASHBOARD STATS
// =========================================

async function dashboardStats(req, res) {

    try {

        const data =
            await getDashboardStats();


        return res.json({

            success: true,

            data

        });

    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to load dashboard."

        });

    }

}


// =========================================
// USERS
// =========================================

async function users(req, res) {

    try {

        const data =
            await getUsers();


        return res.json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        console.error(
            "Admin users error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to load users."

        });

    }

}


// =========================================
// DELETE USER
// =========================================

async function removeUser(req, res) {

    try {

        const userId =
            req.params.id;


        const deleted =
            await deleteUser(userId);


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "User not found."

            });

        }


        return res.json({

            success: true,

            message:
                "User deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete user error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete user."

        });

    }

}


// =========================================
// CITIES
// =========================================

async function cities(req, res) {

    try {

        const data =
            await getCities();


        return res.json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        console.error(
            "Admin cities error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to load cities."

        });

    }

}


// =========================================
// DELETE CITY
// =========================================

async function removeCity(req, res) {

    try {

        const cityId =
            req.params.id;


        const deleted =
            await deleteCity(cityId);


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "City not found."

            });

        }


        return res.json({

            success: true,

            message:
                "City deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete city error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete city."

        });

    }

}


// =========================================
// TRIPS
// =========================================

async function trips(req, res) {

    try {

        const data =
            await getTrips();


        return res.json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        console.error(
            "Admin trips error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to load trips."

        });

    }

}


// =========================================
// COMMUNITY POSTS
// =========================================

async function communityPosts(req, res) {

    try {

        const data =
            await getCommunityPosts();


        return res.json({

            success: true,

            count: data.length,

            data

        });

    } catch (error) {

        console.error(
            "Admin community error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to load community posts."

        });

    }

}


// =========================================
// DELETE COMMUNITY POST
// =========================================

async function removeCommunityPost(req, res) {

    try {

        const postId =
            req.params.id;


        const deleted =
            await deleteCommunityPost(
                postId
            );


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "Post not found."

            });

        }


        return res.json({

            success: true,

            message:
                "Post deleted successfully."

        });

    } catch (error) {

        console.error(
            "Delete community post error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete post."

        });

    }

}


module.exports = {

    dashboardStats,

    users,
    removeUser,

    cities,
    removeCity,

    trips,

    communityPosts,
    removeCommunityPost

};
