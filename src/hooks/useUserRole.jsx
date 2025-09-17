import React from "react"; 
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./UseAxiosSecure"; // Axios instance with token
import useAuth from "./UseAuth";

const useUserRole = () => {
  const { user, loading: authLoading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: roleData,
    isLoading: roleLoading,
    refetch,
  } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !authLoading && !!user?.email,
    queryFn: async () => {
      try {
        if (!user?.email) return "user"; // safety fallback

        // Check localStorage cache first
        const cachedRole = localStorage.getItem(`role_${user.email}`);
        if (cachedRole) return cachedRole;

        // Refresh token once (avoid forced refresh every render)
        const token = await user.getIdToken(); 

        // Set token in Axios headers
        axiosSecure.defaults.headers.Authorization = `Bearer ${token}`;

        // Encode email for safe URL
        const encodedEmail = encodeURIComponent(user.email);
        const res = await axiosSecure.get(`/users/${encodedEmail}/role`);

        const role = res.data.role || "user";

        // Cache role in localStorage for faster subsequent access
        localStorage.setItem(`role_${user.email}`, role);

        return role;
      } catch (err) {
        console.error("Failed to fetch user role:", err);

        // Handle Firebase quota exceeded error gracefully
        if (err.code === "auth/quota-exceeded") {
          console.warn("Firebase quota exceeded: using fallback 'user' role");
        }

        // Handle network errors
        if (err.code === "auth/network-request-failed") {
          console.warn("Network issue: fallback to 'user' role");
        }

        // Fallback to 'user' role on any error
        return "user"; 
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // Optional: clear localStorage if user logs out
  React.useEffect(() => {
    if (!user) {
      localStorage.removeItem(`role_${user?.email}`);
    }
  }, [user]);

  return {
    role: roleData || "user",
    loading: authLoading || roleLoading,
    refetchRole: refetch,
  };
};

export default useUserRole;
