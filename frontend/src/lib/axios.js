import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:10000' 
    : 'https://e-shopping-website-va9n.onrender.com',
  withCredentials: true,
});