/* =========================================
   GLOBETROTTER CREATE TRIP
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================
       GET ELEMENTS
       ===================================== */

    const form =
        document.getElementById("createTripForm");

    const startDate =
        document.getElementById("startDate");

    const endDate =
        document.getElementById("endDate");

    const decreaseTravelers =
        document.getElementById("decreaseTravelers");

    const increaseTravelers =
        document.getElementById("increaseTravelers");

    const travelers =
        document.getElementById("travelers");

    const description =
        document.getElementById("description");

    const characterCount =
        document.getElementById("characterCount");

    const errorMessage =
        document.getElementById("errorMessage");

    const successMessage =
        document.getElementById("successMessage");


    /* =====================================
       TODAY DATE
       ===================================== */

    const today = new Date();

    const year =
        today.getFullYear();

    const month =
        String(today.getMonth() + 1)
            .padStart(2, "0");

    const day =
        String(today.getDate())
            .padStart(2, "0");

    const todayDate =
        `${year}-${month}-${day}`;


    /* =====================================
       DISABLE PAST DATES
       ===================================== */

    if (startDate) {
        startDate.min = todayDate;
    }

    if (endDate) {
        endDate.min = todayDate;
    }


    /* =====================================
       START DATE CHANGE
       ===================================== */

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


    /* =====================================
       PLUS BUTTON
       ===================================== */

    increaseTravelers.addEventListener(
        "click",
        function () {

            let currentValue =
                Number(travelers.value);

            travelers.value =
                currentValue + 1;

        }
    );


    /* =====================================
       MINUS BUTTON
       ===================================== */

    decreaseTravelers.addEventListener(
        "click",
        function () {

            let currentValue =
                Number(travelers.value);

            if (currentValue > 1) {
                travelers.value =
                    currentValue - 1;
            }

        }
    );


    /* =====================================
       CHARACTER COUNT
       ===================================== */

    if (description && characterCount) {

        description.addEventListener(
            "input",
            function () {

                characterCount.textContent =
                    description.value.length;

            }
        );

    }


    /* =====================================
       FORM SUBMIT
       ===================================== */

    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            /* =================================
               CLEAR PREVIOUS MESSAGES
               ================================= */

            errorMessage.textContent = "";
            successMessage.textContent = "";

            errorMessage.style.display = "none";
            successMessage.style.display = "none";


            /* =================================
               GET FORM VALUES
               ================================= */

            const tripName =
                document.getElementById("tripName")
                    .value.trim();

            const destination =
                document.getElementById("destination")
                    .value.trim();

            const start =
                startDate.value;

            const end =
                endDate.value;

            const tripDescription =
                description.value.trim();


            /* =================================
               BASIC VALIDATION
               ================================= */

            if (!tripName) {

                showError(
                    "Please enter a trip name."
                );

                return;

            }


            if (!destination) {

                showError(
                    "Please enter a destination."
                );

                return;

            }


            if (!start) {

                showError(
                    "Please select a start date."
                );

                return;

            }


            if (!end) {

                showError(
                    "Please select an end date."
                );

                return;

            }


            if (start < todayDate) {

                showError(
                    "Start date cannot be in the past."
                );

                return;

            }


            if (end < start) {

                showError(
                    "End date cannot be before start date."
                );

                return;

            }


            /* =================================
               REQUEST DATA
               ================================= */

            const tripData = {

                /*
                    Backend expects "title",
                    while frontend uses "tripName".
                */

                title: tripName,

                destination: destination,

                startDate: start,

                endDate: end,

                description:
                    tripDescription || null

            };


            /* =================================
               DISABLE BUTTON
               ================================= */

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );

            const originalButtonText =
                submitButton.textContent;

            submitButton.disabled = true;

            submitButton.textContent =
                "Creating Trip...";


            /* =================================
               API REQUEST
               ================================= */

            try {

                const response =
                    await apiRequest(
                        "/trips",
                        {
                            method: "POST",

                            body:
                                JSON.stringify(
                                    tripData
                                )
                        }
                    );


                /* =============================
                   SUCCESS
                   ============================= */

                if (response.success) {

                    showSuccess(
                        "Trip created successfully! Redirecting..."
                    );


                    /*
                        Redirect to My Trips
                        after successful creation.
                    */

                    setTimeout(
                        function () {

                            window.location.href =
                                "my-trips.html";

                        },
                        1000
                    );

                }

                else {

                    showError(
                        response.message ||
                        "Unable to create trip."
                    );

                }


            } catch (error) {

                console.error(
                    "Create trip error:",
                    error
                );


                showError(
                    error.message ||
                    "Unable to create trip. Please try again."
                );

            }


            /* =================================
               ENABLE BUTTON
               ================================= */

            submitButton.disabled = false;

            submitButton.textContent =
                originalButtonText;

        }
    );


    /* =====================================
       SHOW ERROR
       ===================================== */

    function showError(message) {

        errorMessage.textContent =
            message;

        errorMessage.style.display =
            "block";

    }


    /* =====================================
       SHOW SUCCESS
       ===================================== */

    function showSuccess(message) {

        successMessage.textContent =
            message;

        successMessage.style.display =
            "block";

    }

});
