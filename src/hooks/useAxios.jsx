// useAxios.js
import axios from "axios";
import { getAuth } from "firebase/auth";

const useAxios = () => {
  const auth = getAuth();

  const instance = axios.create({
    baseURL: "http://localhost:5000", // তোমার backend URL
  });

  // Request interceptor to add Firebase token
  instance.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(true);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return instance;
};

export default useAxios;
