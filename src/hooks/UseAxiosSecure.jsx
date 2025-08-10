import axios from 'axios';
import UseAuth from './UseAuth';
import { useEffect } from 'react';

const axiosSecure = axios.create({
  baseURL: 'http://localhost:5000'
});

const UseAxiosSecure = () => {
  const { user } = UseAuth();

  // প্রতি রেন্ডারে ইন্টারসেপ্টর যোগ না করে useEffect এর ভিতরে যোগ করো
  useEffect(() => {
    const interceptor = axiosSecure.interceptors.request.use(config => {
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });

    // ক্লিনআপ করে ইন্টারসেপ্টর রিমুভ করা দরকার
    return () => {
      axiosSecure.interceptors.request.eject(interceptor);
    };
  }, [user?.accessToken]);

  return axiosSecure;
};

export default UseAxiosSecure;
