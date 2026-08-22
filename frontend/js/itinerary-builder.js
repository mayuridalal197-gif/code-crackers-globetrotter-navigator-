/* =========================================
   GLOBETROTTER ITINERARY BUILDER
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =====================================
       GET HTML ELEMENTS
       ===================================== */

    const activityForm =
        document.getElementById("activityForm");

    const activityDay =
        document.getElementById("activityDay");

    const activityTime =
        document.getElementById("activityTime");

    const activityName =
        document.getElementById("activityName");

    const activityLocation =
        document.getElementById("activityLocation");

    const saveItineraryBtn =
        document.getElementById("saveItineraryBtn");

    const description =
        document.getElementById("description");

    const characterCount =
        document.getElementById("characterCount");

    const tripMenu =
        document.getElementById("tripMenu");

    const tripMobileNav =
        document.getElementById("tripMobileNav");


    /* =====================================
       MOBILE MENU
       ===================================== */

    if (tripMenu && tripMobileNav) {

        tripMenu.addEventListener(
            "click",
            function () {

                tripMobileNav.classList.toggle(
                    "active"
                );

            }
        );

    }


    /* =====================================
       ADD ACTIVITY
       ===================================== */

    activityForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const selectedDay =
                activityDay.value;

            const time =
                activityTime.value;

            const name =
                activityName.value.trim();

            const location =
                activityLocation.value.trim();


            /* VALIDATION */

            if (!time || !name || !location) {

                alert(
                    "Please fill all activity details!"
                );

                return;

            }


            /* FIND SELECTED DAY LIST */

            const activitiesList =
                document.querySelector(
                    `.activities-list[data-day="${selectedDay}"]`
                );


            if (!activitiesList) {

                alert(
                    "Selected day was not found!"
                );

                return;

            }


            /* REMOVE EMPTY MESSAGE */

            const emptyMessage =
                activitiesList.querySelector(
                    ".empty-message"
                );

            if (emptyMessage) {

                emptyMessage.remove();

            }


            /* CREATE ACTIVITY ITEM */

            const activityItem =
                document.createElement("div");

            activityItem.className =
                "activity-item";


            /* TIME */

            const timeBox =
                document.createElement("div");

            timeBox.className =
                "activity-time";

            timeBox.textContent =
                formatTime(time);


            /* ACTIVITY DETAILS */

            const details =
                document.createElement("div");

            details.className =
                "activity-details";


            const activityTitle =
                document.createElement("h4");

            activityTitle.textContent =
                name;


            const activityPlace =
                document.createElement("p");

            activityPlace.textContent =
                "📍 " + location;


            details.appendChild(
                activityTitle
            );

            details.appendChild(
                activityPlace
            );


            /* DELETE BUTTON */

            const deleteButton =
                document.createElement("button");

            deleteButton.type =
                "button";

            deleteButton.className =
                "delete-activity-btn";

            deleteButton.textContent =
                "Delete";


            /* DELETE ACTIVITY */

            deleteButton.addEventListener(
                "click",
                function () {

                    activityItem.remove();


                    /* IF NO ACTIVITY LEFT */

                    if (
                        activitiesList.children.length === 0
                    ) {

                        const newEmptyMessage =
                            document.createElement("p");

                        newEmptyMessage.className =
                            "empty-message";

                        newEmptyMessage.textContent =
                            "No activities added yet.";

                        activitiesList.appendChild(
                            newEmptyMessage
                        );

                    }

                }
            );


            /* ADD ALL PARTS */

            activityItem.appendChild(
                timeBox
            );

            activityItem.appendChild(
                details
            );

            activityItem.appendChild(
                deleteButton
            );


            /* ADD ACTIVITY TO DAY */

            activitiesList.appendChild(
                activityItem
            );


            /* RESET FORM */

            activityTime.value = "";

            activityName.value = "";

            activityLocation.value = "";


            /* SUCCESS MESSAGE */

            alert(
                "Activity added successfully!"
            );

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
       SAVE ITINERARY
       ===================================== */

    if (saveItineraryBtn) {

        saveItineraryBtn.addEventListener(
            "click",
            function () {

                const allActivities =
                    document.querySelectorAll(
                        ".activity-item"
                    );


                if (
                    allActivities.length === 0
                ) {

                    alert(
                        "Please add at least one activity before saving!"
                    );

                    return;

                }


                /*
                   For now, data is stored in
                   browser localStorage.
                */

                const itineraryData = [];


                allActivities.forEach(
                    function (activity) {

                        const parentList =
                            activity.parentElement;

                        const day =
                            parentList.dataset.day;

                        const time =
                            activity.querySelector(
                                ".activity-time"
                            ).textContent;

                        const name =
                            activity.querySelector(
                                ".activity-details h4"
                            ).textContent;

                        const location =
                            activity.querySelector(
                                ".activity-details p"
                            ).textContent
                                .replace("📍 ", "");


                        itineraryData.push({

                            day: day,

                            time: time,

                            activity: name,

                            location: location

                        });

                    }
                );


                /* SAVE TO LOCAL STORAGE */

                localStorage.setItem(
                    "globeTrotterItinerary",
                    JSON.stringify(itineraryData)
                );


                alert(
                    "Itinerary saved successfully!"
                );


                console.log(
                    itineraryData
                );

            }
        );

    }


    /* =====================================
       FORMAT TIME
       ===================================== */

    function formatTime(time) {

        if (!time) {

            return "";

        }


        const timeParts =
            time.split(":");


        let hours =
            Number(timeParts[0]);

        const minutes =
            timeParts[1];


        const period =
            hours >= 12
                ? "PM"
                : "AM";


        hours =
            hours % 12;


        if (hours === 0) {

            hours = 12;

        }


        return (
            hours +
            ":" +
            minutes +
            " " +
            period
        );

    }


});
