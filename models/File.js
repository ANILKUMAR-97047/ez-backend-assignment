import database from '../config/db.js';

// Create Files Table
const createFilesTable = `
    CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        originalname TEXT NOT NULL,
        mimetype TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL
    );
`;

database.run(createFilesTable, (err) => {
    if (err) {
        console.error('Error creating files table:', err.message);
    } else {
        console.log('Files table created or already exists.');
    }
});

export default database;
