import database from './db.js';

// Create Users Table
const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users2 (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('Ops User', 'Client User')),
        email_verified BOOLEAN DEFAULT 0,
        verification_code TEXT
    );
`;



// Create Users Table
database.run(createUsersTable, (err) => {
    if (err) {
        console.error('Error creating users table:', err.message);
    } else {
        console.log('Users table created or already exists.');
    }
});



export default database;
