/* =========================================
   GLOBETROTTER - MY TRIPS
   ========================================= */


document.addEventListener("DOMContentLoaded", function () {


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

        tripUserName.textContent = user.name;

    }


    if (tripAvatar) {

        tripAvatar.textContent =
            user.name.charAt(0).toUpperCase();

    }



    /* ================= MOBILE MENU ================= */

    const tripMenu =
        document.getElementById("tripMenu");

    const tripMobileNav =
        document.getElementById("tripMobileNav");


    tripMenu.addEventListener(
        "click",
        function () {

            tripMobileNav.classList.toggle("active");


            if (
                tripMobileNav.classList.contains("active")
            ) {

                tripMenu.textContent = "✕";

            } else {

                tripMenu.textContent = "☰";

            }

        }
    );



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


    let selectedTripId = null;

    let currentFilter = "all";



    /* ================= GET TRIPS ================= */

    function getTrips() {

        return (
            JSON.parse(
                localStorage.getItem("globeTrotterTrips")
            ) || []
        );

    }



    /* ================= UPDATE COUNTS ================= */

    function updateCounts() {

        const trips = getTrips();


        const upcomingTrips =
            trips.filter(
                function (trip) {

                    return trip.status === "Upcoming";

                }
            );


        const completedTrips =
            trips.filter(
                function (trip) {

                    return trip.status === "Completed";

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

        const allTrips = getTrips();


        const userTrips =
            allTrips.filter(
                function (trip) {

                    return (
                        trip.userId ===
                        (user.email || user.name)
                    );

                }
            );


        let filteredTrips = userTrips;


        if (currentFilter === "upcoming") {

            filteredTrips =
                userTrips.filter(
                    function (trip) {

                        return (
                            trip.status === "Upcoming" ||
                            trip.status === "Planned"
                        );

                    }
                );

        }


        if (currentFilter === "completed") {

            filteredTrips =
                userTrips.filter(
                    function (trip) {

                        return (
                            trip.status === "Completed"
                        );

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


        const style =
            trip.travelStyle || "Travel";


        article.innerHTML = `

            <div class="trip-card-image">

                <span class="trip-card-status">
                    ${escapeHTML(trip.status || "Upcoming")}
                </span>

            </div>


            <div class="trip-card-body">


                <div class="trip-card-title-row">

                    <h2 class="trip-card-title">
                        ${escapeHTML(trip.tripName)}
                    </h2>

                    <span class="trip-card-style">
                        ${escapeHTML(style)}
                    </span>

                </div>


                <p class="trip-location">
                    📍 ${escapeHTML(trip.destination)}
                </p>


                <div class="trip-card-info">

                    <div class="trip-info-row">

                        <span>📅</span>

                        <span>
                            ${formatDate(trip.startDate)}
                            -
                            ${formatDate(trip.endDate)}
                        </span>

                    </div>


                    <div class="trip-info-row">

                        <span>👥</span>

                        <span>
                            <strong>${trip.travelers}</strong>
                            Traveler(s)
                        </span>

                    </div>


                    <div class="trip-info-row">

                        <span>💰</span>

                        <span>
                            ${formatBudget(
                                trip.budget,
                                trip.currency
                            )}
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



    /* ================= FILTERS ================= */

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove("active");

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

            deleteModal.classList.remove("show");

        }
    );



    /* ================= CONFIRM DELETE ================= */

    confirmDelete.addEventListener(
        "click",
        function () {

            if (selectedTripId === null) {

                return;

            }


            const trips =
                getTrips();


            const updatedTrips =
                trips.filter(
                    function (trip) {

                        return (
                            Number(trip.id) !==
                            selectedTripId
                        );

                    }
                );


            localStorage.setItem(
                "globeTrotterTrips",
                JSON.stringify(updatedTrips)
            );


            selectedTripId = null;

            deleteModal.classList.remove("show");


            updateCounts();

            displayTrips();

        }
    );



    /* ================= CLOSE MODAL OUTSIDE ================= */

    deleteModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target === deleteModal
            ) {

                selectedTripId = null;

                deleteModal.classList.remove("show");

            }

        }
    );



    /* ================= DATE FORMAT ================= */

    function formatDate(dateValue) {

        if (!dateValue) {

            return "Not selected";

        }


        const date =
            new Date(dateValue + "T00:00:00");


        return date.toLocaleDateString(
            "en-IN",
            {

                day: "numeric",

                month: "short",

                year: "numeric"

            }
        );

    }



    /* ================= BUDGET FORMAT ================= */

    function formatBudget(
        budget,
        currency
    ) {

        const amount =
            Number(budget || 0);


        if (!amount) {

            return "Budget not set";

        }


        try {

            return new Intl.NumberFormat(
                "en-IN",
                {

                    style: "currency",

                    currency:
                        currency || "INR",

                    maximumFractionDigits: 0

                }
            ).format(amount);

        } catch (error) {

            return (
                (currency || "INR") +
                " " +
                amount
            );

        }

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

    updateCounts();

    displayTrips();

});
