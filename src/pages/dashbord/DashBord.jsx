import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Profileslogo from '../home/banner/Profileslogo';

const DashBord = () => {
  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300 lg:hidden">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <div className="ml-2 text-lg font-semibold">Dashboard</div>
        </div>

        {/* Main Page Content */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-base-200 text-base-content">
          <Profileslogo />
          <li><NavLink to="">Home</NavLink></li>
          <li><NavLink to="/dashboard/myparcels">My Parcels</NavLink></li>
        </ul>
      </div>
    </div>
  );
};

export default DashBord;
