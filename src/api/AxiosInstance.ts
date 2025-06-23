import axios from 'axios';
import Cookie from 'js-cookie';
import {getCookie} from "@/utils/CookieManagement";

// Create Axios instance
const axiosInstance = axios.create({
    baseURL: "https://propellant-latest.onrender.com/api/v1",
    headers: {
        'Content-Type': 'application/json',
    },
});

// ensure all requests send cookies
axiosInstance.defaults.withCredentials = false;
axios.defaults.withCredentials = false;

// Request interceptor
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = getCookie('accessToken');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            clearSessionAndRedirect();
        }

        return Promise.reject(error);
    }
);

// Utility function to clear session and redirect to login
const clearSessionAndRedirect = () => {
    Cookie.remove('accessToken');
    window.location.href = '/login';
};



export default axiosInstance;
