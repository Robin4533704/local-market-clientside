import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Works = () => {
  const navigate = useNavigate();

  const stepVariants = {
    offscreen: { opacity: 0, y: 50 },
    onscreen: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.3, duration: 0.6 },
    },
  };

  return (
    <div className="bg-lime-500 py-10 px-4">
      {/* হেডার */}
      <motion.h2
        className="text-3xl font-semibold text-white text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        HOW IT WORKS
      </motion.h2>

      {/* ধাপগুলো */}
      <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-7xl mx-auto">
        {[1, 2, 3].map((step) => (
          <motion.div
            key={step}
            className="flex-1 rounded-lg p-6 relative text-center bg-lime-400/30"
            variants={stepVariants}
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* নম্বর circle */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg text-white">
              {step}
            </div>

            {/* ছবি */}
            <motion.div
              className="flex justify-center mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 120 }}
            >
              <img
                src={`/zpj/works${step}.jpg`}
                alt={`Step ${step}`}
                className="w-36 h-36 object-cover rounded-full mx-auto"
              />
            </motion.div>

            {/* শিরোনাম */}
            <h3 className="text-xl text-black font-semibold mb-2">
              {step === 1
                ? "Shop What’s In Season"
                : step === 2
                ? "Choose Delivery or Pickup"
                : "Enjoy Real Food, Grown with Love"}
            </h3>

            {/* বর্ণনা */}
            <p className="text-white text-sm">
              {step === 1
                ? "Browse our selection of freshly harvested produce, pantry staples, and farm-made goods — all grown and packed right here on our farm."
                : step === 2
                ? "Get your order delivered to your door or pick it up locally at our farm stand. You can also subscribe to our weekly Farm Box for a rotating mix of seasonal favorites."
                : "Cook with confidence knowing your food is organic, sustainable, and straight from our soil – just the way nature intended."}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Start Shopping Button */}
      <motion.div
        className="mt-8 flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.button
          onClick={() => navigate("/productlist")}
          className="bg-yellow-400 text-white font-semibold px-6 py-3 rounded-full hover:bg-yellow-500 transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          Start Shopping
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Works;
