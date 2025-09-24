import { useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import useAuth from "./UseAuth";

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  // ✅ Axios instance শুধুমাত্র একবার তৈরি হবে
  const axiosSecure = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
      timeout: 10000,
    });
  }, []);

  useEffect(() => {
    // Request interceptor → attach fresh Firebase token
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const user = getAuth().currentUser;
        if (user) {
          try {
            const token = await user.getIdToken(true); // force refresh
            config.headers.Authorization = `Bearer ${token}`;
            console.log("Axios token set:", token);
          } catch (err) {
            console.error("Error getting Firebase token:", err);
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor → handle 401 / 403
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

    // Cleanup interceptors → prevent memory leaks
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [axiosSecure, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
