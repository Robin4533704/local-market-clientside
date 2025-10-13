import axios from "axios";
import { getAuth } from "firebase/auth";

const useAxios = () => {
  const auth = getAuth();

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
     timeout: 20000,
  withCredentials: true, 
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken().catch(() => null);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.warn("Firebase token skipped:", error.message);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default useAxios;
