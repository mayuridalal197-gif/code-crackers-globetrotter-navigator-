const authServices = require("../_services/authServices");
const {
    validateRegister,
    validateLogin
} = require("../_utils/validation");

// Handle user registration request
const register = async (req, res) => {
    try {
        // Get registration data from frontend
        const { name, email, password } = req.body;

        // Validate registration data
        const errors = validateRegister(name, email, password);

        // Stop request if validation fails
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Call service layer to create user
        const user = await authServices.registerUser(
            name.trim(),
            email.trim().toLowerCase(),
            password
        );

        // Send successful response
        return res.status(201).json({
            success: true,
            message: "Registration successful",
            data: {
                user
            }
        });

    } catch (error) {

        // Email already exists
        if (error.message === "Email already registered") {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Handle user login request
const login = async (req, res) => {
    try {
        // Get login data from frontend
        const { email, password } = req.body;

        // Validate login data
        const errors = validateLogin(email, password);

        // Stop request if validation fails
        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors
            });
        }

        // Call service layer to verify credentials
        const result = await authServices.loginUser(
            email.trim().toLowerCase(),
            password
        );

        // Send token and user information
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });

    } catch (error) {

        // Invalid login credentials
        if (error.message === "Invalid email or password") {
            return res.status(401).json({
                success: false,
                message: error.message
            });
        }

        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


// Get currently logged-in user's information
const getMe = async (req, res) => {
    try {
        // req.user comes from authMiddleware after JWT verification
        const user = await authServices.getUserById(req.user.id);

        return res.status(200).json({
            success: true,
            data: {
                user
            }
        });

    } catch (error) {
        console.error("Get user error:", error);

        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }
};


module.exports = {
    register,
    login,
    getMe
};
