// src/pages/policies/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <p className="text-gray-700">
            We collect information you provide directly to us, such as when you create an account, 
            purchase a course, or contact our support team.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>To provide and maintain our services</li>
            <li>To process your transactions</li>
            <li>To communicate with you about courses and updates</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Data Protection</h2>
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your personal information.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;