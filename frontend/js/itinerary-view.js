// ==========================================
// GlobeTrotter - Itinerary View JavaScript
// ==========================================


// Demo itinerary data
const itinerary = {
    tripName: "Goa Adventure",
    destination: "Goa, India",
    startDate: "25 August 2026",
    endDate: "28 August 2026",
    travelers: 2,

    days: [
        {
            day: 1,
            title: "Arrival",
            date: "25 August 2026",

            activities: [
                {
                    time: "09:00 AM",
                    icon: "✈️",
                    title: "Arrive at Goa Airport",
                    description:
                        "Arrive at Goa International Airport and collect your luggage.",
                    location: "Goa Airport"
                },

                {
                    time: "11:00 AM",
                    icon: "🏨",
                    title: "Hotel Check-in",
                    description:
                        "Check in to your hotel and take some time to relax.",
                    location: "North Goa"
                },

                {
                    time: "05:00 PM",
                    icon: "🏖️",
                    title: "Baga Beach",
                    description:
                        "Enjoy the beach, sunset and beautiful surroundings.",
                    location: "Baga Beach"
                }
            ]
        },

        {
            day: 2,
            title: "Explore Goa",
            date: "26 August 2026",

            activities: [
                {
                    time: "08:00 AM",
                    icon: "🍳",
                    title: "Breakfast",
                    description:
                        "Start the day with a delicious breakfast at the hotel.",
                    location: ""
                },

                {
                    time: "10:00 AM",
                    icon: "⛪",
                    title: "Basilica of Bom Jesus",
                    description:
                        "Visit the famous historical church and explore Old Goa.",
                    location: "Old Goa"
                },

                {
                    time: "04:00 PM",
                    icon: "🌅",
                    title: "Sunset Point",
                    description:
                        "Enjoy the beautiful sunset with your travel partner.",
                    location: ""
                }
            ]
        },

        {
            day: 3,
            title: "Adventure Day",
            date: "27 August 2026",

            activities: [
                {
                    time: "09:00 AM",
                    icon: "🚤",
                    title: "Water Sports",
                    description:
                        "Enjoy exciting water sports and adventure activities.",
                    location: "Calangute Beach"
                },

                {
                    time: "01:00 PM",
                    icon: "🍽️",
                    title: "Lunch",
                    description:
                        "Enjoy local Goan cuisine at a nearby restaurant.",
                    location: ""
                },

                {
                    time: "06:00 PM",
                    icon: "🌊",
                    title: "Beach Walk",
                    description:
                        "Relax and enjoy an evening beach walk.",
                    location: ""
                }
            ]
        },

        {
            day: 4,
            title: "Departure",
            date: "28 August 2026",

            activities: [
                {
                    time: "09:00 AM",
                    icon: "🏨",
                    title: "Hotel Check-out",
                    description:
                        "Check out from the hotel and prepare for departure.",
                    location: ""
                },

                {
                    time: "12:00 PM",
                    icon: "✈️",
                    title: "Return Journey",
                    description:
                        "Travel back to Goa Airport for your return flight.",
                    location: "Goa Airport"
                }
            ]
        }
    ]
};


// ==========================================
// Load itinerary when page opens
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadTripDetails();

    loadItinerary();

});


// ==========================================
// Load Trip Header
// ==========================================

function loadTripDetails() {

    const tripName =
        document.getElementById("tripName");

    const destination =
        document.getElementById("destination");

    const tripDates =
        document.getElementById("tripDates");

    const travelers =
        document.getElementById("travelers");


    if (tripName) {
        tripName.textContent = itinerary.tripName;
    }

    if (destination) {
        destination.textContent =
            "📍 " + itinerary.destination;
    }

    if (tripDates) {
        tripDates.textContent =
            "📅 " +
            itinerary.startDate +
            " - " +
            itinerary.endDate;
    }

    if (travelers) {
        travelers.textContent =
            "👥 " +
            itinerary.travelers +
            " Travelers";
    }
}


// ==========================================
// Load All Days
// ==========================================

function loadItinerary() {

    const container =
        document.getElementById("itineraryContainer");


    if (!container) {
        console.error(
            "itineraryContainer not found"
        );

        return;
    }


    container.innerHTML = "";


    itinerary.days.forEach(function (day) {

        const dayCard =
            createDayCard(day);

        container.appendChild(dayCard);

    });
}


// ==========================================
// Create Day Card
// ==========================================

function createDayCard(day) {

    const dayCard =
        document.createElement("section");

    dayCard.className = "day-card";


    dayCard.innerHTML = `

        <div class="day-title">

            <div class="day-number">
                ${day.day}
            </div>

            <div>
                <h2>
                    Day ${day.day} - ${day.title}
                </h2>

                <p>
                    ${day.date}
                </p>
            </div>

        </div>


        <div class="timeline">

            ${createActivities(day.activities)}

        </div>
    `;


    return dayCard;
}


// ==========================================
// Create Activities
// ==========================================

function createActivities(activities) {

    return activities.map(function (activity) {

        let locationHTML = "";


        if (activity.location) {

            locationHTML = `
                <span class="location">
                    📍 ${activity.location}
                </span>
            `;

        }


        return `

            <div class="activity">

                <div class="activity-time">
                    ${activity.time}
                </div>

                <h3>
                    ${activity.icon}
                    ${activity.title}
                </h3>

                <p>
                    ${activity.description}
                </p>

                ${locationHTML}

            </div>

        `;

    }).join("");

}


// ==========================================
// Edit Itinerary
// ==========================================

function editItinerary() {

    window.location.href =
        "itinerary-builder.html";

}


// ==========================================
// Go Back to My Trips
// ==========================================

function goToMyTrips() {

    window.location.href =
        "my-trips.html";

}
