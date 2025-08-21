import React from 'react';
import { NavLink } from 'react-router-dom'; // ✅ Correct import
import Profileslogo from '../../../home/banner/Profileslogo';

const Footer = () => {
  const pages = <>
        <li><NavLink to='/'  className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-lime-600 text-white" : " text-yellow-300  hover:bg-blue-400"
              }`
            }>Home</NavLink></li>
        <li><NavLink to='/coverage' className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-lime-600 text-white" : " text-yellow-300  hover:bg-blue-400"
              }`
            }>Coverage</NavLink></li>
        <li><NavLink to='/sentparsel'  className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-lime-600 text-white" : " text-yellow-300  hover:bg-blue-400"
              }`
            }>Sent A Parcel</NavLink></li>
        <li><NavLink to='/dashboard'  className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-lime-600 text-white" : " text-yellow-300  hover:bg-blue-400"
              }`
            }>Dashboard</NavLink></li>
        <li><NavLink to='/beaider'  className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-lime-600 text-white" : " text-yellow-300  hover:bg-blue-400"
              }`
            }>BeARider</NavLink></li>
        <li><NavLink to='/about'  className={({ isActive }) =>
              `px-4 py-2 rounded-md ${
                isActive ? "bg-lime-600 text-white" : " text-yellow-300 hover:bg-blue-400"
              }`
            }>About Us</NavLink></li>
      </>

  return (
    <footer className="bg-lime-600 text-gray-400 py-16 md:py-24">
  <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 px-4">
    
    {/* LOGO */}
    <div className="text-center md:text-left">
      <Profileslogo />
      <p className="text-sm italic text-yellow-400 mt-2">Farming since 1996</p>
    </div>

    {/* PAGES */}
    <div className="text-center md:text-left">
      <h2 className="text-lg font-semibold text-yellow-300 mb-4">PAGES</h2>
      <ul className="space-y-2 font-bold text-white">
        {pages}
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
      <p className="mt-4 font-semibold text-white">+34 649 74 54 70</p>
      <p>example@organics.com</p>
    </div>

  </div>
</footer>

  );
};

export default Footer;
