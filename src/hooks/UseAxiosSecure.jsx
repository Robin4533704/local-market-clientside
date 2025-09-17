import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import useAuth from "./UseAuth";

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const axiosSecure = useMemo(() => {
    return axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
      timeout: 10000,
    });
  }, []);

  useEffect(() => {
    // Request interceptor
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          // Always refresh token to make sure DELETE/PUT requests are authorized
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        if (status === 401) {
          console.log("Unauthorized: Logging out");
          await logOut();
          navigate("/login");
        } else if (status === 403) {
          console.log("Forbidden: Redirecting");
          navigate("/forbidden");
        } else if (status === 404) {
          console.log("Not found:", error.response?.data);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [axiosSecure, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
