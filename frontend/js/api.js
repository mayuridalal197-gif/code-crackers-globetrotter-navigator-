const API_BASE_URL = "http://localhost:5000/api";

async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem("globetrotter_token");

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                ...options,
                headers
            }
        );

        const contentType = response.headers.get("content-type");

        if (!contentType || !contentType.includes("application/json")) {

            const text = await response.text();

            console.error("NON-JSON RESPONSE:");
            console.error(text);

            throw new Error(
                `Server returned ${response.status} instead of JSON`
            );
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Something went wrong"
            );
        }

        return data;

    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
}


function saveToken(token) {
    localStorage.setItem(
        "globetrotter_token",
        token
    );
}


function getToken() {
    return localStorage.getItem(
        "globetrotter_token"
    );
}


function removeToken() {
    localStorage.removeItem(
        "globetrotter_token"
    );
}


function isLoggedIn() {
    return !!getToken();
}
