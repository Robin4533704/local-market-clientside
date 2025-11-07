import React, { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { 
  FaHome, FaMotorcycle, FaClock, FaBox, FaCreditCard, 
  FaSearchLocation, FaUserEdit, FaChartLine, FaList, 
  FaUsers, FaProductHunt, FaBullhorn, FaShoppingCart,
  FaPlus, FaUserShield, FaUserTie, FaBars, FaTimes
} from "react-icons/fa";
import useUserRole from "../hooks/useUserRole";

const Dashboard = () => {
  const { role, roleLoading } = useUserRole();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);
  const closeDrawer = () => setDrawerOpen(false);

  if (roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const linkClass = (isActive) =>
    `px-4 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 font-medium ${
      isActive 
        ? "bg-blue-600 text-white shadow-md" 
        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
    }`;

  const sectionTitleClass = "text-xs uppercase font-bold text-gray-600 tracking-wider mt-4 mb-2 px-4";

  return (
    <div className="drawer drawer-mobile lg:drawer-open min-h-screen bg-gray-50">
      <input 
        id="dashboard-drawer" 
        type="checkbox" 
        className="drawer-toggle" 
        checked={drawerOpen} 
        onChange={toggleDrawer} 
      />

      {/* Main Content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar for mobile */}
        <header className="w-full navbar bg-white shadow-sm lg:hidden border-b">
          <div className="flex items-center justify-between w-full px-4">
            <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle">
              <FaBars className="h-5 w-5 text-gray-600" />
            </label>
            <div className="flex items-center gap-2">
              <img
                src="/zpj/logo600.png"
                alt="Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-lg font-bold text-gray-800">Dashboard</span>
            </div>
            <div className="w-8"></div> {/* Spacer for balance */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" onClick={closeDrawer}></label>
        <aside className="menu p-4 w-80 min-h-full bg-white shadow-xl border-r">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 px-2">
            <Link to="/" className="flex items-center gap-3" onClick={closeDrawer}>
              <img
                src="/zpj/logo600.png"
                alt="Varcell Ground Logo"
                className="w-12 h-12 rounded-full object-cover shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-800 leading-tight">
                  Varcell
                  <span className="text-amber-500 italic ml-1">Ground</span>
                </span>
                <span className="text-xs text-gray-500">Dashboard</span>
              </div>
            </Link>
            <button 
              onClick={closeDrawer}
              className="lg:hidden btn btn-ghost btn-sm btn-circle"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          </div>

          <div className="divider my-2"></div>

          {/* Navigation Menu */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {/* Common Links */}
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => linkClass(isActive)}
                  onClick={closeDrawer}
                >
                  <FaHome className="text-lg" /> 
                  Dashboard Home
                </NavLink>
              </li>

              {/* User Specific Menu */}
              {role === "user" && (
                <>
                  <li>
                    <div className={sectionTitleClass}>Shopping & Watchlist</div>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/price-trends" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaChartLine /> 
                      Price Trends
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/watchlist" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaList /> 
                      Manage Watchlist
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/orderlist" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaShoppingCart /> 
                      My Orders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/myparcels" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaBox /> 
                      My Parcels
                    </NavLink>
                  </li>
                </>
              )}

              {/* Vendor Specific Menu */}
              {role === "vendor" && (
                <>
                  <li>
                    <div className={sectionTitleClass}>Vendor Management</div>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/addproductvandor" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaPlus /> 
                      Add Product
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/myproductvandor" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaProductHunt /> 
                      My Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/add-advertisement" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaBullhorn /> 
                      Create Advertisement
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/my-advertisements" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaChartLine /> 
                      My Advertisements
                    </NavLink>
                  </li>
                </>
              )}

              {/* Rider Specific Menu */}
              {role === "rider" && (
                <>
                  <li>
                    <div className={sectionTitleClass}>Delivery Management</div>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/pending-deliveries" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaClock /> 
                      Pending Deliveries
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/completed-deliveries" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaMotorcycle /> 
                      Completed Deliveries
                    </NavLink>
                  </li>
                </>
              )}

              {/* Admin Specific Menu */}
              {role === "admin" && (
                <>
                  <li>
                    <div className={sectionTitleClass}>Administration</div>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/active-riders" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaMotorcycle /> 
                      Active Riders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/pending-riders" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaClock /> 
                      Pending Riders
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/assign-riders" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaUserTie /> 
                      Assign Rider
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/make-vendor" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaUserShield /> 
                      Make Vendor
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/makeadmin" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaUserShield /> 
                      Make Admin
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/adminuserall" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaUsers /> 
                      All Users
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/AdminAllProducts" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaProductHunt /> 
                      All Products
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/AdminAllAdvertisements" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaBullhorn /> 
                      All Advertisements
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/dashboard/AdminAllOrders" 
                      className={({ isActive }) => linkClass(isActive)}
                      onClick={closeDrawer}
                    >
                      <FaShoppingCart /> 
                      All Orders
                    </NavLink>
                  </li>
                </>
              )}

              {/* Common Features for All Roles */}
              <li>
                <div className={sectionTitleClass}>Services</div>
              </li>
              <li>
                <NavLink 
                  to="/dashboard/tracking" 
                  className={({ isActive }) => linkClass(isActive)}
                  onClick={closeDrawer}
                >
                  <FaSearchLocation /> 
                  Track Package
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/dashboard/updateprofile" 
                  className={({ isActive }) => linkClass(isActive)}
                  onClick={closeDrawer}
                >
                  <FaUserEdit /> 
                  Update Profile
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="pt-6 mt-6 border-t">
            <div className="text-center text-sm text-gray-500">
              <p>Logged in as: <span className="font-semibold text-blue-600 capitalize">{role}</span></p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;