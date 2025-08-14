import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import Profileslogo from '../../home/banner/Profileslogo';
import UseAuth from '../../../hooks/UseAuth';
import defaultImage from '../../../assets/images/download.png'; // ✅ default image import

const Navber = () => {
  const { user, logOut } = UseAuth();

  const handleLogout = () => {
    logOut()
      .then(() => console.log('Logged out successfully'))
      .catch(err => console.log('Logout error', err));
  };

  const links = (
    <>
      <li><NavLink to='/'>Home</NavLink></li>
      <li><NavLink to='/coverage'>Coverage</NavLink></li>
      <li><NavLink to='/sentparsel'>Sent A Parcel</NavLink></li>
      <li><NavLink to='/dashboard'>Dashboard</NavLink></li>
      <li><NavLink to='/beaider'>BeARider</NavLink></li>
      <li><NavLink to='/about'>About Us</NavLink></li>
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

      {/* Right side: user info */}
      <Link to='/updateprofile' className="navbar-end flex items-center gap-3">
        {user ? (
          <>
            {/* Profile Picture */}
            <img
              src={user.photoURL || defaultImage} // ✅ Firebase photoURL use
              alt="Profile"
              className="h-12 w-12 rounded-full object-cover cursor-pointer"
            />
           
            <button onClick={handleLogout} className="btn btn-sm lg:block hidden bg-red-500 hover:bg-red-600 text-white">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-sm px-6 font-semibold py-2 bg-lime-500 hover:bg-lime-600 text-white hidden lg:block">
            Sign In
          </Link>
        )}
      </Link>

      {/* Mobile Menu Dropdown */}
      <div className="dropdown dropdown-end block lg:hidden ml-auto">
        <div tabIndex={0} className="btn btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 text-black rounded-box w-52">
          {links}
          <div className="flex items-center gap-2 mt-2">
            {user ? (
              <>
              
    <button onClick={handleLogout} className="btn btn-sm bg-red-500 hover:bg-red-600 text-white ">
      Logout
    </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-sm bg-lime-500 hover:bg-lime-600 text-white ">
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
