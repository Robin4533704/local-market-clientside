import React from 'react';
import UseAuth from '../hooks/UseAuth';
import { Navigate } from 'react-router-dom'
const PrivetRoute = ({children}) => {
    const { user, loading} = UseAuth()
    if(loading){
        return <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
    }
    if(!user){
    <Navigate to="/login"></Navigate>
    }
    return children;
};

export default PrivetRoute;