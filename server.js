import express from 'express';
import authRoutes from './routes/authRoutes.js';
import fileRoutes from './routes/fileRoutes.js';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);

// Example Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// Start the Server
const serverStart = () => {
    try {
        app.listen(5000, () => {
            console.log(`Server running at http://localhost:5000`);
        });
    } catch (error) {
        console.error('Error while starting the app:', error);
    }
};

serverStart();
