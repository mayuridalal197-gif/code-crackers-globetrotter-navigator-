document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById("searchForm");

        const input =
            document.getElementById("searchInput");

        const results =
            document.getElementById("searchResults");


        if (!form || !input || !results) {
            return;
        }


        // =========================================
        // SEARCH
        // =========================================

        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const query =
                    input.value.trim();


                if (!query) {

                    results.innerHTML = `

                        <div class="search-message">

                            <h3>
                                Enter a destination
                            </h3>

                            <p>
                                Try Paris, Dubai,
                                Tokyo, London or Bali.
                            </p>

                        </div>

                    `;

                    return;
                }


                results.innerHTML = `

                    <div class="search-message">

                        <h3>
                            Searching...
                        </h3>

                    </div>

                `;


                try {

                    const response =
                        await apiRequest(
                            `/search?q=${encodeURIComponent(query)}`,
                            {
                                method: "GET"
                            }
                        );


                    const cities =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : [];


                    if (
                        cities.length === 0
                    ) {

                        results.innerHTML = `

                            <div class="search-empty">

                                <h3>
                                    No destinations found
                                </h3>

                                <p>
                                    Try another destination.
                                </p>

                            </div>

                        `;

                        return;
                    }


                    results.innerHTML = "";


                    cities.forEach(
                        city => {

                            const card =
                                document.createElement(
                                    "article"
                                );


                            card.className =
                                "search-card";


                            card.innerHTML = `

                                <img
                                    src="${escapeHTML(
                                        city.image_url
                                    )}"
                                    alt="${escapeHTML(
                                        city.name
                                    )}"
                                    class="city-image"
                                >


                                <div class="city-content">

                                    <h2>
                                        ${escapeHTML(
                                            city.name
                                        )}
                                    </h2>


                                    <p class="city-country">

                                        📍
                                        ${escapeHTML(
                                            city.country
                                        )}

                                    </p>


                                    <p class="city-description">

                                        ${escapeHTML(
                                            city.description
                                        )}

                                    </p>


                                    <div class="city-cost">

                                        <span>
                                            Average Budget
                                        </span>

                                        <strong>

                                            ₹${Number(
                                                city.average_budget || 0
                                            ).toLocaleString(
                                                "en-IN"
                                            )}

                                        </strong>

                                    </div>


                                    <button
                                        type="button"
                                        class="add-to-trip-btn"
                                        data-city-id="${city.id}"
                                    >
                                        ➕ Add to Trip
                                    </button>

                                </div>

                            `;


                            const button =
                                card.querySelector(
                                    ".add-to-trip-btn"
                                );

                                button.addEventListener(
                                    "click",
                                    () => {

                                        console.log(
                                            "ADD TO TRIP CLICKED",
                                            city
                                        );

                                        openTripSelector(
                                            city
                                        );

                                    }
                                );


                            results.appendChild(
                                card
                            );

                        }
                    );


                } catch (error) {

                    results.innerHTML = `

                        <div class="search-error">

                            <h3>
                                Search failed
                            </h3>

                            <p>
                                ${escapeHTML(
                                    error.message
                                )}
                            </p>

                        </div>

                    `;

                }

            }
        );

    }
);


// =========================================
// OPEN TRIP SELECTOR
// =========================================

async function openTripSelector(city) {

    try {

        const response =
            await apiRequest(
                "/trips",
                {
                    method: "GET"
                }
            );


        const trips =
            Array.isArray(response.data)
                ? response.data
                : [];


        if (trips.length === 0) {

            alert(
                "You don't have any trips yet. Create a trip first."
            );

            return;
        }


        showTripModal(
            city,
            trips
        );


    } catch (error) {

        alert(
            error.message ||
            "Unable to load your trips."
        );

    }

}


// =========================================
// TRIP MODAL
// =========================================

function showTripModal(
    city,
    trips
) {

    const existingModal =
        document.getElementById(
            "tripSelectorModal"
        );


    if (existingModal) {

        existingModal.remove();

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "tripSelectorModal";


    modal.className =
        "trip-selector-overlay";


    modal.innerHTML = `

        <div class="trip-selector-modal">

            <button
                type="button"
                class="trip-modal-close"
                id="closeTripModal"
            >
                ✕
            </button>


            <h2>
                Add ${escapeHTML(
                    city.name
                )} to a Trip
            </h2>


            <p>
                Select one of your trips:
            </p>


            <div
                class="trip-selector-list"
                id="tripSelectorList"
            >

                ${trips.map(
                    trip => `

                        <button
                            type="button"
                            class="trip-option"
                            data-trip-id="${trip.id}"
                        >

                            <div>

                                <strong>
                                    ${escapeHTML(
                                        trip.title
                                    )}
                                </strong>

                                <span>
                                    📍
                                    ${escapeHTML(
                                        trip.destination || "No destination"
                                    )}
                                </span>

                            </div>

                            <span>
                                →
                            </span>

                        </button>

                    `
                ).join("")}

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // Close button

    document
        .getElementById(
            "closeTripModal"
        )
        .addEventListener(
            "click",
            () => {

                modal.remove();

            }
        );


    // Click outside modal

    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


    // Trip selection

    const options =
        modal.querySelectorAll(
            ".trip-option"
        );


    options.forEach(
        option => {

            option.addEventListener(
                "click",
                async () => {

                    const tripId =
                        option.dataset.tripId;


                    await addCityToTrip(
                        city,
                        tripId,
                        modal
                    );

                }
            );

        }
    );

}


// =========================================
// ADD CITY TO TRIP
// =========================================

async function addCityToTrip(
    city,
    tripId,
    modal
) {

    const options =
        modal.querySelectorAll(
            ".trip-option"
        );


    options.forEach(
        option => {

            option.disabled =
                true;

        }
    );


    try {

        const response =
            await apiRequest(
                `/search/cities/${city.id}/add-to-trip`,
                {
                    method: "POST",

                    body: JSON.stringify({
                        tripId:
                            Number(tripId)
                    })
                }
            );


        modal.innerHTML = `

            <div class="trip-success">

                <div class="trip-success-icon">
                    ✓
                </div>

                <h2>
                    City Added!
                </h2>

                <p>
                    ${escapeHTML(
                        city.name
                    )}
                    has been added to your trip.
                </p>

                <button
                    type="button"
                    class="trip-success-btn"
                    id="closeSuccessModal"
                >
                    Done
                </button>

            </div>

        `;


        document
            .getElementById(
                "closeSuccessModal"
            )
            .addEventListener(
                "click",
                () => {

                    modal.remove();

                }
            );


    } catch (error) {

        options.forEach(
            option => {

                option.disabled =
                    false;

            }
        );


        alert(
            error.message ||
            "Unable to add city to trip."
        );

    }

}


// =========================================
// ESCAPE HTML
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
