import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
import { createLogger } from "../utils/logger.js";
import crypto from "crypto";
import { Resend } from 'resend';
import Enrollment from "../models/enrollmentModel.js";

const logger = createLogger('authController');

const resend = new Resend('re_e3o1och3_3nXGDKDmdampKJgnDzk6VR6A')

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body; // Include phone

        if (!name || !email || !password || !phone) { // Check for phone
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser  = await userModel.findOne({ email });
        if (existingUser ) {
            return res.status(409).json({
                success: false,
                message: "Email already registered",
            });
        }

        const hashedPassword = await hashPassword(password);
        const user = await new userModel({ name, email, password: hashedPassword, phone }).save(); // Save phone

        res.status(201).json({
            success: true,
            message: "User  registered successfully",
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone }, // Return phone
        });
    } catch (error) {
        logger.error('Error in registerController:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone:user.phone,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        logger.error('Error in loginController:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const testController = (req, res) => {
    res.json({ message: "Protected route accessed successfully" });
};

export const forgotPasswordController = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        // Save OTP to user document
        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpiry = otpExpiry;
        await user.save();

        // Send OTP via email using Resend
        const { data, error } = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
        });

        if (error) {
            logger.error('Error sending email:', error);
            return res.status(500).json({
                success: false,
                message: "Failed to send OTP email",
            });
        }

        res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (error) {
        logger.error('Error in forgotPasswordController:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const resetPasswordController = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await userModel.findOne({ 
            email, 
            resetPasswordOtp: otp,
            resetPasswordOtpExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP",
            });
        }

        // Reset password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpiry = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        logger.error('Error in resetPasswordController:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export const getTotalUsersController = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        res.status(200).json({
            success: true,
            totalUsers
        });
    } catch (error) {
        logger.error('Error in getTotalUsersController:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching total users",
            error: error.message
        });
    }
};


export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}, '-password');

        const formattedUsers = await Promise.all(users.map(async (user) => {
            const enrollmentCount = await Enrollment.countDocuments({ user: user._id, status: "completed" });
            return {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,  // Make sure this line is present
                role: user.role,
                status: user.status,
                enrolledCourses: enrollmentCount,
                createdAt: user.createdAt
            };
        }));

        res.status(200).json({
            success: true,
            users: formattedUsers
        });
    } catch (error) {
        console.error('Error in getAllUsersController:', error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};