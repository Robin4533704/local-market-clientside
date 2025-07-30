import React from 'react';
import UseAuth from '../hooks/UseAuth';
import { Navigate, useLocation } from 'react-router-dom'
const PrivetRoute = ({children}) => {
    const { user, loading} = UseAuth()

    const location = useLocation()
    
    if(loading){
        return <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
    }
    if(!user){
    return <Navigate state={{from: location.pathname}} to="/login"></Navigate>
    }
    return children;
};

export default PrivetRoute;