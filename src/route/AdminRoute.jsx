import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import UseAuth from '../hooks/UseAuth';
import useUserRole from '../hooks/useUserRole';


const AdminRoute = ({ children }) => {
  const { user, loading: loading } = UseAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();
 if(loading || roleLoading){
        return <div className="flex justify-center items-center h-screen">
      <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
    </div>
    }
  

  if (!user || role !== 'admin') {
    return <Navigate state={{ from: location.pathname }} to="/forbidden" replace />;
  }

 

  return children;
};


export default AdminRoute;
