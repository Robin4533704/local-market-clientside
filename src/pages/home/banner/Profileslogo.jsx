import React from 'react';
import logo from '../../../assets/images/logo500.jpg'
import { Link} from 'react-router-dom'
const Profileslogo = () => {
    return (
       <Link to="/">
       <div className="flex items-center gap-2">
  <img
    src={logo}
    alt="Logo"
    className="w-12 h-12 lg:w-14 lg:h-14 rounded-full object-cover border-4 border-gray-300"
  />
  <p className="text-lime-400 hidden lg:block text-xl lg:text-2xl font-bold ">
    Varcell
    <span className="text-amber-300 font-bold">Market</span>
  </p>
</div>

       </Link>
    );
};

export default Profileslogo;