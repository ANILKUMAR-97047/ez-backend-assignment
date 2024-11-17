import jwt from 'jsonwebtoken';
import jwtSecret from '../config/jwtSecret.js';

const authMiddleware = (req, res, next) => {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

export default authMiddleware;
