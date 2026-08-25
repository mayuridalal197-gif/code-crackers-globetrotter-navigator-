// =========================================
// CALENDAR INITIALIZATION
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    const calendarGrid =
        document.getElementById("calendarGrid");

    const currentMonthElement =
        document.getElementById("currentMonth");

    const previousMonthButton =
        document.getElementById("previousMonth");

    const nextMonthButton =
        document.getElementById("nextMonth");

    const upcomingTrips =
        document.getElementById("upcomingTrips");


    let currentDate = new Date();

    let trips = [];


    // =========================================
    // INITIALIZE
    // =========================================

    initialize();


    async function initialize() {

        await loadTrips();

        renderCalendar();

        renderUpcomingTrips();

    }


    // =========================================
    // LOAD TRIPS
    // =========================================

    async function loadTrips() {

        try {

            const response =
                await apiRequest(
                    "/trips",
                    {
                        method: "GET"
                    }
                );


            // Handle different API response formats

            if (Array.isArray(response)) {

                trips = response;

            }

            else if (
                response &&
                Array.isArray(response.data)
            ) {

                trips = response.data;

            }

            else if (
                response &&
                response.data &&
                Array.isArray(response.data.trips)
            ) {

                trips = response.data.trips;

            }

            else if (
                response &&
                Array.isArray(response.trips)
            ) {

                trips = response.trips;

            }

            else {

                trips = [];

            }


            console.log(
                "Calendar trips:",
                trips
            );


        } catch (error) {

            console.error(
                "Unable to load calendar trips:",
                error
            );

            trips = [];

        }

    }


    // =========================================
    // RENDER CALENDAR
    // =========================================

    function renderCalendar() {

        const year =
            currentDate.getFullYear();

        const month =
            currentDate.getMonth();


        const monthName =
            currentDate.toLocaleString(
                "en-US",
                {
                    month: "long"
                }
            );


        currentMonthElement.textContent =
            `${monthName} ${year}`;


        calendarGrid.innerHTML = "";


        const firstDay =
            new Date(
                year,
                month,
                1
            ).getDay();


        const daysInMonth =
            new Date(
                year,
                month + 1,
                0
            ).getDate();


        // Empty cells before first day

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {

            const emptyDay =
                document.createElement(
                    "div"
                );

            emptyDay.className =
                "calendar-day empty";

            calendarGrid.appendChild(
                emptyDay
            );

        }


        // Create days

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {

            const dayElement =
                document.createElement(
                    "div"
                );


            dayElement.className =
                "calendar-day";


            // Day number

            const numberElement =
                document.createElement(
                    "div"
                );


            numberElement.className =
                "calendar-day-number";


            numberElement.textContent =
                day;


            dayElement.appendChild(
                numberElement
            );


            // =====================================
            // TODAY
            // =====================================

            const today =
                new Date();


            if (
                day === today.getDate() &&
                month === today.getMonth() &&
                year === today.getFullYear()
            ) {

                dayElement.classList.add(
                    "today"
                );

            }


            // =====================================
            // TRIPS ON THIS DATE
            // =====================================

            const dayTrips =
                getTripsForDate(
                    year,
                    month,
                    day
                );


            dayTrips.forEach(
                trip => {

                    const event =
                        document.createElement(
                            "a"
                        );


                    event.className =
                        "calendar-event";


                    // IMPORTANT:
                    // itinerary-view.js expects ?tripId=

                    event.href =
                        `itinerary-view.html?tripId=${trip.id}`;


                    event.textContent =
                        trip.title ||
                        trip.name ||
                        trip.destination ||
                        "Trip";


                    event.title =
                        event.textContent;


                    dayElement.appendChild(
                        event
                    );

                }
            );


            calendarGrid.appendChild(
                dayElement
            );

        }

    }


    // =========================================
    // FIND TRIPS FOR DATE
    // =========================================

    function getTripsForDate(
        year,
        month,
        day
    ) {

        return trips.filter(
            trip => {

                const startDate =
                    getTripStartDate(
                        trip
                    );


                if (!startDate) {

                    return false;

                }


                return (
                    startDate.getFullYear() === year &&
                    startDate.getMonth() === month &&
                    startDate.getDate() === day
                );

            }
        );

    }


    // =========================================
    // GET TRIP START DATE
    // =========================================

    function getTripStartDate(
        trip
    ) {

        const value =
            trip.start_date ||
            trip.startDate ||
            trip.from_date ||
            trip.date;


        if (!value) {

            return null;

        }


        const date =
            new Date(value);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {

            return null;

        }


        return date;

    }


    // =========================================
    // UPCOMING TRIPS
    // =========================================

    function renderUpcomingTrips() {

        upcomingTrips.innerHTML = "";


        if (
            !trips.length
        ) {

            upcomingTrips.innerHTML = `

                <div class="calendar-empty">

                    <h3>
                        No trips found
                    </h3>

                    <p>
                        Create a trip to see it
                        on your calendar.
                    </p>

                </div>

            `;

            return;

        }


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

                        const date =
                            getTripStartDate(
                                trip
                            );


                        return (
                            date &&
                            date >= today
                        );

                    }
                )
                .sort(
                    (a, b) => {

                        return (
                            getTripStartDate(a) -
                            getTripStartDate(b)
                        );

                    }
                );


        if (
            !upcoming.length
        ) {

            upcomingTrips.innerHTML = `

                <div class="calendar-empty">

                    <h3>
                        No upcoming trips
                    </h3>

                    <p>
                        Your upcoming journeys
                        will appear here.
                    </p>

                </div>

            `;

            return;

        }


        // =====================================
        // CREATE TRIP CARDS
        // =====================================

        upcoming.forEach(
            trip => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "upcoming-trip-card";


                const title =
                    trip.title ||
                    trip.name ||
                    "Untitled Trip";


                const destination =
                    trip.destination ||
                    trip.city ||
                    trip.to ||
                    "Destination";


                const startDate =
                    getTripStartDate(
                        trip
                    );


                const formattedDate =
                    startDate
                        ? startDate.toLocaleDateString(
                            "en-IN",
                            {
                                day: "numeric",
                                month: "short",
                                year: "numeric"
                            }
                        )
                        : "Date not available";


                card.innerHTML = `

                    <h3>
                        ${escapeHTML(
                            title
                        )}
                    </h3>


                    <p class="trip-destination">

                        📍
                        ${escapeHTML(
                            destination
                        )}

                    </p>


                    <p class="trip-date">

                        📅
                        ${formattedDate}

                    </p>


                    <a
                        href="itinerary-view.html?tripId=${trip.id}"
                        class="view-trip-button"
                    >
                        View Trip
                    </a>

                `;


                upcomingTrips.appendChild(
                    card
                );

            }
        );

    }


    // =========================================
    // PREVIOUS MONTH
    // =========================================

    previousMonthButton.addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() - 1
            );


            renderCalendar();

        }
    );


    // =========================================
    // NEXT MONTH
    // =========================================

    nextMonthButton.addEventListener(
        "click",
        () => {

            currentDate.setMonth(
                currentDate.getMonth() + 1
            );


            renderCalendar();

        }
    );


    // =========================================
    // HTML ESCAPE
    // =========================================

    function escapeHTML(
        value
    ) {

        return String(
            value || ""
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

});
