import React, {useState, useEffect} from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import Profileslogo from '../../home/banner/Profileslogo';
import UseAuth from '../../../hooks/UseAuth';
import defaultImage from '../../../assets/images/download.png';

const Navber = () => {
  const { user, logOut } = UseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showService, setShowService] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close dropdowns when route changes
  useEffect(() => {
    setShowService(false);
    setIsMobileMenuOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.service-dropdown')) {
        setShowService(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleService = () => setShowService(!showService);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error.message);
    }
  };

  const mainLinks = [
    { to: '/', label: 'Home' },
    { to: '/productlist', label: 'All Products' },
    { to: '/coverage', label: 'Coverage' },
    { to: '/dashboard', label: 'Dashboard' },
  ];

  const serviceLinks = [
    { to: '/addproduct', label: 'Add Product' },
    { to: '/sentparsel', label: 'Sent A Parcel' },
    { to: '/beaider', label: 'Be A Rider' },
  ];

  const specialLinks = ['/addproduct', '/sentparsel', '/beaider'];

  return (
    <nav className="navbar  shadow-lg text-white lg:px-6 px-4 fixed top-0 w-full z-50 bg-gradient-to-r from-gray-900 to-blue-900 backdrop-blur-sm bg-opacity-95 border-b border-blue-400">
      {/* Left Logo */}
      <div className="navbar-start">
        <Profileslogo />
      </div>

      {/* Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="flex gap-1 font-semibold items-center">
          {mainLinks.map((link, index) => {
            const isSpecial = specialLinks.includes(link.to);
            return (
              <li key={index}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                        : isSpecial
                        ? 'text-gray-100 hover:bg-gray-700 hover:text-white'
                        : 'text-blue-200 hover:text-white hover:bg-blue-700 hover:scale-105'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            );
          })}

          {/* Service Dropdown */}
          <li className="relative service-dropdown">
            <button
              onClick={toggleService}
              className={`px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 ${
                showService 
                  ? 'bg-blue-700 text-white' 
                  : 'text-blue-200 hover:text-white hover:bg-blue-700'
              }`}
            >
              Services
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${showService ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showService && (
              <div className="absolute top-full left-0 mt-2 rounded-xl shadow-2xl w-56 z-50 bg-gray-800 border border-blue-500 overflow-hidden">
                {serviceLinks.map((link, index) => (
                  <NavLink
                    key={index}
                    to={link.to}
                    className={({ isActive }) =>
                      `block px-4 py-3 text-sm border-l-4 transition-all duration-200 ${
                        isActive 
                          ? 'bg-blue-600 text-white border-lime-400 font-bold' 
                          : 'text-gray-300 hover:bg-blue-700 hover:text-white border-transparent'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}
          </li>
        </ul>
      </div>

      {/* Right side - User Info */}
      <div className="navbar-end flex items-center gap-4">
        {user ? (
          <>
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-blue-200 font-medium hidden lg:block">
                {user.displayName || 'User'}
              </span>
              <Link to="/updateprofile" className="hover:scale-110 transition-transform duration-300">
                <img
                  src={user.photoURL || defaultImage}
                  alt="Profile"
                  className="h-12 w-12 rounded-full object-cover cursor-pointer border-2 border-blue-400 hover:border-lime-400"
                />
              </Link>
              <button
                onClick={handleLogout}
                className="btn bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Logout
              </button>
            </div>
          </>
        ) : (
          <Link
            to="/login"
            className="btn px-8 font-semibold py-3 bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white hidden lg:flex items-center gap-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            Sign In
          </Link>
        )}

        {/* Mobile Menu Button */}
        <div className="dropdown dropdown-end lg:hidden">
          <button
            tabIndex={0}
            onClick={toggleMobileMenu}
            className="btn btn-ghost text-blue-200 hover:text-white hover:bg-blue-700 p-3 rounded-lg transition-all duration-300"
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
          </button>

          {isMobileMenuOpen && (
            <ul className="menu menu-md dropdown-content mt-3 p-4 shadow-2xl bg-gray-800 text-white rounded-2xl w-64 border border-blue-500 right-0">
              {/* Main Links */}
              {mainLinks.map((link, index) => {
                const isSpecial = specialLinks.includes(link.to);
                return (
                  <li key={index} className="border-b border-gray-700 last:border-b-0">
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `px-4 py-3 rounded-lg font-medium transition-all duration-200 my-1 ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg'
                            : isSpecial
                            ? 'text-gray-100 hover:bg-gray-700'
                            : 'text-blue-200 hover:text-white hover:bg-blue-700'
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                );
              })}

              {/* Service Links */}
              <li className="border-b border-gray-700">
                <details open>
                  <summary className="px-4 py-3 text-blue-200 font-semibold hover:text-white hover:bg-blue-700 rounded-lg transition-all duration-200">
                    Services
                  </summary>
                  <ul className="pl-2 mt-2 space-y-1">
                    {serviceLinks.map((link, index) => (
                      <li key={index}>
                        <NavLink
                          to={link.to}
                          className={({ isActive }) =>
                            `block px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isActive
                                ? 'bg-blue-600 text-white font-semibold'
                                : 'text-gray-300 hover:bg-blue-700 hover:text-white'
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

              {/* Auth Section */}
              <li className="pt-4 border-t border-gray-700">
                {user ? (
                  <div className="flex flex-col gap-3 p-2">
                    <div className="flex items-center gap-3 px-2">
                      <img
                        src={user.photoURL || defaultImage}
                        alt="Profile"
                        className="h-10 w-10 rounded-full object-cover border-2 border-blue-400"
                      />
                      <span className="text-blue-200 text-sm">
                        {user.displayName || 'User'}
                      </span>
                    </div>
                    <Link
                      to="/updateprofile"
                      className="btn btn-outline btn-sm text-blue-200 border-blue-400 hover:bg-blue-700 hover:text-white"
                    >
                      Update Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="btn bg-red-600 hover:bg-red-700 text-white btn-sm font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="btn bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-600 hover:to-green-700 text-white font-semibold w-full"
                  >
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navber;