import React from 'react';
import { Outlet } from 'react-router';
import Navber from '../pages/shear/navber/Navber';
import Footer from '../pages/shear/navber/footer/Footer';
import Farmers from '../pages/home/Farmers';


const RootLayout = () => {
    return (
        <div>
            <Navber/>
            <Outlet/>
            <Farmers/>
            <Footer/>
         
        </div>
    );
};

export default RootLayout;