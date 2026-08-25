/* =========================================
   PROFILE PAGE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeProfile
);


/* =========================================
   INITIALIZE
========================================= */

function initializeProfile() {

    loadStoredUser();

    setupProfileForm();

    setupLogout();

}


/* =========================================
   LOAD USER
========================================= */

function loadStoredUser() {

    let user = null;


    /*
     * Try common localStorage keys
     */

    const possibleKeys = [
        "user",
        "currentUser",
        "loggedInUser",
        "userData"
    ];


    for (
        const key of possibleKeys
    ) {

        const stored =
            localStorage.getItem(key);


        if (!stored) {
            continue;
        }


        try {

            user =
                JSON.parse(stored);

            break;

        } catch (error) {

            console.warn(
                `Invalid user data in ${key}`
            );

        }

    }


    /*
     * If user object was not found,
     * try individual values.
     */

    if (!user) {

        const name =
            localStorage.getItem(
                "name"
            );

        const email =
            localStorage.getItem(
                "email"
            );

        const phone =
            localStorage.getItem(
                "phone"
            );

        const username =
            localStorage.getItem(
                "username"
            );


        if (
            name ||
            email ||
            phone ||
            username
        ) {

            user = {

                name,
                email,
                phone,
                username

            };

        }

    }


    if (!user) {

        setDefaultProfile();

        return;

    }


    populateProfile(
        user
    );

}


/* =========================================
   POPULATE PROFILE
========================================= */

function populateProfile(
    user
) {

    const name =
        user.name ||
        user.full_name ||
        user.username ||
        "Traveler";


    const email =
        user.email ||
        "-";


    const phone =
        user.phone ||
        user.mobile ||
        "";


    const username =
        user.username ||
        "";


    document.getElementById(
        "profileName"
    ).textContent =
        name;


    document.getElementById(
        "profileEmail"
    ).textContent =
        email;


    document.getElementById(
        "name"
    ).value =
        name;


    document.getElementById(
        "email"
    ).value =
        email;


    document.getElementById(
        "phone"
    ).value =
        phone;


    document.getElementById(
        "username"
    ).value =
        username;


    setAvatar(
        name
    );

}


/* =========================================
   DEFAULT PROFILE
========================================= */

function setDefaultProfile() {

    document.getElementById(
        "profileName"
    ).textContent =
        "Traveler";


    document.getElementById(
        "profileEmail"
    ).textContent =
        "-";


    document.getElementById(
        "name"
    ).value =
        "";


    document.getElementById(
        "email"
    ).value =
        "";


    document.getElementById(
        "phone"
    ).value =
        "";


    document.getElementById(
        "username"
    ).value =
        "";

}


/* =========================================
   AVATAR
========================================= */

function setAvatar(
    name
) {

    const avatar =
        document.getElementById(
            "profileAvatar"
        );


    if (!name) {

        avatar.textContent =
            "👤";

        return;

    }


    const firstLetter =
        name
            .trim()
            .charAt(0)
            .toUpperCase();


    avatar.textContent =
        firstLetter;

}


/* =========================================
   PROFILE FORM
========================================= */

function setupProfileForm() {

    const form =
        document.getElementById(
            "profileForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const phone =
                document.getElementById(
                    "phone"
                ).value.trim();


            if (!name) {

                showMessage(
                    "Please enter your name.",
                    "error"
                );

                return;

            }


            /*
             * Update local profile data.
             */

            updateStoredUser(
                name,
                phone
            );


            document.getElementById(
                "profileName"
            ).textContent =
                name;


            setAvatar(
                name
            );


            showMessage(
                "Profile updated successfully.",
                "success"
            );

        }
    );

}


/* =========================================
   UPDATE STORED USER
========================================= */

function updateStoredUser(
    name,
    phone
) {

    const possibleKeys = [
        "user",
        "currentUser",
        "loggedInUser",
        "userData"
    ];


    let updated = false;


    for (
        const key of possibleKeys
    ) {

        const stored =
            localStorage.getItem(key);


        if (!stored) {
            continue;
        }


        try {

            const user =
                JSON.parse(stored);


            if (
                typeof user !== "object" ||
                user === null
            ) {

                continue;

            }


            if ("name" in user) {
                user.name = name;
            }

            if ("full_name" in user) {
                user.full_name = name;
            }

            if ("phone" in user) {
                user.phone = phone;
            }

            if ("mobile" in user) {
                user.mobile = phone;
            }


            localStorage.setItem(
                key,
                JSON.stringify(user)
            );


            updated = true;

            break;

        } catch (error) {

            console.warn(
                "Could not update stored user."
            );

        }

    }


    /*
     * Also keep simple values updated.
     */

    localStorage.setItem(
        "name",
        name
    );


    localStorage.setItem(
        "phone",
        phone
    );


    if (!updated) {

        console.log(
            "Profile saved using local storage."
        );

    }

}


/* =========================================
   MESSAGE
========================================= */

function showMessage(
    message,
    type
) {

    const element =
        document.getElementById(
            "profileMessage"
        );


    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.className =
        `profile-message ${type}`;


    setTimeout(
        () => {

            element.textContent =
                "";

            element.className =
                "profile-message";

        },
        3000
    );

}


/* =========================================
   LOGOUT
========================================= */

function setupLogout() {

    const buttons = [

        document.getElementById(
            "logoutButton"
        ),

        document.getElementById(
            "profileLogoutButton"
        )

    ];


    buttons.forEach(
        button => {

            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                logoutUser
            );

        }
    );

}


/* =========================================
   LOGOUT USER
========================================= */

function logoutUser() {

    const confirmed =
        confirm(
            "Are you sure you want to logout?"
        );


    if (!confirmed) {
        return;
    }


    /*
     * Remove authentication data.
     */

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "accessToken"
    );

    localStorage.removeItem(
        "authToken"
    );


    localStorage.removeItem(
        "user"
    );

    localStorage.removeItem(
        "currentUser"
    );

    localStorage.removeItem(
        "loggedInUser"
    );

    localStorage.removeItem(
        "userData"
    );


    window.location.href =
        "login.html";

}
