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
    className="w-12 hidden md:block h-12 lg:w-16 lg:h-16 rounded-full"
  />
  <p className="text-blue-400 text-xl lg:text-3xl font-bold ">
    Farmer
    <span className="text-amber-300 font-bold">Market</span>
  </p>
</div>

       </Link>
    );
};

export default Profileslogo;