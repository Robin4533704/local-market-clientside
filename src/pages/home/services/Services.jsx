import React from "react";
import { FaBoxOpen, FaClipboardList, FaHandshake, FaLeaf, FaTruck, FaHome, FaRecycle } from "react-icons/fa";
import { motion } from "framer-motion";

const services = [
  {
    icon: FaHome,
    title: "Family-Owned & Operated",
    desc: "We've been growing with care for generations, right here on our land with traditional farming wisdom.",
    gradient: "from-orange-400 to-amber-500",
    bgGradient: "from-orange-50 to-amber-100",
    delay: 0.1
  },
  {
    icon: FaBoxOpen,
    title: "Seasonal Farm Boxes",
    desc: "Get a rotating selection of what's fresh, local, and in-season. Curated boxes delivered weekly.",
    gradient: "from-green-500 to-emerald-600",
    bgGradient: "from-green-50 to-emerald-100",
    delay: 0.2
  },
  {
    icon: FaRecycle,
    title: "Sustainable & Eco-Friendly",
    desc: "We use regenerative farming methods, organic practices, and minimal packaging for a greener future.",
    gradient: "from-blue-500 to-cyan-600",
    bgGradient: "from-blue-50 to-cyan-100",
    delay: 0.3
  },
  {
    icon: FaTruck,
    title: "Delivered to Your Door",
    desc: "Convenient local delivery and pickup options make eating fresh, healthy food effortless for you.",
    gradient: "from-purple-500 to-pink-600",
    bgGradient: "from-purple-50 to-pink-100",
    delay: 0.4
  },
];

const Services = () => (
  <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
    {/* Background Elements */}
    <div className="absolute top-0 left-0 w-72 h-72 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    <div className="absolute bottom-0 right-0 w-72 h-72 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4"
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <FaLeaf className="text-green-600" />
          Why Choose Us
        </motion.div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Farm-Fresh <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-amber-600">Excellence</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Experience the difference of truly fresh, locally grown produce delivered with care and commitment to quality.
        </p>
      </motion.div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            className="group relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: service.delay }}
            whileHover={{ y: -10 }}
          >
            {/* Card */}
            <div className="relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Icon Container */}
                <motion.div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} text-white shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}
                  whileHover={{ rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <service.icon className="w-7 h-7" />
                </motion.div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300">
                  {service.desc}
                </p>

                {/* Hover Arrow */}
                <motion.div
                  className="mt-6 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300"
                  initial={false}
                >
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${service.gradient} flex items-center justify-center`}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>

            {/* Floating Elements */}
            <motion.div
              className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r ${service.gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: idx * 0.5 }}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="text-center mt-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-green-50 to-amber-50 rounded-2xl p-8 border border-green-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Experience Freshness?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their daily fresh produce needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Subscription
            </motion.button>
            <motion.button
              className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-green-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Stats Bar */}
    <motion.div
      className="mt-20 bg-gradient-to-r from-green-600 to-amber-600 text-white py-8"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { number: "50+", label: "Local Farms" },
            { number: "10K+", label: "Happy Customers" },
            { number: "100%", label: "Organic Certified" },
            { number: "24/7", label: "Fresh Delivery" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 + idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">{stat.number}</div>
              <div className="text-green-100 font-medium drop-shadow-md">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  </section>
);

export default Services;