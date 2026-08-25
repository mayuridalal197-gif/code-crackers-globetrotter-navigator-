const { pool } =
    require("../_config/database");

const {
    registerUser,
    loginUser
} = require("../_services/authServices");

const {
    successResponse,
    errorResponse
} = require("../_utils/response");

const {
    validateRegisterData,
    validateLoginData
} = require("../_utils/validation");


// =========================================
// REGISTER
// =========================================

async function register(req, res) {

    try {

        const {
            name,
            email,
            password
        } = req.body;


        const errors =
            validateRegisterData(
                name,
                email,
                password
            );


        if (
            Object.keys(errors).length > 0
        ) {

            return errorResponse(
                res,
                "Validation failed",
                400,
                errors
            );

        }


        const user =
            await registerUser(
                name,
                email,
                password
            );


        return successResponse(
            res,
            "Registration successful",
            user,
            201
        );


    } catch (error) {

        console.error(
            "Register error:",
            error
        );


        return errorResponse(
            res,
            error.message ||
                "Registration failed",
            error.statusCode ||
                500
        );

    }

}


// =========================================
// LOGIN
// =========================================

async function login(req, res) {

    try {

        const {
            email,
            password
        } = req.body;


        const errors =
            validateLoginData(
                email,
                password
            );


        if (
            Object.keys(errors).length > 0
        ) {

            return errorResponse(
                res,
                "Validation failed",
                400,
                errors
            );

        }


        const result =
            await loginUser(
                email,
                password
            );


        return successResponse(
            res,
            "Login successful",
            result
        );


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        return errorResponse(
            res,
            error.message ||
                "Login failed",
            error.statusCode ||
                500
        );

    }

}


// =========================================
// GET CURRENT USER
// =========================================

async function getMe(req, res) {

    try {

        const userId =
            req.user.id;


        const [rows] =
            await pool.execute(
                `
                SELECT
                    id,
                    name,
                    email,
                    role,
                    profile_image,
                    bio,
                    created_at,
                    updated_at
                FROM users
                WHERE id = ?
                `,
                [userId]
            );


        if (
            rows.length === 0
        ) {

            return errorResponse(
                res,
                "User not found",
                404
            );

        }


        return successResponse(
            res,
            "User loaded successfully",
            rows[0]
        );


    } catch (error) {

        console.error(
            "Get current user error:",
            error
        );


        return errorResponse(
            res,
            error.message ||
                "Unable to load user",
            error.statusCode ||
                500
        );

    }

}


// =========================================
// EXPORT
// =========================================

module.exports = {

    register,

    login,

    getMe

};
