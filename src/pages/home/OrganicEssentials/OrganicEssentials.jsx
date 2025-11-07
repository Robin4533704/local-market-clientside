import React from "react";
import { motion } from "framer-motion";

const OrganicEssentials = () => {
  return (
    <motion.section
      className="relative flex flex-col lg:flex-row items-center justify-between gap-8 p-6 md:p-12 lg:p-16 bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl mx-4 my-8 shadow-lg"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full blur-3xl opacity-30 -translate-x-10 -translate-y-10"></div>
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-emerald-200 rounded-full blur-3xl opacity-40 translate-x-10 translate-y-10"></div>
      
      {/* Image Section */}
      <motion.div
        className="lg:w-1/2 relative"
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <img
            src="https://i.ibb.co/NdTtZLY3/fruits-1761031-640.jpg"
            alt="Fresh Organic Vegetables and Fruits"
            className="w-full h-auto object-cover transform hover:scale-110 transition-transform duration-700"
          />
          {/* Overlay badge */}
          <div className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
            🍃 100% Organic
          </div>
        </div>
        
        {/* Floating stats */}
        <motion.div 
          className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-green-200"
          initial={{ scale: 0, rotate: -10 }}
          whileInView={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-green-700">500+</div>
            <div className="text-xs text-gray-600">Happy Families</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        className="lg:w-1/2 space-y-6 relative z-10"
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* Badge */}
        <motion.div
          className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          🌱 Fresh From Farm to Table
        </motion.div>

        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
          Your{" "}
          <span className="text-green-700 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Organic Essentials
          </span>
          , Delivered Fresh
        </h2>
        
        <p className="text-lg text-gray-700 leading-relaxed">
          Get a box of fresh–picked organic produce and pantry goods delivered 
          to your door each week. Experience the taste of nature's finest harvest.
        </p>

        {/* Features List */}
        <ul className="space-y-4">
          {[
            { 
              text: "Always seasonal, always from our farm", 
              icon: "🌿" 
            },
            { 
              text: "Includes recipe cards and family farm stories", 
              icon: "📖" 
            },
            { 
              text: "Eco-friendly packaging", 
              icon: "♻️" 
            },
            { 
              text: "Cancel or skip anytime", 
              icon: "⏰" 
            },
          ].map((item, idx) => (
            <motion.li
              key={idx}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.5 + idx * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              <span className="text-gray-700 text-lg">{item.text}</span>
            </motion.li>
          ))}
        </ul>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px -5px rgba(34, 197, 94, 0.4)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
          >
            <span>Subscribe Now</span>
            <span>🚀</span>
          </motion.button>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "#f9fafb",
              borderColor: "#10b981"
            }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 border-2 border-green-500 text-green-700 font-semibold py-4 px-8 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <span>See This Week's Box</span>
            <span>👀</span>
          </motion.button>
        </motion.div>

        {/* Trust badge */}
        <motion.div
          className="flex items-center justify-center gap-2 pt-6 text-sm text-gray-600"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
          <span>Rated 4.9/5 by 2000+ customers</span>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default OrganicEssentials;