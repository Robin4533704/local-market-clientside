import React from 'react';
import logo from '../../../assets/images/logo (1).png'
const Profileslogo = () => {
    return (
        <div className='flex items-center gap-1'>
            <img src={logo} className='w-16 h-16 rounded-full' alt="" />
            <p className="btn-ghost text-white text-3xl font-bold">Farmer<span className='text-amber-300 font-bold'>Market</span></p>
        </div>
    );
};

export default Profileslogo;