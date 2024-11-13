import Razorpay from 'razorpay';
import crypto from 'crypto';
import orderModel from '../models/orderModel.js';
import courseModel from '../models/courseModel.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await courseModel.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const options = {
      amount: course.price * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: `course_${courseId}_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    
    // Save order details
    await orderModel.create({
      courseId,
      userId: req.user._id,
      razorpayOrderId: order.id,
      amount: course.price,
      currency: 'INR'
    });

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, courseId } = req.body;
    
    // Verify signature
    const body = orderId + "|" + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update order status
    await orderModel.findOneAndUpdate(
      { razorpayOrderId: orderId },
      { 
        status: 'completed',
        razorpayPaymentId: paymentId
      }
    );

    // Update course enrollment
    await courseModel.findByIdAndUpdate(
      courseId,
      { $addToSet: { enrolledStudents: req.user._id } }
    );

    res.json({
      success: true,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
};