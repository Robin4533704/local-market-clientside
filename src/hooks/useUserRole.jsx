import { useState, useEffect, useCallback } from "react";
import UseAxiosSecure from "./UseAxiosSecure"; 
import UseAuth from "./UseAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = UseAuth(); // user object and auth loading
  const [role, setRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);
  const [error, setError] = useState(null);

  const axiosSecure = UseAxiosSecure();

  const fetchRole = useCallback(async () => {
    if (!user?.email) return;

    setRoleLoading(true);
    try {
      const res = await axiosSecure.get(`/users/role?email=${user.email}`);
      setRole(res.data?.role || "user"); // default to "user"
    } catch (err) {
      console.error("Error fetching user role:", err);
      setError(err);
      setRole("user");
    } finally {
      setRoleLoading(false);
    }
  }, [user?.email, axiosSecure]);

  useEffect(() => {
    fetchRole();
  }, [fetchRole]);

  return { role, roleLoading, authLoading: authLoading || roleLoading, error, refetch: fetchRole };
};

export default useUserRole;
