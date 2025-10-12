import React from 'react';
import { Outlet } from 'react-router-dom';
import Navber from '../pages/shear/navber/Navber';
import Footer from '../pages/shear/navber/footer/Footer';




const RootLayout = () => {


  return (
    <div>
      <Navber />
      <Outlet />
     
      <Footer />
    </div>
  );
};

export default RootLayout;
