import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaHome, 
  FaBox, 
  FaMap, 
  FaChartBar, 
  FaInfoCircle, 
  FaPlus, 
  FaShippingFast, 
  FaMotorcycle,
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin,
  FaArrowUp,
  FaLeaf,
  FaShieldAlt,
  FaAward
} from "react-icons/fa";

const Footer = () => {
  const pages = [
    { to: "/", label: "Home", icon: FaHome },
    { to: "/productlist", label: "All Products", icon: FaBox },
    { to: "/coverage", label: "Coverage", icon: FaMap },
    { to: "/dashboard", label: "Dashboard", icon: FaChartBar },
    { to: "/about", label: "About Us", icon: FaInfoCircle },
  ];

  const categoryLinks = [
    { to: "/addproduct", label: "Add Product", icon: FaPlus },
    { to: "/sentparcel", label: "Send A Parcel", icon: FaShippingFast },
    { to: "/bearider", label: "Be A Rider", icon: FaMotorcycle },
  ];

  const [actionsOpen, setActionsOpen] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer
      className="bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-amber-500/20"></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Section */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/zpj/logo600.png"
                  alt="Varcell Graund Logo"
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-full object-cover border-2 border-amber-400 shadow-lg"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-lime-400 to-amber-400 bg-clip-text text-transparent">
                  Varcell
                  <span className="text-amber-400 ml-1 italic">Graund</span>
                </h1>
                <motion.p
                  className="text-sm text-amber-300 mt-1 flex items-center gap-1 justify-center md:justify-start"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <FaLeaf className="text-green-400" />
                  Farming since 1996
                </motion.p>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed mb-6 max-w-md">
              Your trusted partner for fresh, organic produce directly from our farms to your table. 
              Quality and sustainability at the heart of everything we do.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {[
                { icon: FaShieldAlt, text: "100% Organic", color: "text-green-400" },
                { icon: FaAward, text: "Award Winning", color: "text-amber-400" },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full border border-white/10"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <badge.icon className={`text-sm ${badge.color}`} />
                  <span className="text-xs text-gray-300">{badge.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent mb-6 flex items-center justify-center md:justify-start gap-2">
              <FaMap className="text-amber-400" />
              Quick Links
            </h2>
            <ul className="space-y-3">
              {pages.map((page, i) => (
                <motion.li
                  key={i}
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <NavLink
                    to={page.to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-400/30"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    <page.icon className="text-amber-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">{page.label}</span>
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Services Section */}
          <motion.div
            className="text-center md:text-left relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-6 flex items-center justify-center md:justify-start gap-2">
              <FaShippingFast className="text-green-400" />
              Our Services
            </h2>

            {/* Services Dropdown */}
            <div className="relative">
              <motion.button
                className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 group"
                whileHover={{ scale: 1.02 }}
                onClick={() => setActionsOpen((prev) => !prev)}
              >
                <span className="flex items-center gap-3">
                  <FaPlus className="text-green-400 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-medium">Explore Services</span>
                </span>
                <motion.span
                  animate={{ rotate: actionsOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-green-400"
                >
                  ▼
                </motion.span>
              </motion.button>

              <AnimatePresence>
                {actionsOpen && (
                  <motion.ul
                    className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl bg-gray-800/95 backdrop-blur-xl border border-white/10 overflow-hidden z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    {categoryLinks.map((link, i) => (
                      <motion.li
                        key={i}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <NavLink
                          to={link.to}
                          className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-b-0 group transition-all duration-300 ${
                              isActive
                                ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400"
                                : "text-gray-300 hover:text-white hover:bg-white/5"
                            }`
                          }
                          onClick={() => setActionsOpen(false)}
                        >
                          <link.icon className="text-green-400 group-hover:scale-110 transition-transform duration-300" />
                          <span className="font-medium">{link.label}</span>
                        </NavLink>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-semibold text-amber-300 mb-2">24/7 Support</h3>
              <p className="text-sm text-gray-400">
                Need help? Our team is always here to assist you with any inquiries.
              </p>
            </div>
          </motion.div>

          {/* Contact & Social Section */}
          <motion.div
            className="text-center md:text-left"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6 flex items-center justify-center md:justify-start gap-2">
              <FaPhone className="text-blue-400" />
              Get In Touch
            </h2>

            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <FaMapMarkerAlt className="text-red-400 text-lg" />
                <div className="text-left">
                  <p className="font-medium">1450 Greenfield Lane</p>
                  <p className="text-sm text-gray-400">Willow Creek, PA 17509, USA</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <FaPhone className="text-green-400 text-lg" />
                <div>
                  <p className="font-medium">+8801969453361</p>
                  <p className="text-sm text-gray-400">Mon-Fri, 9AM-6PM</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors duration-300">
                <FaEnvelope className="text-amber-400 text-lg" />
                <div>
                  <p className="font-medium">robinhossen8428@gmail.com</p>
                  <p className="text-sm text-gray-400">Quick response guaranteed</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-300 mb-4">Follow Us</h3>
              <div className="flex justify-center md:justify-start gap-3">
                {[
                  { icon: FaFacebook, color: "text-blue-400", href: "#" },
                  { icon: FaTwitter, color: "text-sky-400", href: "#" },
                  { icon: FaInstagram, color: "text-pink-400", href: "#" },
                  { icon: FaLinkedin, color: "text-blue-500", href: "#" },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className={`p-3 bg-white/5 rounded-xl border border-white/10 ${social.color} hover:bg-white/10 hover:scale-110 transition-all duration-300`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon className="text-lg" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Get Directions */}
            <NavLink
              to="/coverage"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FaMapMarkerAlt />
              Get Directions
            </NavLink>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <motion.div
        className="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <motion.p
              className="text-gray-400 text-sm text-center md:text-left"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              © {currentYear} <span className="text-amber-400 font-semibold">Varcell Graund</span>. 
              All rights reserved. | Made with ❤️ for fresh food lovers
            </motion.p>

            {/* Back to Top Button */}
            <motion.button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowUp className="text-sm" />
              Back to Top
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.footer>
  );
};

export default Footer;