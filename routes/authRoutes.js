import express from 'express';
import { login, signUp, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

// Authentication Endpoints
router.post('/signup', signUp);
router.post('/login', login);
router.get('/verify-email/:verification_code', verifyEmail);

export default router;
