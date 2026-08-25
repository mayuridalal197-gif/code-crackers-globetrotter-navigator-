const { pool } = require("../_config/database");


// =========================================
// GET DASHBOARD STATISTICS
// =========================================

const getDashboardStats = async () => {

    const [users] = await pool.execute(
        `
        SELECT COUNT(*) AS total
        FROM users
        WHERE role != 'admin'
        `
    );


    const [trips] = await pool.execute(
        `
        SELECT COUNT(*) AS total
        FROM trips
        `
    );


    const [cities] = await pool.execute(
        `
        SELECT COUNT(*) AS total
        FROM cities
        `
    );


    const [posts] = await pool.execute(
        `
        SELECT COUNT(*) AS total
        FROM community_posts
        `
    );


    return {

        totalUsers:
            Number(users[0].total),

        totalTrips:
            Number(trips[0].total),

        totalCities:
            Number(cities[0].total),

        totalPosts:
            Number(posts[0].total)

    };

};


// =========================================
// GET ALL USERS
// =========================================

const getUsers = async () => {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            email,
            role,
            profile_image,
            created_at
        FROM users
        ORDER BY created_at DESC
        `
    );


    return rows;

};


// =========================================
// DELETE USER
// =========================================

const deleteUser = async (userId) => {

    const [result] = await pool.execute(
        `
        DELETE FROM users
        WHERE id = ?
        AND role != 'admin'
        `,
        [userId]
    );


    return result.affectedRows > 0;

};


// =========================================
// GET ALL CITIES
// =========================================

const getCities = async () => {

    const [rows] = await pool.execute(
        `
        SELECT
            id,
            name,
            country,
            description,
            image_url,
            average_budget,
            created_at
        FROM cities
        ORDER BY created_at DESC
        `
    );


    return rows;

};


// =========================================
// DELETE CITY
// =========================================

const deleteCity = async (cityId) => {

    const [result] = await pool.execute(
        `
        DELETE FROM cities
        WHERE id = ?
        `,
        [cityId]
    );


    return result.affectedRows > 0;

};


// =========================================
// GET ALL TRIPS
// =========================================

const getTrips = async () => {

    const [rows] = await pool.execute(
        `
        SELECT
            t.*,
            u.name AS user_name,
            u.email AS user_email
        FROM trips t
        JOIN users u
            ON t.user_id = u.id
        ORDER BY t.created_at DESC
        `
    );


    return rows;

};


// =========================================
// GET COMMUNITY POSTS
// =========================================

const getCommunityPosts = async () => {

    const [rows] = await pool.execute(
        `
        SELECT
            cp.*,
            u.name AS user_name,
            u.email AS user_email
        FROM community_posts cp
        JOIN users u
            ON cp.user_id = u.id
        ORDER BY cp.created_at DESC
        `
    );


    return rows;

};


// =========================================
// DELETE COMMUNITY POST
// =========================================

const deleteCommunityPost = async (postId) => {

    const connection =
        await pool.getConnection();


    try {

        await connection.beginTransaction();


        await connection.execute(
            `
            DELETE FROM community-comments
            WHERE post_id = ?
            `,
            [postId]
        );


        await connection.execute(
            `
            DELETE FROM community-likes
            WHERE post_id = ?
            `,
            [postId]
        );


        const [result] =
            await connection.execute(
                `
                DELETE FROM community_posts
                WHERE id = ?
                `,
                [postId]
            );


        await connection.commit();


        return result.affectedRows > 0;


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


module.exports = {

    getDashboardStats,

    getUsers,
    deleteUser,

    getCities,
    deleteCity,

    getTrips,

    getCommunityPosts,
    deleteCommunityPost

};
