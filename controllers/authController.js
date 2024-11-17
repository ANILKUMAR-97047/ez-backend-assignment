import jwt from 'jsonwebtoken';
import jwtSecret from '../config/jwtSecret.js';
import database from '../config/db.js';

import { randomBytes } from 'crypto';

//console.log(database)

export const signUp = (req, res) => {
    const { username, email, password, role } = req.body;
    const verification_code = randomBytes(16).toString('hex'); // Generate a random code

    const query = `
        INSERT INTO users2 (username, email, password, role, verification_code)
        VALUES (?, ?, ?, ?, ?)
    `;
    database.run(query, [username, email, password, role, verification_code], function (err) {
        if (err) {
            console.error('Error registering user:', err.message);
            return res.status(500).json({ error: 'Failed to register user' });
        }

        // Simulate sending the verification email
        console.log(`Verification email sent to ${email} with code: ${verification_code}`);

        res.status(201).json({ id: this.lastID, message: 'User registered successfully. Please verify your email.' });
    });
};


// export const login = (req, res) => {
//     const { email, password } = req.body;

//     const query = `
//         SELECT * FROM users WHERE email = ? AND password = ?
//     `;
//     database.get(query, [email, password], (err, row) => {
//         if (err) {
//             console.error('Error logging in:', err.message);
//             return res.status(500).json({ error: 'Failed to login' });
//         }
//         if (!row) {
//             return res.status(404).json({ error: 'Invalid email or password' });
//         }
//         res.status(200).json({ message: 'Login successful', user: row });
//     });
// };


export const login = (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM users2 WHERE email = ? AND password = ?`;

    database.get(query, [email, password], (err, user) => {
        if (err) {
            console.error('Error during login:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
            expiresIn: '1h', // Token expiration time
        });

        res.status(200).json({ message: 'Login successful', token });
    });
};


export const verifyEmail = (req, res) => {
    const { verification_code } = req.params;

    const query = `
        SELECT * FROM users2 WHERE verification_code = ?
    `;

    database.get(query, [verification_code], (err, user) => {
        if (err) {
            console.error('Error retrieving user:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired verification code' });
        }

        // Update the user's email_verified status
        const updateQuery = `
            UPDATE users2
            SET email_verified = 1, verification_code = NULL
            WHERE id = ?
        `;

        database.run(updateQuery, [user.id], (updateErr) => {
            if (updateErr) {
                console.error('Error updating email verification status:', updateErr.message);
                return res.status(500).json({ error: 'Failed to verify email' });
            }

            res.status(200).json({ message: 'Email verified successfully' });
        });
    });
};