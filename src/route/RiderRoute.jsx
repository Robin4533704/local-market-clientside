import React from 'react';
import UseAuth from '../hooks/UseAuth';
import useUserRole from '../hooks/useUserRole';

const RiderRoute = ({children}) => {
    const { user, loading: loading } = UseAuth();
    const { role, roleLoading } = useUserRole();
  
    if(loading || roleLoading){
           return <div className="flex justify-center items-center h-screen">
         <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
       </div>
       }
     
   
     if (!user || role !== 'rider') {
       return <Navigate state={{ from: location.pathname }} to="/forbidden" replace />;
     }
   return children
};

export default RiderRoute;