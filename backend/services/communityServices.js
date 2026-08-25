const { pool } = require("../_config/database");


// =========================================
// CREATE POST
// =========================================

const createPost = async (data) => {

    const {
        user_id,
        title,
        content,
        image_url
    } = data;


    const [result] = await pool.execute(
        `
        INSERT INTO community_posts
        (
            user_id,
            title,
            content,
            image_url,
            likes_count,
            comments_count
        )
        VALUES (?, ?, ?, ?, 0, 0)
        `,
        [
            user_id,
            title,
            content,
            image_url || null
        ]
    );


    const [rows] = await pool.execute(
        `
        SELECT
            cp.*,
            u.name
        FROM community_posts cp
        JOIN users u
            ON cp.user_id = u.id
        WHERE cp.id = ?
        `,
        [result.insertId]
    );


    return rows[0];

};


// =========================================
// GET ALL POSTS
// =========================================

const getPosts = async () => {

    const [rows] = await pool.execute(
        `
        SELECT
            cp.*,
            u.name
        FROM community_posts cp
        JOIN users u
            ON cp.user_id = u.id
        ORDER BY cp.created_at DESC
        `
    );


    return rows;

};


// =========================================
// GET SINGLE POST
// =========================================

const getPostById = async (id) => {

    const [rows] = await pool.execute(
        `
        SELECT
            cp.*,
            u.name
        FROM community_posts cp
        JOIN users u
            ON cp.user_id = u.id
        WHERE cp.id = ?
        `,
        [id]
    );


    return rows[0] || null;

};


// =========================================
// UPDATE POST
// =========================================

const updatePost = async (
    id,
    userId,
    data
) => {

    const {
        title,
        content,
        image_url
    } = data;


    const [result] = await pool.execute(
        `
        UPDATE community_posts
        SET
            title = ?,
            content = ?,
            image_url = ?
        WHERE id = ?
        AND user_id = ?
        `,
        [
            title,
            content,
            image_url || null,
            id,
            userId
        ]
    );


    if (result.affectedRows === 0) {

        return null;

    }


    return getPostById(id);

};


// =========================================
// DELETE POST
// =========================================

const deletePost = async (
    id,
    userId
) => {

    const [result] = await pool.execute(
        `
        DELETE FROM community_posts
        WHERE id = ?
        AND user_id = ?
        `,
        [
            id,
            userId
        ]
    );


    return result.affectedRows > 0;

};


// =========================================
// LIKE / UNLIKE POST
// =========================================

const likePost = async (
    postId,
    userId
) => {

    const connection =
        await pool.getConnection();


    try {

        await connection.beginTransaction();


        const [existing] =
            await connection.execute(
                `
                SELECT id
                FROM community_likes
                WHERE post_id = ?
                AND user_id = ?
                `,
                [
                    postId,
                    userId
                ]
            );


        // =========================
        // UNLIKE
        // =========================

        if (existing.length > 0) {

            await connection.execute(
                `
                DELETE FROM community_likes
                WHERE post_id = ?
                AND user_id = ?
                `,
                [
                    postId,
                    userId
                ]
            );


            await connection.execute(
                `
                UPDATE community_posts
                SET likes_count =
                    GREATEST(
                        likes_count - 1,
                        0
                    )
                WHERE id = ?
                `,
                [postId]
            );


            await connection.commit();


            return {
                liked: false
            };

        }


        // =========================
        // LIKE
        // =========================

        await connection.execute(
            `
            INSERT INTO community_likes
            (
                post_id,
                user_id
            )
            VALUES (?, ?)
            `,
            [
                postId,
                userId
            ]
        );


        await connection.execute(
            `
            UPDATE community_posts
            SET likes_count =
                likes_count + 1
            WHERE id = ?
            `,
            [postId]
        );


        await connection.commit();


        return {
            liked: true
        };


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// =========================================
// ADD COMMENT
// =========================================

const addComment = async (
    postId,
    userId,
    comment
) => {

    const connection =
        await pool.getConnection();


    try {

        await connection.beginTransaction();


        const [result] =
            await connection.execute(
                `
                INSERT INTO community_comments
                (
                    post_id,
                    user_id,
                    comment
                )
                VALUES (?, ?, ?)
                `,
                [
                    postId,
                    userId,
                    comment
                ]
            );


        await connection.execute(
            `
            UPDATE community_posts
            SET comments_count =
                comments_count + 1
            WHERE id = ?
            `,
            [postId]
        );


        const [rows] =
            await connection.execute(
                `
                SELECT
                    cc.*,
                    u.name
                FROM community_comments cc
                JOIN users u
                    ON cc.user_id = u.id
                WHERE cc.id = ?
                `,
                [result.insertId]
            );


        await connection.commit();


        return rows[0];


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// =========================================
// GET COMMENTS
// =========================================

const getComments = async (
    postId
) => {

    const [rows] = await pool.execute(
        `
        SELECT
            cc.*,
            u.name
        FROM community_comments cc
        JOIN users u
            ON cc.user_id = u.id
        WHERE cc.post_id = ?
        ORDER BY cc.created_at ASC
        `,
        [postId]
    );


    return rows;

};


// =========================================
// DELETE COMMENT
// =========================================

const deleteComment = async (
    commentId,
    userId
) => {

    const connection =
        await pool.getConnection();


    try {

        await connection.beginTransaction();


        const [comments] =
            await connection.execute(
                `
                SELECT post_id
                FROM community_comments
                WHERE id = ?
                AND user_id = ?
                `,
                [
                    commentId,
                    userId
                ]
            );


        if (comments.length === 0) {

            await connection.rollback();

            return false;

        }


        const postId =
            comments[0].post_id;


        const [result] =
            await connection.execute(
                `
                DELETE FROM community_comments
                WHERE id = ?
                AND user_id = ?
                `,
                [
                    commentId,
                    userId
                ]
            );


        if (result.affectedRows > 0) {

            await connection.execute(
                `
                UPDATE community_posts
                SET comments_count =
                    GREATEST(
                        comments_count - 1,
                        0
                    )
                WHERE id = ?
                `,
                [postId]
            );

        }


        await connection.commit();


        return result.affectedRows > 0;


    } catch (error) {

        await connection.rollback();

        throw error;

    } finally {

        connection.release();

    }

};


// =========================================
// EXPORT
// =========================================

module.exports = {

    createPost,

    getPosts,

    getPostById,

    updatePost,

    deletePost,

    likePost,

    addComment,

    getComments,

    deleteComment

};