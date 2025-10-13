import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navber from '../pages/shear/navber/Navber';
import Footer from '../pages/shear/navber/footer/Footer';

const RootLayout = () => {
  const location = useLocation();


  const noNavFooter = ['/login', '/register'];

  return (
    <div>
      {!noNavFooter.includes(location.pathname) && <Navber />}
      <Outlet />
      {!noNavFooter.includes(location.pathname) && <Footer />}
    </div>
  );
};

export default RootLayout;
