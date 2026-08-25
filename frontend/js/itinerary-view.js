// =========================
// GET TRIP ID
// =========================

const params =
    new URLSearchParams(
        window.location.search
    );

const tripId =
    params.get("tripId");


// =========================
// PAGE LOAD
// =========================

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


async function initialize() {

    if (!tripId) {

        showError(
            "Trip ID is missing."
        );

        return;
    }


    await loadTrip();

}


// =========================
// LOAD TRIP
// =========================

async function loadTrip() {

    const loading =
        document.getElementById(
            "loading"
        );


    try {

        // -------------------------
        // GET TRIP
        // -------------------------

        const tripResponse =
            await apiRequest(
                `/trips/${tripId}`,
                {
                    method: "GET"
                }
            );


        const trip =
            tripResponse.data;


        if (!trip) {

            throw new Error(
                "Trip not found."
            );

        }


        // -------------------------
        // DISPLAY TRIP
        // -------------------------

        document.getElementById(
            "tripTitle"
        ).textContent =
            trip.title || "My Trip";


        document.getElementById(
            "tripDestination"
        ).textContent =
            `📍 ${trip.destination || "-"}`;


        document.getElementById(
            "summaryDestination"
        ).textContent =
            trip.destination || "-";


        document.getElementById(
            "tripDates"
        ).textContent =
            `${formatDate(trip.start_date)} - ${formatDate(trip.end_date)}`;


        document.getElementById(
            "tripTravelers"
        ).textContent =
            `👥 ${trip.travelers || 0}`;


        document.getElementById(
            "tripBudget"
        ).textContent =
            `₹${Number(
                trip.budget || 0
            ).toLocaleString("en-IN")}`;


        // -------------------------
        // EDIT BUTTON
        // -------------------------

        document.getElementById(
            "editItineraryButton"
        ).href =
            `itinerary-builder.html?tripId=${tripId}`;


        // -------------------------
        // LOAD ITINERARY
        // -------------------------

        await loadItinerary();


        // -------------------------
        // SHOW PAGE
        // -------------------------

        document.getElementById(
            "tripContent"
        ).style.display =
            "block";


    } catch (error) {

        showError(
            error.message
        );

    } finally {

        loading.style.display =
            "none";

    }

}


// =========================
// LOAD ITINERARY
// =========================

async function loadItinerary() {

    const container =
        document.getElementById(
            "itineraryDays"
        );


    container.innerHTML = "";


    const response =
        await apiRequest(
            `/itineraries/trip/${tripId}`,
            {
                method: "GET"
            }
        );


    const itineraries =
        response.data || [];


    if (itineraries.length === 0) {

        container.innerHTML = `

            <div class="empty-trips">

                <div class="empty-icon">
                    🗺️
                </div>

                <h2>
                    No itinerary yet
                </h2>

                <p>
                    Start building your itinerary
                    to see your travel plan here.
                </p>

                <a
                    href="itinerary-builder.html?tripId=${tripId}"
                    class="create-trip-btn"
                >
                    Build Itinerary
                </a>

            </div>

        `;

        return;
    }


    // Sort days

    itineraries.sort(
        (a, b) =>
            Number(a.day_number) -
            Number(b.day_number)
    );


    // Build each day

    for (
        const itinerary of itineraries
    ) {

        const dayCard =
            createDayCard(
                itinerary
            );


        container.appendChild(
            dayCard
        );


        await loadActivities(
            itinerary.id,
            dayCard
        );

    }

}


// =========================
// CREATE DAY CARD
// =========================

function createDayCard(
    itinerary
) {

    const card =
        document.createElement(
            "section"
        );


    card.className =
        "view-day-card";


    card.innerHTML = `

        <div class="view-day-header">

            <div class="view-day-number">

                DAY ${escapeHTML(
                    itinerary.day_number
                )}

            </div>


            <div class="view-day-info">

                <h2>
                    ${escapeHTML(
                        itinerary.title ||
                        `Day ${itinerary.day_number}`
                    )}
                </h2>

                <p>
                    ${formatPrettyDate(
                        itinerary.date
                    )}
                </p>

            </div>

        </div>


        <div
            class="view-activities-list"
        >

            <div class="activities-loading">

                Loading activities...

            </div>

        </div>

    `;


    return card;

}


// =========================
// LOAD ACTIVITIES
// =========================

async function loadActivities(
    itineraryId,
    card
) {

    const list =
        card.querySelector(
            ".view-activities-list"
        );


    try {

        const response =
            await apiRequest(
                `/itinerary-activities/itinerary/${itineraryId}`,
                {
                    method: "GET"
                }
            );


        const activities =
            response.data || [];


        if (
            activities.length === 0
        ) {

            list.innerHTML = `

                <div class="view-no-activities">

                    <span>
                        🗺️
                    </span>

                    <p>
                        No activities planned
                        for this day.
                    </p>

                </div>

            `;

            return;
        }


        list.innerHTML =
            activities
                .map(
                    activity =>
                        createActivityHTML(
                            activity
                        )
                )
                .join("");


    } catch (error) {

        list.innerHTML = `

            <div class="view-no-activities">

                <p>
                    Unable to load activities.
                </p>

            </div>

        `;

    }

}


// =========================
// ACTIVITY HTML
// =========================

function createActivityHTML(
    activity
) {

    const name =
        activity.custom_activity_name ||
        "Activity";


    const time =
        activity.start_time
            ? `${formatTime(
                activity.start_time
            )}${
                activity.end_time
                    ? ` - ${formatTime(
                        activity.end_time
                    )}`
                    : ""
            }`
            : "Flexible time";


    return `

        <article
            class="view-activity-item"
        >

            <div class="view-activity-time">

                ${escapeHTML(time)}

            </div>


            <div class="view-activity-icon">

                📍

            </div>


            <div class="view-activity-details">

                <h3>

                    ${escapeHTML(name)}

                </h3>


                ${
                    activity.location
                        ? `
                            <p>
                                📍
                                ${escapeHTML(
                                    activity.location
                                )}
                            </p>
                        `
                        : ""
                }


                ${
                    activity.description
                        ? `
                            <p>
                                ${escapeHTML(
                                    activity.description
                                )}
                            </p>
                        `
                        : ""
                }

            </div>


            <div class="view-activity-cost">

                ₹${Number(
                    activity.estimated_cost || 0
                ).toLocaleString(
                    "en-IN"
                )}

            </div>

        </article>

    `;

}


// =========================
// DATE FORMAT
// =========================

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


// =========================
// PRETTY DATE
// =========================

function formatPrettyDate(
    value
) {

    if (!value) {
        return "";
    }


    return new Date(
        value
    ).toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// =========================
// TIME FORMAT
// =========================

function formatTime(
    value
) {

    if (!value) {
        return "";
    }


    return new Date(
        `1970-01-01T${value}`
    ).toLocaleTimeString(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// =========================
// HTML SAFETY
// =========================

function escapeHTML(
    value
) {

    return String(value)
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


// =========================
// ERROR
// =========================

function showError(
    message
) {

    const loading =
        document.getElementById(
            "loading"
        );

    const errorState =
        document.getElementById(
            "errorState"
        );

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    loading.style.display =
        "none";


    errorMessage.textContent =
        message ||
        "Something went wrong.";


    errorState.style.display =
        "block";

}
