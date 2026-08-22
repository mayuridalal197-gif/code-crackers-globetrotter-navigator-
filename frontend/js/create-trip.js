// ==========================================
// GlobeTrotter - Create Trip JavaScript
// ==========================================


// ==========================================
// DOM Elements
// ==========================================

const tripForm =
    document.getElementById("tripForm");

const destinationInput =
    document.getElementById("destination");

const selectedDestination =
    document.getElementById("selectedDestination");

const startDate =
    document.getElementById("startDate");

const endDate =
    document.getElementById("endDate");

const startDateError =
    document.getElementById("startDateError");

const endDateError =
    document.getElementById("endDateError");

const successMessage =
    document.getElementById("successMessage");


// ==========================================
// Get Destination From URL
// ==========================================

const urlParams =
    new URLSearchParams(window.location.search);

const destinationFromURL =
    urlParams.get("destination");


if (destinationFromURL) {

    destinationInput.value =
        destinationFromURL;

    selectedDestination.textContent =
        destinationFromURL;

}


// ==========================================
// Set Minimum Date
// ==========================================

const today =
    new Date();

const todayString =
    today.toISOString().split("T")[0];


// Prevent past dates

startDate.min = todayString;

endDate.min = todayString;


// ==========================================
// Start Date Change
// ==========================================

startDate.addEventListener(
    "change",
    function () {

        startDateError.style.display =
            "none";


        if (!startDate.value) {
            return;
        }


        // End date cannot be before start date

        endDate.min =
            startDate.value;


        // If current end date is invalid

        if (
            endDate.value &&
            endDate.value < startDate.value
        ) {

            endDate.value = "";

            endDateError.style.display =
                "block";

        }

    }
);


// ==========================================
// End Date Change
// ==========================================

endDate.addEventListener(
    "change",
    function () {

        endDateError.style.display =
            "none";


        if (
            startDate.value &&
            endDate.value < startDate.value
        ) {

            endDateError.style.display =
                "block";

            endDate.value = "";

        }

    }
);


// ==========================================
// Form Submit
// ==========================================

tripForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Get values

        const tripName =
            document.getElementById(
                "tripName"
            ).value.trim();


        const destination =
            destinationInput.value.trim();


        const travellers =
            document.getElementById(
                "travellers"
            ).value;


        const budget =
            document.getElementById(
                "budget"
            ).value;


        const description =
            document.getElementById(
                "description"
            ).value.trim();


        // ==========================================
        // Validation
        // ==========================================

        let isValid = true;


        // Start date validation

        if (
            !startDate.value ||
            startDate.value < todayString
        ) {

            startDateError.style.display =
                "block";

            isValid = false;

        } else {

            startDateError.style.display =
                "none";

        }


        // End date validation

        if (
            !endDate.value ||
            endDate.value < startDate.value
        ) {

            endDateError.style.display =
                "block";

            isValid = false;

        } else {

            endDateError.style.display =
                "none";

        }


        if (!isValid) {

            return;

        }


        // ==========================================
        // Create Trip Object
        // ==========================================

        const newTrip = {

            id: Date.now(),

            name: tripName,

            destination: destination,

            startDate: startDate.value,

            endDate: endDate.value,

            travellers: Number(travellers),

            budget: budget,

            description: description,

            createdAt:
                new Date().toISOString()

        };


        // ==========================================
        // Get Existing Trips
        // ==========================================

        let savedTrips =
            JSON.parse(
                localStorage.getItem("globeTrotterTrips")
            ) || [];


        // Add new trip

        savedTrips.push(newTrip);


        // Save

        localStorage.setItem(
            "globeTrotterTrips",
            JSON.stringify(savedTrips)
        );


        // ==========================================
        // Success
        // ==========================================

        successMessage.style.display =
            "block";


        successMessage.scrollIntoView({
            behavior: "smooth"
        });


        // ==========================================
        // Redirect
        // ==========================================

        setTimeout(function () {

            window.location.href =
                "my-trips.html";

        }, 1200);

    }
);


// ==========================================
// Update Destination Preview
// ==========================================

destinationInput.addEventListener(
    "input",
    function () {

        if (destinationInput.value.trim() === "") {

            selectedDestination.textContent =
                "Not selected";

        } else {

            selectedDestination.textContent =
                destinationInput.value.trim();

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
        function () {

            navLinks.classList.toggle("show");

        }
    );

}
