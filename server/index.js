import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from './routes/authRoute.js'

dotenv.config();

connectDB()

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cors({
    origin: '*'
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    return res.json("Hello Backend");
})


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server Running at PORT ${PORT}`);
})