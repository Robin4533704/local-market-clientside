import React from 'react';
import { Outlet } from 'react-router';

const AuthLayout = () => {
  return (
    <div className="p-4 bg-base-200 min-h-screen">
  <div className="hero-content flex-col lg:flex-row-reverse">
   <div className='flex-1'>
     <img
      src="/zpj/auth.png"
      className="max-w-sm rounded-lg shadow-2xl"
    />
   </div>
    <div className='flex-1'>
  <Outlet/>
    </div>
  </div>
</div>
  );
};

export default AuthLayout;