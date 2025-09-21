import { useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import useAuth from "./UseAuth";

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // Create Axios instance
  const axiosSecure = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
      timeout: 10000,
    });
  }, []);

  useEffect(() => {
    // ✅ Request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const user = getAuth().currentUser;
        if (user) {
          // Always get fresh token
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Axios token set:", token);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ✅ Response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;

        if (status === 401) {
          console.log("Unauthorized (401) → logging out");
          await logOut();
          navigate("/login");
        } else if (status === 403) {
          console.log("Forbidden (403) → redirecting to /forbidden");
          navigate("/forbidden");
        }

        return Promise.reject(error);
      }
    );

    // Cleanup interceptors
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [axiosSecure, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
