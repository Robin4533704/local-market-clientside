import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Works = () => {
  const navigate = useNavigate();

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

  const stepVariants = {
    offscreen: { 
      opacity: 0, 
      y: 60,
      scale: 0.9
    },
    onscreen: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { 
        type: "spring", 
        bounce: 0.4, 
        duration: 0.8 
      },
    },
  };

  const steps = [
    {
      number: 1,
      title: "Shop What's In Season",
      description: "Browse our curated selection of freshly harvested organic produce, premium pantry staples, and farm-made specialty goods — all sustainably grown and carefully packed right here on our family farm.",
      image: "/zpj/works1.jpg",
      icon: "🛒"
    },
    {
      number: 2,
      title: "Choose Delivery or Pickup",
      description: "Select between convenient home delivery or local pickup at our farm stand. Subscribe to our weekly Farm Box for a rotating selection of seasonal favorites delivered automatically.",
      image: "/zpj/works2.jpg",
      icon: "🚚"
    },
    {
      number: 3,
      title: "Enjoy Farm-Fresh Quality",
      description: "Experience the pure taste of organic, sustainable food grown with care and delivered straight from our soil to your table — exactly as nature intended.",
      image: "/zpj/works3.jpg",
      icon: "🌟"
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-lime-500 py-16 px-4 md:px-8 lg:px-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-lime-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <motion.div
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-4">
          <span className="w-2 h-2 bg-white rounded-full"></span>
          <span className="text-white/90 text-sm font-medium uppercase tracking-wider">Process</span>
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          How It <span className="text-yellow-300">Works</span>
        </h2>
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
          Experience the simplicity of farm-fresh delivery in three easy steps
        </p>
      </motion.div>

      {/* Steps Container */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="offscreen"
        whileInView="onscreen"
        viewport={{ once: true, amount: 0.3 }}
      >
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            className="group relative"
            variants={stepVariants}
            whileHover={{ 
              y: -8,
              transition: { type: "spring", stiffness: 300 }
            }}
          >
            {/* Connection Lines */}
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-20 left-1/2 w-full h-0.5 bg-white/30 z-0">
                <div className="absolute inset-0 bg-yellow-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            )}

            {/* Step Card */}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 h-full border border-white/20 shadow-2xl group-hover:bg-white/15 group-hover:border-white/30 transition-all duration-500">
              
              {/* Number Badge */}
              <motion.div
                className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white"
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { type: "spring", stiffness: 400 }
                }}
              >
                <span className="text-white font-bold text-xl">{step.number}</span>
              </motion.div>

              {/* Icon */}
              <motion.div
                className="text-4xl mb-6 text-center"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {step.icon}
              </motion.div>

              {/* Image */}
              <motion.div
                className="relative mb-6 mx-auto w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white/50 group-hover:border-yellow-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  src={step.image}
                  alt={`Step ${step.number}`}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </motion.div>

              {/* Content */}
              <div className="text-center space-y-4">
                <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-white/80 leading-relaxed text-sm md:text-base">
                  {step.description}
                </p>
              </div>

              {/* Hover Effect Glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/10 group-hover:to-amber-400/5 transition-all duration-500 pointer-events-none"></div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="text-center mt-16 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        <motion.button
          onClick={() => navigate("/productlist")}
          className="group relative bg-gradient-to-r from-yellow-400 to-amber-500 text-white font-bold text-lg px-12 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden"
          whileHover={{ 
            scale: 1.05,
            y: -2
          }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Button Shine Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          
          <span className="relative flex items-center gap-3">
            Start Shopping Now
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              →
            </motion.span>
          </span>
        </motion.button>

        {/* Trust Badge */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-4 text-white/70"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-300">★</span>
            ))}
          </div>
          <span className="text-sm">Trusted by 10,000+ happy customers</span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Works;