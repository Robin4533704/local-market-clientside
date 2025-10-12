import React from "react";
import { motion } from "framer-motion";

const OrganicEssentials = () => {
  return (
    <motion.div
      className="flex flex-col md:flex-row items-center md:items-start lg:p-8 bg-red-100"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6 }}
    >
      {/* ছবি section */}
      <motion.div
        className="md:w-1/2 p-4"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <img
          src="https://i.ibb.co/NdTtZLY3/fruits-1761031-640.jpg"
          alt="Fresh Vegetables"
          className="w-full h-auto rounded-lg shadow-lg"
        />
      </motion.div>

      {/* টেক্সট ও বাটন section */}
      <motion.div
        className="md:w-1/2 p-4 space-y-4"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Your Organic Essentials, Delivered
        </h2>
        <p className="text-gray-700 mb-6">
          Get a box of fresh–picked organic produce and pantry goods delivered
          to your door each week.
        </p>
        <ul className="space-y-2">
          {[
            "Always seasonal, always from our farm;",
            "Includes recipe cards and family farm stories;",
            "Eco-friendly packaging;",
            "Cancel or skip anytime.",
          ].map((item, idx) => (
            <motion.li
              key={idx}
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
            >
              <div className="w-4 h-4 mr-2 bg-green-500 rounded-full"></div>
              <span>{item}</span>
            </motion.li>
          ))}
        </ul>

        {/* বাটনগুলি */}
        <div className="flex space-x-4 mt-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="border border-gray-300 rounded px-4 py-2 hover:bg-gray-100 transition"
          >
            See This Week's Box
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition"
          >
            Subscribe Now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrganicEssentials;
