// src/pages/policies/AboutUs.jsx
import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">About Cake Academy</h1>
      <div className="max-w-4xl mx-auto space-y-4">
        <section>
          <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
          <p className="text-gray-700">
            Cake Academy is dedicated to providing high-quality online baking and pastry arts education 
            to passionate learners around the world.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Our Story</h2>
          <p className="text-gray-700">
            Founded by professional pastry chefs, Cake Academy began with a simple goal: 
            to make professional baking education accessible to everyone.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold mb-2">Our Team</h2>
          <p className="text-gray-700">
            Our team consists of experienced pastry chefs, culinary instructors, 
            and passionate educators committed to helping you achieve your baking dreams.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;