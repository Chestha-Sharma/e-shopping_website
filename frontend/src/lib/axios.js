import axios from 'axios'


export const axiosInstance = axios.create({
  baseURL:'https://e-shopping-website-va9n.onrender.com',
  withCredentials: true,
})