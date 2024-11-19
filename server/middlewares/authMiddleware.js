import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { createLogger } from "../utils/logger.js";

const logger = createLogger('authMiddleware');

export const requireSignIn = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('Error in requireSignIn middleware:', error);
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};

export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.role !== 1) {
            return res.status(403).json({ success: false, message: "Access denied. Admin only." });
        }

        next();
    } catch (error) {
        logger.error('Error in isAdmin middleware:', error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};