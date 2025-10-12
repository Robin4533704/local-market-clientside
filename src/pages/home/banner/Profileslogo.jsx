import React from 'react';

import { Link} from 'react-router-dom'
const Profileslogo = () => {
    return (
    <Link to="/">
  <div className="flex items-center lg:gap-1 ">
    <img
      src="/zpj/logo600.png"
      alt="Logo"
      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full object-cover"
    />
    <p className="text-lime-400 mt-3 lg:mt-3 text-lg sm:text-xl lg:text-3xl font-extrabold leading-tight tracking-wide">
  Varcell
  <span className="text-amber-400 font-bold ml-1 italic">Graund</span>
</p>
  </div>
</Link>

    );
};

export default Profileslogo;