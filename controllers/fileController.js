import database from '../config/db.js';
import fs from 'fs';
import path from 'path';

export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const { filename, originalname, mimetype, size, path: filePath } = req.file;

    const query = `
        INSERT INTO files (filename, originalname, mimetype, size, path)
        VALUES (?, ?, ?, ?, ?)
    `;
    database.run(query, [filename, originalname, mimetype, size, filePath], function (err) {
        if (err) {
            console.error('Error saving file metadata:', err.message);
            return res.status(500).json({ error: 'Failed to upload file' });
        }

        res.status(201).json({ message: 'File uploaded successfully', fileId: this.lastID });
    });
};

export const listFiles = (req, res) => {
    const query = `SELECT id, originalname, mimetype, size FROM files`;

    database.all(query, (err, rows) => {
        if (err) {
            console.error('Error retrieving files:', err.message);
            return res.status(500).json({ error: 'Failed to list files' });
        }

        res.status(200).json({ files: rows });
    });
};
export const downloadFile = (req, res) => {
    const { file_id } = req.params;

    const query = `SELECT * FROM files WHERE id = ?`;

    database.get(query, [file_id], (err, file) => {
        if (err) {
            console.error('Error retrieving file:', err.message);
            return res.status(500).json({ error: 'Failed to download file' });
        }

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        const filePath = path.resolve(file.path);
        res.download(filePath, file.originalname, (downloadErr) => {
            if (downloadErr) {
                console.error('Error during file download:', downloadErr.message);
            }
        });
    });
};
