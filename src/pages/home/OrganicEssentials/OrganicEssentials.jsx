import React from 'react';

const OrganicEssentials = () => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start p-8 bg-red-100">
      {/* ছবি section */}
      <div className="md:w-1/2 p-4">
        <img 
          src="/public/zpj/organize.jpg" 
          alt="Fresh Vegetables" 
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </div>
      
      {/* টেক্সট ও বাটন section */}
      <div className="md:w-1/2 p-4 space-y-4">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Your Organic Essentials, Delivered
        </h2>
        <p className="text-gray-700 mb-6">
          Get a box of fresh–picked organic produce and pantry goods delivered to your door each week.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-full"></div>
            <span>Always seasonal, always from our farm;</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-full"></div>
            <span>Includes recipe cards and family farm stories;</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-full"></div>
            <span>Eco-friendly packaging;</span>
          </li>
          <li className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-500 rounded-full"></div>
            <span>Cancel or skip anytime.</span>
          </li>
        </ul>
        {/* বাটনগুলি */}
        <div className="flex space-x-4 mt-6">
          <button className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition">
            See This Week's Box
          </button>
          <button className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganicEssentials;