import Razorpay from "razorpay";
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/courseModel.js";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

export const createOrder = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const options = {
            amount: course.price * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `course_${courseId}_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating payment order"
        });
    }
};

export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, courseId, amount } = req.body;

        // Create enrollment record
        await Enrollment.create({
            user: req.user._id,
            course: courseId,
            paymentId: razorpay_payment_id,
            amount: amount / 100, // Convert back from paise to rupees
            status: "completed"
        });

        res.json({
            success: true,
            message: "Payment verified successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment"
        });
    }
};