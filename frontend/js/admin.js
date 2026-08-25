// =========================================
// ADMIN DASHBOARD
// =========================================

document.addEventListener("DOMContentLoaded", initialize);


// =========================================
// INITIALIZE
// =========================================

async function initialize() {

    const token = getToken();

    if (!token) {
        redirectToLogin();
        return;
    }

    setupEvents();

    await loadDashboard();

}


// =========================================
// EVENTS
// =========================================

function setupEvents() {

    // Logout
    const logoutButton =
        document.getElementById("adminLogout");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    // Retry
    const retryButton =
        document.getElementById("retryAdmin");

    if (retryButton) {

        retryButton.addEventListener(
            "click",
            loadDashboard
        );

    }


    // Close data section
    const closeButton =
        document.getElementById(
            "closeDataSection"
        );

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeDataSection
        );

    }


    // View buttons
    document
        .querySelectorAll(".panel-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;

                    loadSection(section);

                }
            );

        });

}


// =========================================
// LOAD DASHBOARD
// =========================================

async function loadDashboard() {

    showLoading();

    try {

        const response =
            await apiRequest(
                "/admin/stats",
                {
                    method: "GET"
                }
            );


        const stats =
            response.data || {};


        document.getElementById(
            "totalUsers"
        ).textContent =
            stats.totalUsers || 0;


        document.getElementById(
            "totalTrips"
        ).textContent =
            stats.totalTrips || 0;


        document.getElementById(
            "totalCities"
        ).textContent =
            stats.totalCities || 0;


        document.getElementById(
            "totalPosts"
        ).textContent =
            stats.totalPosts || 0;


        showContent();


    } catch (error) {

        console.error(
            "Admin dashboard error:",
            error
        );


        showError(
            error.message
        );

    }

}


// =========================================
// LOAD SECTION
// =========================================

async function loadSection(section) {

    const sectionElement =
        document.getElementById(
            "adminDataSection"
        );


    const title =
        document.getElementById(
            "dataSectionTitle"
        );


    const description =
        document.getElementById(
            "dataSectionDescription"
        );


    sectionElement.style.display =
        "block";


    switch (section) {

        case "users":

            title.textContent =
                "Users";

            description.textContent =
                "Manage registered users.";

            break;


        case "cities":

            title.textContent =
                "Destinations";

            description.textContent =
                "Manage travel destinations.";

            break;


        case "trips":

            title.textContent =
                "Trips";

            description.textContent =
                "View trips created by users.";

            break;


        case "community":

            title.textContent =
                "Community Posts";

            description.textContent =
                "Moderate community posts.";

            break;


        default:

            return;

    }


    showDataLoading();


    try {

        let response;


        if (section === "users") {

            response =
                await apiRequest(
                    "/admin/users",
                    {
                        method: "GET"
                    }
                );

            renderUsers(
                response.data || []
            );

        }


        else if (section === "cities") {

            response =
                await apiRequest(
                    "/admin/cities",
                    {
                        method: "GET"
                    }
                );

            renderCities(
                response.data || []
            );

        }


        else if (section === "trips") {

            response =
                await apiRequest(
                    "/admin/trips",
                    {
                        method: "GET"
                    }
                );

            renderTrips(
                response.data || []
            );

        }


        else if (section === "community") {

            response =
                await apiRequest(
                    "/admin/community",
                    {
                        method: "GET"
                    }
                );

            renderCommunity(
                response.data || []
            );

        }


    } catch (error) {

        console.error(
            "Admin section error:",
            error
        );


        showDataError(
            error.message
        );

    }

}


// =========================================
// RENDER USERS
// =========================================

function renderUsers(users) {

    setTableHeader(`
        <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Action</th>
        </tr>
    `);


    if (users.length === 0) {

        setTableBody(`
            <tr>
                <td colspan="6">
                    No users found.
                </td>
            </tr>
        `);

        return;
    }


    const html =
        users.map(user => {

            return `
                <tr>

                    <td>
                        ${escapeHTML(user.id)}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.name || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.email || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            user.role || "user"
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            user.created_at
                        )}
                    </td>

                    <td>

                        ${
                            user.role === "admin"

                            ? `<span>Admin</span>`

                            : `
                                <button
                                    class="delete-button"
                                    data-action="delete-user"
                                    data-id="${user.id}"
                                >
                                    Delete
                                </button>
                            `
                        }

                    </td>

                </tr>
            `;

        }).join("");


    setTableBody(html);

    attachDeleteEvents();

}


// =========================================
// RENDER CITIES
// =========================================

function renderCities(cities) {

    setTableHeader(`
        <tr>
            <th>ID</th>
            <th>Destination</th>
            <th>Country</th>
            <th>Budget</th>
            <th>Created</th>
            <th>Action</th>
        </tr>
    `);


    if (cities.length === 0) {

        setTableBody(`
            <tr>
                <td colspan="6">
                    No destinations found.
                </td>
            </tr>
        `);

        return;
    }


    const html =
        cities.map(city => {

            return `
                <tr>

                    <td>
                        ${escapeHTML(city.id)}
                    </td>

                    <td>
                        ${escapeHTML(
                            city.name || "-"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            city.country || "-"
                        )}
                    </td>

                    <td>
                        ₹${Number(
                            city.average_budget || 0
                        ).toLocaleString("en-IN")}
                    </td>

                    <td>
                        ${formatDate(
                            city.created_at
                        )}
                    </td>

                    <td>

                        <button
                            class="delete-button"
                            data-action="delete-city"
                            data-id="${city.id}"
                        >
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        }).join("");


    setTableBody(html);

    attachDeleteEvents();

}


// =========================================
// RENDER TRIPS
// =========================================

function renderTrips(trips) {

    setTableHeader(`
        <tr>
            <th>ID</th>
            <th>Trip</th>
            <th>User</th>
            <th>Destination</th>
            <th>Dates</th>
            <th>Budget</th>
        </tr>
    `);


    if (trips.length === 0) {

        setTableBody(`
            <tr>
                <td colspan="6">
                    No trips found.
                </td>
            </tr>
        `);

        return;
    }


    const html =
        trips.map(trip => {

            return `
                <tr>

                    <td>
                        ${escapeHTML(trip.id)}
                    </td>

                    <td>
                        ${escapeHTML(
                            trip.title || "Untitled Trip"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            trip.user_name || "-"
                        )}
                        <br>
                        <small>
                            ${escapeHTML(
                                trip.user_email || ""
                            )}
                        </small>
                    </td>

                    <td>
                        ${escapeHTML(
                            trip.destination || "-"
                        )}
                    </td>

                    <td>
                        ${formatDate(
                            trip.start_date
                        )}
                        -
                        ${formatDate(
                            trip.end_date
                        )}
                    </td>

                    <td>
                        ₹${Number(
                            trip.budget || 0
                        ).toLocaleString("en-IN")}
                    </td>

                </tr>
            `;

        }).join("");


    setTableBody(html);

}


// =========================================
// RENDER COMMUNITY
// =========================================

function renderCommunity(posts) {

    setTableHeader(`
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>User</th>
            <th>Likes</th>
            <th>Comments</th>
            <th>Action</th>
        </tr>
    `);


    if (posts.length === 0) {

        setTableBody(`
            <tr>
                <td colspan="6">
                    No community posts found.
                </td>
            </tr>
        `);

        return;
    }


    const html =
        posts.map(post => {

            return `
                <tr>

                    <td>
                        ${escapeHTML(post.id)}
                    </td>

                    <td>
                        ${escapeHTML(
                            post.title || "Untitled"
                        )}
                    </td>

                    <td>
                        ${escapeHTML(
                            post.user_name || "-"
                        )}
                    </td>

                    <td>
                        ❤️
                        ${Number(
                            post.likes_count || 0
                        )}
                    </td>

                    <td>
                        💬
                        ${Number(
                            post.comments_count || 0
                        )}
                    </td>

                    <td>

                        <button
                            class="delete-button"
                            data-action="delete-post"
                            data-id="${post.id}"
                        >
                            Delete
                        </button>

                    </td>

                </tr>
            `;

        }).join("");


    setTableBody(html);

    attachDeleteEvents();

}


// =========================================
// DELETE EVENTS
// =========================================

function attachDeleteEvents() {

    document
        .querySelectorAll(".delete-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                handleDelete
            );

        });

}


// =========================================
// HANDLE DELETE
// =========================================

async function handleDelete(event) {

    const button =
        event.currentTarget;


    const action =
        button.dataset.action;


    const id =
        button.dataset.id;


    if (!id) {
        return;
    }


    let message =
        "Are you sure you want to delete this item?";


    if (action === "delete-user") {

        message =
            "Delete this user? This action cannot be undone.";

    }


    else if (action === "delete-city") {

        message =
            "Delete this destination?";

    }


    else if (action === "delete-post") {

        message =
            "Delete this community post?";

    }


    if (!confirm(message)) {
        return;
    }


    button.disabled = true;

    button.textContent =
        "Deleting...";


    try {

        let endpoint;


        if (action === "delete-user") {

            endpoint =
                `/admin/users/${id}`;

        }


        else if (action === "delete-city") {

            endpoint =
                `/admin/cities/${id}`;

        }


        else if (action === "delete-post") {

            endpoint =
                `/admin/community/${id}`;

        }


        await apiRequest(
            endpoint,
            {
                method: "DELETE"
            }
        );


        // Reload currently visible section
        const section =
            getCurrentSection();


        if (section) {

            await loadSection(section);

        }


        // Refresh statistics
        await refreshStats();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            error.message ||
            "Delete failed."
        );


        button.disabled = false;

        button.textContent =
            "Delete";

    }

}


// =========================================
// CURRENT SECTION
// =========================================

function getCurrentSection() {

    const section =
        document.getElementById(
            "adminDataSection"
        );


    if (
        !section ||
        section.style.display === "none"
    ) {

        return null;

    }


    const title =
        document.getElementById(
            "dataSectionTitle"
        ).textContent;


    if (title === "Users") {
        return "users";
    }


    if (title === "Destinations") {
        return "cities";
    }


    if (title === "Trips") {
        return "trips";
    }


    if (title === "Community Posts") {
        return "community";
    }


    return null;

}


// =========================================
// REFRESH STATS
// =========================================

async function refreshStats() {

    try {

        const response =
            await apiRequest(
                "/admin/stats",
                {
                    method: "GET"
                }
            );


        const stats =
            response.data || {};


        document.getElementById(
            "totalUsers"
        ).textContent =
            stats.totalUsers || 0;


        document.getElementById(
            "totalTrips"
        ).textContent =
            stats.totalTrips || 0;


        document.getElementById(
            "totalCities"
        ).textContent =
            stats.totalCities || 0;


        document.getElementById(
            "totalPosts"
        ).textContent =
            stats.totalPosts || 0;

    } catch (error) {

        console.error(
            "Stats refresh error:",
            error
        );

    }

}


// =========================================
// TABLE HELPERS
// =========================================

function setTableHeader(html) {

    document.getElementById(
        "adminTableHead"
    ).innerHTML = html;

}


function setTableBody(html) {

    document.getElementById(
        "adminTableBody"
    ).innerHTML = html;


    document.getElementById(
        "adminDataLoading"
    ).style.display = "none";


    document.getElementById(
        "adminTableWrapper"
    ).style.display = "block";

}


function showDataLoading() {

    document.getElementById(
        "adminDataLoading"
    ).style.display = "block";


    document.getElementById(
        "adminTableWrapper"
    ).style.display = "none";

}


function showDataError(message) {

    document.getElementById(
        "adminDataLoading"
    ).style.display = "block";


    document.getElementById(
        "adminDataLoading"
    ).textContent =
        message ||
        "Unable to load data.";

}


function closeDataSection() {

    document.getElementById(
        "adminDataSection"
    ).style.display = "none";

}


// =========================================
// PAGE STATES
// =========================================

function showLoading() {

    document.getElementById(
        "adminLoading"
    ).style.display = "flex";


    document.getElementById(
        "adminError"
    ).style.display = "none";


    document.getElementById(
        "adminContent"
    ).style.display = "none";

}


function showContent() {

    document.getElementById(
        "adminLoading"
    ).style.display = "none";


    document.getElementById(
        "adminError"
    ).style.display = "none";


    document.getElementById(
        "adminContent"
    ).style.display = "block";

}


function showError(message) {

    document.getElementById(
        "adminLoading"
    ).style.display = "none";


    document.getElementById(
        "adminContent"
    ).style.display = "none";


    document.getElementById(
        "adminError"
    ).style.display = "block";


    document.getElementById(
        "adminErrorMessage"
    ).textContent =
        message ||
        "Something went wrong.";

}


// =========================================
// LOGOUT
// =========================================

function logout() {

    removeToken();

    window.location.href =
        "login.html";

}


// =========================================
// LOGIN REDIRECT
// =========================================

function redirectToLogin() {

    window.location.href =
        "login.html";

}


// =========================================
// DATE
// =========================================

function formatDate(value) {

    if (!value) {
        return "-";
    }


    const date =
        new Date(value);


    if (Number.isNaN(date.getTime())) {
        return "-";
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

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
