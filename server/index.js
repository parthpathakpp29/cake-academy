import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js'

dotenv.config();

const app = express();

const allowedOrigins = ['https://cake-making-xrda.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Pre-flight request handling
app.options('*', cors());

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`);
});

export default app;