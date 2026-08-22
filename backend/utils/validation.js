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

// Validate trip creation data
const validateTrip = (
    title,
    destination,
    startDate,
    endDate
) => {
    const errors = [];

    // Title validation
    if (!title || title.trim().length === 0) {
        errors.push("Trip title is required");
    }

    // Destination validation
    if (!destination || destination.trim().length === 0) {
        errors.push("Destination is required");
    }

    // Start date validation
    if (!startDate) {
        errors.push("Start date is required");
    }

    // End date validation
    if (!endDate) {
        errors.push("End date is required");
    }

    // Check date order
    if (startDate && endDate && startDate > endDate) {
        errors.push("End date must be after start date");
    }

    return errors;
};

module.exports = {
    isValidEmail,
    validateRegister,
    validateLogin,
    validateTrip
};
