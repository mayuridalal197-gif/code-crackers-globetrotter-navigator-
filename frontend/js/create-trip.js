/* =========================================
   GLOBETROTTER CREATE TRIP
   ========================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* ================= USER CHECK ================= */

    const user =
        JSON.parse(
            localStorage.getItem("globeTrotterLoggedIn")
        );


    if (!user) {

        window.location.href = "login.html";

        return;

    }


    /* ================= USER INFO ================= */

    const tripUserName =
        document.getElementById("tripUserName");

    const tripAvatar =
        document.getElementById("tripAvatar");


    if (tripUserName) {

        tripUserName.textContent = user.name;

    }


    if (tripAvatar) {

        tripAvatar.textContent =
            user.name.charAt(0).toUpperCase();

    }



    /* ================= MOBILE MENU ================= */

    const tripMenu =
        document.getElementById("tripMenu");

    const tripMobileNav =
        document.getElementById("tripMobileNav");


    if (tripMenu && tripMobileNav) {

        tripMenu.addEventListener(
            "click",
            function () {

                tripMobileNav.classList.toggle(
                    "active"
                );


                if (
                    tripMobileNav.classList.contains(
                        "active"
                    )
                ) {

                    tripMenu.textContent = "✕";

                } else {

                    tripMenu.textContent = "☰";

                }

            }
        );

    }



    /* ================= TRAVELERS ================= */

    const travelers =
        document.getElementById("travelers");

    const minusBtn =
        document.getElementById("minusBtn");

    const plusBtn =
        document.getElementById("plusBtn");


    if (minusBtn) {

        minusBtn.addEventListener(
            "click",
            function () {

                let value =
                    parseInt(travelers.value);

                if (value > 1) {

                    travelers.value = value - 1;

                }

            }
        );

    }


    if (plusBtn) {

        plusBtn.addEventListener(
            "click",
            function () {

                let value =
                    parseInt(travelers.value);

                if (value < 20) {

                    travelers.value = value + 1;

                }

            }
        );

    }



    /* ================= DATES ================= */

    const startDate =
        document.getElementById("startDate");

    const endDate =
        document.getElementById("endDate");


    /* Prevent selecting past dates */

    const today =
        new Date().toISOString().split("T")[0];


    if (startDate) {

        startDate.min = today;

    }


    if (endDate) {

        endDate.min = today;

    }


    /* Start date changes */

    if (startDate) {

        startDate.addEventListener(
            "change",
            function () {

                endDate.min = startDate.value;

                if (
                    endDate.value &&
                    endDate.value < startDate.value
                ) {

                    endDate.value = "";

                }

            }
        );

    }



    /* ================= DESCRIPTION COUNTER ================= */

    const description =
        document.getElementById("description");

    const characterCount =
        document.getElementById("characterCount");


    if (description && characterCount) {

        description.addEventListener(
            "input",
            function () {

                characterCount.textContent =
                    description.value.length;

            }
        );

    }



    /* ================= FORM ================= */

    const form =
        document.getElementById("createTripForm");


    const errorMessage =
        document.getElementById("errorMessage");


    const successMessage =
        document.getElementById("successMessage");


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* Hide previous messages */

            errorMessage.classList.remove("show");

            successMessage.classList.remove("show");


            /* ================= VALUES ================= */

            const tripName =
                document.getElementById("tripName").value.trim();

            const destination =
                document.getElementById("destination").value.trim();

            const travelStyle =
                document.getElementById("travelStyle").value;

            const travelersValue =
                parseInt(
                    document.getElementById("travelers").value
                );

            const startDateValue =
                startDate.value;

            const endDateValue =
                endDate.value;

            const currency =
                document.getElementById("currency").value;

            const budget =
                document.getElementById("budget").value;

            const descriptionValue =
                description.value.trim();



            /* ================= VALIDATION ================= */

            if (!tripName) {

                showError(
                    "Please enter a trip name."
                );

                return;

            }


            if (!destination) {

                showError(
                    "Please enter your destination."
                );

                return;

            }


            if (!startDateValue) {

                showError(
                    "Please select a start date."
                );

                return;

            }


            if (!endDateValue) {

                showError(
                    "Please select an end date."
                );

                return;

            }


            if (
                new Date(endDateValue) <
                new Date(startDateValue)
            ) {

                showError(
                    "End date cannot be before start date."
                );

                return;

            }


            if (
                !travelersValue ||
                travelersValue < 1
            ) {

                showError(
                    "Number of travelers must be at least 1."
                );

                return;

            }



            /* ================= CREATE TRIP OBJECT ================= */

            const newTrip = {

                id:
                    Date.now(),

                userId:
                    user.email || user.name,

                tripName:
                    tripName,

                destination:
                    destination,

                travelStyle:
                    travelStyle,

                startDate:
                    startDateValue,

                endDate:
                    endDateValue,

                travelers:
                    travelersValue,

                currency:
                    currency,

                budget:
                    budget || 0,

                description:
                    descriptionValue,

                status:
                    "Upcoming",

                createdAt:
                    new Date().toISOString()

            };



            /* ================= GET EXISTING TRIPS ================= */

            let trips =
                JSON.parse(
                    localStorage.getItem("globeTrotterTrips")
                ) || [];


            /* Add new trip */

            trips.push(newTrip);


            /* Save */

            localStorage.setItem(
                "globeTrotterTrips",
                JSON.stringify(trips)
            );



            /* ================= SUCCESS ================= */

            successMessage.textContent =
                "Trip created successfully! Redirecting...";

            successMessage.classList.add("show");


            /* Redirect */

            setTimeout(
                function () {

                    window.location.href =
                        "my-trips.html";

                },
                1200
            );

        }
    );



    /* ================= ERROR FUNCTION ================= */

    function showError(message) {

        errorMessage.textContent =
            message;

        errorMessage.classList.add("show");

        errorMessage.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }

});
