/* =========================================
   DASHBOARD
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);


/* =========================================
   INITIALIZE
========================================= */

async function initializeDashboard() {

    try {

        await loadUser();

        await loadDashboardTrips();

        document.getElementById(
            "dashboardContent"
        ).style.display = "block";


    } catch (error) {

        console.error(
            "Dashboard Error:",
            error
        );


        const loading =
            document.getElementById(
                "dashboardLoading"
            );


        loading.innerHTML = `

            <div class="dashboard-error">

                <h3>
                    Unable to load dashboard
                </h3>

                <p>
                    ${escapeHTML(
                        error.message ||
                        "Something went wrong."
                    )}
                </p>

            </div>

        `;

    }

}


/* =========================================
   LOAD USER
========================================= */

async function loadUser() {

    try {

        /*
         * Try common profile endpoints.
         * If your backend uses /auth/me,
         * this will work directly.
         */

        const response =
            await apiRequest(
                "/auth/me",
                {
                    method: "GET"
                }
            );


        const user =
            response.data;


        if (!user) {
            return;
        }


        const name =
            user.name ||
            user.full_name ||
            user.username ||
            user.first_name ||
            "Traveler";


        document.getElementById(
            "userName"
        ).textContent = name;


    } catch (error) {

        /*
         * User name is not critical for
         * dashboard functionality.
         */

        console.warn(
            "Could not load user:",
            error.message
        );

    }

}


/* =========================================
   LOAD TRIPS
========================================= */

async function loadDashboardTrips() {

    const response =
        await apiRequest(
            "/trips",
            {
                method: "GET"
            }
        );


    const trips =
        response.data || [];


    updateStats(
        trips
    );


    renderUpcomingTrips(
        trips
    );


    renderRecentTrips(
        trips
    );

}


/* =========================================
   UPDATE STATS
========================================= */

function updateStats(
    trips
) {

    const totalTrips =
        trips.length;


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
            trip => {

                if (!trip.start_date) {
                    return false;
                }


                const startDate =
                    new Date(
                        trip.start_date
                    );

                startDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return startDate >= today;

            }
        );


    const completedTrips =
        trips.filter(
            trip => {

                if (
                    trip.status &&
                    trip.status.toLowerCase() ===
                    "completed"
                ) {

                    return true;

                }


                if (!trip.end_date) {
                    return false;
                }


                const endDate =
                    new Date(
                        trip.end_date
                    );

                endDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return endDate < today;

            }
        );


    const totalBudget =
        trips.reduce(
            (
                total,
                trip
            ) => {

                return (
                    total +
                    Number(
                        trip.budget || 0
                    )
                );

            },
            0
        );


    document.getElementById(
        "totalTrips"
    ).textContent =
        totalTrips;


    document.getElementById(
        "upcomingTrips"
    ).textContent =
        upcomingTrips.length;


    document.getElementById(
        "completedTrips"
    ).textContent =
        completedTrips.length;


    document.getElementById(
        "totalBudget"
    ).textContent =
        `₹${totalBudget.toLocaleString(
            "en-IN"
        )}`;

}


/* =========================================
   UPCOMING TRIPS
========================================= */

function renderUpcomingTrips(
    trips
) {

    const container =
        document.getElementById(
            "upcomingTripsGrid"
        );


    const emptyState =
        document.getElementById(
            "noUpcomingTrips"
        );


    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const upcoming =
        trips
            .filter(
                trip => {

                    if (
                        !trip.start_date
                    ) {

                        return false;

                    }


                    const startDate =
                        new Date(
                            trip.start_date
                        );


                    startDate.setHours(
                        0,
                        0,
                        0,
                        0
                    );


                    return startDate >= today;

                }
            )
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        a.start_date
                    ) -
                    new Date(
                        b.start_date
                    )
            )
            .slice(
                0,
                3
            );


    if (
        upcoming.length === 0
    ) {

        container.innerHTML = "";

        emptyState.style.display =
            "block";

        return;

    }


    emptyState.style.display =
        "none";


    container.innerHTML =
        upcoming
            .map(
                trip =>
                    createTripCard(
                        trip
                    )
            )
            .join("");

}


/* =========================================
   RECENT TRIPS
========================================= */

function renderRecentTrips(
    trips
) {

    const container =
        document.getElementById(
            "recentTripsGrid"
        );


    if (
        trips.length === 0
    ) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <div>
                    🧳
                </div>

                <h3>
                    No trips yet
                </h3>

                <p>
                    Create your first trip
                    to get started.
                </p>

                <a
                    href="create-trip.html"
                    class="dashboard-create-btn"
                >
                    Create Trip
                </a>

            </div>

        `;

        return;

    }


    const recent =
        [...trips]
            .sort(
                (
                    a,
                    b
                ) =>
                    new Date(
                        b.created_at ||
                        b.start_date ||
                        0
                    ) -
                    new Date(
                        a.created_at ||
                        a.start_date ||
                        0
                    )
            )
            .slice(
                0,
                3
            );


    container.innerHTML =
        recent
            .map(
                trip =>
                    createTripCard(
                        trip
                    )
            )
            .join("");

}


/* =========================================
   TRIP CARD
========================================= */

function createTripCard(
    trip
) {

    const status =
        trip.status ||
        getTripStatus(
            trip
        );


    return `

        <article
            class="dashboard-trip-card"
        >

            <div class="dashboard-trip-image">

                <img
                    src="${getDestinationImage(
                        trip.destination
                    )}"
                    alt="${escapeHTML(
                        trip.destination ||
                        "Travel destination"
                    )}"
                >


                <span
                    class="dashboard-trip-status"
                >
                    ${escapeHTML(
                        status
                    )}
                </span>

            </div>


            <div
                class="dashboard-trip-content"
            >

                <h3>
                    ${escapeHTML(
                        trip.title ||
                        "Untitled Trip"
                    )}
                </h3>


                <p
                    class="dashboard-trip-destination"
                >
                    📍
                    ${escapeHTML(
                        trip.destination ||
                        "-"
                    )}
                </p>


                <div
                    class="dashboard-trip-date"
                >
                    📅
                    ${formatDate(
                        trip.start_date
                    )}
                    -
                    ${formatDate(
                        trip.end_date
                    )}
                </div>


                <div
                    class="dashboard-trip-actions"
                >

                    <a
                        href="itinerary-view.html?tripId=${trip.id}"
                    >
                        View Trip
                    </a>


                    <a
                        href="itinerary-builder.html?tripId=${trip.id}"
                    >
                        Edit
                    </a>

                </div>

            </div>

        </article>

    `;

}


/* =========================================
   STATUS
========================================= */

function getTripStatus(
    trip
) {

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    if (
        trip.end_date
    ) {

        const endDate =
            new Date(
                trip.end_date
            );

        endDate.setHours(
            0,
            0,
            0,
            0
        );


        if (
            endDate < today
        ) {

            return "completed";

        }

    }


    if (
        trip.start_date
    ) {

        const startDate =
            new Date(
                trip.start_date
            );

        startDate.setHours(
            0,
            0,
            0,
            0
        );


        if (
            startDate >= today
        ) {

            return "upcoming";

        }

    }


    return "planning";

}


/* =========================================
   DATE
========================================= */

function formatDate(
    value
) {

    if (!value) {
        return "-";
    }


    return new Date(
        value
    ).toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   DESTINATION IMAGE
========================================= */

function getDestinationImage(
    destination
) {

    return (
        "https://images.unsplash.com/" +
        "photo-1469474968028-56623f02e42e" +
        "?auto=format&fit=crop&w=900&q=80"
    );

}


/* =========================================
   HTML SAFETY
========================================= */

function escapeHTML(
    value
) {

    return String(
        value
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
