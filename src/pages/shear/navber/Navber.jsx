import React from 'react';
import { Link, NavLink } from 'react-router';
import Profileslogo from '../../home/banner/Profileslogo';
import UseAuth from '../../../hooks/UseAuth';

const Navber = () => {
  const {user, logOut} =UseAuth()

   const handleLogout = () =>{
    logOut()
    .then(() =>{
      console.log('logged out succesfully')
    })
    .catch((error) =>{
      console.log("logged error", error);
    })
   }
  const links = <>
    <li><NavLink to='/'>Home</NavLink></li>
    <li><NavLink to='/coverage'>Coverage</NavLink></li>
  
    <li><NavLink to='/about'>About Us</NavLink></li>
  
   </>
   return (
    <div className="navbar bg-lime-600 shadow-sm">
      
     
      <div className="navbar-start">
     
        <div className="dropdown">
       
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          
        
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content text-white bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
           {links}
          </ul>
        </div>
        {/* কোম্পানির বা লোগো নাম */}
       <Profileslogo/>
      </div>

      {/* মাঝের অংশ: ডেক্সটপ বা বড় স্ক্রীকের জন্য মেনু */} 
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1  text-white font-bold">
          {links}
        </ul>
      </div>

      {
  user ? (
    <div className="flex items-center gap-4 navbar-end">
      <span className="text-sm font-medium text-gray-700">{user.email}</span>
      <button
        onClick={handleLogout}
        className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="navbar-end">
      <Link to="/login" className="btn btn-sm px-6 font-semibold py-4  bg-lime-500 hover:bg-lime-600 text-white">
        Sign In
      </Link>
    </div>
  )
}


     
     
    </div>
  );
} 

export default Navber;