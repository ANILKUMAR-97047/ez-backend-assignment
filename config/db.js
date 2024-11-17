import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

sqlite3.verbose();

const dbPath = path.resolve(__dirname, '../database.sqlite');

// Create the database connection
const database = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Function to check if a column exists in a table
const columnExistsQuery = `
    PRAGMA table_info(users2);
`;

const addVerificationCodeColumn = `
    ALTER TABLE users2 ADD COLUMN verification_code TEXT;
`;

// Function to check and add the verification_code column
const addColumnIfNotExists = () => {
    database.all(columnExistsQuery, (err, rows) => {
        if (err) {
            console.error('Error checking table columns:', err.message);
            return;
        }

        const columnNames = rows.map((row) => row.name);
        if (!columnNames.includes('verification_code')) {
            database.run(addVerificationCodeColumn, (err) => {
                if (err) {
                    console.error('Error adding verification_code column:', err.message);
                } else {
                    console.log('verification_code column added to users2 table.');
                }
            });
        } else {
            console.log('verification_code column already exists in users2 table.');
        }
    });
};

// Create Users Table if it doesn't exist
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Ops User', 'Client User')),
        email_verified BOOLEAN DEFAULT 0
    );
`;

// Create Users Table and Check/Alter Columns
database.serialize(() => {
    // Run table creation query
    database.run(createUsersTable, (err) => {
        if (err) {
            console.error('Error creating Users table:', err.message);
        } else {
            console.log('Users table created or already exists.');
        }

        // Check and add the `verification_code` column
        addColumnIfNotExists();
    });
});

export default database;
