import React from "react";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

const LogoMarquee = () => {
  const logos = [
    { src: "/zpj/logo1.jpg", alt: "Organic Farm Partner" },
    { src: "/zpj/logo8.jpg", alt: "Sustainable Agriculture" },
    { src: "/zpj/logo3.jpg", alt: "Eco Certification" },
    { src: "/zpj/logo4.jpg", alt: "Local Business Association" },
    { src: "/zpj/logo5.jpg", alt: "Quality Assurance" },
    { src: "/zpj/logo6.jpg", alt: "Farm Fresh Partner" },
    { src: "/zpj/logo7.jpg", alt: "Organic Certification" },
    { src: "/zpj/logo9.jpg", alt: "Sustainable Partner" },
    { src: "/zpj/logo10.jpg", alt: "Local Grower" },
    { src: "/zpj/logo11.jpg", alt: "Quality Partner" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.8
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-50 to-white py-16 md:py-20 overflow-hidden border-y border-gray-200">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-lime-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-gray-200 shadow-sm mb-6"
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 1)" }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Trusted By Industry Leaders</span>
        </motion.div>
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Proud Partners</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Collaborating with the finest brands and organizations to deliver exceptional quality
        </p>
      </motion.div>

      {/* Main Marquee Container */}
      <div className="relative max-w-7xl mx-auto px-4">
        
        {/* First Marquee - Left to Right */}
        <motion.div
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Marquee 
            gradient={true} 
            gradientColor={[248, 250, 252]}
            gradientWidth={100}
            speed={50}
            pauseOnHover={true}
            className="py-4"
          >
            {logos.slice(0, 5).map((logo, index) => (
              <motion.div
                key={index}
                className="mx-6 lg:mx-8 relative group"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-2xl group-hover:border-green-200 transition-all duration-500">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-20 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                  />
                  
                  {/* Hover Effect Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </Marquee>
        </motion.div>

        {/* Second Marquee - Right to Left */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Marquee 
            direction="right"
            gradient={true} 
            gradientColor={[248, 250, 252]}
            gradientWidth={100}
            speed={45}
            pauseOnHover={true}
            className="py-4"
          >
            {logos.slice(5).map((logo, index) => (
              <motion.div
                key={index + 5}
                className="mx-6 lg:mx-8 relative group"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.1,
                  y: -5,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <div className="relative bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group-hover:shadow-2xl group-hover:border-green-200 transition-all duration-500">
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    className="h-20 w-auto object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                  />
                  
                  {/* Hover Effect Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 to-emerald-500/0 group-hover:from-green-500/5 group-hover:to-emerald-500/5 transition-all duration-500 pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </Marquee>
        </motion.div>

        {/* Decorative Dots Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-10 w-2 h-2 bg-green-300 rounded-full opacity-30"></div>
          <div className="absolute top-12 right-20 w-1 h-1 bg-emerald-300 rounded-full opacity-40"></div>
          <div className="absolute bottom-8 left-1/4 w-1 h-1 bg-lime-300 rounded-full opacity-50"></div>
          <div className="absolute bottom-16 right-1/3 w-2 h-2 bg-green-400 rounded-full opacity-20"></div>
        </div>
      </div>

      {/* Bottom Trust Badge */}
      <motion.div
        className="text-center mt-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl border border-gray-200 shadow-lg">
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-xl">★</span>
            ))}
          </div>
          <span className="text-gray-700 font-semibold">Trusted by 10,000+ Customers Worldwide</span>
        </div>
      </motion.div>
    </section>
  );
};

export default LogoMarquee;