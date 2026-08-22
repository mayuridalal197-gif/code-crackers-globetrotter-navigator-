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
        year + "-" + month + "-" + day;


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

            // End date must be same or after start date

            endDate.min =
                startDate.value;


            // Clear invalid end date

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
       FORM DATE VALIDATION
       ===================================== */

    form.addEventListener(
        "submit",
        function (event) {

            const selectedStartDate =
                startDate.value;

            const selectedEndDate =
                endDate.value;


            /* START DATE REQUIRED */

            if (!selectedStartDate) {

                event.preventDefault();

                alert(
                    "Please select a start date!"
                );

                return;

            }


            /* END DATE REQUIRED */

            if (!selectedEndDate) {

                event.preventDefault();

                alert(
                    "Please select an end date!"
                );

                return;

            }


            /* PAST DATE CHECK */

            if (
                selectedStartDate < todayDate
            ) {

                event.preventDefault();

                alert(
                    "Start date cannot be in the past!"
                );

                return;

            }


            /* END DATE VALIDATION */

            if (
                selectedEndDate < selectedStartDate
            ) {

                event.preventDefault();

                alert(
                    "End date cannot be before Start date!"
                );

                return;

            }


        }
    );


});
