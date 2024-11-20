// src/pages/policies/RefundPolicy.jsx
import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund and Cancellation Policy</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Course Refunds</h2>
          <p className="text-gray-700">
            We offer a 30-day money-back guarantee for all our online courses.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Refund Conditions</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Refund requests must be made within 30 days of purchase</li>
            <li>You must have completed less than 20% of the course content</li>
            <li>Refunds are processed within 7-10 business days</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Cancellation Policy</h2>
          <p className="text-gray-700">
            You can cancel your course enrollment at any time. Refund eligibility depends on 
            the course completion percentage.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;