// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js';
import courseRoutes from './routes/courseRoute.js';

import cloudinary from "cloudinary";


// Load environment variables
dotenv.config();

// Initialize database connection
connectDB();

// Configure Cloudinary with environment variables
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Initialize Express app
const app = express();



// Middleware
app.use(express.json({ limit: '50mb' })); // Increased limit for file uploads

app.use(cors({
    origin: '*'  // Adjust origin as needed for security
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);



// Root endpoint
app.get('/', (req, res) => {
    return res.json("Hello Backend");
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
});