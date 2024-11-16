import Razorpay from "razorpay";
import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/courseModel.js";

const razorpay = new Razorpay({
    key_id: 'rzp_test_eB0p0Uq4Lgfu8W',
    key_secret: 'mCMxtv3pTb0j91AVKbaeb7So'
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
            receipt: `course_${courseId}_${Date.now()}`.substring(0, 40) // Ensure receipt is not longer than 40 characters
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({
            success: false,
            message: "Error creating payment order",
            error: error.message
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
            message: "Payment verified and enrollment created successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error verifying payment and creating enrollment"
        });
    }
};

export const getTotalRevenueController = async (req, res) => {
    try {
        const result = await Enrollment.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$amount" }
                }
            }
        ]);

        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            totalRevenue
        });
    } catch (error) {
        console.error("Error calculating total revenue:", error);
        res.status(500).json({
            success: false,
            message: "Error calculating total revenue",
            error: error.message
        });
    }
};