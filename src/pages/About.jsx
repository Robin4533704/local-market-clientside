// src/components/About.jsx
import React from 'react';
import { Link } from 'react-router';

const About = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">About Us</h2>
        <p className="text-gray-700 mb-6">
          Welcome to Local Market! We are dedicated to providing fresh and high-quality products
          from local farmers and vendors directly to your doorstep. Our mission is to support the
          local economy while ensuring that you get the best value for your money.
        </p>
        <p className="text-gray-700 mb-6">
          From fresh fruits and vegetables to daily essentials, we make shopping convenient,
          reliable, and safe. Join our community and experience the freshness and quality that
          sets us apart.
        </p>
        <div className="flex justify-center gap-4">
          <Link to='/OrganicEssentials' className="bg-yellow-400 text-center text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-yellow-500 transition duration-300">
            Learn More
          </Link>
          <Link to='/contactus' className="bg-green-400 text-center text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-yellow-500 transition duration-300">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default About;
