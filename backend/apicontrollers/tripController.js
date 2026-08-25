const { pool } = require("../_config/database");
const { successResponse, errorResponse } = require("../_utils/response");

// Get logged-in user's profile
async function getProfile(req, res) {
    try {
        const [users] = await pool.execute(
            `SELECT 
                id,
                name,
                email,
                role,
                profile_image,
                bio,
                created_at
             FROM users
             WHERE id = ?`,
            [req.user.id]
        );

        if (users.length === 0) {
            return errorResponse(
                res,
                "User not found",
                404
            );
        }

        return successResponse(
            res,
            "Profile fetched successfully",
            users[0]
        );

    } catch (error) {
        console.error("Get profile error:", error);

        return errorResponse(
            res,
            "Failed to fetch profile",
            500
        );
    }
}


// Update logged-in user's profile
async function updateProfile(req, res) {
    try {
        const {
            name,
            bio,
            profile_image
        } = req.body;

        if (!name || name.trim().length < 2) {
            return errorResponse(
                res,
                "Name must contain at least 2 characters",
                400
            );
        }

        const [result] = await pool.execute(
            `UPDATE users
             SET name = ?,
                 bio = ?,
                 profile_image = ?
             WHERE id = ?`,
            [
                name.trim(),
                bio || null,
                profile_image || null,
                req.user.id
            ]
        );

        if (result.affectedRows === 0) {
            return errorResponse(
                res,
                "User not found",
                404
            );
        }

        return successResponse(
            res,
            "Profile updated successfully"
        );

    } catch (error) {
        console.error("Update profile error:", error);

        return errorResponse(
            res,
            "Failed to update profile",
            500
        );
    }
}


module.exports = {
    getProfile,
    updateProfile
};
