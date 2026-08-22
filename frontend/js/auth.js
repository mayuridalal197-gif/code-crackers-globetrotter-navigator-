/* =========================================
   GlobeTrotter Authentication
   Backend Integrated Authentication
   ========================================= */


/* ================= PASSWORD TOGGLE ================= */

function togglePassword(inputId, button) {

    const input = document.getElementById(inputId);

    if (!input) {
        return;
    }

    if (input.type === "password") {

        input.type = "text";
        button.textContent = "🙈";

    } else {

        input.type = "password";
        button.textContent = "👁";

    }
}


/* ================= MESSAGE ================= */

function showMessage(elementId, message, type) {

    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent = message;
    element.className = "auth-message " + type;
}


/* ================= REGISTER ================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("fullName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const terms =
            document.getElementById("terms").checked;


        /* ---------- Frontend Validation ---------- */

        if (fullName.length < 2) {

            showMessage(
                "registerMessage",
                "Please enter your full name.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showMessage(
                "registerMessage",
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "registerMessage",
                "Passwords do not match.",
                "error"
            );

            return;
        }


        if (!terms) {

            showMessage(
                "registerMessage",
                "Please accept the Terms & Conditions.",
                "error"
            );

            return;
        }


        /* ---------- Send Data To Backend ---------- */

        try {

            showMessage(
                "registerMessage",
                "Creating your account...",
                "success"
            );


            const response = await apiRequest(
                "/auth/register",
                {
                    method: "POST",

                    body: JSON.stringify({
                        name: fullName,
                        email: email,
                        password: password
                    })
                }
            );


            /* ---------- Registration Success ---------- */

            showMessage(
                "registerMessage",
                response.message || "Account created successfully!",
                "success"
            );


            /* Redirect to login */

            setTimeout(function () {

                window.location.href = "login.html";

            }, 1000);


        } catch (error) {

            showMessage(
                "registerMessage",
                error.message || "Registration failed.",
                "error"
            );

        }

    });

}


/* ================= LOGIN ================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        /* ---------- Basic Validation ---------- */

        if (!email || !password) {

            showMessage(
                "loginMessage",
                "Please enter email and password.",
                "error"
            );

            return;
        }


        /* ---------- Send Login Request ---------- */

        try {

            showMessage(
                "loginMessage",
                "Logging in...",
                "success"
            );


            const response = await apiRequest(
                "/auth/login",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


            /* ---------- Get Backend Response ---------- */

            const token = response.data?.token;
            const user = response.data?.user;


            if (!token) {

                throw new Error(
                    "Login successful but authentication token was not received."
                );

            }


            /* ---------- Store JWT ---------- */

            localStorage.setItem(
                "token",
                token
            );


            /* ---------- Store User ---------- */

            if (user) {

                localStorage.setItem(
                    "globeTrotterLoggedIn",
                    JSON.stringify(user)
                );

            }


            showMessage(
                "loginMessage",
                response.message || "Login successful!",
                "success"
            );


            /* ---------- Redirect ---------- */

            setTimeout(function () {

                window.location.href = "dashboard.html";

            }, 800);


        } catch (error) {

            showMessage(
                "loginMessage",
                error.message || "Login failed.",
                "error"
            );

        }

    });

}
