import React from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { courseService } from "@/services/api";

function RazorpayPayment({ courseId, courseTitle, coursePrice, onEnrollmentSuccess }) {
  const handlePayment = async () => {
    try {
      const response = await courseService.createOrder(courseId);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: response.order.amount,
        currency: response.order.currency,
        name: "Your Course Platform",
        description: `Payment for ${courseTitle}`,
        order_id: response.order.id,
        handler: async (response) => {
          try {
            const verifyResponse = await courseService.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              courseId,
            });
            if (verifyResponse.success) {
              toast.success('Payment successful! You are now enrolled in the course.');
              onEnrollmentSuccess();
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error('An error occurred during payment verification.');
          }
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <Button onClick={handlePayment} className="w-full" size="lg">
      Enroll Now for ₹{coursePrice}
    </Button>
  );
}

export default RazorpayPayment;
