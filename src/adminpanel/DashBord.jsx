import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  FaHome, FaMotorcycle, FaClock, FaBox, FaCreditCard, 
  FaSearchLocation, FaUserEdit, FaChartLine, FaList, 
  FaUsers, FaProductHunt, FaBullhorn, FaShoppingCart
} from "react-icons/fa";
import Profileslogo from "../pages/home/banner/Profileslogo";
import useUserRole from "../hooks/useUserRole";

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (roleLoading) return <div>Loading...</div>;

  const linkClass = (isActive) =>
    `px-4 py-2 rounded-md flex items-center gap-2 ${
      isActive ? "bg-blue-600 text-white" : "text-gray-800 hover:bg-gray-200"
    }`;

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen">
      <input 
        id="dashboard-drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={drawerOpen} 
        onChange={() => setDrawerOpen(!drawerOpen)} 
      />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar for small screens */}
        <div className="w-full navbar bg-lime-300 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 stroke-current" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
          <div className="ml-2 text-lg font-semibold flex-1">Dashboard</div>
        </div>

        {/* Outlet for nested routes */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 min-h-full bg-lime-500 text-base-content">
          <Profileslogo />

          {/* Home */}
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => linkClass(isActive)}>
              <FaHome /> Home
            </NavLink>
          </li>

          {/* User Links */}
          {role === "user" && (
            <>
              <li className="mt-2 font-semibold text-gray-200">Shop & Watchlist</li>
              <li>
                <NavLink to="/dashboard/price-trends" className={({ isActive }) => linkClass(isActive)}>
                  <FaChartLine /> Price Trends
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/watchlist" className={({ isActive }) => linkClass(isActive)}>
                  <FaList /> Manage Watchlist
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/orderlist" className={({ isActive }) => linkClass(isActive)}>
                  <FaBox /> My Orders
                </NavLink>
              </li>
               <li>
            <NavLink to="/dashboard/myparcels" className={({ isActive }) => linkClass(isActive)}>
              <FaBox /> My Parcels
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/payment-history" className={({ isActive }) => linkClass(isActive)}>
              <FaCreditCard /> Payment History
            </NavLink>
          </li>
            </>
          )}

          {/* Parcel / Payment / Tracking */}
         
          <li>
            <NavLink to="/dashboard/tracking" className={({ isActive }) => linkClass(isActive)}>
              <FaSearchLocation /> Track A Package
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/updateprofile" className={({ isActive }) => linkClass(isActive)}>
              <FaUserEdit /> Update Profile
            </NavLink>
          </li>

          {/* Vendor Links */}
          {role === "vendor" && (
            <>
              <li className="mt-2 font-semibold text-gray-200">Vendor Dashboard</li>
              <li>
                <NavLink to="/dashboard/addproductvandor" className={({ isActive }) => linkClass(isActive)}>
                  ➕ Add Product
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/myproductvandor" className={({ isActive }) => linkClass(isActive)}>
                  📄 My Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/add-advertisement" className={({ isActive }) => linkClass(isActive)}>
                  📢 Add Advertisement
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/my-advertisements" className={({ isActive }) => linkClass(isActive)}>
                  📊 My Advertisements
                </NavLink>
              </li>
            </>
          )}

          {/* Rider Links */}
          {role === "rider" && (
            <>
              <li>
                <NavLink to="/dashboard/pending-deliveries" className={({ isActive }) => linkClass(isActive)}>
                  📦 Pending Deliveries
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/completed-deliveries" className={({ isActive }) => linkClass(isActive)}>
                  ✅ Completed Deliveries
                </NavLink>
              </li>
            </>
          )}

          {/* Admin Links */}
          {role === "admin" && (
            <>
              <li>
                <NavLink to="/dashboard/active-riders" className={({ isActive }) => linkClass(isActive)}>
                  <FaMotorcycle /> Active Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/make-vendor" className={({ isActive }) => linkClass(isActive)}>
                  🔑 Make Vendor
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/pending-riders" className={({ isActive }) => linkClass(isActive)}>
                  <FaClock /> Pending Riders
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/assign-riders" className={({ isActive }) => linkClass(isActive)}>
                  🛵 Assign Rider
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/makeadmin" className={({ isActive }) => linkClass(isActive)}>
                  🔑 Make Admin
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/adminuserall" className={({ isActive }) => linkClass(isActive)}>
                  <FaUsers /> All Users
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/AdminAllProducts" className={({ isActive }) => linkClass(isActive)}>
                  <FaProductHunt /> All Products
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/AdminAllAdvertisements" className={({ isActive }) => linkClass(isActive)}>
                  <FaBullhorn /> All Advertisements
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard/AdminAllOrders" className={({ isActive }) => linkClass(isActive)}>
                  <FaShoppingCart /> All Orders
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
