// src/pages/policies/TermsAndConditions.jsx
import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Terms and Conditions</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Course Usage</h2>
          <p className="text-gray-700">
            Courses are for personal use only and cannot be shared or redistributed.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
          <ul className="list-disc pl-5 text-gray-700">
            <li>Maintain account confidentiality</li>
            <li>Provide accurate information</li>
            <li>Comply with our community guidelines</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Intellectual Property</h2>
          <p className="text-gray-700">
            All course content is the intellectual property of Cake Academy and protected by copyright laws.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;