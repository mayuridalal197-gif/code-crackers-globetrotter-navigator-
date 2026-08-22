// Check whether a value is a valid email address
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate registration data
const validateRegister = (name, email, password) => {
    const errors = [];

    // Name validation
    if (!name || name.trim().length === 0) {
        errors.push("Name is required");
    }

    // Email validation
    if (!email || !isValidEmail(email)) {
        errors.push("A valid email is required");
    }

    // Password validation
    if (!password || password.length < 8) {
        errors.push("Password must be at least 8 characters");
    }

    return errors;
};

// Validate login data
const validateLogin = (email, password) => {
    const errors = [];

    if (!email || !isValidEmail(email)) {
        errors.push("A valid email is required");
    }

    if (!password) {
        errors.push("Password is required");
    }

    return errors;
};

module.exports = {
    isValidEmail,
    validateRegister,
    validateLogin
};
