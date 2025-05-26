import axios from 'axios';

const Axios = axios.create({
    baseURL: 'http://localhost:3000', 
    withCredentials: true, // <-- Add this line
});

// Add this to your axiosInstance.js
Axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { Axios };
