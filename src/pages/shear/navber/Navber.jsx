import React, {useState} from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Profileslogo from '../../home/banner/Profileslogo';
import UseAuth from '../../../hooks/UseAuth';
import defaultImage from '../../../assets/images/download.png';

const Navber = () => {
  const { user, logOut } = UseAuth();
  const navigate = useNavigate();
const [showService, setShowService] = useState(false);

const toggleService = () => setShowService(!showService);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const links = [
    { to: '/', label: 'Home' },
    { to: '/productlist', label: 'All Products' },
    { to: '/coverage', label: 'Coverage' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const categoryLinks = [
    { to: '/addproduct', label: 'Add Product' },
    { to: '/sentparsel', label: 'Sent A Parcel' },
    { to: '/beaider', label: 'BeARider' },
  ];

  const specialLinks = ['/addproduct', '/sentparsel', '/beaider'];

  return (
  <div className="navbar max-w-7xl mx-auto shadow-sm text-white lg:px-4 px-6 fixed top-0 w-full z-50 rounded-xl bg-opacity-50 ">
      {/* Left Logo */}
      <div className="navbar-start duration-300">
        <Profileslogo />
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-3 font-bold items-center">
          {links.map((link, i) => {
            const isSpecial = specialLinks.includes(link.to);
            return (
              <li key={i}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-md font-medium ${
                      isActive
                        ? 'bg-lime-600  text-white'
                        : isSpecial
                        ? ' text-gray-800  hover:bg-gray-200'
                        : ' text-sky-300 hover:border-b-2'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            );
          })}

          {/* ✅ Category Dropdown (inside <ul>) */}
         <li className="relative">
  <button
    onClick={toggleService}
    className="px-4 py-2 rounded-md text-sky-300 font-semibold hover:border-b-2"
  >
    Service
  </button>

  {/* Toggleable dropdown */}
  {showService && (
    <ul className="absolute top-full mt-1 rounded shadow-lg w-48 z-50 bg-gray-800">
      {categoryLinks.map((link, i) => (
        <li key={i}>
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 text-sm ${
                isActive ? 'bg-lime-600 text-white' : 'text-yellow-300 hover:bg-gray-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  )}
</li>

        </ul>
      </div>

      {/* Right side */}
      <div className="navbar-end flex items-center gap-3 relative">
        {user ? (
          <>
            <Link to="/updateprofile">
              <img
                src={user.photoURL || defaultImage}
                alt="Profile"
                className="h-12 w-12 rounded-full hidden lg:block object-cover cursor-pointer"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-sm hidden lg:block bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-sm px-6 font-semibold py-2 bg-lime-500 hover:bg-lime-600 text-white hidden lg:block"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu */}
      <div className="dropdown dropdown-end block lg:hidden ml-auto">
  <div
  tabIndex={0}
  role="button"
  className="btn btn-ghost font-bold text-sky-500 bg-opacity-60 hover:bg-opacity-80 " // text-white makes it visible
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
</div>


  <ul
    tabIndex={0}
    className="menu menu-sm dropdown-content mt-3 p-3 shadow-lg bg-gray-800 text-white rounded-2xl w-60"
  >
    {links.map((link, i) => {
      const isSpecial = specialLinks.includes(link.to);
      return (
        <li key={i}>
          <NavLink
            to={link.to}
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-lime-600 text-white'
                  : isSpecial
                  ? 'border border-gray-500 bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'text-yellow-300 hover:text-white hover:bg-gray-700'
              }`
            }
          >
            {link.label}
          </NavLink>
        </li>
      );
    })}

    {/* ✅ Services Dropdown */}
    <li tabIndex={0}>
      <details>
        <summary className="px-4 py-2 text-yellow-300 font-semibold cursor-pointer hover:bg-gray-800 rounded-md">
          Services
        </summary>
        <ul className="p-2 bg-gray-800 rounded-lg space-y-1">
          {categoryLinks.map((link, i) => (
            <li key={i}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block px-4 py-2 rounded-md text-sm transition ${
                    isActive
                      ? 'bg-lime-600 text-white'
                      : 'text-yellow-300 hover:bg-gray-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </details>
    </li>

    {/* ✅ Auth Buttons */}
    <div className="flex items-center gap-3 mt-4 justify-center">
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