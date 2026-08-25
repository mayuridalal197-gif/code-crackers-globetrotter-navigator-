const params = new URLSearchParams(window.location.search);

const tripId =
    params.get("tripId");


let tripData = null;

let selectedDay = null;


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


    setupModal();

    await loadTrip();

}


// =========================
// LOAD TRIP
// =========================

async function loadTrip() {

    const loading =
        document.getElementById("loading");


    try {

        const response =
            await apiRequest(
                `/trips/${tripId}`,
                {
                    method: "GET"
                }
            );


        tripData =
            response.data;


        document.getElementById(
            "tripTitle"
        ).textContent =
            tripData.title;


        document.getElementById(
            "tripDestination"
        ).textContent =
            `📍 ${tripData.destination}`;


        document.getElementById(
            "viewTripButton"
        ).href =
            `itinerary-view.html?tripId=${tripId}`;


        await buildDays();


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
// BUILD DAYS
// =========================

async function buildDays() {

    const container =
        document.getElementById(
            "itineraryDays"
        );


    container.innerHTML = "";


    const start =
        new Date(
            tripData.start_date
        );

    const end =
        new Date(
            tripData.end_date
        );


    const totalDays =
        Math.floor(
            (
                end - start
            ) /
            (
                1000 *
                60 *
                60 *
                24
            )
        ) + 1;


    for (
        let day = 1;
        day <= totalDays;
        day++
    ) {

        const currentDate =
            new Date(start);

        currentDate.setDate(
            start.getDate() + day - 1
        );


        const date =
            formatDateForInput(
                currentDate
            );


        const itinerary =
            await getOrCreateItinerary(
                day,
                date
            );


        const card =
            createDayCard(
                itinerary,
                day,
                currentDate
            );


        container.appendChild(card);

        await loadActivities(
            itinerary.id,
            card
        );

    }

}


// =========================
// GET / CREATE ITINERARY
// =========================

async function getOrCreateItinerary(
    day,
    date
) {

    const response =
        await apiRequest(
            `/itineraries/trip/${tripId}`,
            {
                method: "GET"
            }
        );


    const existing =
        (response.data || [])
            .find(
                item =>
                    Number(
                        item.day_number
                    ) === day
            );


    if (existing) {
        return existing;
    }


    const created =
        await apiRequest(
            "/itineraries",
            {
                method: "POST",

                body: JSON.stringify({

                    trip_id: tripId,

                    day_number: day,

                    date: date,

                    title:
                        `Day ${day}`,

                    notes: ""

                })
            }
        );


    return created.data;

}


// =========================
// DAY CARD
// =========================

function createDayCard(
    itinerary,
    day,
    date
) {

    const card =
        document.createElement(
            "section"
        );


    card.className =
        "day-card";


    card.dataset.itineraryId =
        itinerary.id;


    card.innerHTML = `

        <div class="day-header">

            <div class="day-number">
                DAY ${day}
            </div>

            <div class="day-date">

                <strong>
                    ${formatPrettyDate(date)}
                </strong>

                <span>
                    ${tripData.destination}
                </span>

            </div>

        </div>


        <div class="activities-list">

            <div class="activities-loading">
                Loading activities...
            </div>

        </div>


        <button
            class="add-activity-btn"
            type="button"
        >
            + Add Activity
        </button>

    `;


    card
        .querySelector(
            ".add-activity-btn"
        )
        .addEventListener(
            "click",
            () => openActivityModal(
                itinerary
            )
        );


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
            ".activities-list"
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

                <div class="no-activities">

                    <span>
                        🗺️
                    </span>

                    <p>
                        No activities planned yet.
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


        list
            .querySelectorAll(
                ".delete-activity"
            )
            .forEach(
                button => {

                    button.addEventListener(
                        "click",
                        () =>
                            deleteActivity(
                                button.dataset.id,
                                itineraryId
                            )
                    );

                }
            );


    } catch (error) {

        list.innerHTML = `

            <div class="no-activities">

                Unable to load activities.

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
            )} - ${
                formatTime(
                    activity.end_time
                )
            }`
            : "Flexible time";


    return `

        <div class="activity-item">

            <div class="activity-time">

                ${time}

            </div>


            <div class="activity-icon">
                📍
            </div>


            <div class="activity-details">

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


            <div class="activity-cost">

                ₹${Number(
                    activity.estimated_cost || 0
                ).toLocaleString("en-IN")}

            </div>


            <button
                class="delete-activity"
                data-id="${activity.id}"
                title="Delete activity"
            >
                🗑️
            </button>

        </div>

    `;

}


// =========================
// MODAL
// =========================

function setupModal() {

    const modal =
        document.getElementById(
            "activityModal"
        );


    document
        .getElementById(
            "closeModal"
        )
        .addEventListener(
            "click",
            closeActivityModal
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                closeActivityModal();

            }

        }
    );


    document
        .getElementById(
            "activityForm"
        )
        .addEventListener(
            "submit",
            saveActivity
        );

}


// =========================
// OPEN MODAL
// =========================

function openActivityModal(
    itinerary
) {

    selectedDay =
        itinerary;


    document.getElementById(
        "selectedItineraryId"
    ).value =
        itinerary.id;


    document.getElementById(
        "modalDayTitle"
    ).textContent =
        `Add Activity — Day ${itinerary.day_number}`;


    document.getElementById(
        "activityForm"
    ).reset();


    document.getElementById(
        "selectedItineraryId"
    ).value =
        itinerary.id;


    document
        .getElementById(
            "activityModal"
        )
        .classList.add(
            "show"
        );

}


// =========================
// CLOSE MODAL
// =========================

function closeActivityModal() {

    document
        .getElementById(
            "activityModal"
        )
        .classList.remove(
            "show"
        );

}


// =========================
// SAVE ACTIVITY
// =========================

async function saveActivity(
    event
) {

    event.preventDefault();


    const button =
        event.target.querySelector(
            "button[type='submit']"
        );


    button.disabled = true;

    button.textContent =
        "Saving...";


    try {

        const itineraryId =
            document.getElementById(
                "selectedItineraryId"
            ).value;


        await apiRequest(
            "/itinerary-activities",
            {
                method: "POST",

                body: JSON.stringify({

                    itinerary_id:
                        itineraryId,

                    custom_activity_name:
                        document.getElementById(
                            "activityName"
                        ).value.trim(),

                    description:
                        document.getElementById(
                            "activityDescription"
                        ).value.trim(),

                    start_time:
                        document.getElementById(
                            "startTime"
                        ).value || null,

                    end_time:
                        document.getElementById(
                            "endTime"
                        ).value || null,

                    location:
                        document.getElementById(
                            "activityLocation"
                        ).value.trim(),

                    estimated_cost:
                        Number(
                            document.getElementById(
                                "activityCost"
                            ).value
                        ) || 0,

                    sort_order: 0

                })
            }
        );


        closeActivityModal();


        const card =
            document.querySelector(
                `[data-itinerary-id="${itineraryId}"]`
            );


        await loadActivities(
            itineraryId,
            card
        );


    } catch (error) {

        alert(
            error.message
        );

    } finally {

        button.disabled = false;

        button.textContent =
            "Add Activity";

    }

}


// =========================
// DELETE
// =========================

async function deleteActivity(
    id,
    itineraryId
) {

    const confirmed =
        confirm(
            "Delete this activity?"
        );


    if (!confirmed) {
        return;
    }


    try {

        await apiRequest(
            `/itinerary-activities/${id}`,
            {
                method: "DELETE"
            }
        );


        const card =
            document.querySelector(
                `[data-itinerary-id="${itineraryId}"]`
            );


        await loadActivities(
            itineraryId,
            card
        );


    } catch (error) {

        alert(
            error.message
        );

    }

}


// =========================
// HELPERS
// =========================

function formatDateForInput(
    date
) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatPrettyDate(
    date
) {

    return date.toLocaleDateString(
        "en-IN",
        {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


function formatDate(
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


function showError(
    message
) {

    document.getElementById(
        "loading"
    ).innerHTML = `

        <div class="trip-error">

            <h3>
                Unable to load itinerary
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

        </div>

    `;

}
