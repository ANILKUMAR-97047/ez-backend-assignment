import express from 'express';
import multer from 'multer';
import { uploadFile, listFiles, downloadFile } from '../controllers/fileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Destination for uploaded files

// Routes
router.post('/upload', authMiddleware, upload.single('file'), uploadFile); // Protected route
router.get('/list-files', authMiddleware, listFiles); // Protected route
router.get('/download-file/:file_id', authMiddleware, downloadFile); // Protected route

export default router;
