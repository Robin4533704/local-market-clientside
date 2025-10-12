import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrganicFarmSection = () => {
  const textVariants = {
    offscreen: { opacity: 0, x: -50 },
    onscreen: { opacity: 1, x: 0, transition: { duration: 0.6, type: 'spring', bounce: 0.3 } },
  };

  const imageVariants = {
    offscreen: { opacity: 0, x: 50 },
    onscreen: { opacity: 1, x: 0, transition: { duration: 0.6, type: 'spring', bounce: 0.3 } },
  };

  return (
    <div className="flex flex-col md:flex-row bg-red-100 p-2 lg:p-8 max-w-7xl mx-auto items-center md:items-start gap-4">
      
      {/* বাম অংশ - লেখা */}
      <motion.div 
        className="md:w-1/2 flex flex-col justify-center p-4"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={textVariants}
      >
        <h4 className="text-sm font-semibold uppercase mb-2">WHY ORGANICS?</h4>
        <h2 className="text-3xl font-bold mb-4">Clean Food, Grown with Care</h2>
        <p className="mb-4 text-gray-700">
          We farm the way nature intended — without synthetic pesticides, GMOs, or harmful chemicals. By nourishing our soil and rotating our crops, we grow produce that’s better for you and better for the planet.
        </p>
        <p className="mb-6 text-gray-700">
          Our organic practices mean fresher flavors, healthier meals, and a cleaner conscience.
        </p>
        <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 120 }}>
          <Link 
            to='/about' 
            className="bg-yellow-400 text-center text-white font-semibold px-4 py-2 rounded-full shadow hover:bg-yellow-500 transition duration-300"
          >
            More About Us
          </Link>
        </motion.div>
      </motion.div>
      
      {/* ডান অংশ - ছবি */}
      <motion.div 
        className="md:w-1/2 flex justify-center p-4"
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
        variants={imageVariants}
      >
        <img 
          src="https://i.ibb.co/XxPfZ9SK/istockphoto-2220276242-612x612.webp" 
          alt="Farm produce"
          className="rounded-lg shadow-lg object-cover max-w-full h-[350px] md:h-auto"
        />
      </motion.div>

    </div>
  );
};

export default OrganicFarmSection;
