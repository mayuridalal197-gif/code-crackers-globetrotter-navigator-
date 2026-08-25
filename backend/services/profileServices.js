const { pool } = require("../_config/database");


// =========================================
// GET PROFILE
// =========================================

const getProfile = async (userId) => {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            email,
            profile_image,
            created_at
        FROM users
        WHERE id = ?
        `,
        [userId]
    );

    return rows[0] || null;
};


// =========================================
// UPDATE PROFILE
// =========================================

const updateProfile = async (
    userId,
    data
) => {

    const {
        name,
        email,
        profile_image
    } = data;


    const [result] = await pool.execute(
        `
        UPDATE users
        SET
            name = ?,
            email = ?,
            profile_image = ?
        WHERE id = ?
        `,
        [
            name,
            email,
            profile_image || null,
            userId
        ]
    );


    if (result.affectedRows === 0) {
        return null;
    }


    return getProfile(userId);
};


// =========================================
// EXPORT
// =========================================

module.exports = {
    getProfile,
    updateProfile
};