import axios from "axios";
import { getAuth } from "firebase/auth";

const useAxios = () => {
  const auth = getAuth();

  // ✅ Axios instance create
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://daily-local-market-server.vercel.app",
    timeout: 10000,
  });

  // ✅ Request interceptor – Token attach
  instance.interceptors.request.use(
    async (config) => {
      const user = auth.currentUser;
      if (user) {
        try {
          const token = await user.getIdToken(true); // Always fresh token
          config.headers.Authorization = `Bearer ${token}`;
          console.log("Token set in Axios:", token);
        } catch (error) {
          console.error("Error fetching Firebase token:", error);
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Response interceptor – optional, যদি 401/403 handle করতে চাও
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      if (status === 401) console.warn("Unauthorized request (401)");
      if (status === 403) console.warn("Forbidden request (403)");
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;
