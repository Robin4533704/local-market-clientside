import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import useAuth from "./UseAuth";

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  const axiosSecure = useMemo(
    () =>
      axios.create({
        baseURL: "http://localhost:5000",
      }),
    []
  );

  useEffect(() => {
    // Request interceptor: Firebase token attach
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const token = await user.getIdToken(true);
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: handle 401 / 403
    const resInterceptor = axiosSecure.interceptors.response.use(
      (res) => res,
      (error) => {
        const status = error.response?.status;

        if (status === 401) {
          logOut().then(() => navigate("/login"));
        } else if (status === 403) {
          console.warn("Access forbidden");
          navigate("/forbidden");
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [logOut, navigate, axiosSecure]);

  return axiosSecure;
};

export default useAxiosSecure;
