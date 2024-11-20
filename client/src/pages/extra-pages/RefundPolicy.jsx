// src/pages/policies/RefundPolicy.jsx
import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Refund and Cancellation Policy</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Eligibility for Refund</h2>
          <p className="text-gray-700">
            You are entitled to a refund under the following conditions:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>If the purchased course is not assigned to you within the expiration date from 
                your date of purchase.</li>
            <li>If you have inadvertently paid twice for the same course.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Non-Refundable Conditions</h2>
          <p className="text-gray-700">
            Under any other circumstances, refund requests will not be considered. This includes 
            but is not limited to dissatisfaction with course content, technical issues unrelated 
            to our platform, or change of mind. As this is a digital course purchase, all sales 
            are final except in the cases outlined above.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Refund Processing</h2>
          <p className="text-gray-700">
            Approved refunds will be processed within 7-10 business days from the date of approval. 
            Refunds will be credited back to the original method of payment used at the time of purchase.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-700">
            If you have any questions about this refund policy or would like to request a refund, 
            please contact our support team at <a href="mailto:support@cakemakingclass.com" 
            className="text-blue-500 underline">professionalcakemakingclass@gmail.com</a>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default RefundPolicy;
