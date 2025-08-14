import React from 'react';
import logo from '../../../assets/images/logo (1).png'
import { Link} from 'react-router-dom'
const Profileslogo = () => {
    return (
       <Link to="/">
       <div className="flex items-center gap-2">
  <img
    src={logo}
    alt="Logo"
    className="hidden md:block  lg:w-12 lg:h-12 rounded-full object-cover border-4 border-gray-300"
  />
  <p className="text-white text-xl lg:text-2xl font-bold ">
    Farmer
    <span className="text-amber-300 font-bold">Market</span>
  </p>
</div>

       </Link>
    );
};

export default Profileslogo;