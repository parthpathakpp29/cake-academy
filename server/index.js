import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js'

dotenv.config();

const app = express();

// Update CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://cake-making-qoy7.vercel.app', 'https://cake-making.vercel.app']
        : '*',
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    return res.json("Hello Backend");
});

// Connect to the database
connectDB().then(() => {
    console.log('Connected to database');
}).catch((err) => {
    console.error('Failed to connect to database:', err);
});

// For local development
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
        console.log(`Server Running at PORT ${PORT}`);
    });
}

export default app;