import React from "react"; 
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./UseAxiosSecure"; 
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
        if (!user?.email) return "user"; // fallback if no email

        // ✅ Check localStorage cache first
        const cachedRole = localStorage.getItem(`role_${user.email}`);
        if (cachedRole) return cachedRole;

        // ✅ Refresh token
        const token = await user.getIdToken();

        // ✅ Encode email for safe URL
        const encodedEmail = encodeURIComponent(user.email);

        // ✅ Pass token per-request (safer than setting defaults)
        const res = await axiosSecure.get(`/users/${encodedEmail}/role`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const role =
          typeof res.data.role === "string" && res.data.role.trim() !== ""
            ? res.data.role
            : "user";

        // ✅ Cache in localStorage
        localStorage.setItem(`role_${user.email}`, role);

        return role;
      } catch (err) {
        console.error("Failed to fetch user role:", err);

        if (err.code === "auth/quota-exceeded") {
          console.warn("Firebase quota exceeded: fallback to 'user'");
        }
        if (err.code === "auth/network-request-failed") {
          console.warn("Network issue: fallback to 'user'");
        }

        return "user"; 
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // ✅ Clear localStorage roles if user logs out
  React.useEffect(() => {
    if (!user?.email) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("role_")) {
          localStorage.removeItem(key);
        }
      });
    }
  }, [user]);

  return {
    role: roleData || "user",
    loading: authLoading || roleLoading,
    refetchRole: refetch,
  };
};

export default useUserRole;
