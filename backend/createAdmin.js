const bcrypt = require("bcryptjs");

const { pool } = require("./_config/database");

async function createAdmin() {

    const name = "GlobeTrotter Admin";
    const email = "admin@globetrotter.com";
    const password = "Admin@123";

    try {

        // Check existing account
        const [existing] = await pool.execute(
            "SELECT id, role FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {

            console.log(
                `User already exists with role: ${existing[0].role}`
            );

            if (existing[0].role !== "admin") {

                await pool.execute(
                    "UPDATE users SET role = 'admin' WHERE id = ?",
                    [existing[0].id]
                );

                console.log("Existing user converted to admin.");

            } else {

                console.log("This account is already an admin.");

            }

            return;
        }


        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);


        // Create admin
        const [result] = await pool.execute(
            `
            INSERT INTO users
            (
                name,
                email,
                password,
                role
            )
            VALUES (?, ?, ?, 'admin')
            `,
            [
                name,
                email,
                hashedPassword
            ]
        );


        console.log("==============================");
        console.log("ADMIN CREATED SUCCESSFULLY");
        console.log("==============================");
        console.log("ID:", result.insertId);
        console.log("Email:", email);
        console.log("Password:", password);
        console.log("Role: admin");
        console.log("==============================");


    } catch (error) {

        console.error(
            "Failed to create admin:",
            error
        );

    } finally {

        await pool.end();

    }

}


createAdmin();