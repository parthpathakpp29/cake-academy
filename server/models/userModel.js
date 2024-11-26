import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [3, "Name must be at least 3 characters long"],
            maxlength: [50, "Name cannot exceed 50 characters"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            unique: [true, "Phone number should be unique"],
            trim: true,
        },
        role: {
            type: Number,
            default: 0,
            enum: [0, 1], // 0 for regular user, 1 for admin
        },
        enrolledCourses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active'
        },
        securityQuestion: {
            type: String,
            required: [true, "Security question is required"],
        },
        securityAnswer: {
            type: String,
            required: [true, "Security answer is required"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("users", userSchema);

