import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navber from '../pages/shear/navber/Navber';
import Footer from '../pages/shear/navber/footer/Footer';
import Farmers from '../pages/home/Farmers';
import { io } from "socket.io-client";


const socket = io("https://daily-local-market-server.vercel.app", {
  transports: ["websocket", "polling"],
  withCredentials: true
});

const RootLayout = () => {
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to socket server:", socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <Navber />
      <Outlet />
      <Farmers />
      <Footer />
    </div>
  );
};

export default RootLayout;
