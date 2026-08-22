// ==========================================
// GlobeTrotter - Profile JavaScript
// ==========================================


// ==========================================
// Profile Image
// ==========================================

const profileImageInput =
    document.getElementById("profileImageInput");

const profilePhoto =
    document.getElementById("profilePhoto");


profileImageInput.addEventListener(
    "change",
    function () {

        const file = this.files[0];

        if (!file) {
            return;
        }

        // Check image type

        if (!file.type.startsWith("image/")) {

            alert("Please select a valid image.");

            return;
        }


        const reader =
            new FileReader();


        reader.onload = function (event) {

            profilePhoto.innerHTML = `
                <img
                    src="${event.target.result}"
                    alt="Profile Photo"
                >
            `;

        };


        reader.readAsDataURL(file);

    }
);


// ==========================================
// Profile Form
// ==========================================

const profileForm =
    document.getElementById("profileForm");


profileForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();


        if (name === "" || email === "") {

            alert(
                "Please fill all required fields."
            );

            return;
        }


        // Update profile header

        document.getElementById(
            "profileName"
        ).textContent = name;


        document.getElementById(
            "profileEmail"
        ).textContent = email;


        alert(
            "Profile updated successfully! ✅"
        );

    }
);


// ==========================================
// Logout
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


logoutBtn.addEventListener(
    "click",
    function () {

        const confirmLogout =
            confirm(
                "Are you sure you want to logout?"
            );


        if (confirmLogout) {

            // Later this can clear
            // actual login/session data

            localStorage.removeItem("loggedInUser");

            window.location.href =
                "login.html";
        }

    }
);


// ==========================================
// Mobile Menu
// ==========================================

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.querySelector(".nav-links");


if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        function () {

            navLinks.classList.toggle("show");

        }
    );

}
