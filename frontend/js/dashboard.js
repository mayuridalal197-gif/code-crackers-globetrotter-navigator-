/* =========================================
   GLOBETROTTER DASHBOARD
   ========================================= */


document.addEventListener("DOMContentLoaded", function () {


    /* ================= GET USER ================= */

    const user =
        JSON.parse(
            localStorage.getItem("globeTrotterLoggedIn")
        );


    /*
       Agar user login nahi hai,
       to login page par bhej do.
    */

    if (!user) {

        window.location.href = "login.html";

        return;

    }


    /* ================= USER NAME ================= */

    const welcomeName =
        document.getElementById("welcomeName");

    const profileName =
        document.getElementById("profileName");

    const profileAvatar =
        document.getElementById("profileAvatar");


    if (welcomeName) {

        welcomeName.textContent = user.name;

    }


    if (profileName) {

        profileName.textContent = user.name;

    }


    if (profileAvatar) {

        profileAvatar.textContent =
            user.name.charAt(0).toUpperCase();

    }



    /* ================= MOBILE MENU ================= */

    const dashboardMenuBtn =
        document.getElementById("dashboardMenuBtn");

    const mobileDashboardNav =
        document.getElementById("mobileDashboardNav");


    if (
        dashboardMenuBtn &&
        mobileDashboardNav
    ) {

        dashboardMenuBtn.addEventListener(
            "click",
            function () {

                mobileDashboardNav.classList.toggle(
                    "active"
                );


                if (
                    mobileDashboardNav.classList.contains(
                        "active"
                    )
                ) {

                    dashboardMenuBtn.textContent = "✕";

                } else {

                    dashboardMenuBtn.textContent = "☰";

                }

            }
        );

    }



    /* ================= PROFILE DROPDOWN ================= */

    const profileMenuBtn =
        document.getElementById("profileMenuBtn");

    const profileDropdown =
        document.getElementById("profileDropdown");


    if (
        profileMenuBtn &&
        profileDropdown
    ) {

        profileMenuBtn.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                profileDropdown.classList.toggle(
                    "active"
                );

            }
        );


        document.addEventListener(
            "click",
            function () {

                profileDropdown.classList.remove(
                    "active"
                );

            }
        );

    }



    /* ================= LOGOUT FUNCTION ================= */

    function logout() {

        localStorage.removeItem(
            "globeTrotterLoggedIn"
        );

        window.location.href = "login.html";

    }


    /* ================= DESKTOP LOGOUT ================= */

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }



    /* ================= MOBILE LOGOUT ================= */

    const mobileLogoutBtn =
        document.getElementById("mobileLogoutBtn");


    if (mobileLogoutBtn) {

        mobileLogoutBtn.addEventListener(
            "click",
            logout
        );

    }

});
