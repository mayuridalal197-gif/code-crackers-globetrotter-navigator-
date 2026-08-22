/* =========================================
   GlobeTrotter Authentication
   Temporary Frontend Authentication
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

    registerForm.addEventListener("submit", function (event) {

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


        /* Validation */

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


        /* Check existing user */

        const existingUser =
            JSON.parse(localStorage.getItem("globeTrotterUser"));


        if (existingUser &&
            existingUser.email === email) {

            showMessage(
                "registerMessage",
                "An account with this email already exists.",
                "error"
            );

            return;
        }


        /* Create user */

        const user = {

            name: fullName,

            email: email,

            password: password,

            createdAt: new Date().toISOString()

        };


        localStorage.setItem(
            "globeTrotterUser",
            JSON.stringify(user)
        );


        showMessage(
            "registerMessage",
            "Account created successfully! Redirecting to login...",
            "success"
        );


        /* Redirect */

        setTimeout(function () {

            window.location.href = "login.html";

        }, 1500);

    });

}


/* ================= LOGIN ================= */

const loginForm = document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;


        /* Get registered user */

        const user =
            JSON.parse(localStorage.getItem("globeTrotterUser"));


        if (!user) {

            showMessage(
                "loginMessage",
                "No account found. Please register first.",
                "error"
            );

            return;
        }


        /* Check credentials */

        if (
            email !== user.email ||
            password !== user.password
        ) {

            showMessage(
                "loginMessage",
                "Invalid email or password.",
                "error"
            );

            return;
        }


        /* Login success */

        const loggedInUser = {

            name: user.name,

            email: user.email,

            loginTime: new Date().toISOString()

        };


        localStorage.setItem(
            "globeTrotterLoggedIn",
            JSON.stringify(loggedInUser)
        );


        showMessage(
            "loginMessage",
            "Login successful! Redirecting...",
            "success"
        );


        /* Dashboard temporarily */

        setTimeout(function () {

            window.location.href = "dashboard.html";

        }, 1000);

    });

}