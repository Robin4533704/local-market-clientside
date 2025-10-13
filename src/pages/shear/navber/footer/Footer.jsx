import React, { useState } from "react";
import { NavLink } from "react-router-dom"; 
import Profileslogo from '../../../home/banner/Profileslogo';
import { motion, AnimatePresence } from "framer-motion";

const Footer = () => {
  const pages = [
    { to: "/", label: "Home" },
    { to: "/productlist/:id", label: "All Products" },
    { to: "/coverage", label: "Coverage" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/about", label: "About Us" },
  ];

  const categoryLinks = [
    { to: "/addproduct", label: "Add Product" },
    { to: "/sentparsel", label: "Sent A Parcel" },
    { to: "/beaider", label: "BeARider" },
  ];

  const [actionsOpen, setActionsOpen] = useState(false);

  return (
    <motion.footer
      className="bg-gray-700 text-gray-400 py-16 md:py-24"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
        
        {/* LOGO */}
        <div className="text-center md:text-left">
          <Profileslogo />
          <p className="text-sm italic text-yellow-400 mt-2">Farming since 1996</p>
        </div>

        {/* PAGES */}
        <div className="text-center md:text-left relative">
          <h2 className="text-lg font-semibold text-yellow-300 mb-4">PAGES</h2>
          <ul className="space-y-2 font-bold text-white">
            {pages.map((page, i) => (
              <motion.li key={i} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                <NavLink
                  to={page.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md ${isActive ? "bg-lime-600 text-white" : "text-yellow-300 "}`
                  }
                >
                  {page.label}
                </NavLink>
              </motion.li>
            ))}
          </ul>

          {/* Actions Dropdown */}
          <ul className="relative">
            <motion.button
              className="px-4 list-none py-2 rounded-md hover:text-white text-amber-300 font-semibold"
              whileHover={{ scale: 1.05 }}
              onClick={() => setActionsOpen(prev => !prev)}
            >
              Actions
            </motion.button>

            <AnimatePresence>
              {actionsOpen && (
                <motion.ul
                  className="absolute right-0 bottom-full mb-2 rounded shadow-lg w-48 z-50 bg-gray-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, staggerChildren: 0.1 }}
                >
                  {categoryLinks.map((link, i) => (
                    <motion.li key={i} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 300 }}>
                      <NavLink
                        to={link.to}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-sm ${isActive ? " text-white" : "text-amber-300 hover:bg-sky-700"}`
                        }
                        onClick={() => setActionsOpen(false)} // close dropdown on click
                      >
                        {link.label}
                      </NavLink>
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </ul>
        </div>

        {/* CONTACTS */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-semibold text-yellow-300 mb-4">CONTACTS</h2>
          <p>1450 Greenfield Lane</p>
          <p>Willow Creek, PA 17509, USA</p>
          <NavLink
            to="/coverage"
            className="inline-flex items-center text-yellow-300 hover:text-yellow-400 mt-2"
          >
            Get Directions
          </NavLink>
          <p className="mt-4 font-semibold text-white">+8801969453361</p>
          <p>robinhossen8428@gmail.com</p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
