import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingBag, FiArrowRight, FiStar, FiTruck, FiUsers, FiAward } from 'react-icons/fi';

import banner1 from "../../../assets/images/beautiful-street-market-sunset.jpg";
import banner2 from "../../../assets/images/istockphoto-1941134987-612x612.webp";
import banner3 from "../../../assets/images/side-view-women-shopping-groceries.jpg";

const slides = [
  {
    img: banner1,
    title: "Welcome to Farmer Market",
    subtitle: "Taste the freshness direct from local farms",
    description: "Experience farm-fresh products delivered directly from local farmers to your doorstep",
    features: ["Fresh Daily", "Local Farmers", "100% Organic"],
    buttonText: "Shop Fresh",
    gradient: "from-orange-500/80 to-red-600/80"
  },
  {
    img: banner2,
    title: "Organic & Pure",
    subtitle: "Healthier choices for your family and home", 
    description: "Nourish your body with chemical-free, nutrient-rich organic products",
    features: ["Chemical Free", "Nutrient Rich", "Eco Friendly"],
    buttonText: "Explore Organic",
    gradient: "from-green-500/80 to-emerald-600/80"
  },
  {
    img: banner3,
    title: "Join Our Community", 
    subtitle: "Support sustainable, small-scale farmers",
    description: "Be part of a movement that values quality, sustainability and community growth",
    features: ["Direct Support", "Sustainable", "Community Driven"],
    buttonText: "Join Now",
    gradient: "from-purple-500/80 to-pink-600/80"
  },
];

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto slide change
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // Animation variants
  const slideVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="relative w-full overflow-hidden pt-16 lg:pt-20">
      {/* Main Carousel Container */}
      <div className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[900px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Gradient Overlay */}
            <div className="relative w-full h-full">
              <motion.img
                src={slides[currentSlide].img}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 10, ease: "easeOut" }}
              />
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient} backdrop-blur-[1px]`} />
              
              {/* Dark Overlay for Better Text Readability */}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center">
              <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <motion.div
                  variants={staggerVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-center lg:text-left text-white space-y-6 lg:space-y-8 max-w-4xl mx-auto lg:mx-0"
                >
                  {/* Badge */}
                  <motion.div
                    variants={textVariants}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                  >
                    <FiStar className="text-yellow-300 text-sm" />
                    <span className="text-sm font-semibold">Premium Quality Guaranteed</span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    variants={textVariants}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight drop-shadow-2xl"
                  >
                    {slides[currentSlide].title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.h2
                    variants={textVariants}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white/95 leading-relaxed drop-shadow-xl"
                  >
                    {slides[currentSlide].subtitle}
                  </motion.h2>

                  {/* Description */}
                  <motion.p
                    variants={textVariants}
                    className="text-lg sm:text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto lg:mx-0 drop-shadow-lg"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  {/* Features */}
                  <motion.div
                    variants={staggerVariants}
                    className="flex flex-wrap justify-center lg:justify-start gap-3"
                  >
                    {slides[currentSlide].features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        variants={featureVariants}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white text-sm font-medium drop-shadow-md">{feature}</span>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* CTA Buttons */}
                  <motion.div
                    variants={textVariants}
                    className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4"
                  >
                    <Link to="/productlist" className="inline-block">
                      <motion.button
                        whileHover={{ 
                          scale: 1.05,
                          boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300"
                      >
                        <FiShoppingBag className="text-lg" />
                        <span className="text-lg">{slides[currentSlide].buttonText}</span>
                        <FiArrowRight className="text-lg" />
                      </motion.button>
                    </Link>

                    <Link to="/coverage" className="inline-block">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-2xl shadow-lg hover:bg-white/30 transition-all duration-300"
                      >
                        <FiTruck className="text-lg" />
                        <span>Check Coverage</span>
                      </motion.button>
                    </Link>
                  </motion.div>

                  {/* Stats - Mobile & Desktop */}
                  <motion.div
                    variants={textVariants}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8 max-w-2xl mx-auto lg:mx-0"
                  >
                    {[
                      { number: "500+", label: "Happy Farmers", icon: FiUsers },
                      { number: "10K+", label: "Products", icon: FiShoppingBag },
                      { number: "50+", label: "Cities", icon: FiTruck },
                      { number: "99%", label: "Satisfaction", icon: FiAward }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        variants={featureVariants}
                        className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 group hover:bg-white/20 transition-all duration-300"
                        whileHover={{ y: -5 }}
                      >
                        <stat.icon className="text-2xl text-white mb-2 mx-auto" />
                        <div className="text-2xl font-bold text-white mb-1 drop-shadow-md">{stat.number}</div>
                        <div className="text-white/80 text-sm drop-shadow-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 sm:p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 sm:gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={`rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white w-6 sm:w-8 h-2 sm:h-3' 
                  : 'bg-white/50 hover:bg-white/80 w-2 sm:w-3 h-2 sm:h-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-10">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ 
              duration: 5, 
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop"
            }}
            key={currentSlide}
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;