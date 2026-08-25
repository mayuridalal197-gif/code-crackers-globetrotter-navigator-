const express = require("express");

const router = express.Router();

const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    likePost,
    addComment,
    getComments,
    deleteComment
} = require("../apicontrollers/communityController");

const authMiddleware =
    require("../_middleware/authMiddleware");


// =========================================
// POSTS
// =========================================

// Create post
router.post(
    "/posts",
    authMiddleware,
    createPost
);


// Get all posts
router.get(
    "/posts",
    authMiddleware,
    getPosts
);


// Get single post
router.get(
    "/posts/:id",
    authMiddleware,
    getPostById
);


// Update post
router.put(
    "/posts/:id",
    authMiddleware,
    updatePost
);


// Delete post
router.delete(
    "/posts/:id",
    authMiddleware,
    deletePost
);


// =========================================
// LIKES
// =========================================

// Like / Unlike post
router.post(
    "/posts/:id/like",
    authMiddleware,
    likePost
);


// =========================================
// COMMENTS
// =========================================

// Add comment
router.post(
    "/posts/:id/comments",
    authMiddleware,
    addComment
);


// Get comments
router.get(
    "/posts/:id/comments",
    authMiddleware,
    getComments
);


// Delete comment
router.delete(
    "/comments/:commentId",
    authMiddleware,
    deleteComment
);


module.exports = router;
