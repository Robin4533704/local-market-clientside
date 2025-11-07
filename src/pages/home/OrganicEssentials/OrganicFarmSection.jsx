import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrganicFarmSection = () => {
  const containerVariants = {
    offscreen: { opacity: 0 },
    onscreen: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        duration: 0.8
      }
    }
  };

  const textVariants = {
    offscreen: { 
      opacity: 0, 
      x: -80,
      scale: 0.95
    },
    onscreen: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        type: 'spring', 
        bounce: 0.3 
      } 
    },
  };

  const imageVariants = {
    offscreen: { 
      opacity: 0, 
      x: 80,
      scale: 0.95,
      rotate: -5 
    },
    onscreen: { 
      opacity: 1, 
      x: 0, 
      scale: 1,
      rotate: 0,
      transition: { 
        duration: 0.8, 
        type: 'spring', 
        bounce: 0.3 
      } 
    },
  };

  const floatingVariants = {
    floating: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-white via-emerald-50 to-green-100 py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-12 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-lime-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-300/10 rounded-full blur-2xl"></div>
        
        {/* Floating Leaves */}
        <motion.div
          className="absolute top-20 left-20 text-6xl opacity-20"
          variants={floatingVariants}
          animate="floating"
        >
          🍃
        </motion.div>
        <motion.div
          className="absolute bottom-32 right-32 text-4xl opacity-15"
          variants={floatingVariants}
          animate="floating"
          style={{ animationDelay: '1s' }}
        >
          🌱
        </motion.div>
      </div>

      <motion.div 
        className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        
        {/* Left Content Section */}
        <motion.div 
          className="lg:w-1/2 flex flex-col justify-center space-y-6 lg:space-y-8"
          variants={textVariants}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-green-100 text-green-800 px-6 py-3 rounded-full border border-green-200 shadow-sm"
            whileHover={{ scale: 1.05, backgroundColor: "rgb(220 252 231)" }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold uppercase tracking-wider">WHY CHOOSE ORGANIC?</span>
          </motion.div>

          {/* Heading */}
          <motion.h2 
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Clean Food, 
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Grown with Care
            </span>
          </motion.h2>

          {/* Description */}
          <div className="space-y-4">
            <motion.p 
              className="text-lg md:text-xl text-gray-700 leading-relaxed"
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              We farm the way nature intended — without synthetic pesticides, GMOs, or harmful chemicals. 
              By nourishing our soil and rotating our crops, we grow produce that's better for you and 
              better for the planet.
            </motion.p>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium"
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              Our organic practices mean fresher flavors, healthier meals, and a cleaner conscience.
            </motion.p>
          </div>

          {/* Features List */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4"
            variants={containerVariants}
          >
            {[
              { icon: "🌱", text: "100% Organic Certified" },
              { icon: "🚫", text: "No Synthetic Pesticides" },
              { icon: "🔄", text: "Crop Rotation" },
              { icon: "🌍", text: "Eco-Friendly Practices" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-green-200/50"
                whileHover={{ 
                  scale: 1.02, 
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 8px 25px -8px rgba(34, 197, 94, 0.3)"
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-2xl">{feature.icon}</span>
                <span className="text-gray-700 font-medium text-sm md:text-base">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div 
            className="pt-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link to='/about'>
              <motion.button
                className="group relative bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
                whileHover={{ 
                  scale: 1.05,
                  background: "linear-gradient(to right, #059669, #10b981)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                
                <span className="relative flex items-center gap-3">
                  Discover Our Story
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    →
                  </motion.span>
                </span>
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
        
        {/* Right Image Section */}
        <motion.div 
          className="lg:w-1/2 flex justify-center items-center relative"
          variants={imageVariants}
        >
          <div className="relative">
            {/* Main Image Container */}
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <img 
                src="https://i.ibb.co/XxPfZ9SK/istockphoto-2220276242-612x612.webp" 
                alt="Fresh organic farm produce from our sustainable farm"
                className="w-full h-[500px] md:h-[600px] object-cover transform hover:scale-110 transition-transform duration-700"
              />
              
              {/* Image Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
            </motion.div>

            {/* Floating Stats Card */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-2xl border border-green-200"
              initial={{ opacity: 0, y: 30, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 400 } }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">15+</div>
                <div className="text-sm text-gray-600 font-medium">Years of Organic Farming</div>
              </div>
            </motion.div>

            {/* Floating Certification Badge */}
            <motion.div
              className="absolute -top-6 -right-6 bg-yellow-400 text-white rounded-2xl p-4 shadow-2xl"
              initial={{ opacity: 0, scale: 0, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.8, type: "spring" }}
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <div className="text-center">
                <div className="text-2xl">🌿</div>
                <div className="text-xs font-bold uppercase">Certified Organic</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default OrganicFarmSection;