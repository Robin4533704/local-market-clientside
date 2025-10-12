import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/UseAuth";
import useUserRole from "../hooks/useUserRole";

const AdminRoute = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();
  const location = useLocation();

  // 🔄 Loading spinner while auth or role is loading
  if (authLoading || roleLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || role !== "admin") {
  return <Navigate to="/forbidden" state={{ from: location }} replace />;
}


  // ✅ Admin access → render children
  return children;
};

export default AdminRoute;
