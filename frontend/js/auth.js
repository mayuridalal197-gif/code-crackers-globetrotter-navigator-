document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("registerForm");

    const loginForm =
        document.getElementById("loginForm");


    // ==========================
    // REGISTER
    // ==========================

    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const name =
                    document
                        .getElementById("name")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                const button =
                    document.getElementById(
                        "registerButton"
                    );


                const message =
                    document.getElementById(
                        "message"
                    );


                button.disabled = true;

                button.textContent =
                    "Creating account...";


                message.innerHTML = "";


                try {

                    const response =
                        await apiRequest(
                            "/auth/register",
                            {
                                method: "POST",

                                body: JSON.stringify({
                                    name,
                                    email,
                                    password
                                })
                            }
                        );


                    message.innerHTML = `
                        <div class="message success">
                            ${response.message}
                        </div>
                    `;


                    registerForm.reset();


                    setTimeout(() => {

                        window.location.href =
                            "login.html";

                    }, 1000);


                } catch (error) {

                    console.error(
                        "Register error:",
                        error
                    );


                    message.innerHTML = `
                        <div class="message error">
                            ${error.message}
                        </div>
                    `;


                } finally {

                    button.disabled = false;

                    button.textContent =
                        "Create Account";

                }

            }
        );

    }


    // ==========================
    // LOGIN
    // ==========================

    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                const button =
                    document.getElementById(
                        "loginButton"
                    );


                const message =
                    document.getElementById(
                        "message"
                    );


                button.disabled = true;

                button.textContent =
                    "Logging in...";


                message.innerHTML = "";


                try {

                    // ==========================
                    // LOGIN API
                    // ==========================

                    const response =
                        await apiRequest(
                            "/auth/login",
                            {
                                method: "POST",

                                body: JSON.stringify({
                                    email,
                                    password
                                })
                            }
                        );


                    // ==========================
                    // CHECK RESPONSE
                    // ==========================

                    if (
                        !response ||
                        !response.data ||
                        !response.data.token ||
                        !response.data.user
                    ) {

                        throw new Error(
                            "Invalid login response from server."
                        );

                    }


                    const token =
                        response.data.token;


                    const user =
                        response.data.user;


                    // ==========================
                    // SAVE TOKEN
                    // ==========================

                    saveToken(token);


                    // ==========================
                    // SAVE USER
                    // ==========================

                    localStorage.setItem(
                        "globetrotter_user",
                        JSON.stringify(user)
                    );


                    // ==========================
                    // SUCCESS MESSAGE
                    // ==========================

                    message.innerHTML = `
                        <div class="message success">
                            ${response.message || "Login successful"}
                        </div>
                    `;


                    // ==========================
                    // ROLE CHECK
                    // ==========================

                    setTimeout(() => {

                        if (
                            user.role &&
                            user.role.toLowerCase() ===
                            "admin"
                        ) {

                            // ADMIN
                            window.location.href =
                                "admin.html";

                        } else {

                            // NORMAL USER
                            window.location.href =
                                "dashboard.html";

                        }

                    }, 800);


                } catch (error) {

                    console.error(
                        "Login error:",
                        error
                    );


                    message.innerHTML = `
                        <div class="message error">
                            ${error.message || "Login failed"}
                        </div>
                    `;


                } finally {
                    button.disabled = false;
                    button.textContent =
                        "Login";
                }
            }
        );
    }
});
