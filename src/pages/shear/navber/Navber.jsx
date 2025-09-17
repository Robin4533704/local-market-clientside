import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Profileslogo from '../../home/banner/Profileslogo';
import UseAuth from '../../../hooks/UseAuth';
import defaultImage from '../../../assets/images/download.png';
import NotificationsBall from '../../home/banner/NotificationsBall';

const Navber = () => {
  const { user, logOut } = UseAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/productlist", label: "All Products" },
    { to: "/addproduct", label: "Add Products" },
    { to: "/coverage", label: "Coverage" },
    { to: "/sentparsel", label: "Sent A Parcel" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/beaider", label: "BeARider" },
    
  ];

  return (
    <div className="navbar max-w-7xl mx-auto shadow-sm text-white px-4 fixed rounded-xl w-full z-50 bg-gray-900">
      
      {/* Left Logo */}
      <div className="navbar-start">
        <Profileslogo />
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-bold gap-3">
          {links.map((link, i) => (
            <li key={i}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md ${
                    isActive
                      ? "bg-lime-600 text-white"
                      : "border text-yellow-300 hover:bg-blue-400"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Right side */}
    <div className="navbar-end flex items-center gap-3 relative">
  {/* 🔔 Notification Bell (for ALL roles) */}

 <NotificationsBall  />
 


  {user ? (
    <>
      <Link to="/updateprofile">
        <img
          src={user.photoURL || defaultImage}
          alt="Profile"
          className="h-12 w-12 rounded-full object-cover cursor-pointer"
        />
      </Link>
      <button
        onClick={handleLogout}
        className="btn btn-sm lg:block hidden bg-red-500 hover:bg-red-600 text-white"
      >
        Logout
      </button>
    </>
  ) : (
    <Link
      to="/login"
      className="btn btn-sm px-6 font-semibold py-2 bg-lime-500 hover:bg-lime-600 text-white hidden lg:block"
    > Sign In </Link>
  )}
</div>


      {/*Mobile Menu*/}
      <div className="dropdown dropdown-end block lg:hidden ml-auto">
        <div tabIndex={0} className="btn btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content mt-3 p-2 shadow text-white rounded-box w-52"
        >
          {links.map((link, i) => (
            <li key={i}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md ${
                    isActive
                      ? "bg-lime-600 text-white"
                      : "border text-yellow-300 hover:bg-blue-400"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
          <div className="flex items-center gap-3 mt-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-lime-500 hover:bg-lime-600 text-white font-semibold rounded-lg shadow-md transition duration-300"
              >
                Sign In
              </Link>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
};

export default Navber;
