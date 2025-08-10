import axios from 'axios';
import React from 'react';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000',
  // Optional:
  // withCredentials: true,
});
const UseAxios = () => {
  return axiosInstance;
};

export default UseAxios;