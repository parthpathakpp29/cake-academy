// src/pages/policies/AboutUs.jsx
import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">About Cake Academy</h1>
      <div className="max-w-4xl mx-auto space-y-8">
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-700">
            At Cake Academy, we aim to inspire and educate baking enthusiasts of all skill levels. 
            Whether you’re a beginner or an aspiring pastry chef, we provide the tools and techniques 
            to elevate your skills and creativity.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Our Story</h2>
          <p className="text-gray-700">
            Cake Academy was founded by a group of professional pastry chefs who envisioned making 
            world-class baking education accessible to everyone. What started as small workshops has 
            now evolved into a comprehensive online learning platform, bringing professional techniques 
            into your kitchen.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <p className="text-gray-700">
            We are a team of passionate culinary experts, educators, and creators dedicated to providing 
            high-quality content and guidance. Our chefs bring decades of professional experience to ensure 
            you learn from the very best.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Our Location</h2>
          <p className="text-gray-700">
            We are proud to call Kolkata, India, our home. Our head office is located at:
          </p>
          <address className="text-gray-700 font-medium">
            Sulonguri, Gouranga Nagar,<br />
            Newtown, Kolkata-700162
          </address>
          <p className="text-gray-700">
            From the heart of Newtown, we strive to connect with learners around the world while sharing 
            the rich baking traditions of our community.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Why Choose Us</h2>
          <p className="text-gray-700">
            At Cake Academy, we believe that baking is an art that should be shared and celebrated. 
            Here’s why thousands of learners trust us:
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li>Expert-led courses designed for all skill levels</li>
            <li>Flexible learning at your own pace</li>
            <li>A vibrant community of baking enthusiasts</li>
            <li>Comprehensive resources to support your growth</li>
          </ul>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
