// Footer.jsx
import React from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { NavLink } from 'react-router';
import Profileslogo from '../../../home/banner/Profileslogo';

const Footer = () => {
  const pages =<>
  <li><NavLink to="/">Home</NavLink></li>
  <li><NavLink to="/about">About Us</NavLink></li>
  <li><NavLink>Services</NavLink></li>
  <li><NavLink>Contacts</NavLink></li>
  </>

  return (
    <footer className="bg-lime-800 text-gray-100 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        
        {/* LOGO */}
         <div >
            <Profileslogo/>
        <p className="text-sm italic ml-18 -mt-2 ">Farming since 1996</p>
      
               </div>
      

        {/* PAGES */}
        <div>
          <h2 className="text-lg font-semibold mb-4">PAGES</h2>
          <ul className="space-y-2 font-bold">
           {pages}
          </ul>
        </div>

        {/* CONTACTS */}
        <div>
          <h2 className="text-lg font-semibold mb-4">CONTACTS</h2>
          <p>1450 Greenfield Lane</p>
          <p>Willow Creek, PA 17509, USA</p>
          <a href="https://maps.google.com" className="inline-flex items-center text-yellow-300 hover:text-yellow-400 mt-2">
            Get Directions <FaArrowRight className="ml-2"/>
          </a>
          <p className="mt-4 font-semibold text-white">+34 649 74 54 70</p>
          <p>example@organics.com</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
