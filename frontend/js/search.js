// ==========================================
// GlobeTrotter - Search JavaScript
// ==========================================


// ==========================================
// Destination Data
// ==========================================

const destinations = [

    {
        id: 1,
        name: "Goa",
        location: "India",
        category: "beach",
        budget: "low",
        price: "₹15,000",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80",
        description: "Beautiful beaches, sunsets, nightlife and relaxing coastal experiences."
    },

    {
        id: 2,
        name: "Manali",
        location: "Himachal Pradesh, India",
        category: "mountain",
        budget: "medium",
        price: "₹20,000",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80",
        description: "Snow-covered mountains, valleys, adventure activities and scenic views."
    },

    {
        id: 3,
        name: "Dubai",
        location: "UAE",
        category: "city",
        budget: "high",
        price: "₹60,000",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80",
        description: "Modern architecture, luxury shopping, desert adventures and city experiences."
    },

    {
        id: 4,
        name: "Rishikesh",
        location: "Uttarakhand, India",
        category: "adventure",
        budget: "low",
        price: "₹12,000",
        image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
        description: "River rafting, trekking, camping and exciting outdoor adventures."
    },

    {
        id: 5,
        name: "Paris",
        location: "France",
        category: "city",
        budget: "high",
        price: "₹90,000",
        image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80",
        description: "Explore iconic landmarks, museums, cafes and romantic streets."
    },

    {
        id: 6,
        name: "Ladakh",
        location: "India",
        category: "mountain",
        budget: "medium",
        price: "₹25,000",
        image: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80",
        description: "High-altitude landscapes, monasteries, mountain passes and road trips."
    }

];


// ==========================================
// DOM Elements
// ==========================================

const searchInput =
    document.getElementById("searchInput");

const categoryFilter =
    document.getElementById("categoryFilter");

const budgetFilter =
    document.getElementById("budgetFilter");

const searchBtn =
    document.getElementById("searchBtn");

const resultsGrid =
    document.getElementById("resultsGrid");

const resultCount =
    document.getElementById("resultCount");


// ==========================================
// Display Destinations
// ==========================================

function displayDestinations(list) {

    resultsGrid.innerHTML = "";

    resultCount.textContent =
        `${list.length} destination${list.length !== 1 ? "s" : ""}`;


    // No results

    if (list.length === 0) {

        resultsGrid.innerHTML = `

            <div class="no-results">

                <h2>
                    😕 No destinations found
                </h2>

                <p>
                    Try another destination or change your filters.
                </p>

            </div>

        `;

        return;
    }


    // Create cards

    list.forEach(destination => {

        const card =
            document.createElement("article");

        card.className =
            "destination-card";


        card.innerHTML = `

            <img
                src="${destination.image}"
                alt="${destination.name}"
                class="destination-image"
            >


            <div class="destination-content">

                <h3>
                    ${destination.name}
                </h3>


                <div class="destination-location">
                    📍 ${destination.location}
                </div>


                <p class="destination-description">
                    ${destination.description}
                </p>


                <div class="destination-bottom">

                    <span class="budget">
                        ${destination.price}
                    </span>


                    <a
                        href="create-trip.html?destination=${encodeURIComponent(destination.name)}"
                        class="view-btn"
                    >
                        Plan Trip
                    </a>

                </div>

            </div>

        `;


        resultsGrid.appendChild(card);

    });

}


// ==========================================
// Search Function
// ==========================================

function performSearch() {

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    const category =
        categoryFilter.value;


    const budget =
        budgetFilter.value;


    const filtered =
        destinations.filter(destination => {

            const matchesSearch =
                destination.name
                    .toLowerCase()
                    .includes(searchValue)
                ||
                destination.location
                    .toLowerCase()
                    .includes(searchValue);


            const matchesCategory =
                category === "all"
                ||
                destination.category === category;


            const matchesBudget =
                budget === "all"
                ||
                destination.budget === budget;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesBudget
            );

        });


    displayDestinations(filtered);

}


// ==========================================
// Search Button
// ==========================================

searchBtn.addEventListener(
    "click",
    performSearch
);


// ==========================================
// Search While Typing
// ==========================================

searchInput.addEventListener(
    "input",
    performSearch
);


// ==========================================
// Filter Changes
// ==========================================

categoryFilter.addEventListener(
    "change",
    performSearch
);


budgetFilter.addEventListener(
    "change",
    performSearch
);


// ==========================================
// Enter Key
// ==========================================

searchInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            performSearch();

        }

    }
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
        function() {

            navLinks.classList.toggle("show");

        }
    );

}


// ==========================================
// Initial Load
// ==========================================

displayDestinations(destinations);
