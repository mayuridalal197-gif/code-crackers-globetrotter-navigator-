document.addEventListener(
    "DOMContentLoaded",
    loadTrips
);


async function loadTrips() {

    const loading =
        document.getElementById("loading");

    const emptyState =
        document.getElementById("emptyState");

    const tripsGrid =
        document.getElementById("tripsGrid");


    try {

        const response =
            await apiRequest(
                "/trips",
                {
                    method: "GET"
                }
            );


        const trips =
            response.data || [];


        loading.style.display = "none";


        if (trips.length === 0) {

            emptyState.style.display =
                "block";

            return;
        }


        tripsGrid.innerHTML =
            trips
                .map(
                    trip =>
                        createTripCard(trip)
                )
                .join("");


    } catch (error) {

        loading.innerHTML = `
            <div class="trip-error">
                <h3>Unable to load trips</h3>
                <p>${error.message}</p>
            </div>
        `;

    }

}


// =========================
// TRIP CARD
// =========================

function createTripCard(trip) {

    const startDate =
        formatDate(trip.start_date);

    const endDate =
        formatDate(trip.end_date);


    const status =
        trip.status || "planning";


    return `

        <article class="trip-card">

            <div class="trip-card-image">

                <img
                    src="${getDestinationImage(
                        trip.destination
                    )}"
                    alt="${trip.destination}"
                >

                <span class="trip-status">
                    ${status}
                </span>

            </div>


            <div class="trip-card-content">

                <h2>
                    ${escapeHTML(trip.title)}
                </h2>


                <p class="trip-destination">
                    📍 ${escapeHTML(
                        trip.destination
                    )}
                </p>


                <div class="trip-info">

                    <div>
                        <span>DATES</span>
                        <strong>
                            ${startDate} -
                            ${endDate}
                        </strong>
                    </div>


                    <div>
                        <span>TRAVELERS</span>
                        <strong>
                            👥 ${trip.travelers}
                        </strong>
                    </div>


                    <div>
                        <span>BUDGET</span>
                        <strong>
                            ₹${Number(
                                trip.budget || 0
                            ).toLocaleString("en-IN")}
                        </strong>
                    </div>

                </div>


                <div class="trip-card-actions">

                    <a
                        href="itinerary-builder.html?tripId=${trip.id}"
                        class="primary-trip-btn"
                    >
                        Build Itinerary
                    </a>


                    <a
                        href="itinerary-view.html?tripId=${trip.id}"
                        class="secondary-trip-btn"
                    >
                        View Trip
                    </a>

                </div>

            </div>

        </article>

    `;
}


// =========================
// DATE FORMAT
// =========================

function formatDate(date) {

    if (!date) return "-";


    return new Date(date)
        .toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

}


// =========================
// DESTINATION IMAGE
// =========================

function getDestinationImage(
    destination
) {

    const destinationName =
        encodeURIComponent(
            destination || "travel"
        );


    return `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80`;
}


// =========================
// HTML SAFETY
// =========================

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
