/* =========================================
   GLOBETROTTER - MY TRIPS
   ========================================= */

document.addEventListener("DOMContentLoaded", async function () {

    /* ================= LOGIN CHECK ================= */

    const user =
        JSON.parse(
            localStorage.getItem("globeTrotterLoggedIn")
        );

    if (!user) {
        window.location.href = "login.html";
        return;
    }


    /* ================= USER INFO ================= */

    const tripUserName =
        document.getElementById("tripUserName");

    const tripAvatar =
        document.getElementById("tripAvatar");

    if (tripUserName) {
        tripUserName.textContent =
            user.name || "Traveler";
    }

    if (tripAvatar) {
        tripAvatar.textContent =
            (user.name || "T").charAt(0).toUpperCase();
    }


    /* ================= MOBILE MENU ================= */

    const tripMenu =
        document.getElementById("tripMenu");

    const tripMobileNav =
        document.getElementById("tripMobileNav");

    if (tripMenu && tripMobileNav) {

        tripMenu.addEventListener(
            "click",
            function () {

                tripMobileNav.classList.toggle("active");

                tripMenu.textContent =
                    tripMobileNav.classList.contains("active")
                        ? "✕"
                        : "☰";

            }
        );

    }


    /* ================= ELEMENTS ================= */

    const tripsGrid =
        document.getElementById("tripsGrid");

    const emptyTrips =
        document.getElementById("emptyTrips");

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const deleteModal =
        document.getElementById("deleteModal");

    const cancelDelete =
        document.getElementById("cancelDelete");

    const confirmDelete =
        document.getElementById("confirmDelete");


    let trips = [];

    let selectedTripId = null;

    let currentFilter = "all";


    /* ================= GET TRIPS FROM BACKEND ================= */

    async function loadTrips() {

        try {

            tripsGrid.innerHTML = `
                <p class="loading-message">
                    Loading your trips...
                </p>
            `;

            const response =
                await apiRequest("/trips", {
                    method: "GET"
                });


            if (!response.success) {

                throw new Error(
                    response.message ||
                    "Unable to load trips."
                );

            }


            trips =
                response.data?.trips || [];


            updateCounts();

            displayTrips();


        } catch (error) {

            console.error(
                "Load trips error:",
                error
            );


            tripsGrid.innerHTML = "";

            emptyTrips.classList.add("show");

            const message =
                emptyTrips.querySelector("p");

            if (message) {

                message.textContent =
                    error.message ||
                    "Unable to load your trips.";

            }

        }

    }


    /* ================= UPDATE COUNTS ================= */

    function updateCounts() {

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const upcomingTrips =
            trips.filter(
                function (trip) {

                    const startDate =
                        new Date(
                            trip.start_date +
                            "T00:00:00"
                        );

                    return startDate >= today;

                }
            );


        const completedTrips =
            trips.filter(
                function (trip) {

                    const endDate =
                        new Date(
                            trip.end_date +
                            "T00:00:00"
                        );

                    return endDate < today;

                }
            );


        document.getElementById(
            "allTripsCount"
        ).textContent =
            trips.length;


        document.getElementById(
            "upcomingCount"
        ).textContent =
            upcomingTrips.length;


        document.getElementById(
            "completedCount"
        ).textContent =
            completedTrips.length;

    }


    /* ================= DISPLAY TRIPS ================= */

    function displayTrips() {

        let filteredTrips = trips;


        if (currentFilter === "upcoming") {

            filteredTrips =
                trips.filter(
                    function (trip) {

                        const startDate =
                            new Date(
                                trip.start_date +
                                "T00:00:00"
                            );

                        const today =
                            new Date();

                        today.setHours(
                            0,
                            0,
                            0,
                            0
                        );

                        return startDate >= today;

                    }
                );

        }


        if (currentFilter === "completed") {

            filteredTrips =
                trips.filter(
                    function (trip) {

                        const endDate =
                            new Date(
                                trip.end_date +
                                "T00:00:00"
                            );

                        const today =
                            new Date();

                        today.setHours(
                            0,
                            0,
                            0,
                            0
                        );

                        return endDate < today;

                    }
                );

        }


        tripsGrid.innerHTML = "";


        if (filteredTrips.length === 0) {

            emptyTrips.classList.add("show");

            return;

        }


        emptyTrips.classList.remove("show");


        filteredTrips.forEach(
            function (trip) {

                const card =
                    createTripCard(trip);

                tripsGrid.appendChild(card);

            }
        );

    }


    /* ================= CREATE CARD ================= */

    function createTripCard(trip) {

        const article =
            document.createElement("article");

        article.className =
            "trip-card";


        const status =
            getTripStatus(trip);


        article.innerHTML = `

            <div class="trip-card-image">

                <span class="trip-card-status">
                    ${escapeHTML(status)}
                </span>

            </div>


            <div class="trip-card-body">


                <div class="trip-card-title-row">

                    <h2 class="trip-card-title">
                        ${escapeHTML(trip.title)}
                    </h2>

                    <span class="trip-card-style">
                        Travel
                    </span>

                </div>


                <p class="trip-location">
                    📍 ${escapeHTML(trip.destination)}
                </p>


                <div class="trip-card-info">

                    <div class="trip-info-row">

                        <span>📅</span>

                        <span>
                            ${formatDate(trip.start_date)}
                            -
                            ${formatDate(trip.end_date)}
                        </span>

                    </div>


                    <div class="trip-info-row">

                        <span>👥</span>

                        <span>
                            Traveler information unavailable
                        </span>

                    </div>


                    <div class="trip-info-row">

                        <span>💰</span>

                        <span>
                            Budget information unavailable
                        </span>

                    </div>

                </div>


                <div class="trip-card-actions">

                    <a
                        href="itinerary-builder.html?id=${trip.id}"
                        class="view-trip-btn">

                        Plan Trip

                    </a>


                    <a
                        href="create-trip.html?edit=${trip.id}"
                        class="edit-trip-btn">

                        Edit

                    </a>


                    <button
                        class="delete-trip-btn"
                        type="button"
                        data-id="${trip.id}"
                        aria-label="Delete trip">

                        🗑️

                    </button>

                </div>

            </div>
        `;


        const deleteButton =
            article.querySelector(
                ".delete-trip-btn"
            );


        deleteButton.addEventListener(
            "click",
            function () {

                selectedTripId =
                    Number(
                        deleteButton.dataset.id
                    );

                deleteModal.classList.add("show");

            }
        );


        return article;

    }


    /* ================= TRIP STATUS ================= */

    function getTripStatus(trip) {

        const today =
            new Date();

        today.setHours(
            0,
            0,
            0,
            0
        );


        const startDate =
            new Date(
                trip.start_date +
                "T00:00:00"
            );


        const endDate =
            new Date(
                trip.end_date +
                "T00:00:00"
            );


        if (endDate < today) {

            return "Completed";

        }


        if (startDate > today) {

            return "Upcoming";

        }


        return "Ongoing";

    }


    /* ================= FILTERS ================= */

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add("active");


                    currentFilter =
                        button.dataset.filter;


                    displayTrips();

                }
            );

        }
    );


    /* ================= CANCEL DELETE ================= */

    cancelDelete.addEventListener(
        "click",
        function () {

            selectedTripId = null;

            deleteModal.classList.remove(
                "show"
            );

        }
    );


    /* ================= CONFIRM DELETE ================= */

    confirmDelete.addEventListener(
        "click",
        async function () {

            if (selectedTripId === null) {
                return;
            }


            const tripId =
                selectedTripId;


            confirmDelete.disabled = true;

            confirmDelete.textContent =
                "Deleting...";


            try {

                const response =
                    await apiRequest(
                        `/trips/${tripId}`,
                        {
                            method: "DELETE"
                        }
                    );


                if (!response.success) {

                    throw new Error(
                        response.message ||
                        "Unable to delete trip."
                    );

                }


                trips =
                    trips.filter(
                        function (trip) {

                            return Number(trip.id) !==
                                tripId;

                        }
                    );


                selectedTripId = null;

                deleteModal.classList.remove(
                    "show"
                );


                updateCounts();

                displayTrips();


            } catch (error) {

                console.error(
                    "Delete trip error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to delete trip."
                );

            }


            confirmDelete.disabled = false;

            confirmDelete.textContent =
                "Delete Trip";

        }
    );


    /* ================= CLOSE MODAL OUTSIDE ================= */

    deleteModal.addEventListener(
        "click",
        function (event) {

            if (event.target === deleteModal) {

                selectedTripId = null;

                deleteModal.classList.remove(
                    "show"
                );

            }

        }
    );


    /* ================= DATE FORMAT ================= */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "Not selected";

        }


        const date =
            new Date(
                dateValue +
                "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

    }


    /* ================= SECURITY ================= */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    /* ================= INITIAL LOAD ================= */

    await loadTrips();

});
