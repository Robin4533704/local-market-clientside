import axios from "axios";
import { getAuth } from "firebase/auth";

const useAxios = () => {
  const auth = getAuth();

  const instance = axios.create({
    baseURL: "http://localhost:5000", // তোমার backend URL
  });

  // রিকোয়েস্ট ইন্টারসেপ্টর দিয়ে টোকেন যোগ করা
  instance.interceptors.request.use(
    async (config) => {
      const user = auth.currentUser;
      if (user) {
        try {
          // টোকেন ক্যাশে থাকা রাখার জন্য getIdToken() ব্যবহার
          const token = await user.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.error("Error fetching Firebase token:", error);
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};

export default useAxios;