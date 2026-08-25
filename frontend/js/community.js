// =========================================
// PAGE INITIALIZATION
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    initializeCommunity
);


function initializeCommunity() {

    setupCreatePost();

    loadPosts();

}


// =========================================
// CREATE POST UI
// =========================================

function setupCreatePost() {

    const createButton =
        document.getElementById(
            "createPostButton"
        );


    const createCard =
        document.getElementById(
            "createPostCard"
        );


    const cancelButton =
        document.getElementById(
            "cancelPostButton"
        );


    const form =
        document.getElementById(
            "createPostForm"
        );


    createButton.addEventListener(
        "click",
        () => {

            createCard.classList.toggle(
                "show"
            );

        }
    );


    cancelButton.addEventListener(
        "click",
        () => {

            form.reset();

            createCard.classList.remove(
                "show"
            );

        }
    );


    form.addEventListener(
        "submit",
        createPost
    );

}


// =========================================
// LOAD POSTS
// =========================================

async function loadPosts() {

    const container =
        document.getElementById(
            "postsContainer"
        );


    container.innerHTML = `
        <div class="loading-state">
            Loading community posts...
        </div>
    `;


    try {

        const response =
            await apiRequest(
                "/community/posts",
                {
                    method: "GET"
                }
            );


        const posts =
            response.data || [];


        if (
            posts.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-state">

                    <h2>
                        No posts yet
                    </h2>

                    <p>
                        Be the first person
                        to share a travel story.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            posts
                .map(
                    post =>
                        createPostHTML(
                            post
                        )
                )
                .join("");


        setupPostEvents();


    } catch (error) {

        container.innerHTML = `

            <div class="error-state">

                <h2>
                    Unable to load posts
                </h2>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

                <button
                    type="button"
                    onclick="loadPosts()"
                >
                    Try Again
                </button>

            </div>

        `;

    }

}


// =========================================
// CREATE POST
// =========================================

async function createPost(event) {

    event.preventDefault();


    const form =
        event.target;


    const title =
        document
            .getElementById(
                "postTitle"
            )
            .value
            .trim();


    const content =
        document
            .getElementById(
                "postContent"
            )
            .value
            .trim();


    const imageUrl =
        document
            .getElementById(
                "postImage"
            )
            .value
            .trim();


    if (!title) {

        alert(
            "Please enter a post title."
        );

        return;

    }


    if (!content) {

        alert(
            "Please enter post content."
        );

        return;

    }


    const button =
        form.querySelector(
            "button[type='submit']"
        );


    button.disabled = true;

    button.textContent =
        "Publishing...";


    try {

        await apiRequest(
            "/community/posts",
            {
                method: "POST",

                body: JSON.stringify({

                    title,

                    content,

                    image_url:
                        imageUrl || null

                })

            }
        );


        form.reset();


        document
            .getElementById(
                "createPostCard"
            )
            .classList.remove(
                "show"
            );


        await loadPosts();


    } catch (error) {

        alert(
            error.message
        );

    } finally {

        button.disabled = false;

        button.textContent =
            "Publish Post";

    }

}


// =========================================
// POST HTML
// =========================================

function createPostHTML(post) {

    const author =
        post.name ||
        "GlobeTrotter User";


    const image =
        post.image_url
            ? `
                <img
                    class="post-image"
                    src="${escapeAttribute(
                        post.image_url
                    )}"
                    alt="${escapeAttribute(
                        post.title
                    )}"
                    onerror="this.style.display='none'"
                >
            `
            : "";


    return `

        <article
            class="post-card"
            data-post-id="${post.id}"
        >


            <div class="post-top">

                <div>

                    <div class="post-author">

                        👤
                        ${escapeHTML(
                            author
                        )}

                    </div>

                    <div class="post-date">

                        ${formatDate(
                            post.created_at
                        )}

                    </div>

                </div>


                <button
                    type="button"
                    class="delete-post-btn"
                    data-post-id="${post.id}"
                    title="Delete post"
                >
                    🗑️
                </button>

            </div>


            <h2>
                ${escapeHTML(
                    post.title
                )}
            </h2>


            <div class="post-content">

                ${escapeHTML(
                    post.content
                )}

            </div>


            ${image}


            <div class="post-actions">

                <button
                    type="button"
                    class="post-action-btn like-btn"
                    data-post-id="${post.id}"
                >

                    ❤️
                    <span>
                        ${Number(
                            post.likes_count || 0
                        )}
                    </span>

                </button>


                <button
                    type="button"
                    class="post-action-btn comment-btn"
                    data-post-id="${post.id}"
                >

                    💬
                    <span>
                        ${Number(
                            post.comments_count || 0
                        )}
                    </span>

                </button>

            </div>


            <section
                class="comments-section"
                id="comments-${post.id}"
            >

                <div
                    class="comment-list"
                    id="comment-list-${post.id}"
                >
                </div>


                <form
                    class="comment-form"
                    data-post-id="${post.id}"
                >

                    <input
                        type="text"
                        placeholder="Write a comment..."
                        required
                    >


                    <button
                        type="submit"
                    >
                        Comment
                    </button>

                </form>

            </section>


        </article>

    `;

}


// =========================================
// POST EVENTS
// =========================================

function setupPostEvents() {

    document
        .querySelectorAll(
            ".like-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () =>
                        likePost(
                            button.dataset.postId,
                            button
                        )
                );

            }
        );


    document
        .querySelectorAll(
            ".comment-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () =>
                        toggleComments(
                            button.dataset.postId
                        )
                );

            }
        );


    document
        .querySelectorAll(
            ".delete-post-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () =>
                        deletePost(
                            button.dataset.postId
                        )
                );

            }
        );


    document
        .querySelectorAll(
            ".comment-form"
        )
        .forEach(
            form => {

                form.addEventListener(
                    "submit",
                    submitComment
                );

            }
        );

}


// =========================================
// LIKE / UNLIKE
// =========================================

async function likePost(
    postId,
    button
) {

    button.disabled = true;


    try {

        const response =
            await apiRequest(
                `/community/posts/${postId}/like`,
                {
                    method: "POST"
                }
            );


        const count =
            button.querySelector(
                "span"
            );


        if (
            response.data
        ) {

            // Reload posts so
            // database count is always accurate.
            await loadPosts();

        }


    } catch (error) {

        alert(
            error.message
        );

    } finally {

        button.disabled = false;

    }

}


// =========================================
// COMMENTS TOGGLE
// =========================================

async function toggleComments(
    postId
) {

    const section =
        document.getElementById(
            `comments-${postId}`
        );


    if (
        section.classList.contains(
            "show"
        )
    ) {

        section.classList.remove(
            "show"
        );

        return;

    }


    section.classList.add(
        "show"
    );


    await loadComments(
        postId
    );

}


// =========================================
// LOAD COMMENTS
// =========================================

async function loadComments(
    postId
) {

    const list =
        document.getElementById(
            `comment-list-${postId}`
        );


    list.innerHTML = `
        <p>
            Loading comments...
        </p>
    `;


    try {

        const response =
            await apiRequest(
                `/community/posts/${postId}/comments`,
                {
                    method: "GET"
                }
            );


        const comments =
            response.data || [];


        if (
            comments.length === 0
        ) {

            list.innerHTML = `
                <p>
                    No comments yet.
                    Be the first to comment.
                </p>
            `;

            return;

        }


        list.innerHTML =
            comments
                .map(
                    comment =>
                        createCommentHTML(
                            comment
                        )
                )
                .join("");


        setupCommentDeleteEvents();


    } catch (error) {

        list.innerHTML = `
            <p>
                Unable to load comments.
            </p>
        `;

    }

}


// =========================================
// COMMENT HTML
// =========================================

function createCommentHTML(
    comment
) {

    return `

        <div
            class="comment"
            data-comment-id="${comment.id}"
        >

            <div class="comment-header">

                <div>

                    <span class="comment-author">

                        👤
                        ${escapeHTML(
                            comment.name ||
                            "User"
                        )}

                    </span>

                    <span class="comment-date">

                        ${formatDate(
                            comment.created_at
                        )}

                    </span>

                </div>


                <button
                    type="button"
                    class="delete-comment-btn"
                    data-comment-id="${comment.id}"
                >
                    Delete
                </button>

            </div>


            <p class="comment-text">

                ${escapeHTML(
                    comment.comment
                )}

            </p>

        </div>

    `;

}


// =========================================
// SUBMIT COMMENT
// =========================================

async function submitComment(
    event
) {

    event.preventDefault();


    const form =
        event.target;


    const postId =
        form.dataset.postId;


    const input =
        form.querySelector(
            "input"
        );


    const button =
        form.querySelector(
            "button"
        );


    const comment =
        input.value.trim();


    if (!comment) {

        return;

    }


    button.disabled = true;

    button.textContent =
        "Posting...";


    try {

        await apiRequest(
            `/community/posts/${postId}/comments`,
            {
                method: "POST",

                body: JSON.stringify({

                    comment

                })

            }
        );


        input.value = "";


        await loadComments(
            postId
        );


        await loadPosts();


        const section =
            document.getElementById(
                `comments-${postId}`
            );


        if (section) {

            section.classList.add(
                "show"
            );

        }


    } catch (error) {

        alert(
            error.message
        );

    } finally {

        button.disabled = false;

        button.textContent =
            "Comment";

    }

}


// =========================================
// DELETE COMMENT EVENTS
// =========================================

function setupCommentDeleteEvents() {

    document
        .querySelectorAll(
            ".delete-comment-btn"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () =>
                        deleteComment(
                            button.dataset.commentId
                        )
                );

            }
        );

}


// =========================================
// DELETE COMMENT
// =========================================

async function deleteComment(
    commentId
) {

    const confirmed =
        confirm(
            "Delete this comment?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await apiRequest(
            `/community/comments/${commentId}`,
            {
                method: "DELETE"
            }
        );


        const comment =
            document.querySelector(
                `[data-comment-id="${commentId}"]`
            );


        if (comment) {

            const section =
                comment.closest(
                    ".comments-section"
                );


            comment.remove();


            if (section) {

                const postId =
                    section.id.replace(
                        "comments-",
                        ""
                    );


                await loadComments(
                    postId
                );

            }

        }


        await loadPosts();


    } catch (error) {

        alert(
            error.message
        );

    }

}


// =========================================
// DELETE POST
// =========================================

async function deletePost(
    postId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this post?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await apiRequest(
            `/community/posts/${postId}`,
            {
                method: "DELETE"
            }
        );


        await loadPosts();


    } catch (error) {

        alert(
            error.message
        );

    }

}


// =========================================
// DATE FORMAT
// =========================================

function formatDate(
    value
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "";

    }


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


// =========================================
// HTML SAFETY
// =========================================

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeAttribute(
    value
) {

    return escapeHTML(
        value
    );

}
