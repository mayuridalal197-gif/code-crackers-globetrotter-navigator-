document.addEventListener("DOMContentLoaded", () => {

    const token = getToken();

    if (!token) {
        window.location.href = "login.html";
        return;
    }


    const form =
        document.getElementById("createTripForm");

    const tripName =
        document.getElementById("tripName");

    const destination =
        document.getElementById("destination");

    const startDate =
        document.getElementById("startDate");

    const endDate =
        document.getElementById("endDate");

    const travelers =
        document.getElementById("travelers");

    const budget =
        document.getElementById("budget");

    const currency =
        document.getElementById("currency");

    const description =
        document.getElementById("description");

    const button =
        document.getElementById("createTripButton");

    const message =
        document.getElementById("tripMessage");

        // =========================
        // DATE RESTRICTION
        // =========================

        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        // Start date: today se pehle allowed nahi
        startDate.min = todayString;

        // End date bhi today se pehle allowed nahi
        endDate.min = todayString;

        startDate.addEventListener("change", () => {

            // End date start date se pehle nahi ho sakti
            endDate.min = startDate.value || todayString;

            if (
                endDate.value &&
                endDate.value < endDate.min
            ) {
                endDate.value = "";
            }

            updatePreview();
            });

    // =========================
    // PREVIEW
    // =========================

    function updatePreview() {

        document.getElementById(
            "previewName"
        ).textContent =
            tripName.value.trim() ||
            "Your Trip";


        document.getElementById(
            "previewDestination"
        ).textContent =
            destination.value.trim() ||
            "Destination";


        if (startDate.value && endDate.value) {

            const start =
                new Date(startDate.value)
                    .toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    );

            const end =
                new Date(endDate.value)
                    .toLocaleDateString(
                        "en-IN",
                        {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                        }
                    );

            document.getElementById(
                "previewDates"
            ).textContent =
                `${start} - ${end}`;

        } else {

            document.getElementById(
                "previewDates"
            ).textContent =
                "Select dates";
        }


        const travelerCount =
            Number(travelers.value) || 1;

        document.getElementById(
            "previewTravelers"
        ).textContent =
            travelerCount === 1
                ? "1 traveler"
                : `${travelerCount} travelers`;


        const budgetValue =
            Number(budget.value) || 0;

        document.getElementById(
            "previewBudget"
        ).textContent =
            `${currency.value} ${budgetValue.toLocaleString("en-IN")}`;
    }


    [
        tripName,
        destination,
        startDate,
        endDate,
        travelers,
        budget,
        currency
    ].forEach(element => {

        element.addEventListener(
            "input",
            updatePreview
        );

        element.addEventListener(
            "change",
            updatePreview
        );

    });


    updatePreview();


    // =========================
    // DATE VALIDATION
    // =========================

    startDate.addEventListener(
        "change",
        () => {

            endDate.min =
                startDate.value;

            if (
                endDate.value &&
                endDate.value < startDate.value
            ) {
                endDate.value = "";
            }

            updatePreview();
        }
    );


    // =========================
    // CREATE TRIP
    // =========================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            if (
                startDate.value &&
                endDate.value &&
                endDate.value < startDate.value
            ) {

                message.innerHTML = `
                    <div class="message error">
                        End date cannot be before start date.
                    </div>
                `;

                return;
            }


            const tripData = {

                title:
                    tripName.value.trim(),

                description:
                    description.value.trim(),

                destination:
                    destination.value.trim(),

                start_date:
                    startDate.value,

                end_date:
                    endDate.value,

                travelers:
                    Number(travelers.value),

                budget:
                    Number(budget.value) || 0
            };


            button.disabled = true;

            button.textContent =
                "Creating Trip...";

            message.innerHTML = "";


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


                message.innerHTML = `
                    <div class="message success">
                        Trip created successfully! 🎉
                    </div>
                `;


                setTimeout(() => {

                    window.location.href =
                        "my-trips.html";

                }, 1000);


            } catch (error) {

                message.innerHTML = `
                    <div class="message error">
                        ${error.message}
                    </div>
                `;

                button.disabled = false;

                button.textContent =
                    "Create Trip →";
            }

        }
    );


    // =========================
    // LOGOUT
    // =========================

    document
        .getElementById("logoutButton")
        .addEventListener(
            "click",
            () => {

                removeToken();

                localStorage.removeItem(
                    "globetrotter_user"
                );

                window.location.href =
                    "index.html";
            }
        );

});
