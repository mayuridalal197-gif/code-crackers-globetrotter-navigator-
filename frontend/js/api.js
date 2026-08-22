/* =====================================================
   GLOBETROTTER API HELPER
   This file handles communication between
   frontend and Node.js backend.
===================================================== */


/*
    Backend server URL.

    During development:
    http://localhost:5000

    Later, when deployed:
    https://your-backend-url.com
*/

const API_BASE_URL = "http://localhost:5000/api";


/*
    Generic API request function.

    Instead of writing fetch() again and again,
    we can simply call apiRequest().
*/

async function apiRequest(endpoint, options = {}) {

    try {

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,

                headers: {

                    "Content-Type": "application/json",

                    /*
                        If authentication token exists,
                        send it to backend.
                    */

                    ...(localStorage.getItem("token")
                        ? {
                            "Authorization":
                            `Bearer ${localStorage.getItem("token")}`
                        }
                        : {}),

                    ...options.headers

                }
            }
        );


        /*
            Convert backend response into JSON.
        */

        const data = await response.json();


        /*
            If HTTP status is not successful,
            throw an error.
        */

        if (!response.ok) {

            console.log("Backend Error Response:", data);

            throw new Error(
            data.errors
                ? data.errors.join(", ")
                : data.message || "Something went wrong"
        );

    }


        return data;

    }

    catch (error) {

        console.error("API Error:", error);

        throw error;

    }

}
