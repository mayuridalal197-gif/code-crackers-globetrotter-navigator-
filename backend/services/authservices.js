const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { pool } = require("../_config/database");

const registerUser = async (name, email, password) => {
    // Check if email already exists
    const [existingUsers] = await pool.execute(
        "SELECT id FROM users WHERE email = ?",
        [email]
    );

    if (existingUsers.length > 0) {
        throw new Error("Email already registered");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.execute(
        `INSERT INTO users (name, email, password)
         VALUES (?, ?, ?)`,
        [name, email, hashedPassword]
    );

    return {
        id: result.insertId,
        name,
        email,
        role: "user"
    };
};


const loginUser = async (email, password) => {
    // Find user
    const [users] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    if (users.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = users[0];

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordCorrect) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
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

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};


const getUserById = async (id) => {
    const [users] = await pool.execute(
        `SELECT id, name, email, role, created_at
         FROM users
         WHERE id = ?`,
        [id]
    );

    if (users.length === 0) {
        throw new Error("User not found");
    }

    return users[0];
};


module.exports = {
    registerUser,
    loginUser,
    getUserById
};
