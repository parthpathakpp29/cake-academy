import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);

// Error Handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8080;
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}); 