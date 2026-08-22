// ==========================================
// GlobeTrotter Community
// ==========================================


// Sample community posts

let posts = [

    {
        id: 1,
        user: "Rahul Sharma",
        avatar: "👨🏻",
        date: "2 hours ago",
        text: "Just completed my Goa trip! The beaches were amazing and the sunset at Palolem was unforgettable. 🌅🏖️",
        image: "",
        likes: 24,
        liked: false,
        comments: [
            "Goa looks amazing!",
            "Thanks for sharing!"
        ]
    },

    {
        id: 2,
        user: "Priya Patel",
        avatar: "👩🏻",
        date: "Yesterday",
        text: "Travel tip: Always keep a digital copy of your passport and important documents while travelling. ✈️",
        image: "",
        likes: 18,
        liked: false,
        comments: [
            "Very useful tip!",
            "Absolutely agree."
        ]
    },

    {
        id: 3,
        user: "Amit Verma",
        avatar: "🧑🏻",
        date: "3 days ago",
        text: "Planning a trip to Manali next month. Anyone have recommendations for places to visit? 🏔️",
        image: "",
        likes: 12,
        liked: false,
        comments: []
    }

];


// DOM elements

const postsContainer =
    document.getElementById("postsContainer");

const postText =
    document.getElementById("postText");

const postBtn =
    document.getElementById("postBtn");

const imageInput =
    document.getElementById("imageInput");


// ==========================================
// Render Posts
// ==========================================

function renderPosts() {

    postsContainer.innerHTML = "";

    posts.forEach(post => {

        const postCard =
            document.createElement("article");

        postCard.className = "post-card";

        postCard.innerHTML = `

            <div class="post-user">

                <div class="user-avatar">
                    ${post.avatar}
                </div>

                <div class="user-info">

                    <h3>
                        ${post.user}
                    </h3>

                    <span>
                        ${post.date}
                    </span>

                </div>

            </div>


            <div class="post-content">
                ${post.text}
            </div>


            ${
                post.image
                ?
                `<img
                    src="${post.image}"
                    class="post-image"
                    alt="Travel photo"
                >`
                :
                ""
            }


            <div class="post-footer">

                <button
                    class="${post.liked ? "liked" : ""}"
                    onclick="likePost(${post.id})"
                >
                    ❤️ ${post.likes}
                </button>


                <button
                    onclick="toggleComments(${post.id})"
                >
                    💬 ${post.comments.length}
                </button>


                <button
                    onclick="sharePost(${post.id})"
                >
                    🔗 Share
                </button>

            </div>


            <div
                class="comments"
                id="comments-${post.id}"
            >

                ${
                    post.comments.length > 0
                    ?
                    post.comments.map(comment => `
                        <div class="comment">
                            ${comment}
                        </div>
                    `).join("")
                    :
                    `<div class="comment">
                        No comments yet.
                    </div>`
                }

            </div>

        `;

        postsContainer.appendChild(postCard);

    });

}


// ==========================================
// Like Post
// ==========================================

function likePost(postId) {

    const post =
        posts.find(item => item.id === postId);

    if (!post) return;


    if (post.liked) {

        post.likes--;
        post.liked = false;

    } else {

        post.likes++;
        post.liked = true;

    }


    renderPosts();
}


// ==========================================
// Show / Hide Comments
// ==========================================

function toggleComments(postId) {

    const comments =
        document.getElementById(
            `comments-${postId}`
        );

    if (comments) {

        comments.classList.toggle("show");

    }
}


// ==========================================
// Share Post
// ==========================================

function sharePost(postId) {

    const post =
        posts.find(item => item.id === postId);

    if (!post) return;


    const shareText =
        `${post.user}: ${post.text}`;


    if (navigator.share) {

        navigator.share({
            title: "GlobeTrotter Travel Post",
            text: shareText
        });

    } else {

        navigator.clipboard.writeText(
            shareText
        );

        alert(
            "Post link/text copied to clipboard!"
        );

    }

}


// ==========================================
// Create New Post
// ==========================================

postBtn.addEventListener(
    "click",
    function () {

        const text =
            postText.value.trim();


        if (text === "") {

            alert(
                "Please write something before sharing."
            );

            return;

        }


        const file =
            imageInput.files[0];


        // Create post without image

        if (!file) {

            addPost(text, "");

            return;

        }


        // Read image

        const reader =
            new FileReader();


        reader.onload = function (event) {

            addPost(
                text,
                event.target.result
            );

        };


        reader.readAsDataURL(file);

    }
);


// ==========================================
// Add New Post
// ==========================================

function addPost(text, image) {

    const newPost = {

        id: Date.now(),

        user: "You",

        avatar: "👤",

        date: "Just now",

        text: text,

        image: image,

        likes: 0,

        liked: false,

        comments: []

    };


    posts.unshift(newPost);


    postText.value = "";

    imageInput.value = "";


    renderPosts();


    alert("Your post has been shared! 🎉");

}


// ==========================================
// Mobile Menu
// ==========================================

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.querySelector(".nav-links");


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle("show");

        }
    );

}


// ==========================================
// Initial Load
// ==========================================

renderPosts();
