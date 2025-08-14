import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Profileslogo from '../home/banner/Profileslogo';
import { FaHome,FaMotorcycle, FaClock, FaBox, FaCreditCard, FaSearchLocation, FaUserEdit } from 'react-icons/fa';
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
           <li>
    <NavLink to="/dashboard" className="flex items-center gap-2">
      <FaHome /> Home
    </NavLink>
  </li>
  <li>
    <NavLink to="/dashboard/myparcels" className="flex items-center gap-2">
      <FaBox /> My Parcels
    </NavLink>
  </li>
  <li>
    <NavLink to="/dashboard/payment-history" className="flex items-center gap-2">
      <FaCreditCard /> Payment History
    </NavLink>
  </li>
  <li>
    <NavLink to="/dashboard/tracking" className="flex items-center gap-2">
      <FaSearchLocation /> Track A Package
    </NavLink>
  </li>
  <li>
    <NavLink to="/dashboard/updateprofile" className="flex items-center gap-2">
      <FaUserEdit /> Update Profiles
    </NavLink>
  </li>
  {/* New Links for Riders */}
<li>
  <NavLink to="/dashboard/active-riders" className="flex items-center gap-2">
    <FaMotorcycle /> Active Riders
  </NavLink>
</li>
<li>
  <NavLink to="/dashboard/pending-riders" className="flex items-center gap-2">
    <FaClock /> Pending Riders
  </NavLink>
</li>
        </ul>
      </div>
    </div>
  );
};

export default DashBord;
