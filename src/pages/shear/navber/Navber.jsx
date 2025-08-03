import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Profileslogo from '../../home/banner/Profileslogo';
import UseAuth from '../../../hooks/UseAuth';

const Navber = () => {
  const { user, logOut } = UseAuth();

  const handleLogout = () => {
    logOut()
      .then(() => {
        console.log('logged out successfully');
      })
      .catch((error) => {
        console.log("logout error", error);
      });
  };

  const links = (
    <>
      <li><NavLink to='/'>Home</NavLink></li>
      <li><NavLink to='/coverage'>Coverage</NavLink></li>
      <li><NavLink to='/sentparsel'>Sent A Parcel</NavLink></li>
      <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
        <li><NavLink to='/about'>About Us</NavLink></li>
      {user ? (
        <li><NavLink to='/login' className="btn btn-sm bg-red-500 hover:bg-red-600 text-white hidden lg:black">Logout</NavLink></li>
      ) : (
        <li><NavLink to='/login'>Signin</NavLink></li>
      )}
    
    </>
  );

  return (
    <div className="navbar bg-lime-600 shadow-sm text-white px-4">
      {/* Logo */}
      <div className="navbar-start">
        <Profileslogo />
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 font-bold">
          {links}
        </ul>
      </div>

      {/* Right side: user info or Sign In */}
      <div className="navbar-end hidden lg:flex items-center gap-2">
        {user ? (
          <>
            <span className="text-sm font-medium text-white">{user.email}</span>
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white hidden lg:black"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm px-6 font-semibold py-2 bg-lime-500 hover:bg-lime-600 text-white"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      <div className="dropdown dropdown-end lg:hidden ml-auto">
        <div tabIndex={0} role="button" className="btn btn-ghost">
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
          className="menu menu-sm dropdown-content mt-3 z-[999] p-2 shadow bg-base-100 text-black rounded-box w-52"
        >
          {links}
          {user && (
            <li>
              <button
                onClick={handleLogout}
                className="text-red-600 font-medium hover:underline"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navber;
