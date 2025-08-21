import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import Profileslogo from "../home/banner/Profileslogo";
import { FaHome, FaMotorcycle, FaClock, FaBox, FaCreditCard, FaSearchLocation, FaUserEdit } from "react-icons/fa";
import useUserRole from "../../hooks/useUserRole";


const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
  console.log("user role:", role)
  if (roleLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        <div className="w-full navbar bg-lime-300 lg:hidden">
          <label htmlFor="my-drawer-2" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <div className="ml-2 text-lg font-semibold">Dashboard</div>
        </div>

        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-lime-500 text-base-content">
          <Profileslogo />

          <li>
            <NavLink to="/dashboard" className="text-white flex items-center gap-2">
              <FaHome /> Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/myparcels"
              className={({ isActive }) => `px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"}`}
            >
              <FaBox /> My Parcels
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/payment-history"
              className={({ isActive }) => `px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"}`}
            >
              <FaCreditCard /> Payment History
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/tracking"
              className={({ isActive }) => `px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"}`}
            >
              <FaSearchLocation /> Track A Package
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/updateprofile"
              className={({ isActive }) => `px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"}`}
            >
              <FaUserEdit /> Update Profiles
            </NavLink>
          </li>

          {/* Admin-only links */}
          {!roleLoading && role === "admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/active-riders"
                  className={({ isActive }) => `px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                >
                  <FaMotorcycle /> Active Riders
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/pending-riders"
                  className={({ isActive }) => `px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                >
                  <FaClock /> Pending Riders
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/makeadmin"
                  className={({ isActive }) => `px-4 py-2 rounded-md ${isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"}`}
                >
                  🔑 Make Admin
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
