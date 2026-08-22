const tripsGrid =
    document.getElementById("tripsGrid");

const tripSearch =
    document.getElementById("tripSearch");

const tripFilter =
    document.getElementById("tripFilter");

const tripCount =
    document.getElementById("tripCount");


// ==========================================
// Get Saved Trips
// ==========================================

function getTrips() {

    return JSON.parse(
        localStorage.getItem("globeTrotterTrips")
    ) || [];

}


// ==========================================
// Format Date
// ==========================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    return new Date(
        dateString + "T00:00:00"
    ).toLocaleDateString("en-IN", {

        day: "numeric",
        month: "short",
        year: "numeric"

    });

}


// ==========================================
// Get Trip Icon
// ==========================================

function getTripIcon(destination) {

    const place =
        destination.toLowerCase();

    if (
        place.includes("goa") ||
        place.includes("beach")
    ) {
        return "🏖️";
    }

    if (
        place.includes("manali") ||
        place.includes("ladakh") ||
        place.includes("mountain")
    ) {
        return "🏔️";
    }

    if (
        place.includes("dubai") ||
        place.includes("paris") ||
        place.includes("city")
    ) {
        return "🌆";
    }

    return "✈️";

}


// ==========================================
// Display Trips
// ==========================================

function displayTrips() {

    const trips =
        getTrips();

    const searchValue =
        tripSearch.value
            .trim()
            .toLowerCase();

    const filterValue =
        tripFilter.value;

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    const filteredTrips =
        trips.filter(trip => {

            // Search

            const matchesSearch =
                trip.name
                    .toLowerCase()
                    .includes(searchValue)
                ||
                trip.destination
                    .toLowerCase()
                    .includes(searchValue);


            if (!matchesSearch) {
                return false;
            }


            // Filter

            if (filterValue === "upcoming") {

                return new Date(
                    trip.endDate + "T00:00:00"
                ) >= today;

            }


            if (filterValue === "past") {

                return new Date(
                    trip.endDate + "T00:00:00"
                ) < today;

            }


            return true;

        });


    tripCount.textContent =
        `${filteredTrips.length} trip${filteredTrips.length !== 1 ? "s" : ""}`;


    tripsGrid.innerHTML = "";


    // ==========================================
    // Empty State
    // ==========================================

    if (filteredTrips.length === 0) {

        tripsGrid.innerHTML = `

            <div class="empty-state">

                <div class="empty-state-icon">
                    🧳
                </div>

                <h2>
                    No trips found
                </h2>

                <p>
                    Start planning your next adventure!
                </p>

                <a
                    href="create-trip.html"
                    class="empty-create-btn"
                >
                    + Create Your First Trip
                </a>

            </div>

        `;

        return;
    }


    // ==========================================
    // Create Trip Cards
    // ==========================================

    filteredTrips.forEach(trip => {

        const card =
            document.createElement("article");

        card.className =
            "trip-card";


        const icon =
            getTripIcon(trip.destination);


        card.innerHTML = `

            <div class="trip-cover">
                ${icon}
            </div>


            <div class="trip-content">

                <h2>
                    ${trip.name}
                </h2>


                <div class="trip-location">
                    📍 ${trip.destination}
                </div>


                <div class="trip-info">

                    <div>
                        📅
                        ${formatDate(trip.startDate)}
                        -
                        ${formatDate(trip.endDate)}
                    </div>

                    <div>
                        👥
                        ${trip.travellers}
                        traveller${trip.travellers > 1 ? "s" : ""}
                    </div>

                    <div>
                        💰
                        ${trip.budget}
                        budget
                    </div>

                </div>


                <div class="trip-actions">

                    <button
                        class="view-btn"
                        onclick="viewTrip(${trip.id})"
                    >
                        View Trip
                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTrip(${trip.id})"
                    >
                        🗑️
                    </button>

                </div>

            </div>

        `;


        tripsGrid.appendChild(card);

    });

}


// ==========================================
// View Trip
// ==========================================

function viewTrip(tripId) {

    window.location.href =
        `itinerary-view.html?tripId=${tripId}`;

}


// ==========================================
// Delete Trip
// ==========================================

function deleteTrip(tripId) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this trip?"
        );


    if (!confirmDelete) {
        return;
    }


    let trips =
        getTrips();


    trips =
        trips.filter(
            trip => trip.id !== tripId
        );


    localStorage.setItem(
        "globeTrotterTrips",
        JSON.stringify(trips)
    );


    displayTrips();


    alert(
        "Trip deleted successfully."
    );

}


// ==========================================
// Search
// ==========================================

tripSearch.addEventListener(
    "input",
    displayTrips
);


// ==========================================
// Filter
// ==========================================

tripFilter.addEventListener(
    "change",
    displayTrips
);


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

displayTrips();
