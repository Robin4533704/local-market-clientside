import React from 'react';
import { useNavigate } from 'react-router-dom';

const Works = () => {
  const navigate = useNavigate(); // Initialize navigate inside the component

  return (
    <div className="bg-lime-500 py-10 px-4">
      {/* হেডার */}
      <h2 className="text-3xl font-semibold text-white text-center mb-8">HOW IT WORKS</h2>
      
      {/* ধাপগুলো */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-7xl mx-auto">
        {/* ধাপ 1 */}
        <div className="flex-1  rounded-lg p-6 relative text-center">
          {/* নম্বর circle */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg text-white">
            1
          </div>
          {/* ছবি */}
          <div className="flex justify-center mb-4">
            <img 
              src="/zpj/works1.jpg" 
              alt="Seasonal produce"
              className="w-36 h-36 object-cover rounded-full mx-auto"
            />
          </div>
          {/* শিরোনাম */}
          <h3 className="text-xl text-black font-semibold mb-2">Shop What’s In Season</h3>
          {/* বর্ণনা */}
          <p className="text-white text-sm">
            Browse our selection of freshly harvested produce, pantry staples, and farm-made goods — all grown and packed right here on our farm.
          </p>
        </div>

        {/* ধাপ 2 */}
        <div className="flex-1 rounded-lg p-6 relative text-center">
          {/* নম্বর circle */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg text-white">
            2
          </div>
          {/* ছবি */}
          <div className="flex justify-center mb-4">
            <img 
              src="/zpj/works2.jpg" 
              alt="Delivery or Pickup"
              className="w-36 h-36 object-cover rounded-full mx-auto"
            />
          </div>
          {/* শিরোনাম */}
          <h3 className="text-xl text-black font-semibold mb-2">Choose Delivery or Pickup</h3>
          {/* বর্ণনা */}
          <p className="text-white text-sm">
            Get your order delivered to your door or pick it up locally at our farm stand. You can also subscribe to our weekly Farm Box for a rotating mix of seasonal favorites.
          </p>
        </div>

        {/* ধাপ 3 */}
        <div className="flex-1  rounded-lg p-6 relative text-center">
          {/* নম্বর circle */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg text-white">
            3
          </div>
          {/* ছবি */}
          <div className="flex justify-center mb-4">
            <img 
              src="/zpj/works3.jpg" 
              alt="Enjoy Food"
              className="w-36 h-36 object-cover rounded-full mx-auto"
            />
          </div>
          {/* শিরোনাম */}
          <h3 className="text-xl text-black font-semibold mb-2">Enjoy Real Food, Grown with Love</h3>
          {/* বর্ণনা */}
          <p className="text-white text-sm">
            Cook with confidence knowing your food is organic, sustainable, and straight from our soil – just the way nature intended.
          </p>
        </div>
      </div>

      {/* Start Shopping Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/productlist")}
          className="bg-yellow-400 text-white font-semibold px-6 py-3 rounded-full hover:bg-yellow-500 transition duration-300"
        >
          Start Shopping
        </button>
      </div>
    </div>
  );
};

export default Works;