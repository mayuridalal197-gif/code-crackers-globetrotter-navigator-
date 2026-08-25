const communityService =
    require("../_services/communityServices");


// =========================================
// CREATE POST
// =========================================

const createPost = async (
    req,
    res,
    next
) => {

    try {

        const {
            title,
            content,
            image_url
        } = req.body;


        const userId =
            req.user.id;


        if (!title || !title.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Post title is required."

            });

        }


        if (!content || !content.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Post content is required."

            });

        }


        const post =
            await communityService.createPost({

                user_id: userId,

                title: title.trim(),

                content: content.trim(),

                image_url

            });


        return res.status(201).json({

            success: true,

            message:
                "Post created successfully.",

            data: post

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// GET ALL POSTS
// =========================================

const getPosts = async (
    req,
    res,
    next
) => {

    try {

        const posts =
            await communityService.getPosts();


        return res.json({

            success: true,

            data: posts

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// GET SINGLE POST
// =========================================

const getPostById = async (
    req,
    res,
    next
) => {

    try {

        const post =
            await communityService.getPostById(
                req.params.id
            );


        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Post not found."

            });

        }


        return res.json({

            success: true,

            data: post

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// UPDATE POST
// =========================================

const updatePost = async (
    req,
    res,
    next
) => {

    try {

        const {
            title,
            content,
            image_url
        } = req.body;


        const post =
            await communityService.updatePost(

                req.params.id,

                req.user.id,

                {
                    title,
                    content,
                    image_url
                }

            );


        if (!post) {

            return res.status(404).json({

                success: false,

                message:
                    "Post not found or you are not the owner."

            });

        }


        return res.json({

            success: true,

            message:
                "Post updated successfully.",

            data: post

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// DELETE POST
// =========================================

const deletePost = async (
    req,
    res,
    next
) => {

    try {

        const deleted =
            await communityService.deletePost(

                req.params.id,

                req.user.id

            );


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "Post not found or you are not the owner."

            });

        }


        return res.json({

            success: true,

            message:
                "Post deleted successfully."

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// LIKE / UNLIKE POST
// =========================================

const likePost = async (
    req,
    res,
    next
) => {

    try {

        const result =
            await communityService.likePost(

                req.params.id,

                req.user.id

            );


        return res.json({

            success: true,

            message:
                result.liked
                    ? "Post liked."
                    : "Post unliked.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// ADD COMMENT
// =========================================

const addComment = async (
    req,
    res,
    next
) => {

    try {

        const comment =
            req.body.comment;


        if (
            !comment ||
            !comment.trim()
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Comment is required."

            });

        }


        const result =
            await communityService.addComment(

                req.params.id,

                req.user.id,

                comment.trim()

            );


        return res.status(201).json({

            success: true,

            message:
                "Comment added successfully.",

            data: result

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// GET COMMENTS
// =========================================

const getComments = async (
    req,
    res,
    next
) => {

    try {

        const comments =
            await communityService.getComments(

                req.params.id

            );


        return res.json({

            success: true,

            data: comments

        });

    } catch (error) {

        next(error);

    }

};


// =========================================
// DELETE COMMENT
// =========================================

const deleteComment = async (
    req,
    res,
    next
) => {

    try {

        const deleted =
            await communityService.deleteComment(

                req.params.commentId,

                req.user.id

            );


        if (!deleted) {

            return res.status(404).json({

                success: false,

                message:
                    "Comment not found or you are not the owner."

            });

        }


        return res.json({

            success: true,

            message:
                "Comment deleted successfully."

        });

    } catch (error) {

        next(error);

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
