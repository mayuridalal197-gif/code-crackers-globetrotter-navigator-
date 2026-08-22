// ==========================================
// GlobeTrotter - Calendar JavaScript
// ==========================================

// Current calendar date
let currentDate = new Date();


// ==========================================
// Sample Trips
// ==========================================

const trips = [
    {
        id: 1,
        title: "Goa Trip",
        startDate: "2026-09-05",
        endDate: "2026-09-08",
        location: "Goa, India",
        description: "Beach vacation and sightseeing."
    },

    {
        id: 2,
        title: "Manali Adventure",
        startDate: "2026-10-12",
        endDate: "2026-10-17",
        location: "Manali, Himachal Pradesh",
        description: "Mountain adventure and nature exploration."
    },

    {
        id: 3,
        title: "Dubai Trip",
        startDate: "2026-11-20",
        endDate: "2026-11-25",
        location: "Dubai, UAE",
        description: "City tour, shopping and sightseeing."
    }
];


// ==========================================
// DOM Elements
// ==========================================

const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");

const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");
const todayBtn = document.getElementById("todayBtn");

const tripDetails = document.getElementById("tripDetails");


// ==========================================
// Render Calendar
// ==========================================

function renderCalendar() {

    calendarDays.innerHTML = "";

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of current month
    const firstDay = new Date(year, month, 1);

    // Last day of current month
    const lastDay = new Date(year, month + 1, 0);

    // Days from previous month
    const previousLastDay = new Date(year, month, 0);

    const firstDayIndex = firstDay.getDay();

    const lastDate = lastDay.getDate();

    const previousLastDate = previousLastDay.getDate();


    // ==========================================
    // Month Heading
    // ==========================================

    const monthName = currentDate.toLocaleString("default", {
        month: "long"
    });

    monthYear.textContent = `${monthName} ${year}`;


    // ==========================================
    // Previous Month Dates
    // ==========================================

    for (let i = firstDayIndex - 1; i >= 0; i--) {

        const dayNumber = previousLastDate - i;

        const date = new Date(year, month - 1, dayNumber);

        createDayElement(
            date,
            dayNumber,
            true
        );
    }


    // ==========================================
    // Current Month Dates
    // ==========================================

    for (let day = 1; day <= lastDate; day++) {

        const date = new Date(year, month, day);

        createDayElement(
            date,
            day,
            false
        );
    }


    // ==========================================
    // Next Month Dates
    // ==========================================

    const totalCells = calendarDays.children.length;

    const remainingCells = 42 - totalCells;

    for (let day = 1; day <= remainingCells; day++) {

        const date = new Date(year, month + 1, day);

        createDayElement(
            date,
            day,
            true
        );
    }
}


// ==========================================
// Create Calendar Day
// ==========================================

function createDayElement(date, dayNumber, otherMonth) {

    const dayElement = document.createElement("div");

    dayElement.classList.add("day");

    if (otherMonth) {
        dayElement.classList.add("other-month");
    }


    // ==========================================
    // Date String
    // ==========================================

    const dateString = formatDate(date);


    // ==========================================
    // Today
    // ==========================================

    const today = new Date();

    if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    ) {

        dayElement.classList.add("today");
    }


    // ==========================================
    // Selected Date
    // ==========================================

    const dayNumberElement = document.createElement("span");

    dayNumberElement.classList.add("day-number");

    dayNumberElement.textContent = dayNumber;

    dayElement.appendChild(dayNumberElement);


    // ==========================================
    // Find Trip
    // ==========================================

    const trip = getTripForDate(dateString);


    if (trip) {

        const eventElement = document.createElement("div");

        eventElement.classList.add("trip-event");

        eventElement.textContent = trip.title;

        dayElement.appendChild(eventElement);
    }


    // ==========================================
    // Click Event
    // ==========================================

    dayElement.addEventListener("click", function () {

        document.querySelectorAll(".day").forEach(day => {
            day.classList.remove("selected-day");
        });

        dayElement.classList.add("selected-day");

        showTripDetails(dateString);
    });


    calendarDays.appendChild(dayElement);
}


// ==========================================
// Format Date
// ==========================================

function formatDate(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


// ==========================================
// Find Trip For Date
// ==========================================

function getTripForDate(dateString) {

    return trips.find(trip => {

        return (
            dateString >= trip.startDate &&
            dateString <= trip.endDate
        );

    });
}


// ==========================================
// Show Trip Details
// ==========================================

function showTripDetails(dateString) {

    const trip = getTripForDate(dateString);


    if (!trip) {

        const formattedDate = new Date(
            dateString + "T00:00:00"
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        tripDetails.innerHTML = `
            <h2>📅 ${formattedDate}</h2>

            <p class="no-trip">
                No trip is scheduled for this date.
            </p>
        `;

        return;
    }


    // ==========================================
    // Trip Found
    // ==========================================

    const start = new Date(
        trip.startDate + "T00:00:00"
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    const end = new Date(
        trip.endDate + "T00:00:00"
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });


    tripDetails.innerHTML = `

        <h2>✈️ ${trip.title}</h2>

        <p>
            <strong>📍 Location:</strong>
            ${trip.location}
        </p>

        <p>
            <strong>📅 Dates:</strong>
            ${start} - ${end}
        </p>

        <p>
            <strong>📝 Description:</strong>
            ${trip.description}
        </p>

        <button
            onclick="viewTrip(${trip.id})"
            class="primary-btn"
        >
            View Itinerary
        </button>

    `;
}


// ==========================================
// View Trip
// ==========================================

function viewTrip(tripId) {

    // Later this can open the actual itinerary
    window.location.href =
        `itinerary-view.html?tripId=${tripId}`;
}


// ==========================================
// Previous Month
// ==========================================

prevMonth.addEventListener("click", function () {

    currentDate.setMonth(
        currentDate.getMonth() - 1
    );

    renderCalendar();
});


// ==========================================
// Next Month
// ==========================================

nextMonth.addEventListener("click", function () {

    currentDate.setMonth(
        currentDate.getMonth() + 1
    );

    renderCalendar();
});


// ==========================================
// Today Button
// ==========================================

todayBtn.addEventListener("click", function () {

    currentDate = new Date();

    renderCalendar();

});


// ==========================================
// Mobile Menu
// ==========================================

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("show");

    });

}


// ==========================================
// Initial Calendar Load
// ==========================================

renderCalendar();
