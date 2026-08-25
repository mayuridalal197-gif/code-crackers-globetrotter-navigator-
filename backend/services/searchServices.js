const { pool } =
    require("../_config/database");


const searchCities = async (query) => {

    const [rows] =
        await pool.execute(
            `
            SELECT *
            FROM cities
            WHERE
                name LIKE ?
                OR country LIKE ?
            ORDER BY name ASC
            `,
            [
                `%${query}%`,
                `%${query}%`
            ]
        );


    return rows;
};

function createCityCard(city) {

    return `

        <article class="search-card">

            ${
                city.image_url
                    ? `
                        <img
                            src="${escapeHTML(
                                city.image_url
                            )}"
                            alt="${escapeHTML(
                                city.name
                            )}"
                            class="city-image"
                        >
                    `
                    : ""
            }


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


                ${
                    city.description
                        ? `
                            <p class="city-description">
                                ${escapeHTML(
                                    city.description
                                )}
                            </p>
                        `
                        : ""
                }


                <div class="city-cost">

                    <span>
                        Average Budget
                    </span>

                    <strong>
                        ₹${Number(
                            city.average_budget || 0
                        ).toLocaleString("en-IN")}
                    </strong>

                </div>

            </div>

        </article>

    `;
}

module.exports = {
    searchCities
};