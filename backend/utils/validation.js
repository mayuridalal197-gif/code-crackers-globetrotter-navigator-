function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPassword(password) {
    return typeof password === "string" && password.length >= 6;
}

function validateRegisterData(name, email, password) {
    const errors = {};

    if (!name || name.trim().length < 2) {
        errors.name = "Name must contain at least 2 characters";
    }

    if (!email || !isValidEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!password || !isValidPassword(password)) {
        errors.password = "Password must contain at least 6 characters";
    }

    return errors;
}

function validateLoginData(email, password) {
    const errors = {};

    if (!email || !isValidEmail(email)) {
        errors.email = "Please enter a valid email address";
    }

    if (!password) {
        errors.password = "Password is required";
    }

    return errors;
}

module.exports = {
    isValidEmail,
    isValidPassword,
    validateRegisterData,
    validateLoginData
};
