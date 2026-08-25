const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../_config/database");

async function registerUser(name, email, password) {
    const connection = await pool.getConnection();

    try {
        const [existingUsers] = await connection.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            const error = new Error("Email is already registered");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await connection.execute(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, 'user')`,
            [name.trim(), email.toLowerCase(), hashedPassword]
        );

        return {
            id: result.insertId,
            name: name.trim(),
            email: email.toLowerCase(),
            role: "user"
        };
    } finally {
        connection.release();
    }
}

async function loginUser(email, password) {
    const [users] = await pool.execute(
        `SELECT id, name, email, password, role, profile_image, bio
         FROM users
         WHERE email = ?`,
        [email.toLowerCase()]
    );

    if (users.length === 0) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const user = users[0];

    const passwordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!passwordMatch) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    delete user.password;

    return {
        user,
        token
    };
}

module.exports = {
    registerUser,
    loginUser
};
