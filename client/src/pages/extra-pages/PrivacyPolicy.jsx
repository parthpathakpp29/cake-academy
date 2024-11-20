// src/pages/policies/PrivacyPolicy.jsx
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
      <div className="max-w-4xl mx-auto space-y-8">

        <section>
          <h2 className="text-xl font-semibold mb-2">Introduction</h2>
          <p className="text-gray-700">
            This Privacy Policy outlines how we collect, use, and protect your personal information 
            when you use our online bakery course-selling website. By using our services, you agree 
            to the terms outlined here.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <p className="text-gray-700">
            We collect personal information you provide directly, such as:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Your name, email address, and password during account creation</li>
            <li>Details submitted while purchasing courses</li>
          </ul>
          <p className="text-gray-700 mt-4">
            Additionally, we automatically collect data like:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Your device's IP address, browser type, and usage patterns</li>
            <li>Details about your interaction with our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
          <p className="text-gray-700">
            Your personal information is used for the following purposes:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>To provide and improve our services</li>
            <li>To process your transactions, including payments via QR codes</li>
            <li>To contact you regarding updates, courses, or offers</li>
            <li>To ensure the security and functionality of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Cookies and Tracking</h2>
          <p className="text-gray-700">
            We use cookies and similar technologies to enhance your experience and analyze website usage. 
            You can manage your cookie preferences in your browser settings, but some functionalities may 
            be restricted if cookies are disabled.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Data Sharing and Protection</h2>
          <p className="text-gray-700">
            Your data may be shared with third-party service providers for purposes such as:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Payment processing</li>
            <li>Analyzing website usage</li>
            <li>Providing customer support</li>
          </ul>
          <p className="text-gray-700 mt-4">
            We implement industry-standard security measures to protect your personal data, but no method 
            of transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Children’s Privacy</h2>
          <p className="text-gray-700">
            Our services are not intended for individuals under 13 years of age. We do not knowingly 
            collect personal data from children. If you believe your child has provided us with personal 
            data, please contact us to remove it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Changes to This Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy periodically. Any updates will be communicated through our 
            website or via email. Please review the policy regularly for changes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
          <p className="text-gray-700">
            For questions or concerns, contact us at{' '}
            <a href="mailto:proffesionalcakemakingclass@gmail.com" className="text-blue-600 underline">
              proffesionalcakemakingclass@gmail.com
            </a>.
          </p>
        </section>

      </div>
    </div>
  );
};

export default PrivacyPolicy;
