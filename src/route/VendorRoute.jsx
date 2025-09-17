import { Navigate } from "react-router-dom";
import Loading from "../pages/loading/Loading";
import UseAuth from "../hooks/UseAuth";
import useUserRole from "../hooks/useUserRole";

const VendorRoute = ({ children }) => {
  const { user } = UseAuth();
  const { role, loading } = useUserRole(user?.email);

  if (loading) return <p><Loading/> </p>;

  if (!user || role !== "vendor") {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default VendorRoute;
